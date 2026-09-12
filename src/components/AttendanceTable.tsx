import React, { useState } from 'react';
import type { Employee, AttendanceStatus } from '../types/attendance';
import { STATUS_CONFIG } from '../types/attendance';
import { CheckSquare, Square, Search, X, Check } from 'lucide-react';

interface AttendanceTableProps {
  employees: Employee[];
  records: Record<string, AttendanceStatus>;
  onStatusChange: (employeeId: string, status: AttendanceStatus) => void;
  onBulkStatusChange: (status: AttendanceStatus | null) => void;
  onAddEmployeeClick: () => void;
}

const STATUS_COLUMNS: AttendanceStatus[] = ['P', 'A', 'L', 'E'];

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  employees,
  records,
  onStatusChange,
  onBulkStatusChange,
  onAddEmployeeClick
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showBulkOptions, setShowBulkOptions] = useState(false);

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate totals
  const totalEmployees = employees.length;
  const presentCount = Object.values(records).filter((s) => s === 'P').length;
  const absentCount = Object.values(records).filter((s) => s === 'A').length;
  const leaveCount = Object.values(records).filter((s) => s === 'L').length;
  const excusedCount = Object.values(records).filter((s) => s === 'E').length;

  const isAllPresent = totalEmployees > 0 && presentCount === totalEmployees;

  return (
    <div className="flex-1 flex flex-col min-h-0 select-none pb-20">
      {/* Attendance Row Header matching Mockup */}
      <div className="px-5 py-2 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <span className="text-[#e05344] font-black text-xl tracking-tight">
            attendance
          </span>

          {/* "all employee" checkbox & trigger */}
          <div className="relative">
            <button
              onClick={() => setShowBulkOptions(!showBulkOptions)}
              className="flex items-center space-x-1.5 text-xs font-semibold text-gray-800 hover:text-gray-900 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              {isAllPresent ? (
                <CheckSquare className="w-4 h-4 text-[#e05344] stroke-[2.2]" />
              ) : (
                <Square className="w-4 h-4 text-gray-700 stroke-[2]" />
              )}
              <span>all employee</span>
            </button>

            {/* Quick Bulk Actions Popover */}
            {showBulkOptions && (
              <div className="absolute left-0 top-full mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-gray-200 p-2 z-40 text-xs animate-in fade-in zoom-in-95">
                <div className="font-bold text-gray-400 uppercase tracking-wider px-2 py-1 text-[10px]">
                  Bulk Actions
                </div>
                <button
                  onClick={() => {
                    onBulkStatusChange('P');
                    setShowBulkOptions(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-emerald-50 text-emerald-700 font-semibold flex items-center justify-between"
                >
                  <span>Mark All Present (P)</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </button>
                <button
                  onClick={() => {
                    onBulkStatusChange('A');
                    setShowBulkOptions(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-rose-50 text-rose-700 font-semibold flex items-center justify-between"
                >
                  <span>Mark All Absent (A)</span>
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                </button>
                <button
                  onClick={() => {
                    onBulkStatusChange(null);
                    setShowBulkOptions(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-gray-100 text-gray-600 font-medium"
                >
                  Clear All Marks
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Status Letters Column Headers: P, A, L, E */}
        <div className="flex items-center space-x-2 sm:space-x-3 pr-1">
          {STATUS_COLUMNS.map((status) => (
            <div
              key={status}
              className="w-7 text-center font-black text-sm text-gray-900 tracking-tight"
            >
              {status}
            </div>
          ))}
        </div>
      </div>

      {/* Sub-header: Pill "name" and search toggle */}
      <div className="px-5 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="inline-block px-3 py-0.5 bg-[#ececee] text-gray-800 text-xs font-bold rounded-full">
            name
          </span>
          <span className="text-[11px] text-gray-400 font-medium">
            ({filteredEmployees.length})
          </span>
        </div>

        <button
          onClick={() => setShowSearch(!showSearch)}
          className="p-1 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
          title="Search employee"
        >
          <Search className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Search Bar Input (collapsible) */}
      {showSearch && (
        <div className="px-5 pb-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Filter by name, department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-7 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-400 focus:bg-white"
              autoFocus
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Employee Rows List */}
      <div className="flex-1 overflow-y-auto px-5 space-y-2.5 pt-1">
        {filteredEmployees.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-xs">
            No employees found.
          </div>
        ) : (
          filteredEmployees.map((employee) => {
            const currentStatus = records[employee.id];

            return (
              <div
                key={employee.id}
                className="flex items-center justify-between py-1 group hover:bg-gray-50/80 rounded-lg transition-colors"
              >
                {/* Employee Name */}
                <div className="flex-1 min-w-0 pr-2">
                  <span className="text-sm font-bold text-gray-900 tracking-tight block truncate">
                    {employee.name}
                  </span>
                </div>

                {/* P, A, L, E Status Selector Boxes */}
                <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
                  {STATUS_COLUMNS.map((status) => {
                    const isSelected = currentStatus === status;
                    const config = STATUS_CONFIG[status];

                    return (
                      <button
                        key={status}
                        onClick={() => onStatusChange(employee.id, status)}
                        aria-label={`Mark ${employee.name} as ${config.full}`}
                        className={`w-7 h-7 rounded-[7px] flex items-center justify-center transition-all duration-150 cursor-pointer focus:outline-none ${
                          isSelected
                            ? config.activeBg
                            : 'border border-gray-400/90 bg-white hover:border-gray-700 active:scale-90'
                        }`}
                      >
                        {isSelected && (
                          <Check className="w-4 h-4 stroke-[3]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}

        {/* Add Employee quick link at bottom of list */}
        <div className="pt-3 pb-2 text-center">
          <button
            onClick={onAddEmployeeClick}
            className="text-xs font-semibold text-gray-500 hover:text-[#e05344] transition-colors inline-flex items-center space-x-1"
          >
            <span>+ Add New Employee</span>
          </button>
        </div>
      </div>

      {/* Mini Stats Bar */}
      <div className="px-5 py-2 bg-gray-50/90 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-gray-600">
        <span className="text-emerald-700">P: {presentCount}</span>
        <span className="text-rose-700">A: {absentCount}</span>
        <span className="text-amber-700">L: {leaveCount}</span>
        <span className="text-indigo-700">E: {excusedCount}</span>
        <span className="text-gray-400">Total: {totalEmployees}</span>
      </div>
    </div>
  );
};
