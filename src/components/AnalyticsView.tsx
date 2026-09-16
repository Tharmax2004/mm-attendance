import React from 'react';
import type { Employee, AttendanceStatus } from '../types/attendance';
import { BarChart3, TrendingUp, CheckCircle2, XCircle, Clock } from 'lucide-react';

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
  const otCount = Object.values(records).filter((s) => s === 'OT').length;
  const aCount = Object.values(records).filter((s) => s === 'A').length;
  const unmarked = total - (pCount + otCount + aCount);

  const presentPercentage = total > 0 ? Math.round((pCount / total) * 100) : 0;
  const otPercentage = total > 0 ? Math.round((otCount / total) * 100) : 0;
  const absentPercentage = total > 0 ? Math.round((aCount / total) * 100) : 0;

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

        {/* Multi-segment Progress Bar for P, OT, A */}
        <div className="mt-4 w-full h-2.5 bg-gray-700/60 rounded-full overflow-hidden flex">
          <div style={{ width: `${presentPercentage}%` }} className="bg-emerald-500 h-full transition-all duration-500" title={`Present: ${presentPercentage}%`} />
          <div style={{ width: `${otPercentage}%` }} className="bg-amber-500 h-full transition-all duration-500" title={`Over time: ${otPercentage}%`} />
          <div style={{ width: `${absentPercentage}%` }} className="bg-rose-500 h-full transition-all duration-500" title={`Absent: ${absentPercentage}%`} />
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-3 gap-2">
        {/* Present (P) */}
        <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800">Present (P)</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-emerald-950 mt-1">
            {pCount}
          </div>
          <div className="text-[10px] text-emerald-600 font-medium">
            {presentPercentage}%
          </div>
        </div>

        {/* Over time (OT) */}
        <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800">Over time (OT)</span>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-xl font-black text-amber-950 mt-1">
            {otCount}
          </div>
          <div className="text-[10px] text-amber-600 font-medium">
            {otPercentage}%
          </div>
        </div>

        {/* Absent (A) */}
        <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800">Absent (A)</span>
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="text-xl font-black text-rose-950 mt-1">
            {aCount}
          </div>
          <div className="text-[10px] text-rose-600 font-medium">
            {absentPercentage}%
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
