import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const UnauthorizedPage = () => {
  const { user } = useAuth();

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'teacher') return '/teacher/dashboard';
    return '/student/dashboard';
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xs p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">403 - Access Denied</h1>
        <p className="text-sm text-slate-600 mb-6">
          Your current account role (
          <span className="font-semibold text-slate-800 uppercase text-xs px-2 py-0.5 rounded-md bg-slate-100">
            {user?.role || 'Guest'}
          </span>
          ) does not have permission to view this section of the portal.
        </p>

        <Link
          to={getDashboardPath()}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Your Portal</span>
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
