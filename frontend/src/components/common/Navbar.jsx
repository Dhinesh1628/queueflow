import React from 'react';
import { Menu, Database, ShieldCheck, Sun, Moon, Search } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';

const Navbar = ({ onOpenSidebar, pageTitle = 'Dashboard' }) => {
  const { manager } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-[#080B11]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-white/[0.08] px-4 sm:px-8 flex items-center justify-between transition-colors">
      {/* Left title & mobile menu */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.06] lg:hidden cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right controls matching CarWhisperer Cockpit */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Real-time DB indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 dark:bg-[#0E1526] border border-slate-200 dark:border-emerald-500/25 text-xs text-slate-700 dark:text-emerald-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
          <span>ATLAS TELEMETRY: ONLINE</span>
        </div>

        {/* Security badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-50 dark:bg-[#0E1526] border border-cyan-200 dark:border-cyan-500/25 text-xs font-mono text-cyan-700 dark:text-cyan-400">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>JWT SCOPED</span>
        </div>

        {/* Theme Toggle Button (Light/Dark) */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Cockpit Dark Mode'}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* Profile Avatar & Email */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-white/[0.08]">
          <div className="w-8 h-8 rounded-md bg-cyan-500 text-[#080B11] flex items-center justify-center text-xs font-mono font-bold uppercase shadow-[0_0_10px_rgba(6,182,212,0.35)]">
            {manager?.name ? manager.name.charAt(0) : 'M'}
          </div>
          <div className="hidden sm:block text-left">
            <span className="block text-xs font-semibold text-slate-900 dark:text-slate-200">
              {manager?.name || 'Manager'}
            </span>
            <a
              href={`mailto:${manager?.email}`}
              className="text-[10px] text-slate-400 hover:text-cyan-400 transition-colors block font-mono"
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
