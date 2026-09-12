import React, { type ReactNode } from 'react';

interface PhoneFrameProps {
  children: ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0d0f14] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.18),rgba(0,0,0,0.9))] p-0 sm:p-6 overflow-hidden select-none">
      {/* Phone Chassis Container */}
      <div className="w-full sm:w-[390px] h-screen sm:h-[820px] sm:max-h-[94vh] bg-black sm:rounded-[50px] p-0 sm:p-3 sm:ring-1 sm:ring-white/20 sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_12px_#1c1d22] flex flex-col relative overflow-hidden transition-all duration-300">
        
        {/* Dynamic Island / Camera Notch (visible on desktop mockup) */}
        <div className="hidden sm:flex absolute top-4 left-1/2 -translate-x-1/2 z-40 w-28 h-7 bg-black rounded-full items-center justify-end pr-3 space-x-2 shadow-sm pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-[#111] ring-1 ring-zinc-800" />
          <div className="w-2 h-2 rounded-full bg-[#1a1a2e]" />
        </div>

        {/* Screen Glass */}
        <div className="w-full h-full bg-white sm:rounded-[40px] overflow-hidden flex flex-col relative sm:pt-4">
          {children}

          {/* iOS Bottom Home Bar */}
          <div className="w-full py-1.5 flex justify-center bg-transparent pointer-events-none sm:pb-2">
            <div className="w-32 h-1 bg-black/80 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
