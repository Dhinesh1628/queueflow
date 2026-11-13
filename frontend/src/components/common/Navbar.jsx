import React, { useState } from 'react';
import { Menu, Database, ShieldCheck, Sun, Moon, Volume2, VolumeX } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { isSoundEnabled, setSoundEnabled, playCallNextChime } from '../../utils/sound';

const Navbar = ({ onOpenSidebar, pageTitle = 'Dashboard' }) => {
  const { manager } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const handleToggleSound = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    setSoundEnabled(nextState);
    if (nextState) {
      playCallNextChime();
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

      {/* Right controls matching Warm Studio Palette */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Real-time DB indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-md bg-[#F8F6F0] dark:bg-[#2A241F] border border-[#E6E0D4] dark:border-[#3E342C] text-xs text-[#594F45] dark:text-[#FAF8F5] font-mono">
          <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
          <span>ATLAS TELEMETRY: READY</span>
        </div>

        {/* Security badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F8F6F0] dark:bg-[#2A241F] border border-[#E6E0D4] dark:border-[#3E342C] text-xs font-mono text-[#8C532B] dark:text-[#C78753]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#8C532B] dark:text-[#C78753]" />
          <span>JWT SCOPED</span>
        </div>

        {/* Audio Chime Toggle */}
        <button
          onClick={handleToggleSound}
          title={soundOn ? 'Audio Chimes: Enabled (Click to Mute)' : 'Audio Chimes: Muted (Click to Enable)'}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            soundOn
              ? 'text-[#8C532B] dark:text-[#C78753] hover:bg-[#8C532B]/10'
              : 'text-[#8C827A] hover:text-[#26221F] dark:hover:text-[#FAF8F5]'
          }`}
          aria-label="Toggle audio chimes"
        >
          {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Theme Toggle Button (Light/Dark) */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Warm Alabaster White Mode' : 'Switch to Dark Espresso Mode'}
          className="p-2 rounded-lg text-[#736A62] hover:text-[#26221F] hover:bg-[#F8F6F0] dark:text-[#A69B8F] dark:hover:text-[#FAF8F5] dark:hover:bg-[#2C241F] transition-colors cursor-pointer"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-[#C78753]" />
          ) : (
            <Moon className="w-4 h-4 text-[#736A62]" />
          )}
        </button>

        {/* Profile Avatar & Email */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[#E6E0D4] dark:border-[#3E342C]">
          <div className="w-8 h-8 rounded-md bg-[#8C532B] text-white flex items-center justify-center text-xs font-mono font-bold uppercase shadow-sm">
            {manager?.name ? manager.name.charAt(0) : 'M'}
          </div>
          <div className="hidden sm:block text-left">
            <span className="block text-xs font-semibold text-[#26221F] dark:text-[#FAF8F5]">
              {manager?.name || 'Manager'}
            </span>
            <a
              href={`mailto:${manager?.email}`}
              className="text-[10px] text-[#736A62] dark:text-[#A69B8F] hover:text-[#8C532B] transition-colors block font-mono"
            >
              {manager?.email}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
