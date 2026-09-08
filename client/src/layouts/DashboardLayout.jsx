import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import TopNavbar from '../components/dashboard/TopNavbar';
import MobileBottomNav from '../components/dashboard/MobileBottomNav';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors">
      {/* Dynamic Role Sidebar (Drawer on mobile, fixed on desktop) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <TopNavbar onOpenSidebar={() => setSidebarOpen(true)} />

        {/* Dynamic Nested Route Content with safe mobile padding */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          <Outlet />
        </main>

        {/* Native Mobile Phone Bottom Navigation Bar */}
        <MobileBottomNav onOpenMenu={() => setSidebarOpen(true)} />
      </div>
    </div>
  );
};

export default DashboardLayout;
