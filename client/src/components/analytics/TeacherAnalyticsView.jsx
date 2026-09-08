import React from 'react';
import {
  Users,
  FileCheck,
  AlertTriangle,
  Award,
  BarChart2,
  ShieldAlert,
  Percent,
  TrendingUp,
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
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';
import { Link } from 'react-router-dom';

const SIMILARITY_PIE_COLORS = ['#10b981', '#f59e0b', '#ef4444'];

export default function TeacherAnalyticsView({ analyticsData }) {
  if (!analyticsData) return null;

  const { kpis, assignmentPerformance, similarityStats, gradeDistribution } = analyticsData;

  const similarityPieData = [
    { name: 'Low Risk (<30%)', value: similarityStats.lowRiskCount || 0 },
    { name: 'Medium Risk (30-59%)', value: similarityStats.mediumRiskCount || 0 },
    { name: 'High Risk (≥60%)', value: similarityStats.highRiskCount || 0 },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-8">
      {/* 1. Primary Faculty KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Coursework & Submissions */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Submissions
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {kpis.totalSubmissions}
            </span>
            <span className="text-xs font-medium text-slate-500">
              across {kpis.totalAssignments} assignments
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {kpis.pendingGrading} submissions pending evaluation
          </p>
        </div>

        {/* Cohort Average Marks */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Cohort Avg Marks
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {kpis.averageMarks}%
            </span>
            <span className="text-xs font-medium text-slate-500">
              ({kpis.gradedSubmissions} graded)
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${kpis.averageMarks}%` }}
            />
          </div>
        </div>

        {/* Late Submission Rate */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Late Submission Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
              {kpis.lateSubmissionRate}%
            </span>
            <span className="text-xs font-medium text-slate-500">
              ({kpis.totalLateSubmissions} total late)
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full"
              style={{ width: `${kpis.lateSubmissionRate}%` }}
            />
          </div>
        </div>

        {/* High Similarity Flagged */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              High Similarity (≥60%)
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">
              {similarityStats.highRiskCount}
            </span>
            <span className="text-xs font-medium text-slate-500">
              ({similarityStats.highRiskPercentage}% flagged)
            </span>
          </div>
          <Link
            to="/teacher/plagiarism"
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline mt-2 inline-block font-semibold"
          >
            Review in Similarity Center →
          </Link>
        </div>
      </div>

      {/* 2. Visual Graphs: Grade Distribution & Similarity Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Grade Distribution Bar Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-indigo-500" />
                Cohort Grade Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Performance band breakdown across evaluated submissions
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            {gradeDistribution && gradeDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={gradeDistribution}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                  <XAxis
                    dataKey="grade"
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
                  <Bar
                    dataKey="count"
                    name="Student Count"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                No grade distribution data available yet.
              </div>
            )}
          </div>
        </div>

        {/* Similarity Stats Donut Chart */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                Textual Similarity Profile
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Risk classification of cohort submissions
              </p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {similarityPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={similarityPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {similarityPieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={SIMILARITY_PIE_COLORS[index % SIMILARITY_PIE_COLORS.length]}
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
              <div className="text-slate-400 text-xs">No submission similarity data.</div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Assignment Performance Matrix */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Assignment-Wise Performance Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Detailed breakdown of submissions, on-time rates, and score distributions
            </p>
          </div>
          <Link
            to="/teacher/submissions"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
          >
            <span>Submissions Page</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {assignmentPerformance && assignmentPerformance.length > 0 ? (
          <div>
            {/* Mobile Cards View (< 768px) */}
            <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {assignmentPerformance.map((item) => (
                <div key={item._id} className="py-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-400">{item.subject}</p>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        item.onTimeRate >= 80
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : item.onTimeRate >= 60
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                      }`}
                    >
                      {item.onTimeRate}% On-Time
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Submissions</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {item.submissionsCount} ({item.gradedCount} graded)
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Avg Mark</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {item.averageMarks > 0 ? `${item.averageMarks}%` : 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">
                      Range: {item.gradedCount > 0 ? `${item.lowestMark} - ${item.highestMark} pts` : '—'}
                    </span>
                    <Link
                      to="/teacher/submissions"
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                    >
                      Grade Submissions
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (>= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 px-3">Coursework</th>
                    <th className="pb-3 px-3">Subject</th>
                    <th className="pb-3 px-3">Submissions</th>
                    <th className="pb-3 px-3">On-Time %</th>
                    <th className="pb-3 px-3">Avg Mark</th>
                    <th className="pb-3 px-3">Range (Low/High)</th>
                    <th className="pb-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                  {assignmentPerformance.map((item) => (
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
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {item.submissionsCount}
                        </span>{' '}
                        ({item.gradedCount} graded)
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`font-semibold ${
                            item.onTimeRate >= 80
                              ? 'text-emerald-500'
                              : item.onTimeRate >= 60
                              ? 'text-amber-500'
                              : 'text-rose-500'
                          }`}
                        >
                          {item.onTimeRate}%
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                        {item.averageMarks > 0 ? `${item.averageMarks}%` : 'N/A'}
                      </td>
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                        {item.gradedCount > 0
                          ? `${item.lowestMark} - ${item.highestMark} pts`
                          : '—'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          to="/teacher/submissions"
                          className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-400 font-semibold text-[11px] rounded-lg transition"
                        >
                          Grade
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="py-10 text-center text-slate-400 text-xs">
            No assignment data available.
          </div>
        )}
      </div>
    </div>
  );
}
