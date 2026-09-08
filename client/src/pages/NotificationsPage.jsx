import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  BookOpen,
  Award,
  AlertTriangle,
  ShieldAlert,
  Calendar,
  Layers,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Trash2,
  RefreshCw,
  Filter,
} from 'lucide-react';
import notificationService from '../services/notificationService';
import useAuth from '../hooks/useAuth';

const NotificationsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'unread' | 'assignments' | 'grades'

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await notificationService.getNotifications({ limit: 100 });
      if (res.success) {
        setNotifications(res.data || []);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err) {
      setError(err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'new_assignment':
        return <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'due_soon':
        return <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'overdue':
        return <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
      case 'submission_success':
        return <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'evaluation_completed':
        return <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'feedback_added':
        return <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'deadline_changed':
        return <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case 'high_similarity':
        return <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
      default:
        return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  // Filtered notifications
  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.isRead;
    if (activeFilter === 'assignments') {
      return ['new_assignment', 'due_soon', 'overdue', 'deadline_changed'].includes(n.type);
    }
    if (activeFilter === 'grades') {
      return ['evaluation_completed', 'feedback_added', 'submission_success'].includes(n.type);
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-2 tracking-wide uppercase">
            <Bell className="w-3.5 h-3.5" />
            <span>Activity & Communication Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Notifications & Alerts</h1>
          <p className="text-indigo-100 text-xs sm:text-sm mt-1 max-w-xl">
            Stay up to date with new coursework releases, approaching deadlines, evaluation marks, and system updates.
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-xs transition-colors shadow-xs"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark All Read</span>
            </button>
          )}

          <button
            onClick={fetchNotifications}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
            title="Refresh Notifications"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeFilter === 'all'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          All ({notifications.length})
        </button>

        <button
          onClick={() => setActiveFilter('unread')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeFilter === 'unread'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Unread ({unreadCount})
        </button>

        <button
          onClick={() => setActiveFilter('assignments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeFilter === 'assignments'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Coursework & Deadlines
        </button>

        <button
          onClick={() => setActiveFilter('grades')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeFilter === 'grades'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Submissions & Grading
        </button>
      </div>

      {/* Notifications List Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Loading your notifications...
            </p>
          </div>
        ) : error ? (
          <div className="p-12 text-center space-y-3">
            <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-sm font-bold text-slate-900 dark:text-white">Unable to load notifications</p>
            <p className="text-xs text-slate-500">{error}</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <Bell className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No notifications to display
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {activeFilter === 'unread'
                ? 'You have read all of your notifications. Nice work!'
                : 'When new assignments are published or deliverables are graded, alerts will appear here.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredNotifications.map((n) => (
              <div
                key={n._id}
                className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  !n.isRead
                    ? 'bg-indigo-50/30 dark:bg-indigo-950/20'
                    : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/30'
                }`}
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-sm ${
                          !n.isRead
                            ? 'font-extrabold text-slate-900 dark:text-white'
                            : 'font-semibold text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {n.title}
                      </h4>
                      {!n.isRead && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
                          New
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                      {n.message}
                    </p>

                    <p className="text-[11px] text-slate-400 pt-0.5">
                      {new Date(n.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 sm:self-center shrink-0 pt-2 sm:pt-0">
                  {n.actionUrl && (
                    <button
                      onClick={() => {
                        if (!n.isRead) handleMarkAsRead(n._id);
                        navigate(n.actionUrl);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}

                  {!n.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(n._id)}
                      className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 text-xs font-semibold transition-colors"
                      title="Mark as Read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(n._id)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete Notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
