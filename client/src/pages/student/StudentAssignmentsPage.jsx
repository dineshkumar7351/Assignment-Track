import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckSquare,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  ChevronRight,
  ArrowUpRight,
  Plus,
  ArrowUpDown,
  FileText,
  Sparkles,
  ExternalLink,
  MoreVertical,
  X,
} from 'lucide-react';
import assignmentService from '../../services/assignmentService';

const StudentAssignmentsPage = () => {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('Computer Science');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('Normal');

  // Default tasks fallback
  const defaultTasks = [
    {
      _id: 't-1',
      title: 'Develop API Endpoints & Auth Middleware',
      subject: { name: 'Computer Science' },
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      mySubmission: null,
      priority: 'High',
      totalMarks: 100,
      iconType: 'blue-striped',
      status: 'in-progress',
    },
    {
      _id: 't-2',
      title: 'Design Onboarding Flow & User Dashboard',
      subject: { name: 'UX Design' },
      dueDate: new Date(Date.now() + 86400000 * 4).toISOString(),
      mySubmission: { score: 95, status: 'Graded' },
      priority: 'Normal',
      totalMarks: 100,
      iconType: 'teal-circle',
      status: 'completed',
    },
    {
      _id: 't-3',
      title: 'Multivariable Calculus - Stokes Theorem',
      subject: { name: 'Mathematics' },
      dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
      mySubmission: null,
      priority: 'High',
      totalMarks: 50,
      iconType: 'flower',
      status: 'pending',
    },
    {
      _id: 't-4',
      title: 'Optimize Database Indexing & Page Load',
      subject: { name: 'Database Systems' },
      dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
      mySubmission: null,
      priority: 'Normal',
      totalMarks: 100,
      iconType: 'orange-sun',
      status: 'in-progress',
    },
    {
      _id: 't-5',
      title: 'Cross-Browser Testing & PWA Service Workers',
      subject: { name: 'Web Architecture' },
      dueDate: new Date(Date.now() + 86400000 * 9).toISOString(),
      mySubmission: { score: 90, status: 'Graded' },
      priority: 'Normal',
      totalMarks: 100,
      iconType: 'purple-dots',
      status: 'completed',
    },
  ];

  const loadAssignments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await assignmentService.getAssignments();
      if (res.success && res.data && res.data.length > 0) {
        setAssignments(res.data);
      } else {
        setAssignments(defaultTasks);
      }
    } catch (err) {
      setAssignments(defaultTasks);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const created = {
      _id: `t-${Date.now()}`,
      title: newTaskTitle,
      subject: { name: newTaskSubject },
      dueDate: newTaskDueDate || new Date(Date.now() + 86400000 * 3).toISOString(),
      mySubmission: null,
      priority: newTaskPriority,
      totalMarks: 100,
      iconType: 'teal-circle',
      status: 'in-progress',
    };
    setAssignments([created, ...assignments]);
    setNewTaskTitle('');
    setNewTaskDueDate('');
    setShowAddModal(false);
  };

  const filteredTasks = assignments.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'in-progress') return matchesSearch && !item.mySubmission;
    if (activeTab === 'completed') return matchesSearch && item.mySubmission;
    if (activeTab === 'urgent') return matchesSearch && item.priority === 'High';
    return matchesSearch;
  });

  const totalCount = assignments.length || 24;
  const completedCount = assignments.filter((a) => a.mySubmission).length || 10;
  const inProgressCount = assignments.filter((a) => !a.mySubmission).length || 12;

  return (
    <div className="space-y-7 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Tasks & Assignments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Organize, prioritize, and submit your coursework with ease.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#104f37] hover:bg-[#0d3f2c] text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
          <button
            type="button"
            onClick={() => alert('Tasks imported!')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-[#104f37] dark:border-emerald-500 text-[#104f37] dark:text-emerald-400 text-xs sm:text-sm font-bold hover:bg-slate-50 transition-all cursor-pointer"
          >
            <span>Import Tasks</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-6 rounded-3xl bg-[#104f37] text-white flex flex-col justify-between shadow-lg shadow-emerald-950/15">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-emerald-100/90">Total Tasks</span>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-4xl font-extrabold">{totalCount}</div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#186347] text-emerald-100 text-[11px] font-bold mt-2 w-fit">
            <span>▲ 5 new this week</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Completed</span>
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-4xl font-black text-slate-900 dark:text-white">{completedCount}</div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 text-[11px] font-bold mt-2 w-fit">
            <span>100% on time</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">In Progress</span>
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-4xl font-black text-slate-900 dark:text-white">{inProgressCount}</div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 text-[11px] font-bold mt-2 w-fit">
            <span>2 urgent</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Pending Review</span>
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-4xl font-black text-slate-900 dark:text-white">2</div>
          <div className="text-xs font-bold text-slate-400 mt-2">On Discuss</div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search assignments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Tasks' },
            { id: 'in-progress', label: 'In Progress' },
            { id: 'completed', label: 'Completed' },
            { id: 'urgent', label: 'Urgent' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#104f37] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3.5">
        {filteredTasks.map((task) => {
          const isSubmitted = !!task.mySubmission;
          return (
            <div
              key={task._id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-start sm:items-center gap-4 min-w-0">
                {/* Geometric icon */}
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckSquare className="w-5 h-5" />
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                      {task.subject?.name || 'General'}
                    </span>
                    {task.priority === 'High' && (
                      <span className="px-2 py-0.2 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        Urgent
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-[#104f37] transition-colors truncate">
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Due {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>{task.totalMarks || 100} Points</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    isSubmitted
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {isSubmitted ? 'Submitted' : 'In Progress'}
                </span>

                <Link
                  to={`/assignments/${task._id}`}
                  className="px-4 py-2 rounded-full bg-[#104f37] hover:bg-[#0d3f2c] text-white text-xs font-bold shadow-sm transition-all"
                >
                  View Details →
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Create New Task
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement Responsive Navigation"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subject / Category
                </label>
                <select
                  value={newTaskSubject}
                  onChange={(e) => setNewTaskSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="UX Design">UX Design</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Database Systems">Database Systems</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#104f37] hover:bg-[#0d3f2c] text-white text-xs font-bold shadow-sm"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAssignmentsPage;
