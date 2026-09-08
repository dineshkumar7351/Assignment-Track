import React from 'react';
import {
  CheckCircle,
  Clock,
  Award,
  AlertTriangle,
  TrendingUp,
  BarChart2,
  Calendar,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';
import { Link } from 'react-router-dom';
import AcademicHealthCard from './AcademicHealthCard';
import WhatShouldIDoNowCard from './WhatShouldIDoNowCard';
import DeadlineRiskBadge from './DeadlineRiskBadge';

const PIE_COLORS = ['#10b981', '#f59e0b', '#ef4444'];

export default function StudentAnalyticsView({ analyticsData }) {
  if (!analyticsData) return null;

  const {
    kpis,
    academicHealth,
    recommendation,
    subjectPerformance,
    monthlyActivity,
    pendingAssignmentsWithRisk,
  } = analyticsData;

  // Pie data for On-Time vs Late vs Overdue
  const pieData = [
    { name: 'On-Time', value: kpis.submittedCount - kpis.lateCount || 0 },
    { name: 'Late Submissions', value: kpis.lateCount || 0 },
    { name: 'Overdue Pending', value: kpis.overdueCount || 0 },
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-8">
      {/* 1. "What Should I Do Now?" Top Recommendation */}
      <WhatShouldIDoNowCard recommendationData={recommendation} />

      {/* 2. Primary KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Completion Rate */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Completion Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {kpis.completionRate}%
            </span>
            <span className="text-xs font-medium text-slate-500">
              ({kpis.submittedCount}/{kpis.totalAssigned} items)
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full"
              style={{ width: `${kpis.completionRate}%` }}
            />
          </div>
        </div>

        {/* On-Time Submission Rate */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              On-Time Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {kpis.onTimeSubmissionRate}%
            </span>
            <span className="text-xs font-medium text-slate-500">
              on-time compliance
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${kpis.onTimeSubmissionRate}%` }}
            />
          </div>
        </div>

        {/* Average Marks */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Average Marks
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/50 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-sky-600 dark:text-sky-400">
              {kpis.averageMarks > 0 ? `${kpis.averageMarks}%` : 'N/A'}
            </span>
            <span className="text-xs font-medium text-slate-500">
              ({kpis.gradedCount} graded)
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-sky-500 h-full rounded-full"
              style={{ width: `${kpis.averageMarks || 0}%` }}
            />
          </div>
        </div>

        {/* Late Submissions Count */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Late Submissions
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
              {kpis.lateCount}
            </span>
            <span className="text-xs font-medium text-slate-500">
              ({kpis.lateSubmissionRate}% of submissions)
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full"
              style={{ width: `${kpis.lateSubmissionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Academic Health Score Component */}
      <AcademicHealthCard academicHealth={academicHealth} />

      {/* 4. Subject Performance & Submission Trend Recharts Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Subject Performance Bar Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-indigo-500" />
                Subject Performance & Mastery
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Coursework completion and average score by curriculum subject
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            {subjectPerformance && subjectPerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={subjectPerformance}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                  <XAxis
                    dataKey="code"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  />
                  <Bar
                    dataKey="completionRate"
                    name="Completion %"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="averageMarks"
                    name="Avg Marks %"
                    fill="#0ea5e9"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                No subject performance data available.
              </div>
            )}
          </div>
        </div>

        {/* Submission Breakdown Donut Chart */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-500" />
                Submission Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Punctuality profile of academic submissions
              </p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-400 text-xs">No submission data yet.</div>
            )}
          </div>
        </div>
      </div>

      {/* 5. Monthly Submission Trend Area Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-500" />
              Submission Activity & Punctuality Trend
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              6-month historical trajectory of coursework submissions
            </p>
          </div>
        </div>

        <div className="h-64 w-full">
          {monthlyActivity && monthlyActivity.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyActivity}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorOnTime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="onTime"
                  name="On-Time Submissions"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorOnTime)"
                />
                <Area
                  type="monotone"
                  dataKey="late"
                  name="Late Submissions"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorLate)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs">
              No historical trend data available.
            </div>
          )}
        </div>
      </div>

      {/* 6. Pending Coursework & Deadline Risk Matrix */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-500" />
              Pending Coursework & Deadline Risk Assessment
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evaluated by remaining duration, complexity level, and weight
            </p>
          </div>
          <Link
            to="/student/assignments"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pendingAssignmentsWithRisk && pendingAssignmentsWithRisk.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 px-3">Assignment</th>
                  <th className="pb-3 px-3">Subject</th>
                  <th className="pb-3 px-3">Deadline</th>
                  <th className="pb-3 px-3">Priority</th>
                  <th className="pb-3 px-3">Risk Level</th>
                  <th className="pb-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {pendingAssignmentsWithRisk.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      {item.title}
                    </td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                      {item.subject}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {new Date(item.deadline).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-3">
                      <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {item.priority || 'Normal'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <DeadlineRiskBadge level={item.risk?.level} />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        to={`/student/assignments/${item._id}/submit`}
                        className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-400 font-semibold text-[11px] rounded-lg transition"
                      >
                        Submit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-10 text-center text-slate-400 text-xs">
            <CheckCircle className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-80" />
            <span>No pending coursework! All assignments have been submitted.</span>
          </div>
        )}
      </div>
    </div>
  );
}
