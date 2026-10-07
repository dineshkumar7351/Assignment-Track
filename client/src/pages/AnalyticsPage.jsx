import React, { useState } from 'react';
import {
  BarChart2,
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Award,
  RefreshCw,
  Calendar,
  Layers,
  FileText,
  Download,
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

const AnalyticsPage = () => {
  const { user } = useAuth();
  const [activeTimeframe, setActiveTimeframe] = useState('month');

  // Metrics data
  const metrics = {
    totalProjects: 24,
    completed: 10,
    inProgress: 12,
    pending: 2,
    onTimeRate: 96.5,
    avgGrade: 92.4,
  };

  const courseBreakdown = [
    {
      course: 'Distributed Systems (CS-304)',
      tasksCount: 6,
      progress: 85,
      grade: 'A',
      onTime: '100%',
    },
    {
      course: 'Computer Vision & AI (AI-401)',
      tasksCount: 5,
      progress: 70,
      grade: 'A-',
      onTime: '92%',
    },
    {
      course: 'Multivariable Calculus (MATH-202)',
      tasksCount: 4,
      progress: 60,
      grade: 'B+',
      onTime: '88%',
    },
    {
      course: 'Database Optimization (DB-301)',
      tasksCount: 5,
      progress: 90,
      grade: 'A',
      onTime: '100%',
    },
  ];

  return (
    <div className="space-y-7 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Analytics & Insights
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Real-time project velocity, completion gauges, and historical performance index.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            {['week', 'month', 'term'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setActiveTimeframe(t)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-all cursor-pointer ${
                  activeTimeframe === t
                    ? 'bg-[#104f37] text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => alert('Analytics report downloaded!')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#104f37] hover:bg-[#0d3f2c] text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-6 rounded-3xl bg-[#104f37] text-white flex flex-col justify-between shadow-lg shadow-emerald-950/15">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-emerald-100/90">Total Projects</span>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-4xl font-extrabold">{metrics.totalProjects}</div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#186347] text-emerald-100 text-[11px] font-bold mt-2 w-fit">
            <span>5 ▲ Increased from last month</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Ended Projects</span>
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-4xl font-black text-slate-900 dark:text-white">{metrics.completed}</div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 text-[11px] font-bold mt-2 w-fit">
            <span>6 ▲ Increased from last month</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Running Projects</span>
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-4xl font-black text-slate-900 dark:text-white">{metrics.inProgress}</div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 text-[11px] font-bold mt-2 w-fit">
            <span>2 ▲ Increased from last month</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">On-Time Submissions</span>
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-4xl font-black text-slate-900 dark:text-white">{metrics.onTimeRate}%</div>
          <div className="text-xs font-bold text-emerald-600 mt-2">Honor Roll Standing</div>
        </div>
      </div>

      {/* Middle Row: Project Analytics Pill Bars + Progress Radial Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Project Analytics Pill Bars (Col span 7) */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Weekly Velocity & Hours Logged
              </h2>
              <p className="text-xs text-slate-400">Daily breakdown for active sprint</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold">
              ● Live Sync
            </span>
          </div>

          {/* Custom Pill Bars Chart */}
          <div className="flex items-end justify-between gap-3 h-52 px-4 pb-2">
            {/* Sun: Striped */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-full h-24 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-100/60 relative overflow-hidden">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(148,163,184,0.3)_4px,rgba(148,163,184,0.3)_8px)]" />
              </div>
              <span className="text-xs font-bold text-slate-400">Sun</span>
            </div>

            {/* Mon: Dark Green */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-full h-36 rounded-2xl bg-[#104f37] shadow-sm" />
              <span className="text-xs font-bold text-slate-400">Mon</span>
            </div>

            {/* Tue: Mint Green with 76% Tooltip */}
            <div className="flex flex-col items-center gap-2 flex-1 relative">
              <div className="absolute -top-7 px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 text-[10px] font-bold text-slate-700 dark:text-slate-300 shadow-sm">
                76%
              </div>
              <div className="w-full h-32 rounded-2xl bg-[#52b788] shadow-sm" />
              <span className="text-xs font-bold text-slate-400">Tue</span>
            </div>

            {/* Wed: Deep Forest Green (Tallest) */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-full h-44 rounded-2xl bg-[#0b3b29] shadow-sm" />
              <span className="text-xs font-bold text-slate-400">Wed</span>
            </div>

            {/* Thu: Striped */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-full h-32 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-100/60 relative overflow-hidden">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(148,163,184,0.3)_4px,rgba(148,163,184,0.3)_8px)]" />
              </div>
              <span className="text-xs font-bold text-slate-400">Thu</span>
            </div>

            {/* Fri: Striped */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-full h-28 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-100/60 relative overflow-hidden">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(148,163,184,0.3)_4px,rgba(148,163,184,0.3)_8px)]" />
              </div>
              <span className="text-xs font-bold text-slate-400">Fri</span>
            </div>

            {/* Sat: Striped */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-full h-20 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-100/60 relative overflow-hidden">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(148,163,184,0.3)_4px,rgba(148,163,184,0.3)_8px)]" />
              </div>
              <span className="text-xs font-bold text-slate-400">Sat</span>
            </div>
          </div>
        </div>

        {/* Project Progress Gauge (Col span 5) */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            Overall Completion Ratio
          </h2>

          <div className="flex flex-col items-center justify-center my-4">
            <div className="relative w-56 h-32 flex items-end justify-center overflow-hidden">
              <svg viewBox="0 0 100 55" className="w-56 h-32">
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="12"
                  strokeLinecap="round"
                  className="dark:stroke-slate-800"
                />
                <path
                  d="M 10 50 A 40 40 0 0 1 65 14"
                  fill="none"
                  stroke="#104f37"
                  strokeWidth="12"
                  strokeLinecap="round"
                  className="dark:stroke-emerald-500"
                />
              </svg>

              <div className="absolute bottom-1 flex flex-col items-center">
                <span className="text-4xl font-black text-slate-900 dark:text-white">
                  41%
                </span>
                <span className="text-xs font-bold text-slate-400">
                  Project Ended
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-5 text-xs font-bold text-slate-600 dark:text-slate-400 pt-3 border-t border-slate-50 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#52b788]" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#104f37]" />
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-300 border border-slate-400" />
              <span>Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Coursework & Subject Performance Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-lg font-black text-slate-900 dark:text-white">
          Coursework & Subject Distribution
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[11px]">
                <th className="pb-3 font-bold">Course / Subject</th>
                <th className="pb-3 font-bold">Total Tasks</th>
                <th className="pb-3 font-bold">Progress</th>
                <th className="pb-3 font-bold">Projected Grade</th>
                <th className="pb-3 font-bold">On-Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
              {courseBreakdown.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 font-bold text-slate-900 dark:text-white">
                    {item.course}
                  </td>
                  <td className="py-4 font-semibold text-slate-600 dark:text-slate-300">
                    {item.tasksCount} tasks
                  </td>
                  <td className="py-4 w-48">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-[#104f37] dark:bg-emerald-500 rounded-full"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span className="font-bold text-xs">{item.progress}%</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-bold text-xs">
                      {item.grade}
                    </span>
                  </td>
                  <td className="py-4 font-bold text-slate-700 dark:text-slate-300">
                    {item.onTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
