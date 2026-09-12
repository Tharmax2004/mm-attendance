import React, { type ReactNode } from 'react';
import { Smartphone, Monitor } from 'lucide-react';

interface PhoneFrameProps {
  children: ReactNode;
  isPhoneFrame: boolean;
  onToggleFrame: () => void;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  isPhoneFrame,
  onToggleFrame,
}) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#12141a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] text-gray-900 p-0 sm:p-4 md:p-6 transition-all duration-300">
      {/* Top Floating Control Bar */}
      <header className="fixed top-3 z-50 flex items-center space-x-2 bg-black/75 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-2xl text-white text-xs font-medium">
        <span className="text-[#e05344] font-black tracking-wider uppercase text-[10px]">
          MM attendance
        </span>
        <span className="text-gray-500">|</span>
        <button
          onClick={onToggleFrame}
          className="flex items-center space-x-1.5 text-gray-300 hover:text-white transition-colors cursor-pointer"
        >
          {isPhoneFrame ? (
            <>
              <Monitor className="w-3.5 h-3.5" />
              <span>Full Screen</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5" />
              <span>Phone Frame</span>
            </>
          )}
        </button>
      </header>

      {/* Main Content Area */}
      {isPhoneFrame ? (
        <div className="relative mt-8 sm:mt-10 mb-4 transition-all duration-300">
          {/* Phone Shell Outer Bezel */}
          <div className="w-[375px] h-[780px] max-h-[92vh] bg-black rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.15)] ring-1 ring-white/10 flex flex-col relative overflow-hidden">
            {/* Dynamic Island / Speaker Pill */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 w-24 h-6 bg-black rounded-full flex items-center justify-end pr-2.5 space-x-1.5 shadow-sm pointer-events-none">
              <div className="w-2.5 h-2.5 rounded-full bg-[#111] ring-1 ring-zinc-800" />
            </div>

            {/* Phone Screen Glass */}
            <div className="w-full h-full bg-white rounded-[38px] overflow-hidden flex flex-col relative shadow-inner pt-6">
              {children}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md h-screen sm:h-[820px] sm:max-h-[95vh] bg-white sm:rounded-[32px] overflow-hidden flex flex-col shadow-2xl mt-10 border border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
};
