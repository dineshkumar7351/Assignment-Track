import React from 'react';
import {
  Users,
  Building,
  Server,
  KeyRound,
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto py-2 sm:py-6 space-y-6 sm:space-y-8">
      {/* Admin Profile Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                System Administration
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-100 dark:border-rose-800">
                Admin Portal
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Logged in as {user?.fullName} ({user?.email})
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <KeyRound className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>Access Level: <strong className="text-slate-900 dark:text-white">Super Administrator</strong></span>
          </div>
        </div>
      </div>

      {/* Admin Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Registered Accounts
          </h3>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">1,420</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
            <Building className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Departments Active
          </h3>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">8</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
            <Server className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            System Health
          </h3>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Optimal (100%)</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
