import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, ChevronDown, Check } from 'lucide-react';

interface DateShiftHeaderProps {
  selectedDate: string; // YYYY-MM-DD
  onDateChange: (date: string) => void;
  selectedShift: string;
  onShiftChange: (shift: string) => void;
}

const AVAILABLE_SHIFTS = [
  '12:00 pm',
  '09:00 am',
  '02:00 pm',
  '06:00 pm',
  'Night Shift'
];

export const DateShiftHeader: React.FC<DateShiftHeaderProps> = ({
  selectedDate,
  onDateChange,
  selectedShift,
  onShiftChange,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showShiftPicker, setShowShiftPicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const shiftPickerRef = useRef<HTMLDivElement>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const isToday = selectedDate === todayStr;

  // Format date display label
  const getDateLabel = () => {
    if (isToday) return 'today';
    const d = new Date(selectedDate + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target as Node)) {
        setShowDatePicker(false);
      }
      if (shiftPickerRef.current && !shiftPickerRef.current.contains(e.target as Node)) {
        setShowShiftPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="px-5 pt-2 pb-3">
      {/* Top Row: "day attendance" & Date Pill */}
      <div className="flex items-center justify-between">
        <h2 className="text-[22px] font-black tracking-tight text-gray-900 leading-none">
          day attendance
        </h2>

        {/* Date Selector Pill */}
        <div className="relative" ref={datePickerRef}>
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#f0f0f2] hover:bg-[#e6e6e9] active:scale-95 transition-all text-gray-800 rounded-full text-sm font-semibold shadow-xs"
          >
            <Calendar className="w-4 h-4 text-gray-900 stroke-[2.2]" />
            <span>{getDateLabel()}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${showDatePicker ? 'rotate-180' : ''}`} />
          </button>

          {/* Date Picker Dropdown */}
          {showDatePicker && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
                Select Date
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    onDateChange(todayStr);
                    setShowDatePicker(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium flex items-center justify-between transition-colors ${
                    isToday ? 'bg-rose-50 text-[#e05344] font-semibold' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>Today</span>
                  {isToday && <Check className="w-4 h-4 text-[#e05344]" />}
                </button>
                <button
                  onClick={() => {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    onDateChange(yesterday.toISOString().split('T')[0]);
                    setShowDatePicker(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Yesterday
                </button>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-100">
                <label className="text-xs text-gray-500 block mb-1 px-1">Choose custom date:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    if (e.target.value) {
                      onDateChange(e.target.value);
                      setShowDatePicker(false);
                    }
                  }}
                  className="w-full text-xs p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 bg-gray-50"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Second Row: Time / Shift Pill */}
      <div className="mt-2.5 relative inline-block" ref={shiftPickerRef}>
        <button
          onClick={() => setShowShiftPicker(!showShiftPicker)}
          className="flex items-center space-x-2 px-3.5 py-1.5 bg-[#f0f0f2] hover:bg-[#e6e6e9] active:scale-95 transition-all text-gray-900 rounded-full text-sm font-semibold shadow-xs"
        >
          <Clock className="w-4 h-4 text-black stroke-[2.4]" />
          <span>{selectedShift}</span>
          <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${showShiftPicker ? 'rotate-180' : ''}`} />
        </button>

        {/* Shift Picker Dropdown */}
        {showShiftPicker && (
          <div className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 px-2">
              Select Shift / Time
            </div>
            <div className="space-y-0.5">
              {AVAILABLE_SHIFTS.map((shift) => {
                const isSelected = selectedShift === shift;
                return (
                  <button
                    key={shift}
                    onClick={() => {
                      onShiftChange(shift);
                      setShowShiftPicker(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      isSelected ? 'bg-rose-50 text-[#e05344]' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{shift}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#e05344]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
