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

      {/* Sidebar container in Warm Walnut & White */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-[#211C18] border-r border-[#E6E0D4] dark:border-[#3E342C] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-[#E6E0D4] dark:border-[#3E342C]">
          <Link to="/" onClick={onClose} className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-[#8C532B] flex items-center justify-center text-white font-mono font-extrabold text-sm tracking-wide shadow-sm">
              QF
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-[#26221F] dark:text-[#FAF8F5] tracking-tight group-hover:text-[#8C532B] transition-colors">
                  QueueFlow
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-[#8C532B]/10 text-[#8C532B] dark:text-[#C78753] rounded border border-[#8C532B]/20">
                  STUDIO
                </span>
              </div>
              <p className="text-[10px] text-[#736A62] dark:text-[#A69B8F] font-mono tracking-wider uppercase">Dispatch Telemetry</p>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-mono font-semibold tracking-widest text-[#8C827A] dark:text-[#7A6F66] uppercase">
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
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-mono transition-all ${
                    isActive
                      ? 'bg-[#8C532B]/10 text-[#8C532B] dark:text-[#C78753] font-bold border border-[#8C532B]/25'
                      : 'text-[#736A62] dark:text-[#A69B8F] hover:text-[#26221F] dark:hover:text-[#FAF8F5] hover:bg-[#F8F6F0] dark:hover:bg-[#2C241F]'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0 text-[#8C532B] dark:text-[#C78753]" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}

          <div className="pt-6 px-3 pb-2 text-[10px] font-mono font-semibold tracking-widest text-[#8C827A] dark:text-[#7A6F66] uppercase">
            LEGAL COMPLIANCE
          </div>
          <Link
            to="/privacy"
            onClick={onClose}
            className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-mono text-[#736A62] dark:text-[#A69B8F] hover:text-[#26221F] dark:hover:text-[#FAF8F5] hover:bg-[#F8F6F0] dark:hover:bg-[#2C241F] transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-[#8C532B] dark:text-[#C78753]" />
            <span>Privacy Policy</span>
          </Link>
          <Link
            to="/terms"
            onClick={onClose}
            className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-mono text-[#736A62] dark:text-[#A69B8F] hover:text-[#26221F] dark:hover:text-[#FAF8F5] hover:bg-[#F8F6F0] dark:hover:bg-[#2C241F] transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-[#8C532B] dark:text-[#C78753]" />
            <span>Terms of Service</span>
          </Link>
        </div>

        {/* Footer / User Profile Card */}
        <div className="p-3 border-t border-[#E6E0D4] dark:border-[#3E342C] bg-[#FAF8F5] dark:bg-[#1A1613]">
          <div className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-md bg-[#8C532B]/15 text-[#8C532B] dark:text-[#C78753] border border-[#8C532B]/25 flex items-center justify-center font-mono font-bold text-xs uppercase shrink-0">
                {manager?.name ? manager.name.charAt(0) : 'M'}
              </div>
              <div className="min-w-0 truncate">
                <p className="text-xs font-semibold text-[#26221F] dark:text-[#FAF8F5] truncate">
                  {manager?.name || 'Manager'}
                </p>
                <a
                  href={`mailto:${manager?.email}`}
                  className="text-[11px] text-[#736A62] dark:text-[#A69B8F] hover:text-[#8C532B] truncate block transition-colors font-mono"
                  title="Click to send email"
                >
                  {manager?.email || ''}
                </a>
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 rounded-md text-[#736A62] hover:text-[#B71C1C] hover:bg-[#B71C1C]/10 transition-colors shrink-0 cursor-pointer"
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
