import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckSquare,
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  ExternalLink,
  RefreshCw,
  Eye,
  AlertTriangle,
  Award,
  Layers,
  FileText,
  User,
  History,
  X,
  CheckCircle2,
  Edit3,
  MessageSquare,
} from 'lucide-react';
import assignmentService from '../../services/assignmentService';
import EvaluationModal from '../../components/evaluation/EvaluationModal';

const TeacherSubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [teacherAssignments, setTeacherAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modal states
  const [versionModal, setVersionModal] = useState({ isOpen: false, submission: null, versions: [], loading: false });
  const [evalModal, setEvalModal] = useState({ isOpen: false, submission: null });

  const loadSubmissions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(selectedAssignment ? { assignmentId: selectedAssignment } : {}),
        ...(selectedStatus !== 'all' ? { status: selectedStatus } : {}),
      };

      const res = await assignmentService.getTeacherSubmissions(params);
      if (res.success) {
        setSubmissions(res.data || []);
        if (res.teacherAssignments) {
          setTeacherAssignments(res.teacherAssignments);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load teacher submissions');
    } finally {
      setLoading(false);
    }
  }, [search, selectedAssignment, selectedStatus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadSubmissions();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadSubmissions]);

  // Open versions modal
  const openVersionsModal = async (sub) => {
    setVersionModal({ isOpen: true, submission: sub, versions: [], loading: true });
    try {
      const res = await assignmentService.getSubmissionById(sub._id);
      if (res.success && res.data) {
        setVersionModal({
          isOpen: true,
          submission: sub,
          versions: res.data.versions || [],
          loading: false,
        });
      }
    } catch (err) {
      console.error('Failed to load versions for modal:', err);
      setVersionModal((prev) => ({ ...prev, loading: false }));
    }
  };

  // Open evaluation modal
  const openEvaluationModal = (sub) => {
    setEvalModal({ isOpen: true, submission: sub });
  };

  const handleEvaluationSuccess = (updatedData) => {
    setSuccessToast(`Successfully evaluated submission for ${evalModal.submission?.student?.fullName || 'student'}`);
    setTimeout(() => setSuccessToast(''), 4000);
    loadSubmissions();
  };

  // Resolve download link
  const getFileDownloadUrl = (url) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return `${apiBase.replace(/\/api$/, '')}${url}`;
  };

  const gradedCount = submissions.filter((s) => s.status === 'graded').length;
  const pendingCount = submissions.filter((s) => s.status !== 'graded').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-2 tracking-wide uppercase">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Faculty Evaluation Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Student Submissions</h1>
          <p className="text-emerald-100 text-sm mt-1 max-w-xl">
            Review student deliverables, inspect multi-version submission history, evaluate marks, and give constructive feedback.
          </p>
        </div>
      </div>

      {/* Success Notification Toast */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Deliverables</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{submissions.length}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pending Evaluation</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{pendingCount}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Evaluated & Graded</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{gradedCount}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name, ID, or assignment title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Assignment Filter */}
          <div className="md:col-span-4">
            <select
              value={selectedAssignment}
              onChange={(e) => setSelectedAssignment(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="">All Coursework Assignments</option>
              {teacherAssignments.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.title}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="all">Status: All</option>
              <option value="submitted">Pending Evaluation</option>
              <option value="graded">Graded</option>
            </select>
          </div>
        </div>

        {/* Reset filter button */}
        <div className="flex items-center justify-end pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          <button
            onClick={() => {
              setSearch('');
              setSelectedAssignment('');
              setSelectedStatus('all');
              loadSubmissions();
            }}
            className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset filters</span>
          </button>
        </div>
      </div>

      {/* Submissions List / Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Loading submissions...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-900 dark:text-white">Failed to load submissions</p>
            <p className="text-xs text-slate-500 mt-1">{error}</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No submissions found</h3>
            <p className="text-xs text-slate-500 mt-1">
              No student submissions match your selected filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Assignment</th>
                  <th className="py-3.5 px-4">Submission & Status</th>
                  <th className="py-3.5 px-4">Timeline</th>
                  <th className="py-3.5 px-4">Marks & Feedback</th>
                  <th className="py-3.5 px-4 text-right">Evaluation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {submissions.map((sub) => {
                  const assignmentMaxMarks = sub.assignment?.maxMarks || sub.assignment?.totalMarks || 100;
                  const submittedDate = new Date(sub.submittedAt);
                  const deadlineDate = sub.assignment?.deadline ? new Date(sub.assignment.deadline) : null;
                  const isLate = deadlineDate ? submittedDate > deadlineDate : false;
                  const isGraded = sub.status === 'graded' && typeof sub.obtainedMarks === 'number';

                  return (
                    <tr key={sub._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                      {/* Student */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {sub.student?.fullName || 'Student'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {sub.student?.studentId ? `ID: ${sub.student.studentId}` : sub.student?.email}
                        </div>
                      </td>

                      {/* Assignment */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {sub.assignment?.title || 'Coursework'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {sub.assignment?.subjectId?.name || sub.assignment?.subject || 'Subject'}
                        </div>
                      </td>

                      {/* Version & Status */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            onClick={() => openVersionsModal(sub)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900 hover:bg-indigo-100 transition-colors"
                            title="View all historical versions"
                          >
                            <History className="w-3 h-3" />
                            <span>v{sub.version || 1}</span>
                          </button>

                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                              isGraded
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                            }`}
                          >
                            {isGraded ? 'Graded' : 'Pending'}
                          </span>
                        </div>
                      </td>

                      {/* Timeline: Submitted Date & Late/On-Time */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-700 dark:text-slate-300 font-medium">
                          {submittedDate.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <div className="mt-0.5">
                          {isLate ? (
                            <span className="text-[10px] font-extrabold text-rose-600 dark:text-rose-400 flex items-center gap-0.5">
                              <AlertTriangle className="w-2.5 h-2.5" /> Late
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                              <CheckCircle2 className="w-2.5 h-2.5" /> On Time
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Marks & Feedback */}
                      <td className="py-3.5 px-4 max-w-xs">
                        {isGraded ? (
                          <div>
                            <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <Award className="w-3.5 h-3.5 text-emerald-600" />
                              <span>
                                {sub.obtainedMarks} / {assignmentMaxMarks}
                              </span>
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                                {Math.round((sub.obtainedMarks / assignmentMaxMarks) * 100)}%
                              </span>
                            </div>
                            {sub.feedback && (
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 italic truncate mt-0.5">
                                "{sub.feedback}"
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold text-xs">
                            <Clock className="w-3 h-3" />
                            <span>Ungraded</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Evaluate / Grade Button */}
                          <button
                            onClick={() => openEvaluationModal(sub)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs transition-all ${
                              isGraded
                                ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                            }`}
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>{isGraded ? 'Update Marks' : 'Evaluate'}</span>
                          </button>

                          {/* Download Button */}
                          {sub.fileUrl && (
                            <a
                              href={getFileDownloadUrl(sub.fileUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-semibold transition-colors"
                              title="Download Submission File"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Evaluation Modal */}
      <EvaluationModal
        isOpen={evalModal.isOpen}
        onClose={() => setEvalModal({ isOpen: false, submission: null })}
        submission={evalModal.submission}
        onSuccess={handleEvaluationSuccess}
      />

      {/* Version History Modal */}
      {versionModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-indigo-600" />
                  <span>Submission Version History</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Student: <strong>{versionModal.submission?.student?.fullName}</strong>
                </p>
              </div>
              <button
                onClick={() => setVersionModal({ isOpen: false, submission: null, versions: [], loading: false })}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {versionModal.loading ? (
              <div className="py-8 text-center">
                <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin mx-auto mb-2" />
                <p className="text-xs text-slate-500">Loading version details...</p>
              </div>
            ) : versionModal.versions.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">
                No archived versions recorded.
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {versionModal.versions.map((v) => (
                  <div
                    key={v._id}
                    className={`p-3.5 rounded-xl border ${
                      v.isCurrent
                        ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/10'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          Version {v.version}
                        </span>
                        {v.isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                            Current
                          </span>
                        )}
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          {v.fileType}
                        </span>
                      </div>

                      <a
                        href={getFileDownloadUrl(v.fileUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </a>
                    </div>

                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200 mt-1 truncate">
                      {v.fileName}
                    </p>

                    {v.comment && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-0.5">
                        "{v.comment}"
                      </p>
                    )}

                    <p className="text-[10px] text-slate-400 mt-1">
                      Submitted on {new Date(v.submittedAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherSubmissionsPage;
