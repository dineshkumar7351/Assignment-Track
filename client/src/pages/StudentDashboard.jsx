import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Percent,
  Calendar,
  Sparkles,
  RefreshCw,
  FileCheck,
  Building2,
  BadgeCheck,
  Award,
  Flame,
  Inbox,
  Check,
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import api from '../services/api';

/**
 * Skeleton Loader Component for Student Dashboard
 */
const StudentDashboardSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto py-2 sm:py-6 space-y-6 sm:space-y-8 animate-pulse">
      {/* Banner Skeleton */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="space-y-3">
            <div className="h-7 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            <div className="h-4 w-48 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
          </div>
          <div className="h-10 w-52 bg-slate-100 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-20 bg-slate-100 dark:bg-slate-800 rounded-md" />
            <div className="h-6 w-12 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Progress Bar Skeleton */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="h-5 w-40 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full" />
      </div>

      {/* Grid Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="h-5 w-48 bg-slate-200 dark:bg-slate-800 rounded-md" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-50 dark:bg-slate-800/50 rounded-xl" />
          ))}
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="h-5 w-36 bg-slate-200 dark:bg-slate-800 rounded-md" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/dashboard/student');
      if (response.data && response.data.success) {
        setDashboardData(response.data.data);
      } else {
        setError(response.data?.message || 'Failed to retrieve dashboard data');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to connect to the dashboard service. Please check your network connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    api
      .get('/dashboard/student')
      .then((res) => {
        if (isMounted) {
          if (res.data?.success) {
            setDashboardData(res.data.data);
          } else {
            setError(res.data?.message || 'Failed to retrieve dashboard data');
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              'Unable to connect to the dashboard service. Please check your network connection.'
          );
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <StudentDashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900/50 p-8 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Failed to Load Student Dashboard
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
            {error}
          </p>
          <button
            onClick={fetchDashboardData}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  const { statistics, progress, upcomingAssignments = [], recentActivity = [] } =
    dashboardData || {};

  const priorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            High
          </span>
        );
      case 'low':
        return (
          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            Low
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            Medium
          </span>
        );
    }
  };

  const statusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'graded':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <Check className="w-3 h-3" />
            <span>Graded</span>
          </span>
        );
      case 'submitted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            <FileCheck className="w-3 h-3" />
            <span>Submitted</span>
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <AlertCircle className="w-3 h-3" />
            <span>Overdue</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </span>
        );
    }
  };

  const formatDeadline = (dateStr) => {
    if (!dateStr) return 'No deadline';
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.round((date.getTime() - now.getTime()) / (1000 * 60 * 60));

    let relative = '';
    if (diffHours < 0) {
      const days = Math.abs(Math.round(diffHours / 24));
      relative = days === 0 ? 'Overdue today' : `${days}d overdue`;
    } else if (diffHours <= 24) {
      relative = `Due in ${diffHours}h`;
    } else {
      const days = Math.round(diffHours / 24);
      relative = `Due in ${days}d`;
    }

    return {
      formatted: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      relative,
      isOverdue: diffHours < 0,
    };
  };

  return (
    <div className="max-w-7xl mx-auto py-2 sm:py-6 space-y-6 sm:space-y-8">
      {/* 1. Student Profile Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
              <h1 className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Welcome back, {user?.fullName || 'Student'}! 👋
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Student Portal
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {user?.email} • Live Academic Progression Hub
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 sm:p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Dept: <strong className="text-slate-900 dark:text-white">{user?.department || 'Computer Science'}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <BadgeCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>ID: <strong className="text-slate-900 dark:text-white">{user?.studentId || 'STU-2026'}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 6 Metric Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {/* Total Assignments */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
            <BookOpen className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
            Total Coursework
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
            {statistics?.totalAssignments ?? 0}
          </p>
        </div>

        {/* Pending */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
            Pending Tasks
          </p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">
            {statistics?.pendingAssignments ?? 0}
          </p>
        </div>

        {/* Submitted */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
            Submitted
          </p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {statistics?.submittedAssignments ?? 0}
          </p>
        </div>

        {/* Overdue */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
            <AlertCircle className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
            Overdue
          </p>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-0.5">
            {statistics?.overdueAssignments ?? 0}
          </p>
        </div>

        {/* Average Score */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
            Average Score
          </p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-0.5">
            {statistics?.averageScore ?? 0}%
          </p>
        </div>

        {/* Completion Rate */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
            <Percent className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
            Completion Rate
          </p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">
            {statistics?.completionRate ?? 0}%
          </p>
        </div>
      </div>

      {/* 3. Progress Tracking Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Academic Coursework Progress</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Cumulative submission rate across all enrolled department subjects
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {progress?.completionRate ?? 0}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">Completed</span>
          </div>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3.5 rounded-full overflow-hidden flex">
          <div
            style={{
              width: `${
                progress?.total > 0 ? (progress.submitted / progress.total) * 100 : 0
              }%`,
            }}
            className="bg-emerald-500 transition-all duration-500"
            title={`Submitted: ${progress?.submitted || 0}`}
          />
          <div
            style={{
              width: `${
                progress?.total > 0 ? (progress.pending / progress.total) * 100 : 0
              }%`,
            }}
            className="bg-amber-400 transition-all duration-500"
            title={`Pending: ${progress?.pending || 0}`}
          />
          <div
            style={{
              width: `${
                progress?.total > 0 ? (progress.overdue / progress.total) * 100 : 0
              }%`,
            }}
            className="bg-rose-500 transition-all duration-500"
            title={`Overdue: ${progress?.overdue || 0}`}
          />
        </div>

        {/* Progress Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs pt-1 text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Submitted ({progress?.submitted ?? 0})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>Pending ({progress?.pending ?? 0})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Overdue ({progress?.overdue ?? 0})</span>
          </div>
          <div className="ml-auto text-slate-400 dark:text-slate-500 text-[11px]">
            Total: {progress?.total ?? 0} Assignments
          </div>
        </div>
      </div>

      {/* 4. Upcoming Assignments & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Upcoming Assignments (Next 5 by Deadline) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs transition-colors">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Upcoming Assignments</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Next 5 assignments ordered chronologically by deadline
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {upcomingAssignments.length} Items
              </span>
              <Link
                to="/assignments"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View All →
              </Link>
            </div>
          </div>

          {upcomingAssignments.length === 0 ? (
            <div className="py-12 text-center">
              <Inbox className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No assignments scheduled
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                You are completely up to date with your coursework!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAssignments.map((assignment) => {
                const deadlineInfo = formatDeadline(assignment.deadline);
                return (
                  <div
                    key={assignment._id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                            {assignment.subject}
                          </span>
                          {priorityBadge(assignment.priority)}
                          {statusBadge(assignment.status)}
                        </div>
                        <Link
                          to={`/assignments/${assignment._id}`}
                          className="block text-sm font-bold text-slate-900 dark:text-white leading-snug hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                          {assignment.title}
                        </Link>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between text-xs sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/50 dark:border-slate-700/50">
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-semibold">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{deadlineInfo.formatted}</span>
                        </div>
                        <span
                          className={`text-[11px] font-medium ${
                            deadlineInfo.isOverdue
                              ? 'text-rose-600 dark:text-rose-400 font-bold'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {deadlineInfo.relative} • {assignment.totalMarks} Marks
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Col: Recent Activity Stream */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs transition-colors flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Recent Activity</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Submissions, evaluations & notices
              </p>
            </div>
          </div>

          {recentActivity.length === 0 ? (
            <div className="py-12 text-center my-auto">
              <Inbox className="w-9 h-9 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                No recent activity recorded
              </p>
            </div>
          ) : (
            <div className="space-y-4 flex-1">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 text-xs pb-3.5 border-b border-slate-100 dark:border-slate-800 last:border-b-0 last:pb-0"
                >
                  <div
                    className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center mt-0.5 ${
                      activity.type === 'evaluation'
                        ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400'
                        : activity.type === 'submission'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                        : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                    }`}
                  >
                    {activity.type === 'evaluation' && <Award className="w-3.5 h-3.5" />}
                    {activity.type === 'submission' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {activity.type === 'new_assignment' && <BookOpen className="w-3.5 h-3.5" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="font-bold text-slate-900 dark:text-white truncate">
                        {activity.title}
                      </p>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-tight">
                      {activity.description}
                    </p>
                    {activity.feedback && (
                      <p className="mt-1 text-[11px] italic text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 p-1.5 rounded-md border border-slate-200/60 dark:border-slate-700/60">
                        "{activity.feedback}"
                      </p>
                    )}
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                      {new Date(activity.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
