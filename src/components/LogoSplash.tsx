import React, { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';

interface LogoSplashProps {
  isOpen: boolean;
  onClose: () => void;
  autoClose?: boolean;
  durationMs?: number;
}

export const LogoSplash: React.FC<LogoSplashProps> = ({
  isOpen,
  onClose,
  autoClose = true,
  durationMs = 2800,
}) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Starting System...');

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      return;
    }

    // Step-by-step progress and status text animation
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(pct);

      if (pct < 30) {
        setStatusText('Loading MM Engineering Works...');
      } else if (pct < 70) {
        setStatusText('Initializing Attendance Database...');
      } else if (pct < 95) {
        setStatusText('Securing Employee Roster...');
      } else {
        setStatusText('Ready!');
      }

      if (elapsed >= durationMs) {
        clearInterval(interval);
        if (autoClose) {
          setTimeout(onClose, 250);
        }
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isOpen, autoClose, durationMs, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#090b10] via-[#10141f] to-[#090b10] p-4 select-none animate-in fade-in duration-300">
      {/* Background Animated Glows & Rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] bg-gradient-to-tr from-cyan-500/20 via-rose-500/20 to-amber-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] border border-white/5 rounded-full scale-125 animate-ping opacity-20 duration-1000" />
      </div>

      {/* Top Skip Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 px-3 py-1 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-full text-xs font-semibold backdrop-blur-md border border-white/10 transition-all flex items-center space-x-1 z-50 cursor-pointer"
      >
        <span>Skip</span>
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Center Cinematic Card */}
      <div className="relative z-10 flex flex-col items-center max-w-xs text-center">
        {/* Animated Logo Container with 3D Float & Shimmer */}
        <div className="relative group">
          {/* Pulsing Light Rim */}
          <div className="absolute -inset-2 bg-gradient-to-r from-[#00b4d8] via-[#e05344] to-[#ffb703] rounded-[36px] blur-md opacity-75 group-hover:opacity-100 transition duration-500 animate-spin [animation-duration:8s]" />

          {/* Logo Frame */}
          <div className="relative w-40 h-40 bg-white rounded-[32px] p-2 shadow-2xl overflow-hidden flex items-center justify-center border-2 border-white/90 transform transition-transform duration-700 animate-in zoom-in-75 ease-out">
            <img
              src="/logo.jpg"
              alt="MM Engineering Works Logo"
              className="w-full h-full object-contain rounded-[24px]"
            />

            {/* Shimmer Light Sweep Effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 animate-[shimmer_2s_infinite]" />
          </div>
        </div>

        {/* Brand Titles */}
        <div className="mt-6 space-y-1">
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center justify-center space-x-1.5">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e05344] via-rose-400 to-[#ff9e00]">
              MM
            </span>
            <span className="text-white">attendance</span>
          </h2>
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
            Engineering Works
          </p>
        </div>

        {/* Video Run Progress Bar */}
        <div className="mt-6 w-56 space-y-2">
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-[#00b4d8] via-[#e05344] to-[#ffb703] transition-all duration-75 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-semibold text-gray-400">
            <span className="truncate max-w-[170px] text-left">{statusText}</span>
            <span className="text-white font-mono">{progress}%</span>
          </div>
        </div>

        {/* Tagline */}
        <div className="mt-5 flex items-center space-x-1 text-[11px] text-cyan-400/80 font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Precision Attendance System</span>
        </div>
      </div>
    </div>
  );
};
