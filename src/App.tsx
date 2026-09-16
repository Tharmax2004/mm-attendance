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
import { AnalyticsView } from './components/AnalyticsView';
import { SideDrawer } from './components/SideDrawer';
import { PhoneFrame } from './components/PhoneFrame';

export function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [selectedShift, setSelectedShift] = useState<string>('09:00 am - 06:00 pm');
  const [records, setRecords] = useState<Record<string, AttendanceStatus>>({});
  const [activeTab, setActiveTab] = useState<ActiveTab>('attendance');

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
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

  // Handle single employee status change
  const handleStatusChange = (employeeId: string, status: AttendanceStatus) => {
    const current = records[employeeId];
    const newRecords = { ...records };

    if (current === status) {
      // Clicking same status unchecks it
      delete newRecords[employeeId];
    } else {
      newRecords[employeeId] = status;
    }

    setRecords(newRecords);
    saveAttendanceLog(selectedDate, selectedShift, newRecords);
  };

  // Handle bulk status change (e.g. mark all P, mark all A, or clear)
  const handleBulkStatusChange = (status: AttendanceStatus | null) => {
    const newRecords: Record<string, AttendanceStatus> = {};
    if (status) {
      employees.forEach((emp) => {
        newRecords[emp.id] = status;
      });

      if (status === 'P') {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.7 }
        });
      }
    }

    setRecords(newRecords);
    saveAttendanceLog(selectedDate, selectedShift, newRecords);
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

    // Also remove from current records
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
        {/* Top Header with MM Attendance Brand */}
        <Header onOpenMenu={() => setIsMenuOpen(true)} />

        {/* Dynamic Content based on Active Tab */}
        {activeTab === 'attendance' && (
          <>
            {/* Date & Shift Picker */}
            <DateShiftHeader
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              selectedShift={selectedShift}
              onShiftChange={setSelectedShift}
            />

            {/* Attendance Table */}
            <AttendanceTable
              employees={employees}
              records={records}
              onStatusChange={handleStatusChange}
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

        {activeTab === 'analytics' && (
          <AnalyticsView
            employees={employees}
            records={records}
            selectedDate={selectedDate}
            selectedShift={selectedShift}
            onExport={handleExport}
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
    </PhoneFrame>
  );
}

export default App;
