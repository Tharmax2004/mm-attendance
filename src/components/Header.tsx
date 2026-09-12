import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onOpenMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMenu }) => {
  return (
    <header className="relative flex items-center justify-between px-5 pt-3 pb-2 select-none">
      {/* App Branding */}
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-extrabold tracking-tight text-[#e05344]">
          MM attendance
        </h1>
      </div>

      {/* Hamburger Menu Button */}
      <button
        onClick={onOpenMenu}
        aria-label="Open menu"
        className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 active:scale-95 transition-all duration-150 focus:outline-none"
      >
        <Menu className="w-6 h-6 stroke-[2.2]" />
      </button>
    </header>
  );
};
