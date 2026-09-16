import React, { useState, useMemo } from 'react';
import type { Employee, AttendanceStatus, ReportPeriod } from '../types/attendance';
import {
  getMonthlyReport,
  getYearlyReport,
  downloadMonthlyCSV,
  downloadYearlyCSV,
  downloadCSV,
} from '../services/storage';
import {
  BarChart3,
  DownloadCloud,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReportsViewProps {
  employees: Employee[];
  currentDateRecords: Record<string, AttendanceStatus[]>;
  currentDate: string;
  currentShift: string;
  onStartNewMonthClick: () => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const ReportsView: React.FC<ReportsViewProps> = ({
  employees,
  currentDateRecords,
  currentDate,
  currentShift,
  onStartNewMonthClick,
}) => {
  const currentD = new Date(currentDate);
  const [period, setPeriod] = useState<ReportPeriod>('monthly');
  const [selectedYear, setSelectedYear] = useState<number>(currentD.getFullYear() || new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(currentD.getMonth() + 1 || new Date().getMonth() + 1);

  // Compute Daily Report
  const totalEmployees = employees.length;
  const dailyPresent = Object.values(currentDateRecords).filter((s) => s?.includes('P')).length;
  const dailyOT = Object.values(currentDateRecords).filter((s) => s?.includes('OT')).length;
  const dailyAbsent = Object.values(currentDateRecords).filter((s) => s?.includes('A')).length;
  const dailyPercentage = totalEmployees > 0 ? Math.round((dailyPresent / totalEmployees) * 100) : 0;

  // Compute Monthly Report from database
  const monthlyData = useMemo(() => {
    return getMonthlyReport(selectedYear, selectedMonth, employees);
  }, [selectedYear, selectedMonth, employees]);

  // Compute Yearly Report from database
  const yearlyData = useMemo(() => {
    return getYearlyReport(selectedYear, employees);
  }, [selectedYear, employees]);

  // Handle CSV Downloads
  const handleExport = () => {
    if (period === 'daily') {
      downloadCSV(currentDate, currentShift, employees, currentDateRecords);
    } else if (period === 'monthly') {
      downloadMonthlyCSV(selectedYear, selectedMonth, monthlyData.items);
    } else {
      downloadYearlyCSV(selectedYear, yearlyData.items);
    }

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 px-4 pt-2 pb-24 overflow-y-auto select-none space-y-3.5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">
            Attendance Reports
          </h2>
          <p className="text-[11px] text-gray-500 font-medium">
            Saved database records & analytics
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#e05344] text-white rounded-full text-xs font-bold shadow-xs hover:bg-[#c94537] active:scale-95 transition-all"
        >
          <DownloadCloud className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Period Filter Tabs (Daily / Monthly / Yearly) */}
      <div className="bg-[#f0f0f2] p-1 rounded-2xl flex items-center justify-between text-xs font-bold text-gray-600">
        <button
          onClick={() => setPeriod('daily')}
          className={`flex-1 py-1.5 rounded-xl transition-all ${
            period === 'daily' ? 'bg-white text-gray-900 shadow-xs' : 'hover:text-gray-900'
          }`}
        >
          Daily
        </button>
        <button
          onClick={() => setPeriod('monthly')}
          className={`flex-1 py-1.5 rounded-xl transition-all ${
            period === 'monthly' ? 'bg-white text-gray-900 shadow-xs' : 'hover:text-gray-900'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setPeriod('yearly')}
          className={`flex-1 py-1.5 rounded-xl transition-all ${
            period === 'yearly' ? 'bg-white text-gray-900 shadow-xs' : 'hover:text-gray-900'
          }`}
        >
          Yearly
        </button>
      </div>

      {/* Date / Month / Year Selectors */}
      {period !== 'daily' && (
        <div className="flex items-center space-x-2 bg-gray-50 p-2.5 rounded-2xl border border-gray-100">
          {period === 'monthly' && (
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                Month
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="w-full text-xs font-bold text-gray-900 bg-white border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#e05344]"
              >
                {MONTH_NAMES.map((name, idx) => (
                  <option key={name} value={idx + 1}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex-1">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full text-xs font-bold text-gray-900 bg-white border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#e05344]"
            >
              {[2024, 2025, 2026, 2027, 2028].map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          {period === 'monthly' && (
            <div className="shrink-0 self-end">
              <button
                onClick={onStartNewMonthClick}
                className="px-2.5 py-1 bg-white hover:bg-gray-100 border border-gray-200 text-[#e05344] text-[11px] font-bold rounded-lg transition-colors"
                title="Start a fresh month"
              >
                + New Month
              </button>
            </div>
          )}
        </div>
      )}

      {/* ---------------- DAILY VIEW ---------------- */}
      {period === 'daily' && (
        <div className="space-y-3">
          {/* Main Attendance Card */}
          <div className="p-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-3xl shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                  {currentDate} • Turnout Rate
                </div>
                <div className="text-4xl font-black mt-1 text-white tracking-tight">
                  {dailyPercentage}%
                </div>
                <div className="text-xs text-emerald-400 font-medium mt-1 flex items-center space-x-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{dailyPresent} of {totalEmployees} employees present</span>
                </div>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xs">
                <BarChart3 className="w-7 h-7 text-[#00f0ff]" />
              </div>
            </div>
          </div>

          {/* 3 Metric Cards for P, OT, A */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-center">
              <div className="text-xs font-bold text-emerald-800">Present (P)</div>
              <div className="text-2xl font-black text-emerald-950 mt-1">{dailyPresent}</div>
            </div>
            <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-2xl text-center">
              <div className="text-xs font-bold text-amber-800">Over time (OT)</div>
              <div className="text-2xl font-black text-amber-950 mt-1">{dailyOT}</div>
            </div>
            <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-2xl text-center">
              <div className="text-xs font-bold text-rose-800">Absent (A)</div>
              <div className="text-2xl font-black text-rose-950 mt-1">{dailyAbsent}</div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MONTHLY VIEW ---------------- */}
      {period === 'monthly' && (
        <div className="space-y-3">
          {/* Monthly Summary Banner */}
          <div className="p-3.5 bg-gray-900 text-white rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <div className="text-[11px] text-gray-400 font-semibold uppercase">
                {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
              </div>
              <div className="text-2xl font-black text-white">
                {monthlyData.daysRecorded} Days Logged
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400 block">Total Team</span>
              <span className="text-lg font-bold text-[#00f0ff]">{employees.length} Members</span>
            </div>
          </div>

          {/* Employee Breakdown Table */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-2xs">
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-[11px] font-bold text-gray-500 uppercase">
              <span className="flex-1">Employee</span>
              <div className="flex items-center space-x-3 text-center w-36 justify-between">
                <span className="w-8 text-emerald-700">P</span>
                <span className="w-8 text-amber-700">OT</span>
                <span className="w-8 text-rose-700">A</span>
                <span className="w-9 text-gray-700">%</span>
              </div>
            </div>

            <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
              {monthlyData.items.map((item) => (
                <div key={item.employeeId} className="px-3 py-2 flex items-center justify-between text-xs">
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="font-bold text-gray-900 truncate">{item.name}</div>
                    <div className="text-[10px] text-gray-400 truncate">{item.role || 'Team Member'}</div>
                  </div>

                  <div className="flex items-center space-x-3 text-center w-36 justify-between font-bold">
                    <span className="w-8 text-emerald-700">{item.presentDays}</span>
                    <span className="w-8 text-amber-700">{item.otDays}</span>
                    <span className="w-8 text-rose-700">{item.absentDays}</span>
                    <span
                      className={`w-9 text-[11px] px-1.5 py-0.5 rounded-md ${
                        item.attendancePercentage >= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.attendancePercentage >= 50
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.attendancePercentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- YEARLY VIEW ---------------- */}
      {period === 'yearly' && (
        <div className="space-y-3">
          {/* Yearly Summary Banner */}
          <div className="p-3.5 bg-gray-900 text-white rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <div className="text-[11px] text-gray-400 font-semibold uppercase">
                Annual Review • {selectedYear}
              </div>
              <div className="text-2xl font-black text-white">
                {yearlyData.daysRecorded} Days Logged
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400 block">Annual Database</span>
              <span className="text-lg font-bold text-[#00f0ff]">{employees.length} Members</span>
            </div>
          </div>

          {/* Employee Yearly Breakdown Table */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-2xs">
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-[11px] font-bold text-gray-500 uppercase">
              <span className="flex-1">Employee</span>
              <div className="flex items-center space-x-3 text-center w-36 justify-between">
                <span className="w-8 text-emerald-700">P</span>
                <span className="w-8 text-amber-700">OT</span>
                <span className="w-8 text-rose-700">A</span>
                <span className="w-9 text-gray-700">%</span>
              </div>
            </div>

            <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
              {yearlyData.items.map((item) => (
                <div key={item.employeeId} className="px-3 py-2 flex items-center justify-between text-xs">
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="font-bold text-gray-900 truncate">{item.name}</div>
                    <div className="text-[10px] text-gray-400 truncate">{item.department || item.role || 'Member'}</div>
                  </div>

                  <div className="flex items-center space-x-3 text-center w-36 justify-between font-bold">
                    <span className="w-8 text-emerald-700">{item.presentDays}</span>
                    <span className="w-8 text-amber-700">{item.otDays}</span>
                    <span className="w-8 text-rose-700">{item.absentDays}</span>
                    <span
                      className={`w-9 text-[11px] px-1.5 py-0.5 rounded-md ${
                        item.attendancePercentage >= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.attendancePercentage >= 50
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.attendancePercentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
