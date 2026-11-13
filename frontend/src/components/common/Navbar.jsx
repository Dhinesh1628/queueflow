import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Database, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Navbar = ({ onOpenSidebar, pageTitle = 'Dashboard' }) => {
  const { manager } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 flex items-center justify-between">
      {/* Left title & mobile menu */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Real-time DB indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-md bg-slate-950 border border-slate-800 text-xs text-slate-300">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>MongoDB Atlas Connected</span>
        </div>

        {/* Security badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-xs font-medium text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
          <span>JWT Protected</span>
        </div>

        {/* Profile Avatar & Email */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white uppercase">
            {manager?.name ? manager.name.charAt(0) : 'M'}
          </div>
          <div className="hidden sm:block text-left">
            <span className="block text-xs font-semibold text-slate-200">
              {manager?.name || 'Manager'}
            </span>
            <a
              href={`mailto:${manager?.email}`}
              className="text-[10px] text-slate-400 hover:text-sky-400 transition-colors block"
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
