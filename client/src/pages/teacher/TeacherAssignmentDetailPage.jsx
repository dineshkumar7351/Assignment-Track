import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  BookOpen,
  Award,
  Layers,
  Flag,
  Paperclip,
  ExternalLink,
  Edit,
  Trash2,
  CheckCircle2,
  Users,
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
  FileText,
} from 'lucide-react';
import assignmentService from '../../services/assignmentService';
import useAuth from '../../hooks/useAuth';

const TeacherAssignmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await assignmentService.getAssignmentById(id);
        if (res.success && res.data) {
          setAssignment(res.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to retrieve assignment details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await assignmentService.deleteAssignment(id);
      navigate('/teacher/assignments');
    } catch (err) {
      setError(err.message || 'Failed to delete assignment');
      setDeleting(false);
      setDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Loading assignment...</p>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Assignment Not Found</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">{error || 'Unable to retrieve assignment.'}</p>
        <Link
          to="/teacher/assignments"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Assignments</span>
        </Link>
      </div>
    );
  }

  const deadlineDate = new Date(assignment.deadline);
  const isOverdue = deadlineDate < new Date();
  const isOwner =
    assignment.teacherId?._id === user?._id ||
    assignment.teacherId === user?._id ||
    user?.role === 'admin';

  const submissions = assignment.submissions || [];
  const gradedCount = submissions.filter((s) => s.status === 'graded').length;
  const pendingCount = submissions.length - gradedCount;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back button & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/teacher/assignments"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Assignments</span>
        </Link>

        {isOwner && (
          <div className="flex items-center gap-3">
            <Link
              to={`/teacher/assignments/${assignment._id}/edit`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-semibold transition-colors shadow-xs"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Assignment</span>
            </Link>

            <button
              onClick={() => setDeleteModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-semibold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Details Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Coursework Header */}
        <div className="space-y-3 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-900/60">
              <BookOpen className="w-3.5 h-3.5" />
              {assignment.subjectId?.name || assignment.subject || 'Subject'}
              {assignment.subjectId?.code && ` (${assignment.subjectId.code})`}
            </span>

            <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold capitalize">
              {assignment.difficulty} Difficulty
            </span>

            <span className="px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-xs font-semibold uppercase border border-amber-200 dark:border-amber-900/50">
              {assignment.priority} Priority
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {assignment.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400 pt-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>
                Deadline:{' '}
                <strong className="text-slate-800 dark:text-slate-200">
                  {deadlineDate.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </strong>
              </span>
              <span className={`font-semibold ${isOverdue ? 'text-rose-500' : 'text-emerald-600'}`}>
                ({isOverdue ? 'Past Deadline' : 'Active'})
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Max Marks:</span>
              <strong className="text-slate-800 dark:text-slate-200">{assignment.totalMarks || assignment.maxMarks}</strong>
            </div>

            <div className="flex items-center gap-1.5">
              <span>Department:</span>
              <strong className="text-slate-800 dark:text-slate-200">{assignment.department}</strong>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overview & Prompt</h3>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {assignment.description}
          </p>
        </div>

        {/* Instructions */}
        {assignment.instructions && (
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Step-by-Step Instructions
            </h3>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
              {assignment.instructions}
            </div>
          </div>
        )}

        {/* Attachment reference */}
        {assignment.attachmentUrl && (
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Paperclip className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {assignment.attachmentName || 'Coursework Reference Attachment'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Downloadable prompt material</p>
              </div>
            </div>
            <a
              href={assignment.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Link</span>
            </a>
          </div>
        )}
      </div>

      {/* Submissions Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <span>Student Submissions</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Review and grade deliverables submitted by students for this assignment.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-900">
              {submissions.length} Total Submissions
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-900">
              {gradedCount} Evaluated
            </span>
          </div>
        </div>

        {submissions.length === 0 ? (
          <div className="py-10 text-center">
            <FileText className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No student submissions recorded yet
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              When students submit their work, deliverables and similarity scores will display here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Student</th>
                  <th className="py-3 px-3">Submitted At</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Similarity</th>
                  <th className="py-3 px-3">Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {submissions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      <div>{sub.student?.fullName || 'Student'}</div>
                      <div className="text-[11px] text-slate-400">{sub.student?.studentId || sub.student?.email}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                      {new Date(sub.submittedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase ${
                          sub.status === 'graded'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {sub.similarityScore !== undefined ? (
                        <span
                          className={`font-semibold ${
                            sub.similarityScore > 25
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {sub.similarityScore}%
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200">
                      {sub.obtainedMarks !== null && sub.obtainedMarks !== undefined
                        ? `${sub.obtainedMarks} / ${assignment.totalMarks || assignment.maxMarks}`
                        : 'Pending'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Assignment?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Are you sure you want to permanently delete{' '}
                <span className="font-semibold text-slate-800 dark:text-slate-200">"{assignment.title}"</span>?
                This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteModal(false)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-semibold text-xs hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
              >
                {deleting ? (
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

export default TeacherAssignmentDetailPage;
