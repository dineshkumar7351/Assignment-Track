import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Calendar,
  Bell,
  BarChart3,
  Sparkles,
  UserCircle,
  FileText,
  CheckSquare,
  SearchCheck,
  TrendingUp,
  Users,
  BookMarked,
  ClipboardList,
  FileBarChart,
  X,
  ChevronRight,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const ROLE_NAV_CONFIG = {
  student: [
    { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Assignments', path: '/student/assignments', icon: BookOpen },
    { label: 'Calendar', path: '/student/calendar', icon: Calendar },
    { label: 'Notifications', path: '/student/notifications', icon: Bell },
    { label: 'Analytics', path: '/student/analytics', icon: BarChart3 },
    { label: 'AI Assistant', path: '/student/ai-assistant', icon: Sparkles },
    { label: 'Profile', path: '/student/profile', icon: UserCircle },
  ],
  teacher: [
    { label: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
    { label: 'Assignments', path: '/teacher/assignments', icon: FileText },
    { label: 'Submissions', path: '/teacher/submissions', icon: CheckSquare },
    { label: 'Similarity Detection', path: '/teacher/plagiarism', icon: SearchCheck },
    { label: 'Analytics', path: '/teacher/analytics', icon: TrendingUp },
    { label: 'Notifications', path: '/teacher/notifications', icon: Bell },
    { label: 'Profile', path: '/teacher/profile', icon: UserCircle },
  ],
  admin: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Subjects', path: '/admin/subjects', icon: BookMarked },
    { label: 'Assignments', path: '/admin/assignments', icon: ClipboardList },
    { label: 'Reports', path: '/admin/reports', icon: FileBarChart },
    { label: 'Profile', path: '/admin/profile', icon: UserCircle },
  ],
};

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const role = user?.role || 'student';
  const navItems = ROLE_NAV_CONFIG[role] || ROLE_NAV_CONFIG.student;

  const roleLabel = {
    student: 'Student Portal',
    teacher: 'Faculty Portal',
    admin: 'Admin Portal',
  }[role];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 sm:h-20 px-5 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
          <Link to={`/${role}/dashboard`} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-all">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white leading-tight">
                Smart Tracker
              </span>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                {roleLabel}
              </span>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Role Card */}
        <div className="p-3.5 mx-3.5 mt-3.5 rounded-2xl glass-panel border border-slate-200/70 dark:border-slate-800/70 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0">
              {user?.fullName?.charAt(0) || user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user?.fullName || user?.name}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize font-medium truncate">
                {role} • {user?.department || 'Academic'}
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 text-[11px] font-semibold text-slate-400 dark:text-slate-500 text-center">
          Smart Assignment Tracker
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
