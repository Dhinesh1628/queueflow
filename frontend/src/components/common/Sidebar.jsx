import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  BarChart3,
  History,
  Settings,
  LogOut,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ isOpen, onClose }) => {
  const { manager, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', to: '/', icon: LayoutDashboard },
    { name: 'Queue Counters', to: '/queues', icon: Layers },
    { name: 'Analytics', to: '/analytics', icon: BarChart3 },
    { name: 'Token Audit', to: '/history', icon: History },
    { name: 'Settings', to: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container matching CarWhisperer Cockpit structure */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-[#0B0F19] border-r border-slate-200/90 dark:border-white/[0.08] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200/80 dark:border-white/[0.08]">
          <Link to="/" onClick={onClose} className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-[#080B11] font-extrabold text-sm tracking-wide shadow-[0_0_14px_rgba(6,182,212,0.45)]">
              QF
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-slate-900 dark:text-white tracking-tight group-hover:text-cyan-400 transition-colors">
                  QueueFlow
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 rounded border border-cyan-500/25">
                  COCKPIT
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-wider uppercase">Command Telemetry</p>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-mono font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
            TELEMETRY SYSTEMS
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs transition-all ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 font-semibold border border-cyan-500/25 shadow-[0_0_12px_rgba(6,182,212,0.1)]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.04]'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}

          <div className="pt-6 px-3 pb-2 text-[10px] font-mono font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
            LEGAL COMPLIANCE
          </div>
          <Link
            to="/privacy"
            onClick={onClose}
            className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.04] transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span>Privacy Policy</span>
          </Link>
          <Link
            to="/terms"
            onClick={onClose}
            className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.04] transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Terms of Service</span>
          </Link>
        </div>

        {/* Footer / User Profile Card */}
        <div className="p-3 border-t border-slate-200/80 dark:border-white/[0.08] bg-slate-50/50 dark:bg-[#0B0F19]">
          <div className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-white dark:bg-[#0E1526] border border-slate-200/80 dark:border-white/[0.08] shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 flex items-center justify-center font-mono font-bold text-xs uppercase shrink-0">
                {manager?.name ? manager.name.charAt(0) : 'M'}
              </div>
              <div className="min-w-0 truncate">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-200 truncate">
                  {manager?.name || 'Manager'}
                </p>
                <a
                  href={`mailto:${manager?.email}`}
                  className="text-[11px] text-slate-400 hover:text-cyan-400 truncate block transition-colors font-mono"
                  title="Click to send email"
                >
                  {manager?.email || ''}
                </a>
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
