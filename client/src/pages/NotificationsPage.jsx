import React, { useState, useEffect, useCallback } from 'react';
import {
  Bell,
  CheckCircle2,
  Clock,
  Video,
  CheckSquare,
  Award,
  Trash2,
  CheckCheck,
  ArrowUpRight,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import api from '../services/api';

const NotificationsPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Meeting with Arc Company Starts Soon',
      desc: 'Scheduled conference call begins in 15 minutes. Click to prepare your room.',
      type: 'meeting',
      time: '10 minutes ago',
      read: false,
    },
    {
      id: 2,
      title: 'Task Assigned: Develop API Endpoints',
      desc: 'Faculty assigned you to the backend authentication milestone.',
      type: 'task',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 3,
      title: 'Grade Released: Onboarding Flow (95/100)',
      desc: 'Your submission has been evaluated and marked with full marks on UI responsiveness.',
      type: 'grade',
      time: 'Yesterday',
      read: true,
    },
    {
      id: 4,
      title: 'Sprint Progress Reached 41%',
      desc: '10 projects marked as ended. Outstanding work on the latest release.',
      type: 'system',
      time: '2 days ago',
      read: true,
    },
  ]);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/notifications');
      if (response.data && response.data.success && response.data.notifications?.length > 0) {
        const mapped = response.data.notifications.map((n) => ({
          id: n._id || n.id,
          title: n.title,
          desc: n.message || n.desc,
          type: n.type || 'system',
          time: n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Recent',
          read: n.isRead ?? n.read ?? false,
        }));
        setNotifications(mapped);
      }
    } catch (err) {
      console.warn('Notifications fetch fallback:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
    } catch (err) {
      console.warn('Mark all read note:', err.message);
    }
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
    } catch (err) {
      console.warn('Delete notification note:', err.message);
    }
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
    } catch (err) {
      console.warn('Mark read note:', err.message);
    }
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const filtered = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.read;
    if (activeFilter === 'meeting') return n.type === 'meeting';
    if (activeFilter === 'task') return n.type === 'task';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-7 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Notifications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Real-time updates on deadlines, meetings, grade releases, and team assignments.
          </p>
        </div>

        <button
          type="button"
          onClick={markAllRead}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-all cursor-pointer shadow-xs"
        >
          <CheckCheck className="w-4 h-4 text-emerald-600" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Top 3 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-[#104f37] text-white shadow-lg shadow-emerald-950/15 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-emerald-100/90">Unread Alerts</span>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="text-4xl font-extrabold">{unreadCount}</div>
          <p className="text-xs text-emerald-200/80 mt-2">Requires immediate review</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Meeting Invites</span>
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="text-4xl font-black text-slate-900 dark:text-white">1</div>
          <p className="text-xs text-slate-400 mt-2">Arc Company sync</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">System Logs</span>
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-4xl font-black text-slate-900 dark:text-white">4</div>
          <p className="text-xs text-slate-400 mt-2">All sync services operational</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 w-fit">
        {[
          { id: 'all', label: 'All' },
          { id: 'unread', label: `Unread (${unreadCount})` },
          { id: 'meeting', label: 'Meetings' },
          { id: 'task', label: 'Tasks' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveFilter(tab.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeFilter === tab.id
                ? 'bg-[#104f37] text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3.5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-3xl border transition-all flex items-start justify-between gap-4 ${
              !item.read
                ? 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-800 shadow-sm'
                : 'bg-white/70 dark:bg-slate-900/60 border-slate-100 dark:border-slate-800/80 opacity-90'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  item.type === 'meeting'
                    ? 'bg-[#104f37] text-white'
                    : item.type === 'task'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : item.type === 'grade'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                    : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                }`}
              >
                {item.type === 'meeting' && <Video className="w-5 h-5" />}
                {item.type === 'task' && <CheckSquare className="w-5 h-5" />}
                {item.type === 'grade' && <Award className="w-5 h-5" />}
                {item.type === 'system' && <Sparkles className="w-5 h-5" />}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
                <div className="text-[10px] text-slate-400 font-medium pt-1">
                  {item.time}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => deleteNotification(item.id)}
              className="p-2 text-slate-400 hover:text-rose-600 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Dismiss"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
