import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  ChevronRight,
  RefreshCw,
  ArrowUpDown,
  FileText,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import assignmentService from '../../services/assignmentService';

const StudentAssignmentsPage = () => {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters and sorting
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [sortBy, setSortBy] = useState('deadline_asc');

  // Load subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await assignmentService.getSubjects();
        if (res.success) {
          setSubjects(res.data || []);
        }
      } catch (err) {
        console.error('Failed to load subjects:', err);
      }
    };
    fetchSubjects();
  }, []);

  // Fetch student assignments
  const loadAssignments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        sortBy,
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(selectedSubject ? { subjectId: selectedSubject } : {}),
        ...(selectedStatus !== 'all' ? { status: selectedStatus } : {}),
        ...(selectedPriority ? { priority: selectedPriority } : {}),
        ...(selectedDifficulty ? { difficulty: selectedDifficulty } : {}),
      };

      const res = await assignmentService.getAssignments(params);
      if (res.success) {
        setAssignments(res.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  }, [search, selectedSubject, selectedStatus, selectedPriority, selectedDifficulty, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadAssignments();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadAssignments]);

  // Format deadline and countdown
  const formatDeadline = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const isPast = date < now;
    const diffHours = Math.round((date - now) / (1000 * 60 * 60));

    let relative = '';
    if (isPast) {
      const hoursAgo = Math.abs(diffHours);
      if (hoursAgo < 24) relative = `Expired ${hoursAgo}h ago`;
      else relative = `Expired ${Math.floor(hoursAgo / 24)}d ago`;
    } else if (diffHours < 24) {
      relative = `Due in ${diffHours}h`;
    } else {
      const days = Math.floor(diffHours / 24);
      relative = `Due in ${days}d`;
    }

    return {
      formatted: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      relative,
      isPast,
    };
  };

  // Status badges
  const renderStatusBadge = (status) => {
    const lower = (status || '').toLowerCase();
    switch (lower) {
      case 'graded':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3" />
            Graded
          </span>
        );
      case 'submitted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
            <CheckCircle2 className="w-3 h-3" />
            Submitted
          </span>
        );
      case 'due soon':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800 animate-pulse">
            <Clock className="w-3 h-3" />
            Due Soon
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
            <AlertTriangle className="w-3 h-3" />
            Overdue
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <Calendar className="w-3 h-3" />
            Upcoming
          </span>
        );
    }
  };

  const priorityBadge = (priority) => {
    const styles = {
      high: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-900',
      medium: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-900',
      low: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900',
    };
    return (
      <span
        className={`px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider border ${
          styles[priority?.toLowerCase()] || styles.medium
        }`}
      >
        {priority}
      </span>
    );
  };

  const difficultyBadge = (diff) => {
    const styles = {
      hard: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200 dark:border-purple-900',
      medium: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-900',
      easy: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    };
    return (
      <span
        className={`px-2 py-0.5 rounded-md text-[11px] font-medium capitalize border ${
          styles[diff?.toLowerCase()] || styles.medium
        }`}
      >
        {diff}
      </span>
    );
  };

  // Status Tab counts
  const countByStatus = (st) => {
    if (st === 'all') return assignments.length;
    return assignments.filter((a) => a.status?.toLowerCase() === st.toLowerCase()).length;
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-2 uppercase tracking-wide">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic Coursework Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Assignments & Deadlines</h1>
          <p className="text-indigo-100 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Track all course deliverables, view faculty instructions, monitor due dates with real-time status indicators, and review your grading evaluations.
          </p>
        </div>
      </div>

      {/* Quick Status Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Coursework' },
          { id: 'upcoming', label: 'Upcoming' },
          { id: 'due soon', label: 'Due Soon (<= 48h)' },
          { id: 'submitted', label: 'Submitted' },
          { id: 'graded', label: 'Graded' },
          { id: 'overdue', label: 'Overdue' },
        ].map((tab) => {
          const isActive = selectedStatus.toLowerCase() === tab.id.toLowerCase();
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-indigo-300'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search assignments by title, keyword, or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Subject Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="">All Subjects</option>
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="">Difficulty: All</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="">Priority: All</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Secondary controls: Sort options & reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="deadline_asc">Deadline (Earliest first)</option>
              <option value="deadline_desc">Deadline (Furthest first)</option>
              <option value="marks_desc">Marks (Highest first)</option>
              <option value="marks_asc">Marks (Lowest first)</option>
              <option value="recent">Recently Created</option>
            </select>
          </div>

          <button
            onClick={() => {
              setSearch('');
              setSelectedSubject('');
              setSelectedStatus('all');
              setSelectedPriority('');
              setSelectedDifficulty('');
              setSortBy('deadline_asc');
              loadAssignments();
            }}
            className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset filters</span>
          </button>
        </div>
      </div>

      {/* Assignment Cards List */}
      <div className="space-y-3.5">
        {loading ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Loading coursework...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-900 dark:text-white">Unable to fetch assignments</p>
            <p className="text-xs text-slate-500 mt-1">{error}</p>
          </div>
        ) : assignments.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No assignments found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              No coursework matches your filter criteria. Try adjusting your search keywords or status filter.
            </p>
          </div>
        ) : (
          assignments.map((assignment) => {
            const deadlineInfo = formatDeadline(assignment.deadline);

            return (
              <div
                key={assignment._id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:border-indigo-300 dark:hover:border-indigo-800/70 transition-all shadow-xs group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Info column */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 text-xs font-semibold border border-indigo-200 dark:border-indigo-900/60">
                        <BookOpen className="w-3 h-3" />
                        {assignment.subjectId?.name || assignment.subject || 'Subject'}
                        {assignment.subjectId?.code && ` (${assignment.subjectId.code})`}
                      </span>

                      {difficultyBadge(assignment.difficulty)}
                      {priorityBadge(assignment.priority)}
                      {renderStatusBadge(assignment.status)}
                    </div>

                    <Link
                      to={`/assignments/${assignment._id}`}
                      className="block"
                    >
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {assignment.title}
                      </h2>
                    </Link>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 max-w-2xl leading-relaxed">
                      {assignment.description}
                    </p>

                    {/* Metadata line */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{deadlineInfo.formatted}</span>
                        <span
                          className={`font-semibold ml-1 ${
                            deadlineInfo.isPast ? 'text-rose-600 dark:text-rose-400' : 'text-indigo-600 dark:text-indigo-400'
                          }`}
                        >
                          ({deadlineInfo.relative})
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>{assignment.totalMarks || assignment.maxMarks} Marks</span>
                      </div>

                      {assignment.submission?.status === 'graded' && (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold">
                          <span>Grade: {assignment.submission.obtainedMarks} / {assignment.totalMarks || assignment.maxMarks}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right CTA */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800 shrink-0">
                    <Link
                      to={`/assignments/${assignment._id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all shadow-xs"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StudentAssignmentsPage;
