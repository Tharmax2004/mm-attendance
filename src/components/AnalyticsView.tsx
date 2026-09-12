import React from 'react';
import type { Employee, AttendanceStatus } from '../types/attendance';
import { BarChart3, TrendingUp, CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';

interface AnalyticsViewProps {
  employees: Employee[];
  records: Record<string, AttendanceStatus>;
  selectedDate: string;
  selectedShift: string;
  onExport: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  employees,
  records,
  selectedDate,
  selectedShift,
  onExport,
}) => {
  const total = employees.length;
  const pCount = Object.values(records).filter((s) => s === 'P').length;
  const aCount = Object.values(records).filter((s) => s === 'A').length;
  const lCount = Object.values(records).filter((s) => s === 'L').length;
  const eCount = Object.values(records).filter((s) => s === 'E').length;
  const unmarked = total - (pCount + aCount + lCount + eCount);

  const presentPercentage = total > 0 ? Math.round((pCount / total) * 100) : 0;
  const absentPercentage = total > 0 ? Math.round((aCount / total) * 100) : 0;
  const leavePercentage = total > 0 ? Math.round((lCount / total) * 100) : 0;
  const excusedPercentage = total > 0 ? Math.round((eCount / total) * 100) : 0;

  return (
    <div className="flex-1 flex flex-col min-h-0 px-5 pt-3 pb-24 overflow-y-auto select-none space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">
            Daily Summary
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            {selectedDate} • {selectedShift}
          </p>
        </div>

        <button
          onClick={onExport}
          className="text-xs font-bold text-[#e05344] hover:underline"
        >
          Export CSV
        </button>
      </div>

      {/* Main Attendance Rate Card */}
      <div className="p-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-3xl shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
              Turnout Rate
            </div>
            <div className="text-4xl font-black mt-1 text-white tracking-tight">
              {presentPercentage}%
            </div>
            <div className="text-xs text-emerald-400 font-medium mt-1 flex items-center space-x-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{pCount} of {total} employees present</span>
            </div>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xs">
            <BarChart3 className="w-8 h-8 text-[#00f0ff]" />
          </div>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="mt-4 w-full h-2.5 bg-gray-700/60 rounded-full overflow-hidden flex">
          <div style={{ width: `${presentPercentage}%` }} className="bg-emerald-500 h-full transition-all duration-500" />
          <div style={{ width: `${absentPercentage}%` }} className="bg-rose-500 h-full transition-all duration-500" />
          <div style={{ width: `${leavePercentage}%` }} className="bg-amber-500 h-full transition-all duration-500" />
          <div style={{ width: `${excusedPercentage}%` }} className="bg-indigo-500 h-full transition-all duration-500" />
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Present */}
        <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800">Present (P)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-950 mt-1">
            {pCount}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">
            {presentPercentage}% of roster
          </div>
        </div>

        {/* Absent */}
        <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800">Absent (A)</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-950 mt-1">
            {aCount}
          </div>
          <div className="text-[11px] text-rose-600 font-medium">
            {absentPercentage}% of roster
          </div>
        </div>

        {/* Leave */}
        <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800">Leave (L)</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-950 mt-1">
            {lCount}
          </div>
          <div className="text-[11px] text-amber-600 font-medium">
            {leavePercentage}% of roster
          </div>
        </div>

        {/* Excused */}
        <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-800">Excused (E)</span>
            <AlertCircle className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-950 mt-1">
            {eCount}
          </div>
          <div className="text-[11px] text-indigo-600 font-medium">
            {excusedPercentage}% of roster
          </div>
        </div>
      </div>

      {/* Unmarked notice if any */}
      {unmarked > 0 && (
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-600 flex items-center justify-between">
          <span>{unmarked} employees not yet marked today</span>
          <span className="font-bold text-[#e05344]">Pending</span>
        </div>
      )}
    </div>
  );
};
