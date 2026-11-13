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
    { name: 'Overview', to: '/', icon: LayoutDashboard },
    { name: 'My Queues', to: '/queues', icon: Layers },
    { name: 'Analytics', to: '/analytics', icon: BarChart3 },
    { name: 'Token History', to: '/history', icon: History },
    { name: 'Settings', to: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Clickable Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Link to="/" onClick={onClose} className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold text-sm tracking-wider">
              QF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white tracking-tight group-hover:text-sky-400 transition-colors">
                  QueueFlow
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-slate-800 text-slate-300 rounded border border-slate-700">
                  SaaS
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Queue Operations Platform</p>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Platform Console
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
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-white border border-slate-700'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}

          <div className="pt-6 px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Compliance & Legal
          </div>
          <Link
            to="/privacy"
            onClick={onClose}
            className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-slate-500" />
            <span>Privacy Policy</span>
          </Link>
          <Link
            to="/terms"
            onClick={onClose}
            className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>Terms of Service</span>
          </Link>
        </div>

        {/* Footer / User Profile */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 font-bold text-xs uppercase shrink-0">
                {manager?.name ? manager.name.charAt(0) : 'M'}
              </div>
              <div className="min-w-0 truncate">
                <p className="text-xs font-semibold text-slate-200 truncate">
                  {manager?.name || 'Manager'}
                </p>
                <a
                  href={`mailto:${manager?.email}`}
                  className="text-[11px] text-slate-400 hover:text-sky-400 truncate block transition-colors"
                  title="Click to send email"
                >
                  {manager?.email || ''}
                </a>
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
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
