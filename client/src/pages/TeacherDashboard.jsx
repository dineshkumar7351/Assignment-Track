import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  CheckSquare,
  Clock,
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
  Calendar,
  User,
  RefreshCw,
  AlertCircle,
  Building2,
  BadgeCheck,
  Inbox,
  Sparkles,
  Plus,
  Award,
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import api from '../services/api';
import EvaluationModal from '../components/evaluation/EvaluationModal';

/**
 * Skeleton Loader Component for Teacher Dashboard
 */
const TeacherDashboardSkeleton = () => {
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

      {/* 6 Metric Cards Skeleton */}
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

      {/* Grid Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="h-5 w-48 bg-slate-200 dark:bg-slate-800 rounded-md" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-50 dark:bg-slate-800/50 rounded-xl" />
          ))}
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="h-5 w-36 bg-slate-200 dark:bg-slate-800 rounded-md" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 bg-slate-50 dark:bg-slate-800/50 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
};

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [evalModal, setEvalModal] = useState({ isOpen: false, submission: null });

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/dashboard/teacher');
      if (response.data && response.data.success) {
        setDashboardData(response.data.data);
      } else {
        setError(response.data?.message || 'Failed to retrieve teacher dashboard data');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to connect to the teacher dashboard service. Please check your network connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    api
      .get('/dashboard/teacher')
      .then((res) => {
        if (isMounted) {
          if (res.data?.success) {
            setDashboardData(res.data.data);
          } else {
            setError(res.data?.message || 'Failed to retrieve teacher dashboard data');
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              'Unable to connect to the teacher dashboard service. Please check your network connection.'
          );
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <TeacherDashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900/50 p-8 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Failed to Load Faculty Dashboard
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
            {error}
          </p>
          <button
            onClick={fetchDashboardData}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  const { statistics, recentAssignments = [], recentSubmissions = [] } =
    dashboardData || {};

  const similarityBadge = (score) => {
    if (typeof score !== 'number') {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
          Unchecked
        </span>
      );
    }
    if (score >= 25) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
          <ShieldAlert className="w-3 h-3 text-rose-600 dark:text-rose-400" />
          <span>{score}% High</span>
        </span>
      );
    }
    if (score >= 15) {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          {score}% Mod
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
        {score}% Clean
      </span>
    );
  };

  const statusPill = (status) => {
    switch (status?.toLowerCase()) {
      case 'graded':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            Graded
          </span>
        );
      case 'late':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            Late
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            Pending Review
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-2 sm:py-6 space-y-6 sm:space-y-8">
      {/* 1. Faculty Profile Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
              <h1 className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Welcome, Professor {user?.fullName || 'Faculty'} 🎓
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Faculty Portal
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {user?.email} • Live Coursework & Evaluation Hub
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/teacher/assignments/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Create Assignment</span>
            </Link>

            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 sm:p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Dept: <strong className="text-slate-900 dark:text-white">{user?.department || 'Computer Science'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>EMP ID: <strong className="text-slate-900 dark:text-white">{user?.employeeId || 'EMP-101'}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 6 Metric Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {/* Assignments Created */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
            <FileText className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
            Assignments
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
            {statistics?.totalAssignments ?? 0}
          </p>
        </div>

        {/* Submissions Received */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
            <CheckSquare className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
            Submissions
          </p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">
            {statistics?.totalSubmissions ?? 0}
          </p>
        </div>

        {/* Pending Evaluation */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
            Pending Eval
          </p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">
            {statistics?.pendingEvaluations ?? 0}
          </p>
        </div>

        {/* Evaluated */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
            Evaluated
          </p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {statistics?.evaluatedSubmissions ?? 0}
          </p>
        </div>

        {/* Average Marks */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
            Average Marks
          </p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-0.5">
            {statistics?.averageMarks ?? 0}%
          </p>
        </div>

        {/* High Similarity */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
            High Similarity
          </p>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-0.5">
            {statistics?.highSimilaritySubmissions ?? 0}
          </p>
        </div>
      </div>

      {/* 3. Recent Assignments & Recent Submissions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Assignments Created by Teacher */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs transition-colors">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Recent Assignments</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Assignments created by you with cohort submission progress
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {recentAssignments.length} Items
              </span>
              <Link
                to="/teacher/assignments"
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                View All →
              </Link>
            </div>
          </div>

          {recentAssignments.length === 0 ? (
            <div className="py-12 text-center">
              <Inbox className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No assignments created yet
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Assignments you create will display here with submission trackers.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAssignments.map((assignment) => (
                <div
                  key={assignment._id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {assignment.subject}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {assignment.totalMarks} Marks
                        </span>
                      </div>
                      <Link
                        to={`/teacher/assignments/${assignment._id}`}
                        className="block text-sm font-bold text-slate-900 dark:text-white leading-snug hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      >
                        {assignment.title}
                      </Link>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Deadline: {new Date(assignment.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>

                    {/* Progress Stats per Assignment */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between text-xs shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/50 dark:border-slate-700/50">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{assignment.submittedCount} Submitted</span>
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{assignment.pendingCount} Pending</span>
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                        Cohort: {assignment.totalStudents} Students
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Recent Submissions Review Stream */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs transition-colors flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Recent Submissions</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Latest student submissions & marks
              </p>
            </div>
          </div>

          {recentSubmissions.length === 0 ? (
            <div className="py-12 text-center my-auto">
              <Inbox className="w-9 h-9 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                No student submissions received yet
              </p>
            </div>
          ) : (
            <div className="space-y-3.5 flex-1">
              {recentSubmissions.map((sub) => (
                <div
                  key={sub._id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold flex items-center justify-center shrink-0">
                        {sub.student?.fullName?.charAt(0) || <User className="w-3 h-3" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {sub.student?.fullName}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          {sub.student?.studentId}
                        </p>
                      </div>
                    </div>
                    {statusPill(sub.status)}
                  </div>

                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 line-clamp-1">
                    {sub.assignment?.title}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 dark:border-slate-700/50 text-[11px]">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                      Score: {sub.obtainedMarks !== null && sub.obtainedMarks !== undefined ? (
                        <strong className="text-emerald-600 dark:text-emerald-400">{sub.obtainedMarks}/{sub.assignment?.totalMarks || 100}</strong>
                      ) : (
                        <span className="italic text-amber-600 dark:text-amber-400">Ungraded</span>
                      )}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEvalModal({ isOpen: true, submission: sub })}
                        className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 font-bold text-[10px] transition-colors"
                      >
                        {sub.obtainedMarks !== null && sub.obtainedMarks !== undefined ? 'Update' : 'Grade'}
                      </button>
                      {similarityBadge(sub.similarityScore)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Faculty Evaluation Modal */}
      <EvaluationModal
        isOpen={evalModal.isOpen}
        onClose={() => setEvalModal({ isOpen: false, submission: null })}
        submission={evalModal.submission}
        onSuccess={() => {
          fetchDashboardData();
        }}
      />
    </div>
  );
};

export default TeacherDashboard;
