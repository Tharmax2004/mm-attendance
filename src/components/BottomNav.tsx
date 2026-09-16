import React from 'react';
import { Home, User, BarChart2, DownloadCloud } from 'lucide-react';
import type { ActiveTab } from '../types/attendance';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onExportClick: () => void;
  isExporting?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onExportClick,
  isExporting = false
}) => {
  return (
    <div className="relative select-none">
      {/* Floating Cloud Download Button (Matching mockup bottom-right) */}
      <div className="absolute right-5 -top-12 z-20">
        <button
          onClick={onExportClick}
          disabled={isExporting}
          title="Download Attendance Report (CSV)"
          className="p-2.5 rounded-full bg-white/95 text-gray-700 hover:text-black hover:bg-white shadow-md border border-gray-200/80 active:scale-90 transition-all flex items-center justify-center group"
        >
          <DownloadCloud className={`w-5 h-5 text-gray-800 transition-transform group-hover:translate-y-0.5 ${isExporting ? 'animate-bounce' : ''}`} />
        </button>
      </div>

      {/* Bottom Navigation Capsule Bar */}
      <div className="px-6 pb-4 pt-1">
        <nav className="bg-[#f2f2f4] rounded-full px-6 py-2 flex items-center justify-around shadow-inner border border-gray-200/60 max-w-xs mx-auto">
          {/* Home / Attendance Sheet Tab */}
          <button
            onClick={() => onTabChange('attendance')}
            aria-label="Attendance View"
            className="relative flex items-center justify-center transition-transform active:scale-90 focus:outline-none"
          >
            {activeTab === 'attendance' ? (
              /* Vibrant Cyan squircle badge from mockup */
              <div className="w-10 h-10 rounded-[12px] bg-[#00f0ff] flex items-center justify-center shadow-sm">
                <Home className="w-5 h-5 text-black stroke-[2.4]" />
              </div>
            ) : (
              <div className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-800">
                <Home className="w-5 h-5 stroke-[2]" />
              </div>
            )}
          </button>

          {/* Employees Directory Tab */}
          <button
            onClick={() => onTabChange('employees')}
            aria-label="Employees Directory"
            className="relative flex items-center justify-center transition-transform active:scale-90 focus:outline-none"
          >
            {activeTab === 'employees' ? (
              <div className="w-10 h-10 rounded-[12px] bg-[#00f0ff] flex items-center justify-center shadow-sm">
                <User className="w-5 h-5 text-black stroke-[2.4]" />
              </div>
            ) : (
              <div className="w-10 h-10 flex items-center justify-center text-gray-800 hover:text-black">
                <User className="w-6 h-6 fill-current stroke-none" />
              </div>
            )}
          </button>

          {/* Reports & Analytics Tab */}
          <button
            onClick={() => onTabChange('reports')}
            aria-label="Monthly & Yearly Reports"
            className="relative flex items-center justify-center transition-transform active:scale-90 focus:outline-none"
          >
            {activeTab === 'reports' ? (
              <div className="w-10 h-10 rounded-[12px] bg-[#00f0ff] flex items-center justify-center shadow-sm">
                <BarChart2 className="w-5 h-5 text-black stroke-[2.4]" />
              </div>
            ) : (
              <div className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-800">
                <BarChart2 className="w-5 h-5 stroke-[2]" />
              </div>
            )}
          </button>
        </nav>
      </div>
    </div>
  );
};
