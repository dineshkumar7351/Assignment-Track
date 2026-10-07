import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import TopNavbar from '../components/dashboard/TopNavbar';
import MobileBottomNav from '../components/dashboard/MobileBottomNav';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f5f7] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      <div className="flex-1 flex">
        {/* Assignment Track Left Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
          {/* Top Navbar */}
          <TopNavbar onOpenSidebar={() => setSidebarOpen(true)} />

          {/* Dynamic Nested Route Content */}
          <main className="flex-1 p-4 sm:p-7 lg:p-9 pb-24 lg:pb-10">
            <Outlet />
          </main>

          {/* Native Mobile Phone Bottom Navigation Bar */}
          <MobileBottomNav onOpenMenu={() => setSidebarOpen(true)} />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
