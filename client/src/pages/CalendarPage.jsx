import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  Sparkles,
  Layers,
  UploadCloud,
  FileText,
  User,
} from 'lucide-react';
import calendarService from '../services/calendarService';
import useAuth from '../hooks/useAuth';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarPage = () => {
  const { user } = useAuth();
  const today = new Date();

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1); // 1-indexed
  const [selectedDateKey, setSelectedDateKey] = useState(today.toISOString().split('T')[0]);

  const [calendarData, setCalendarData] = useState({
    eventsByDate: {},
    summary: { upcoming: 0, dueSoon: 0, overdue: 0, submitted: 0 },
    totalAssignments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCalendar = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await calendarService.getCalendarEvents({
        month: currentMonth,
        year: currentYear,
      });
      if (res.success && res.data) {
        setCalendarData(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  }, [currentMonth, currentYear]);

  useEffect(() => {
    fetchCalendar();
  }, [fetchCalendar]);

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth() + 1);
    setSelectedDateKey(now.toISOString().split('T')[0]);
  };

  // Helper to get calendar days for current month grid
  const getDaysGrid = () => {
    const firstDayIndex = new Date(currentYear, currentMonth - 1, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth - 1, 0).getDate();

    const grid = [];

    // Previous month padding days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      const m = currentMonth === 1 ? 12 : currentMonth - 1;
      const y = currentMonth === 1 ? currentYear - 1 : currentYear;
      const dateKey = `${y}-${String(m).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      grid.push({ dayNum, isCurrentMonth: false, dateKey });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      grid.push({ dayNum: i, isCurrentMonth: true, dateKey });
    }

    // Next month padding days to complete 35 or 42 cells
    const remaining = (7 - (grid.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const m = currentMonth === 12 ? 1 : currentMonth + 1;
      const y = currentMonth === 12 ? currentYear + 1 : currentYear;
      const dateKey = `${y}-${String(m).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      grid.push({ dayNum: i, isCurrentMonth: false, dateKey });
    }

    return grid;
  };

  const daysGrid = getDaysGrid();
  const eventsByDate = calendarData.eventsByDate || {};
  const selectedEvents = eventsByDate[selectedDateKey] || [];
  const summary = calendarData.summary || {};

  const getStatusColorClass = (status) => {
    switch (status) {
      case 'submitted':
        return 'bg-emerald-500 text-white';
      case 'due_soon':
        return 'bg-amber-500 text-white';
      case 'overdue':
        return 'bg-rose-500 text-white';
      case 'upcoming':
      default:
        return 'bg-indigo-500 text-white';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'submitted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3" />
            <span>Submitted</span>
          </span>
        );
      case 'due_soon':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800 animate-pulse">
            <Clock className="w-3 h-3" />
            <span>Due Soon</span>
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <AlertTriangle className="w-3 h-3" />
            <span>Overdue</span>
          </span>
        );
      case 'upcoming':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            <CalendarIcon className="w-3 h-3" />
            <span>Upcoming</span>
          </span>
        );
    }
  };

  const isSelectedToday = selectedDateKey === today.toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-2 tracking-wide uppercase">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Academic Schedule & Deadlines</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Academic Calendar</h1>
          <p className="text-indigo-100 text-xs sm:text-sm mt-1 max-w-xl">
            Interactive month view of all coursework deadlines with color-coded status tracking and day agendas.
          </p>
        </div>

        {/* Legend Summary Pills */}
        <div className="flex flex-wrap items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/15 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-indigo-500/80 text-white shadow-xs">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span>Upcoming: {summary.upcoming || 0}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-amber-500/90 text-white shadow-xs">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span>Due Soon: {summary.dueSoon || 0}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-rose-500/90 text-white shadow-xs">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span>Overdue: {summary.overdue || 0}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/90 text-white shadow-xs">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span>Submitted: {summary.submitted || 0}</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Left Calendar (7 cols), Right Day Agenda (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Monthly Calendar Component */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
          {/* Calendar Navigation Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {MONTH_NAMES[currentMonth - 1]} {currentYear}
              </h2>
              {loading && <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleToday}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
              >
                Today
              </button>
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 uppercase tracking-wider py-2 border-b border-slate-100 dark:border-slate-800">
            {DAYS_OF_WEEK.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Calendar Day Cells Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {daysGrid.map(({ dayNum, isCurrentMonth, dateKey }, index) => {
              const dayEvents = eventsByDate[dateKey] || [];
              const isSelected = selectedDateKey === dateKey;
              const isTodayCell = dateKey === today.toISOString().split('T')[0];

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDateKey(dateKey)}
                  className={`min-h-[70px] sm:min-h-[85px] p-1.5 sm:p-2 rounded-2xl flex flex-col items-start justify-between text-left transition-all border ${
                    isSelected
                      ? 'ring-2 ring-indigo-600 border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40'
                      : isTodayCell
                      ? 'border-indigo-300 dark:border-indigo-800 bg-indigo-50/20 dark:bg-indigo-950/10'
                      : isCurrentMonth
                      ? 'border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/50 bg-white dark:bg-slate-900'
                      : 'border-transparent text-slate-300 dark:text-slate-700 hover:bg-slate-50/40 dark:hover:bg-slate-800/20 opacity-40'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isTodayCell
                          ? 'bg-indigo-600 text-white font-black'
                          : isSelected
                          ? 'text-indigo-600 dark:text-indigo-400 font-extrabold'
                          : isCurrentMonth
                          ? 'text-slate-800 dark:text-slate-200'
                          : 'text-slate-400'
                      }`}
                    >
                      {dayNum}
                    </span>

                    {dayEvents.length > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  {/* Tiny Event Badges */}
                  <div className="w-full space-y-1 mt-1">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev._id}
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md truncate w-full shadow-2xs ${getStatusColorClass(
                          ev.status
                        )}`}
                        title={`${ev.title} (${ev.status})`}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[9px] text-slate-400 font-bold block text-right">
                        +{dayEvents.length - 2} more
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Day Agenda Card */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5 flex flex-col">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Selected Day Agenda
              </span>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                <CalendarIcon className="w-4 h-4 text-indigo-600" />
                <span>
                  {new Date(selectedDateKey + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </h3>
            </div>

            {isSelectedToday && (
              <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-extrabold text-[10px] uppercase">
                Today
              </span>
            )}
          </div>

          {selectedEvents.length === 0 ? (
            <div className="py-12 text-center my-auto space-y-2">
              <Clock className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No assignments due on this date
              </h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Click any other highlighted date on the calendar to inspect due coursework deliverables.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5 overflow-y-auto max-h-[500px] pr-1">
              {selectedEvents.map((ev) => (
                <div
                  key={ev._id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400">
                        {ev.subject}
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                        {ev.title}
                      </h4>
                    </div>
                    {getStatusBadge(ev.status)}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Due at{' '}
                      {new Date(ev.deadline).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                    <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      {ev.totalMarks} Marks
                    </span>
                  </div>

                  {/* Action Link Button */}
                  <div className="pt-2 flex items-center justify-end">
                    {user?.role === 'teacher' ? (
                      <Link
                        to={`/teacher/assignments/${ev._id}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors"
                      >
                        <span>Manage Assignment</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    ) : ev.status === 'submitted' ? (
                      <Link
                        to={`/assignments/${ev._id}/submit`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                      >
                        <span>View Submission</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    ) : (
                      <Link
                        to={`/assignments/${ev._id}/submit`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Submit Deliverable</span>
                      </Link>
                    )}
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

export default CalendarPage;
