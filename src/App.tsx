import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { AttendanceStatus, Employee, ActiveTab } from './types/attendance';
import {
  getStoredEmployees,
  saveStoredEmployees,
  getAttendanceLog,
  saveAttendanceLog,
  downloadCSV,
  INITIAL_EMPLOYEES,
} from './services/storage';

import { Header } from './components/Header';
import { DateShiftHeader } from './components/DateShiftHeader';
import { AttendanceTable } from './components/AttendanceTable';
import { BottomNav } from './components/BottomNav';
import { EmployeeModal } from './components/EmployeeModal';
import { EmployeesView } from './components/EmployeesView';
import { ReportsView } from './components/ReportsView';
import { SideDrawer } from './components/SideDrawer';
import { PhoneFrame } from './components/PhoneFrame';
import { NewMonthModal } from './components/NewMonthModal';
import { LogoSplash } from './components/LogoSplash';

export function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [selectedShift, setSelectedShift] = useState<string>('09:00 am - 06:00 pm');
  const [records, setRecords] = useState<Record<string, AttendanceStatus[]>>({});
  const [activeTab, setActiveTab] = useState<ActiveTab>('attendance');

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isNewMonthModalOpen, setIsNewMonthModalOpen] = useState(false);
  const [isLogoSplashOpen, setIsLogoSplashOpen] = useState(true);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Initialize employees from storage
  useEffect(() => {
    const loaded = getStoredEmployees();
    setEmployees(loaded);
  }, []);

  // Load attendance records whenever date or shift changes
  useEffect(() => {
    const loadedRecords = getAttendanceLog(selectedDate, selectedShift);
    setRecords(loadedRecords);
  }, [selectedDate, selectedShift]);

  // Handle simultaneous P and OT selection, with A clearing both
  const handleStatusToggle = (employeeId: string, status: AttendanceStatus) => {
    const currentStatuses = records[employeeId] || [];
    let updatedStatuses: AttendanceStatus[] = [];

    if (status === 'P') {
      // Toggle P, remove A if active, keep OT if already active
      const withoutA = currentStatuses.filter((s) => s !== 'A');
      if (withoutA.includes('P')) {
        updatedStatuses = withoutA.filter((s) => s !== 'P');
      } else {
        updatedStatuses = [...withoutA, 'P'];
      }
    } else if (status === 'OT') {
      // Toggle OT, remove A if active, keep P if already active
      const withoutA = currentStatuses.filter((s) => s !== 'A');
      if (withoutA.includes('OT')) {
        updatedStatuses = withoutA.filter((s) => s !== 'OT');
      } else {
        updatedStatuses = [...withoutA, 'OT'];
      }
    } else if (status === 'A') {
      // Toggle A: selecting A clears P and OT
      if (currentStatuses.includes('A')) {
        updatedStatuses = [];
      } else {
        updatedStatuses = ['A'];
      }
    }

    const newRecords = { ...records };
    if (updatedStatuses.length === 0) {
      delete newRecords[employeeId];
    } else {
      newRecords[employeeId] = updatedStatuses;
    }

    setRecords(newRecords);
    saveAttendanceLog(selectedDate, selectedShift, newRecords);
  };

  // Handle bulk status change
  const handleBulkStatusChange = (status: AttendanceStatus | null) => {
    const newRecords: Record<string, AttendanceStatus[]> = {};

    if (status === 'P') {
      employees.forEach((emp) => {
        const existing = records[emp.id] || [];
        const hasOT = existing.includes('OT');
        newRecords[emp.id] = hasOT ? ['P', 'OT'] : ['P'];
      });
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 }
      });
    } else if (status === 'OT') {
      employees.forEach((emp) => {
        const existing = records[emp.id] || [];
        const hasP = existing.includes('P');
        newRecords[emp.id] = hasP ? ['P', 'OT'] : ['OT'];
      });
    } else if (status === 'A') {
      employees.forEach((emp) => {
        newRecords[emp.id] = ['A'];
      });
    }

    setRecords(newRecords);
    saveAttendanceLog(selectedDate, selectedShift, newRecords);
  };

  // Start New Month Handler
  const handleStartMonth = (year: number, month: number) => {
    const newDateStr = `${year}-${String(month).padStart(2, '0')}-01`;
    setSelectedDate(newDateStr);
    setActiveTab('attendance');

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Employee Management
  const handleSaveEmployee = (empData: Omit<Employee, 'id'>, id?: string) => {
    let updated: Employee[];
    if (id) {
      updated = employees.map((e) => (e.id === id ? { ...e, ...empData } : e));
    } else {
      const newEmp: Employee = {
        ...empData,
        id: `emp-${Date.now()}`
      };
      updated = [...employees, newEmp];
    }
    setEmployees(updated);
    saveStoredEmployees(updated);
  };

  const handleDeleteEmployee = (id: string) => {
    const updated = employees.filter((e) => e.id !== id);
    setEmployees(updated);
    saveStoredEmployees(updated);

    const newRecords = { ...records };
    delete newRecords[id];
    setRecords(newRecords);
    saveAttendanceLog(selectedDate, selectedShift, newRecords);
  };

  const handleResetDefaults = () => {
    setEmployees(INITIAL_EMPLOYEES);
    saveStoredEmployees(INITIAL_EMPLOYEES);
  };

  // CSV Export
  const handleExport = () => {
    setIsExporting(true);
    try {
      downloadCSV(selectedDate, selectedShift, employees, records);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.8 }
      });
    } finally {
      setTimeout(() => setIsExporting(false), 800);
    }
  };

  return (
    <PhoneFrame>
      {/* App Shell Container */}
      <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
        {/* Top Header with MM Attendance Brand & Official Logo */}
        <Header
          onOpenMenu={() => setIsMenuOpen(true)}
          onPlayLogoIntro={() => setIsLogoSplashOpen(true)}
        />

        {/* Dynamic Content based on Active Tab */}
        {activeTab === 'attendance' && (
          <>
            {/* Date & Shift Picker */}
            <DateShiftHeader
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              selectedShift={selectedShift}
              onShiftChange={setSelectedShift}
              onStartNewMonthClick={() => setIsNewMonthModalOpen(true)}
            />

            {/* Attendance Table */}
            <AttendanceTable
              employees={employees}
              records={records}
              onStatusToggle={handleStatusToggle}
              onBulkStatusChange={handleBulkStatusChange}
              onAddEmployeeClick={() => {
                setEmployeeToEdit(null);
                setIsEmployeeModalOpen(true);
              }}
            />
          </>
        )}

        {activeTab === 'employees' && (
          <EmployeesView
            employees={employees}
            onAddClick={() => {
              setEmployeeToEdit(null);
              setIsEmployeeModalOpen(true);
            }}
            onEditClick={(emp) => {
              setEmployeeToEdit(emp);
              setIsEmployeeModalOpen(true);
            }}
            onDeleteClick={handleDeleteEmployee}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView
            employees={employees}
            currentDateRecords={records}
            currentDate={selectedDate}
            currentShift={selectedShift}
            onStartNewMonthClick={() => setIsNewMonthModalOpen(true)}
          />
        )}

        {/* Bottom Floating Cloud Download & Capsule Bar */}
        <div className="mt-auto">
          <BottomNav
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onExportClick={handleExport}
            isExporting={isExporting}
          />
        </div>
      </div>

      {/* Side Menu Drawer */}
      <SideDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onMarkAllPresent={() => handleBulkStatusChange('P')}
        onMarkAllOvertime={() => handleBulkStatusChange('OT')}
        onMarkAllAbsent={() => handleBulkStatusChange('A')}
        onClearCurrent={() => handleBulkStatusChange(null)}
        onResetDefaults={handleResetDefaults}
        onExport={handleExport}
        onStartNewMonth={() => setIsNewMonthModalOpen(true)}
        onPlayLogoVideo={() => setIsLogoSplashOpen(true)}
        currentDate={selectedDate}
        currentShift={selectedShift}
      />

      {/* Add / Edit Employee Modal */}
      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        onSave={handleSaveEmployee}
        employeeToEdit={employeeToEdit}
      />

      {/* Start New Month Modal */}
      <NewMonthModal
        isOpen={isNewMonthModalOpen}
        onClose={() => setIsNewMonthModalOpen(false)}
        onStartMonth={handleStartMonth}
        currentDate={selectedDate}
      />

      {/* Animated Logo Video Intro Screen */}
      <LogoSplash
        isOpen={isLogoSplashOpen}
        onClose={() => setIsLogoSplashOpen(false)}
      />
    </PhoneFrame>
  );
}

export default App;
