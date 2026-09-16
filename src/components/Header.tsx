import React from 'react';
import { Menu, Play } from 'lucide-react';

interface HeaderProps {
  onOpenMenu: () => void;
  onPlayLogoIntro?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMenu, onPlayLogoIntro }) => {
  return (
    <header className="relative flex items-center justify-between px-4 pt-2.5 pb-2 select-none border-b border-gray-50">
      {/* App Branding with Logo */}
      <div className="flex items-center space-x-2.5">
        <button
          onClick={onPlayLogoIntro}
          title="Click to play Logo Video Animation"
          className="relative group p-0.5 rounded-xl bg-white border border-gray-200 shadow-2xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <img
            src="/logo.jpg"
            alt="MM Engineering Works Logo"
            className="w-8 h-8 rounded-lg object-contain"
          />
          {/* Subtle play badge indicator */}
          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#e05344] rounded-full flex items-center justify-center text-white shadow-xs group-hover:scale-110 transition-transform">
            <Play className="w-2 h-2 fill-current" />
          </div>
        </button>

        <div className="flex flex-col">
          <h1 className="text-[19px] font-black tracking-tight text-[#e05344] leading-tight flex items-center space-x-1">
            <span>MM attendance</span>
          </h1>
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-gray-400 -mt-0.5">
            Engineering Works
          </span>
        </div>
      </div>

      {/* Hamburger Menu Button */}
      <button
        onClick={onOpenMenu}
        aria-label="Open menu"
        className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:scale-95 transition-all duration-150 focus:outline-none"
      >
        <Menu className="w-5 h-5 stroke-[2.2]" />
      </button>
    </header>
  );
};
