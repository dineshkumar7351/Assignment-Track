import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowUpRight,
  Video,
  X,
  RefreshCw,
  BookOpen,
} from 'lucide-react';
import api from '../services/api';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarPage = () => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('02:00 PM - 03:30 PM');
  const [loading, setLoading] = useState(false);

  const [events, setEvents] = useState([
    {
      id: 1,
      day: 15,
      title: 'Meeting with Arc Company',
      time: '02.00 pm - 04.00 pm',
      type: 'meeting',
      color: 'bg-[#104f37] text-white',
    },
    {
      id: 2,
      day: 18,
      title: 'Develop API Endpoints Due',
      time: '11:59 PM',
      type: 'assignment',
      color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    },
    {
      id: 3,
      day: 22,
      title: 'Design Sprint Review',
      time: '10:00 AM - 11:30 AM',
      type: 'review',
      color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    },
    {
      id: 4,
      day: 26,
      title: 'Build Dashboard Milestones',
      time: '05:00 PM',
      type: 'milestone',
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
    },
  ]);

  const loadCalendarEvents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/calendar', {
        params: { year: currentYear, month: currentMonth },
      });
      if (response.data && response.data.success && response.data.events?.length > 0) {
        const mapped = response.data.events.map((ev) => ({
          id: ev.id || ev._id,
          day: ev.day || new Date(ev.deadline).getDate(),
          title: ev.title,
          time: ev.timeFormatted || '11:59 PM',
          type: ev.status === 'submitted' ? 'completed' : 'assignment',
          color: ev.status === 'submitted'
            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
            : ev.status === 'overdue'
            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
            : 'bg-[#104f37] text-white',
          subject: ev.subject,
        }));
        setEvents(mapped);
      }
    } catch (err) {
      console.warn('Calendar fetch fallback:', err.message);
    } finally {
      setLoading(false);
    }
  }, [currentYear, currentMonth]);

  useEffect(() => {
    loadCalendarEvents();
  }, [loadCalendarEvents]);

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

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;
    const newEv = {
      id: Date.now(),
      day: selectedDate,
      title: newEventTitle,
      time: newEventTime,
      type: 'meeting',
      color: 'bg-[#104f37] text-white',
    };
    setEvents([...events, newEv]);
    setNewEventTitle('');
    setShowAddEventModal(false);
  };

  // Calendar calculations
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth - 1, 1).getDay();

  const selectedDayEvents = events.filter((ev) => ev.day === selectedDate);

  return (
    <div className="space-y-7 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Calendar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Track meetings, submission milestones, and synchronized schedules.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddEventModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#104f37] hover:bg-[#0d3f2c] text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Event</span>
        </button>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-[#104f37] text-white shadow-lg shadow-emerald-950/15 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-emerald-100/90">
              Total Events ({MONTH_NAMES[currentMonth - 1]})
            </span>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-4xl font-extrabold">{events.length}</div>
          <p className="text-xs text-emerald-200/80 mt-2">4 upcoming this week</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Scheduled Meetings
            </span>
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="text-4xl font-black text-slate-900 dark:text-white">6</div>
          <p className="text-xs text-slate-400 mt-2">Synchronized with Google Meet</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Project Milestones
            </span>
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-4xl font-black text-slate-900 dark:text-white">8</div>
          <p className="text-xs text-slate-400 mt-2">All tasks on track</p>
        </div>
      </div>

      {/* Main Calendar Section (Grid of 12 cols: 8 for calendar, 4 for day agenda) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Grid Container (Col span 8) */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
          {/* Calendar Header Controls */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {MONTH_NAMES[currentMonth - 1]} {currentYear}
            </h2>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentMonth(today.getMonth() + 1);
                  setCurrentYear(today.getFullYear());
                }}
                className="px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Today
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day} className="py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Blank offset days */}
            {[...Array(firstDayIndex)].map((_, idx) => (
              <div key={`blank-${idx}`} className="h-14 sm:h-20 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30" />
            ))}

            {/* Month days */}
            {[...Array(daysInMonth)].map((_, idx) => {
              const dayNum = idx + 1;
              const isSelected = selectedDate === dayNum;
              const dayEvents = events.filter((e) => e.day === dayNum);

              return (
                <button
                  key={`day-${dayNum}`}
                  type="button"
                  onClick={() => setSelectedDate(dayNum)}
                  className={`h-14 sm:h-20 rounded-2xl p-2 flex flex-col justify-between items-start transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#104f37] text-white border-[#104f37] shadow-md shadow-emerald-950/20'
                      : 'bg-white dark:bg-slate-800/40 border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 text-slate-900 dark:text-white'
                  }`}
                >
                  <span
                    className={`text-xs font-extrabold w-6 h-6 flex items-center justify-center rounded-full ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : dayNum === today.getDate() && currentMonth === today.getMonth() + 1
                        ? 'bg-emerald-500 text-white'
                        : ''
                    }`}
                  >
                    {dayNum}
                  </span>

                  {dayEvents.length > 0 && (
                    <div className="w-full space-y-1">
                      {dayEvents.slice(0, 1).map((ev) => (
                        <div
                          key={ev.id}
                          className={`text-[9px] font-bold truncate rounded px-1 py-0.5 w-full ${
                            isSelected ? 'bg-white/25 text-white' : ev.color
                          }`}
                        >
                          {ev.title}
                        </div>
                      ))}
                      {dayEvents.length > 1 && (
                        <div className="text-[9px] font-bold opacity-75">
                          +{dayEvents.length - 1} more
                        </div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Agenda (Col span 4) */}
        <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                Day Schedule
              </h3>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950 text-xs font-bold">
                {MONTH_NAMES[currentMonth - 1].slice(0, 3)} {selectedDate}
              </span>
            </div>

            {selectedDayEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDayEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                        {ev.type}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {ev.time}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {ev.title}
                    </h4>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-slate-400 text-xs space-y-2">
                <CalendarIcon className="w-8 h-8 mx-auto opacity-40" />
                <p>No events scheduled for this day.</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowAddEventModal(true)}
            className="w-full py-3 rounded-full bg-[#104f37] hover:bg-[#0d3f2c] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            + Add Event for Day {selectedDate}
          </button>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Add Calendar Event
              </h3>
              <button
                type="button"
                onClick={() => setShowAddEventModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Event / Milestone Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sprint Retrospective Meeting"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. 02:00 PM - 03:00 PM"
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#104f37] hover:bg-[#0d3f2c] text-white text-xs font-bold shadow-sm"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
