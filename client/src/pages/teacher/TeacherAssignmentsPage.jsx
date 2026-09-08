import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckSquare,
  AlertTriangle,
  MoreVertical,
  Edit,
  Trash2,
  ExternalLink,
  ChevronRight,
  BookOpen,
  ArrowUpDown,
  RefreshCw,
  Eye,
} from 'lucide-react';
import assignmentService from '../../services/assignmentService';
import useAuth from '../../hooks/useAuth';

const TeacherAssignmentsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [sortBy, setSortBy] = useState('deadline_asc');
  const [onlyMine, setOnlyMine] = useState(true);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, assignment: null, isDeleting: false });

  // Fetch subjects for dropdown
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await assignmentService.getSubjects();
        if (res.success) {
          setSubjects(res.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch subjects:', err);
      }
    };
    fetchSubjects();
  }, []);

  // Fetch assignments with current query parameters
  const loadAssignments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        sortBy,
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(selectedSubject ? { subjectId: selectedSubject } : {}),
        ...(selectedDifficulty ? { difficulty: selectedDifficulty } : {}),
        ...(selectedPriority ? { priority: selectedPriority } : {}),
        ...(onlyMine ? { myAssignments: 'true' } : {}),
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
  }, [search, selectedSubject, selectedDifficulty, selectedPriority, sortBy, onlyMine]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadAssignments();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadAssignments]);

  // Handle Delete
  const confirmDelete = async () => {
    if (!deleteModal.assignment) return;
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
    try {
      await assignmentService.deleteAssignment(deleteModal.assignment._id);
      setActionSuccess(`"${deleteModal.assignment.title}" was deleted successfully.`);
      setDeleteModal({ isOpen: false, assignment: null, isDeleting: false });
      loadAssignments();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to delete assignment');
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  // Helper formatting for deadline
  const formatDeadline = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const isPast = date < now;
    const diffHours = Math.round((date - now) / (1000 * 60 * 60));

    let relative = '';
    if (isPast) {
      relative = 'Overdue';
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
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      relative,
      isPast,
    };
  };

  // Badge helpers
  const priorityBadge = (priority) => {
    const styles = {
      high: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-900',
      medium: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-900',
      low: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900',
    };
    return (
      <span
        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${
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
        className={`px-2 py-0.5 rounded-md text-xs font-medium capitalize border ${
          styles[diff?.toLowerCase()] || styles.medium
        }`}
      >
        {diff}
      </span>
    );
  };

  // Metrics calculation
  const totalCreated = assignments.length;
  const totalSubmissions = assignments.reduce((acc, curr) => acc + (curr.submittedCount || 0), 0);
  const totalGraded = assignments.reduce((acc, curr) => acc + (curr.gradedCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-2 tracking-wide uppercase">
            <FileText className="w-3.5 h-3.5" />
            <span>Curriculum & Coursework Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Assignment Management</h1>
          <p className="text-emerald-100 text-sm mt-1 max-w-xl">
            Create, track, review submissions, and manage academic coursework for your department courses.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <Link
            to="/teacher/assignments/create"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-emerald-800 font-bold text-sm shadow-md hover:bg-emerald-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 text-emerald-700" />
            <span>Create Assignment</span>
          </Link>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess('')} className="text-xs hover:underline font-medium">
            Dismiss
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Assignments</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalCreated}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Submissions Received</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{totalSubmissions}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Evaluations Complete</p>
            <p className="text-2xl font-bold text-teal-600 dark:text-teal-400 mt-1">{totalGraded}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, subject, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Subject Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
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
              className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
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
              className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="">Priority: All</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Secondary row: Sorting & Ownership Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="deadline_asc">Deadline (Earliest first)</option>
                <option value="deadline_desc">Deadline (Latest first)</option>
                <option value="marks_desc">Marks (Highest first)</option>
                <option value="marks_asc">Marks (Lowest first)</option>
                <option value="recent">Recently Created</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyMine}
                onChange={(e) => setOnlyMine(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <span>My Created Assignments only</span>
            </label>
          </div>

          <button
            onClick={() => {
              setSearch('');
              setSelectedSubject('');
              setSelectedDifficulty('');
              setSelectedPriority('');
              setSortBy('deadline_asc');
              loadAssignments();
            }}
            className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset filters</span>
          </button>
        </div>
      </div>

      {/* Assignment List / Cards */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Loading assignments...</p>
          </div>
        ) : assignments.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No assignments found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              No coursework matches your current filter criteria. Create a new assignment or clear your search filters.
            </p>
            <Link
              to="/teacher/assignments/create"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Assignment</span>
            </Link>
          </div>
        ) : (
          assignments.map((assignment) => {
            const deadlineInfo = formatDeadline(assignment.deadline);
            const isOwner = assignment.teacherId?._id === user?._id || assignment.teacherId === user?._id || user?.role === 'admin';

            return (
              <div
                key={assignment._id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:border-emerald-300 dark:hover:border-emerald-800/80 transition-all shadow-xs"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left info column */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-200 dark:border-emerald-900/60">
                        <BookOpen className="w-3 h-3" />
                        {assignment.subjectId?.name || assignment.subject || 'Subject'}
                        {assignment.subjectId?.code && ` (${assignment.subjectId.code})`}
                      </span>
                      {difficultyBadge(assignment.difficulty)}
                      {priorityBadge(assignment.priority)}
                    </div>

                    <Link
                      to={`/teacher/assignments/${assignment._id}`}
                      className="block group"
                    >
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {assignment.title}
                      </h2>
                    </Link>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 max-w-2xl">
                      {assignment.description}
                    </p>

                    {/* Meta info chips */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{deadlineInfo.formatted}</span>
                        <span
                          className={`ml-1 font-semibold ${
                            deadlineInfo.isPast ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          ({deadlineInfo.relative})
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Max Marks:</span>
                        <span>{assignment.totalMarks || assignment.maxMarks}</span>
                      </div>

                      {assignment.attachmentName && (
                        <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-medium">
                          <ExternalLink className="w-3 h-3" />
                          <span className="truncate max-w-[150px]">{assignment.attachmentName}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submissions tracker & Action buttons */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 dark:border-slate-800">
                    {/* Progress indicator */}
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                        <span>
                          {assignment.submittedCount || 0} / {assignment.totalStudents || 3} Submissions
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {assignment.gradedCount || 0} evaluated
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/teacher/assignments/${assignment._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400 text-xs font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </Link>

                      {isOwner && (
                        <>
                          <Link
                            to={`/teacher/assignments/${assignment._id}/edit`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/40 dark:hover:text-blue-400 text-xs font-semibold transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </Link>

                          <button
                            onClick={() => setDeleteModal({ isOpen: true, assignment, isDeleting: false })}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Assignment?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Are you sure you want to permanently delete{' '}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  "{deleteModal.assignment?.title}"
                </span>
                ? All associated student submissions will also be permanently deleted.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteModal({ isOpen: false, assignment: null, isDeleting: false })}
                disabled={deleteModal.isDeleting}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteModal.isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-semibold text-xs hover:bg-rose-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {deleteModal.isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Yes, Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAssignmentsPage;
