import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Building,
  Server,
  KeyRound,
  BookMarked,
  ClipboardList,
  FileBarChart,
  ShieldCheck,
  Activity,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto py-2 sm:py-6 space-y-6 sm:space-y-8">
      {/* Admin Profile Banner */}
      <div className="glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                System Administration
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                Admin Portal
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Welcome back, <strong className="text-slate-900 dark:text-white">{user?.fullName}</strong> ({user?.email})
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
            <KeyRound className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>Role: <strong className="text-slate-900 dark:text-white">Super Administrator</strong></span>
          </div>
        </div>
      </div>

      {/* Admin Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 glow-card">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Total Users
          </h3>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">1,420</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +14% this semester
          </p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 glow-card">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
            <Building className="w-6 h-6" />
          </div>
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Departments Active
          </h3>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">8</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-2">
            CS, IT, Mech, Civil, ECE, EEE, AI, Data
          </p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 glow-card">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
            <Server className="w-6 h-6" />
          </div>
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            System Uptime
          </h3>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">99.98%</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> All services operational
          </p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 glow-card">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Security Status
          </h3>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">Enforced</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-2">
            JWT & Clerk Auth Active
          </p>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/users"
          className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Manage Users</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            View student enrollments, faculty profiles, and adjust access permissions.
          </p>
        </Link>

        <Link
          to="/admin/subjects"
          className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <BookMarked className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Course Catalog</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure academic subjects, semesters, and curriculum metadata.
          </p>
        </Link>

        <Link
          to="/admin/reports"
          className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FileBarChart className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Institutional Audit & Reports</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Generate submission analytics and departmental compliance summaries.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
