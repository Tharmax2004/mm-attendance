import React from 'react';
import { X, CheckCircle2, RotateCcw, Download, RefreshCw, Calendar, Clock } from 'lucide-react';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onMarkAllPresent: () => void;
  onMarkAllAbsent: () => void;
  onClearCurrent: () => void;
  onResetDefaults: () => void;
  onExport: () => void;
  currentDate: string;
  currentShift: string;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  onMarkAllPresent,
  onMarkAllAbsent,
  onClearCurrent,
  onResetDefaults,
  onExport,
  currentDate,
  currentShift,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-2xs animate-in fade-in duration-150">
      {/* Drawer Overlay backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Sheet */}
      <div className="relative w-72 max-w-full bg-white h-full shadow-2xl p-5 flex flex-col justify-between z-10 animate-in slide-in-from-right duration-200">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-black text-[#e05344] tracking-tight">
                MM attendance
              </h2>
              <p className="text-[11px] text-gray-500 font-medium">
                Fast & easy attendance management
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Session Info */}
          <div className="mt-4 p-3 bg-gray-50 rounded-2xl border border-gray-100 space-y-1.5 text-xs text-gray-700">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="font-semibold">{currentDate}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="font-semibold">{currentShift}</span>
            </div>
          </div>

          {/* Quick Actions List */}
          <div className="mt-5 space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-1 mb-2">
              Quick Actions
            </div>

            <button
              onClick={() => {
                onMarkAllPresent();
                onClose();
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100 flex items-center space-x-2 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark All Present</span>
            </button>

            <button
              onClick={() => {
                onMarkAllAbsent();
                onClose();
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50/70 hover:bg-rose-100 flex items-center space-x-2 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Mark All Absent</span>
            </button>

            <button
              onClick={() => {
                onClearCurrent();
                onClose();
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-gray-500" />
              <span>Clear Current Shift Marks</span>
            </button>

            <button
              onClick={() => {
                onExport();
                onClose();
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition-colors"
            >
              <Download className="w-4 h-4 text-gray-500" />
              <span>Export Today&#39;s CSV</span>
            </button>

            <div className="pt-3 border-t border-gray-100">
              <button
                onClick={() => {
                  if (confirm('Reset employee list to the original 8 mockup items?')) {
                    onResetDefaults();
                    onClose();
                  }
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 flex items-center space-x-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset Demo Employees</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 text-center">
          <div className="text-[11px] text-gray-400 font-medium">
            MM attendance • v1.0.0
          </div>
        </div>
      </div>
    </div>
  );
};
