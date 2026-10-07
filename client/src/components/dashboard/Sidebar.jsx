import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  CheckSquare,
  Calendar,
  BarChart2,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  X,
  Smartphone,
  ChevronRight,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#fbfcfd] dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex-1 flex flex-col overflow-y-auto px-4 py-6">
          {/* Logo Brand: Assignment Track */}
          <div className="flex items-center justify-between px-2 mb-8">
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              {/* Assignment Track SVG Logo */}
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <svg
                  viewBox="0 0 32 32"
                  fill="none"
                  className="w-8 h-8"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="16" cy="16" r="14" stroke="#10b981" strokeWidth="2.5" />
                  <path
                    d="M11 15C11 12.2386 13.2386 10 16 10C18.7614 10 21 12.2386 21 15C21 17.5 17.5 21 16 22C14.5 21 11 17.5 11 15Z"
                    stroke="#10b981"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="16" cy="14.5" r="2" fill="#10b981" />
                </svg>
              </div>
              <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
                Assignment Track
              </span>
            </Link>

            {/* Mobile close */}
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* MENU Section */}
          <div className="space-y-1 mb-8">
            <div className="px-3 mb-2.5 text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              Menu
            </div>

            {/* Dashboard */}
            <NavLink
              to="/dashboard"
              end
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'text-slate-900 dark:text-white font-extrabold relative before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1.5 before:bg-[#104f37] dark:before:bg-emerald-500 before:rounded-full bg-slate-100/70 dark:bg-slate-800/60'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <LayoutGrid className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>Dashboard</span>
              </div>
            </NavLink>

            {/* Tasks */}
            <NavLink
              to="/assignments"
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'text-slate-900 dark:text-white font-extrabold bg-slate-100/70 dark:bg-slate-800/60'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <CheckSquare className="w-4 h-4 text-slate-400" />
                <span>Tasks</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#104f37] text-white text-[10px] font-extrabold">
                12+
              </span>
            </NavLink>

            {/* Calendar */}
            <NavLink
              to="/calendar"
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'text-slate-900 dark:text-white font-extrabold bg-slate-100/70 dark:bg-slate-800/60'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Calendar</span>
              </div>
            </NavLink>

            {/* Analytics */}
            <NavLink
              to="/analytics"
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'text-slate-900 dark:text-white font-extrabold bg-slate-100/70 dark:bg-slate-800/60'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <BarChart2 className="w-4 h-4 text-slate-400" />
                <span>Analytics</span>
              </div>
            </NavLink>

            {/* Team */}
            <NavLink
              to="/team"
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'text-slate-900 dark:text-white font-extrabold bg-slate-100/70 dark:bg-slate-800/60'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-slate-400" />
                <span>Team</span>
              </div>
            </NavLink>
          </div>

          {/* GENERAL Section */}
          <div className="space-y-1 mb-6">
            <div className="px-3 mb-2.5 text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              General
            </div>

            {/* Settings */}
            <NavLink
              to="/settings"
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-all"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings</span>
            </NavLink>

            {/* Help */}
            <NavLink
              to="/help"
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-all"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>Help</span>
            </NavLink>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/60 dark:hover:bg-rose-950/30 transition-all cursor-pointer text-left"
            >
              <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-600" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Download our Mobile App Card Widget */}
        <div className="p-4">
          <div className="relative rounded-2xl p-4 bg-[#0a1f18] text-white overflow-hidden shadow-lg border border-emerald-900/40">
            {/* Background Texture */}
            <img
              src="/green-wave.jpg"
              alt="Wave background"
              className="absolute inset-0 w-full h-full object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f18] via-transparent to-transparent" />

            <div className="relative z-10 space-y-2">
              <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white leading-tight">
                  Download our <br /> Mobile App
                </h4>
                <p className="text-[10px] text-emerald-200/80 mt-1">
                  Get easy in another way
                </p>
              </div>
              <button
                type="button"
                className="w-full mt-2 py-2 rounded-xl bg-[#104f37] hover:bg-[#146345] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
