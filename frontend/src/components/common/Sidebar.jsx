import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  BarChart3,
  History,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ isOpen, onClose }) => {
  const { manager, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', to: '/', icon: LayoutDashboard },
    { name: 'Queues', to: '/queues', icon: Layers },
    { name: 'Analytics', to: '/analytics', icon: BarChart3 },
    { name: 'Token History', to: '/history', icon: History },
    { name: 'Settings', to: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Clean Human Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-60 bg-white dark:bg-[#211C18] border-r border-[#E6E0D4] dark:border-[#3E342C] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-5 border-b border-[#E6E0D4] dark:border-[#3E342C]">
          <Link to="/" onClick={onClose} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#8C532B] flex items-center justify-center text-white font-bold text-sm shadow-xs">
              QF
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base text-[#26221F] dark:text-[#FAF8F5] tracking-tight group-hover:text-[#8C532B] transition-colors leading-tight">
                QueueFlow
              </span>
              <span className="text-[11px] text-[#736A62] dark:text-[#A69B8F] font-normal leading-tight">
                Queue Management
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#8C532B]/10 text-[#8C532B] dark:text-[#D4A373] font-semibold'
                      : 'text-[#736A62] dark:text-[#A69B8F] hover:text-[#26221F] dark:hover:text-[#FAF8F5] hover:bg-[#F8F6F0] dark:hover:bg-[#2C241F]'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer / User Profile Row */}
        <div className="p-3 border-t border-[#E6E0D4] dark:border-[#3E342C]">
          <div className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-[#F8F6F0] dark:hover:bg-[#2C241F] transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#8C532B]/15 text-[#8C532B] dark:text-[#D4A373] flex items-center justify-center font-semibold text-xs shrink-0">
                {manager?.name ? manager.name.charAt(0).toUpperCase() : 'M'}
              </div>
              <div className="min-w-0 truncate">
                <p className="text-xs font-semibold text-[#26221F] dark:text-[#FAF8F5] truncate leading-tight">
                  {manager?.name || 'Manager'}
                </p>
                <p className="text-[11px] text-[#736A62] dark:text-[#A69B8F] truncate leading-tight">
                  {manager?.email || ''}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign out"
              className="p-1.5 rounded-md text-[#736A62] hover:text-[#B71C1C] hover:bg-[#B71C1C]/10 transition-colors shrink-0 cursor-pointer"
              aria-label="Sign out"
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
