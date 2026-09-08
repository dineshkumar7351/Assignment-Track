import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { analyticsService } from '../services/analyticsService';
import StudentAnalyticsView from '../components/analytics/StudentAnalyticsView';
import TeacherAnalyticsView from '../components/analytics/TeacherAnalyticsView';
import { Activity, RefreshCw, AlertCircle, BarChart2 } from 'lucide-react';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

  const fetchAnalytics = async () => {
    try {
      setError(null);
      if (isTeacher) {
        const res = await analyticsService.getTeacherAnalytics();
        setAnalyticsData(res.data);
      } else {
        const res = await analyticsService.getStudentAnalytics();
        setAnalyticsData(res.data);
      }
    } catch (err) {
      console.error('Failed to load analytics data:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load analytics.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [user?.role]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAnalytics();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Calculating academic metrics & performance indices...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-2">
            <BarChart2 className="w-3.5 h-3.5" />
            <span>{isTeacher ? 'Faculty Academic Analytics' : 'Student Performance & Insights'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isTeacher ? 'Cohort Performance Analytics' : 'Academic Analytics & Smart Insights'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isTeacher
              ? 'Real-time cohort submission rates, grade distributions, and textual similarity insights.'
              : 'Deterministic progress indicators, Academic Health Score, and prioritized action recommendations.'}
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold shadow-sm transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl p-4 text-rose-700 dark:text-rose-300 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div className="flex-1">{error}</div>
          <button
            onClick={fetchAnalytics}
            className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-medium hover:bg-rose-700 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* View Content */}
      {analyticsData && (
        isTeacher ? (
          <TeacherAnalyticsView analyticsData={analyticsData} />
        ) : (
          <StudentAnalyticsView analyticsData={analyticsData} />
        )
      )}
    </div>
  );
}
