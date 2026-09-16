import React, { useState } from 'react';
import { Calendar, X, ArrowRight, ShieldCheck } from 'lucide-react';

interface NewMonthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartMonth: (year: number, month: number) => void;
  currentDate: string; // YYYY-MM-DD
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const NewMonthModal: React.FC<NewMonthModalProps> = ({
  isOpen,
  onClose,
  onStartMonth,
  currentDate,
}) => {
  const currentD = new Date(currentDate);
  const initialYear = currentD.getFullYear() || new Date().getFullYear();
  const initialMonth = (currentD.getMonth() + 2 > 12) ? 1 : currentD.getMonth() + 2; // default to next month
  const nextMonthYear = (currentD.getMonth() + 2 > 12) ? initialYear + 1 : initialYear;

  const [selectedYear, setSelectedYear] = useState<number>(nextMonthYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(initialMonth);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onStartMonth(selectedYear, selectedMonth);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 select-none">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-gray-100 p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-50 text-[#e05344] flex items-center justify-center shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-lg leading-tight">
                Start New Month
              </h3>
              <p className="text-[11px] text-gray-500 font-medium">
                Fresh roster & clean attendance sheet
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Card */}
        <div className="mt-4 p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-xs text-emerald-900 space-y-1">
          <div className="flex items-center space-x-1.5 font-bold text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Database Protected</span>
          </div>
          <p className="text-[11px] text-emerald-700 leading-relaxed">
            All previous months are safely saved in your database and can be reviewed or exported anytime in the <strong>Reports</strong> tab.
          </p>
        </div>

        {/* Month & Year Selectors */}
        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
              Select Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#e05344] focus:bg-white"
            >
              {MONTH_NAMES.map((name, idx) => (
                <option key={name} value={idx + 1}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
              Select Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#e05344] focus:bg-white"
            >
              {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Destination preview */}
        <div className="mt-4 p-2.5 bg-gray-50 rounded-xl text-center text-xs text-gray-600 font-medium">
          New active period: <strong className="text-gray-900">{MONTH_NAMES[selectedMonth - 1]} {selectedYear}</strong>
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2 text-xs font-bold text-white bg-[#e05344] hover:bg-[#c94537] rounded-xl shadow-md active:scale-95 transition-all flex items-center space-x-1.5"
          >
            <span>Start Month</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
