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
    { label: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Tasks', path: '/assignments', icon: BookOpen },
    { label: 'Calendar', path: '/calendar', icon: Calendar },
    { label: 'Profile', path: '/profile', icon: UserCircle },
  ],
  teacher: [
    { label: 'Home', path: '/teacher/dashboard', icon: LayoutDashboard },
    { label: 'Tasks', path: '/teacher/assignments', icon: FileText },
    { label: 'Submissions', path: '/teacher/submissions', icon: CheckSquare },
    { label: 'Profile', path: '/profile', icon: UserCircle },
  ],
  admin: [
    { label: 'Home', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Tasks', path: '/admin/assignments', icon: FileText },
    { label: 'Profile', path: '/profile', icon: UserCircle },
  ],
};

const MobileBottomNav = ({ onOpenMenu }) => {
  const { user } = useAuth();
  const role = user?.role || 'student';
  const tabs = MOBILE_TABS[role] || MOBILE_TABS.student;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 lg:hidden px-2 pt-2 pb-3.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] transition-colors">
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
                    ? 'text-[#104f37] dark:text-emerald-400 font-bold scale-105'
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
          className="flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-semibold text-slate-500 dark:text-slate-400 hover:text-[#104f37] dark:hover:text-emerald-400 transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span>More</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
