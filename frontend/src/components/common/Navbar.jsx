import React, { useState } from 'react';
import { Menu, Database, ShieldCheck, Sun, Moon, Volume2, VolumeX } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../hooks/useToast';
import { isSoundEnabled, setSoundEnabled, playCallNextChime } from '../../utils/sound';

const Navbar = ({ onOpenSidebar, pageTitle = 'Dashboard' }) => {
  const { manager } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const handleToggleSound = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    setSoundEnabled(nextState);
    if (nextState) {
      playCallNextChime();
      toast.success('Audio chimes enabled');
    } else {
      toast.info('Audio chimes muted');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-[#211C18]/90 backdrop-blur-md border-b border-[#E6E0D4] dark:border-[#3E342C] px-4 sm:px-8 flex items-center justify-between transition-colors">
      {/* Left title & mobile menu */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-lg text-[#736A62] hover:text-[#26221F] hover:bg-[#F8F6F0] dark:text-[#A69B8F] dark:hover:text-[#FAF8F5] dark:hover:bg-[#2C241F] lg:hidden cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-[#26221F] dark:text-[#FAF8F5] tracking-tight">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Simple live status */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-[#736A62] dark:text-[#A69B8F]">
          <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
          <span>Online</span>
        </div>

        {/* Audio Chime Toggle */}
        <button
          onClick={handleToggleSound}
          title={soundOn ? 'Sound: On' : 'Sound: Muted'}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            soundOn
              ? 'text-[#8C532B] dark:text-[#D4A373] hover:bg-[#8C532B]/10'
              : 'text-[#8C827A] hover:text-[#26221F] dark:hover:text-[#FAF8F5]'
          }`}
          aria-label="Toggle audio chimes"
        >
          {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Theme Toggle Button (Light/Dark) */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 rounded-lg text-[#736A62] hover:text-[#26221F] hover:bg-[#F8F6F0] dark:text-[#A69B8F] dark:hover:text-[#FAF8F5] dark:hover:bg-[#2C241F] transition-colors cursor-pointer"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-[#D4A373]" />
          ) : (
            <Moon className="w-4 h-4 text-[#736A62]" />
          )}
        </button>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#E6E0D4] dark:border-[#3E342C]">
          <div className="w-8 h-8 rounded-full bg-[#8C532B] text-white flex items-center justify-center text-xs font-semibold uppercase shadow-xs">
            {manager?.name ? manager.name.charAt(0).toUpperCase() : 'M'}
          </div>
          <div className="hidden sm:block text-left">
            <span className="block text-xs font-semibold text-[#26221F] dark:text-[#FAF8F5] leading-tight">
              {manager?.name || 'Manager'}
            </span>
            <span className="text-[11px] text-[#736A62] dark:text-[#A69B8F] block leading-tight">
              Queue Manager
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
