import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  UserCircle,
  Menu,
  FileText,
  CheckSquare,
  Users,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const MOBILE_TABS = {
  student: [
    { label: 'Home', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Assignments', path: '/student/assignments', icon: BookOpen },
    { label: 'Calendar', path: '/student/calendar', icon: Calendar },
    { label: 'Profile', path: '/student/profile', icon: UserCircle },
  ],
  teacher: [
    { label: 'Home', path: '/teacher/dashboard', icon: LayoutDashboard },
    { label: 'Assignments', path: '/teacher/assignments', icon: FileText },
    { label: 'Submissions', path: '/teacher/submissions', icon: CheckSquare },
    { label: 'Profile', path: '/teacher/profile', icon: UserCircle },
  ],
  admin: [
    { label: 'Home', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Assignments', path: '/admin/assignments', icon: FileText },
    { label: 'Profile', path: '/admin/profile', icon: UserCircle },
  ],
};

const MobileBottomNav = ({ onOpenMenu }) => {
  const { user } = useAuth();
  const role = user?.role || 'student';
  const tabs = MOBILE_TABS[role] || MOBILE_TABS.student;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 lg:hidden px-2 py-1.5 shadow-lg transition-colors">
      <div className="grid grid-cols-5 items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-semibold transition-all ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="truncate max-w-[56px]">{tab.label}</span>
            </NavLink>
          );
        })}

        {/* More / Menu Button */}
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span>More</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
