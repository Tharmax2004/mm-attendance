import React, { useState } from 'react';
import type { Employee } from '../types/attendance';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

interface EmployeesViewProps {
  employees: Employee[];
  onAddClick: () => void;
  onEditClick: (employee: Employee) => void;
  onDeleteClick: (id: string) => void;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({
  employees,
  onAddClick,
  onEditClick,
  onDeleteClick,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 px-5 pt-3 pb-24 select-none">
      {/* View Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">
            Employees Roster
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            {employees.length} team members registered
          </p>
        </div>

        <button
          onClick={onAddClick}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#e05344] text-white rounded-full text-xs font-bold shadow-sm hover:bg-[#c94537] active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>New</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative mb-3">
        <input
          type="text"
          placeholder="Search team member..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-xs pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#e05344] focus:bg-white"
        />
        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
      </div>

      {/* Employee List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-xs">
            No employees found matching &quot;{searchTerm}&quot;
          </div>
        ) : (
          filtered.map((emp) => (
            <div
              key={emp.id}
              className="flex items-center justify-between p-2.5 bg-white border border-gray-100 rounded-2xl shadow-2xs hover:border-gray-300 transition-all"
            >
              <div className="flex items-center space-x-3 min-w-0">
                {/* Avatar */}
                <div
                  style={{ backgroundColor: emp.avatarColor || '#3b82f6' }}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs"
                >
                  {emp.name.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <div className="text-sm font-bold text-gray-900 truncate">
                    {emp.name}
                  </div>
                  <div className="text-[11px] text-gray-500 truncate">
                    {emp.role || 'Staff Member'} {emp.department ? `• ${emp.department}` : ''}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-1 shrink-0">
                <button
                  onClick={() => onEditClick(emp)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Remove ${emp.name}?`)) {
                      onDeleteClick(emp.id);
                    }
                  }}
                  className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
