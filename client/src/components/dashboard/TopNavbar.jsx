import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Sun,
  Moon,
  LogOut,
  User,
  Sparkles,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';
import NotificationDropdown from '../notifications/NotificationDropdown';

const TopNavbar = ({ onOpenSidebar }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const roleColor = {
    student: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    teacher: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    admin: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  }[user?.role || 'student'];

  return (
    <header className="sticky top-0 z-30 h-16 sm:h-20 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-colors">
      {/* Left: Mobile hamburger & breadcrumb */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-200 dark:border-slate-800"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <span className="text-[10px] sm:text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Workspace Portal
          </span>
          <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white capitalize truncate max-w-[150px] sm:max-w-none">
            {user?.role || 'Student'} Overview
          </span>
        </div>
      </div>

      {/* Right: Notifications, Theme Toggle, User Profile, Logout */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notification Bell Dropdown */}
        <NotificationDropdown />

        {/* Dark Mode Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600 dark:text-slate-400" />}
        </button>

        {/* User Pill */}
        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {user?.fullName?.charAt(0) || user?.name?.charAt(0) || <User className="w-3.5 h-3.5" />}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[130px]">
              {user?.fullName || user?.name}
            </span>
            <span className={`text-[10px] font-bold uppercase px-2 py-0.2 rounded-md border w-fit ${roleColor}`}>
              {user?.role}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-all cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default TopNavbar;
