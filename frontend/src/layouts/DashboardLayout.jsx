import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';

const pageTitleMap = {
  '/': 'Overview',
  '/queues': 'Queue Counters',
  '/analytics': 'Performance Analytics',
  '/history': 'Token Audit Trail',
  '/settings': 'System Settings',
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const currentPath = location.pathname;
  let pageTitle = pageTitleMap[currentPath] || 'Queue Details';
  if (currentPath.startsWith('/queues/')) {
    pageTitle = 'Counter Console';
  }

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#26221F] dark:bg-[#1C1815] dark:text-[#FAF8F5] flex flex-col lg:flex-row antialiased transition-colors duration-150">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Navbar
          onOpenSidebar={() => setSidebarOpen(true)}
          pageTitle={pageTitle}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
