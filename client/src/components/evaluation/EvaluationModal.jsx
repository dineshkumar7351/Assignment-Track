import React, { useState, useEffect } from 'react';
import {
  X,
  Award,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  FileText,
  User,
  BookOpen,
  Calendar,
  Send,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import evaluationService from '../../services/evaluationService';

const EvaluationModal = ({ isOpen, onClose, submission, onSuccess }) => {
  const [marks, setMarks] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingEvaluation, setExistingEvaluation] = useState(null);

  // Initialize form state whenever modal opens or submission changes
  useEffect(() => {
    if (!isOpen || !submission) {
      setMarks('');
      setFeedback('');
      setError('');
      setExistingEvaluation(null);
      return;
    }

    // Pre-populate from submission if already graded
    if (submission.obtainedMarks !== undefined && submission.obtainedMarks !== null) {
      setMarks(submission.obtainedMarks.toString());
    } else {
      setMarks('');
    }

    if (submission.feedback) {
      setFeedback(submission.feedback);
    } else {
      setFeedback('');
    }

    // Try to fetch full evaluation record from backend
    const loadEvaluationData = async () => {
      setFetchLoading(true);
      try {
        const res = await evaluationService.getEvaluationBySubmissionId(submission._id);
        if (res.success && res.data) {
          setExistingEvaluation(res.data);
          if (res.data.marks !== undefined && res.data.marks !== null) {
            setMarks(res.data.marks.toString());
          }
          if (res.data.feedback) {
            setFeedback(res.data.feedback);
          }
        }
      } catch {
        // Fallback to submission data already provided
      } finally {
        setFetchLoading(false);
      }
    };

    loadEvaluationData();
  }, [isOpen, submission]);

  if (!isOpen || !submission) return null;

  const assignment = submission.assignment || {};
  const student = submission.student || {};
  const maxMarks = assignment.maxMarks || assignment.totalMarks || 100;

  // Compute On-time vs Late status
  const submittedDate = submission.submittedAt ? new Date(submission.submittedAt) : new Date();
  const deadlineDate = assignment.deadline ? new Date(assignment.deadline) : null;
  const isLate = deadlineDate ? submittedDate > deadlineDate : false;

  // Resolve download url
  const getFileDownloadUrl = (url) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return `${apiBase.replace(/\/api$/, '')}${url}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (marks === '' || isNaN(Number(marks))) {
      setError('Please enter a valid numeric mark.');
      return;
    }

    const numMarks = Number(marks);
    if (numMarks < 0) {
      setError('Marks cannot be negative.');
      return;
    }

    if (numMarks > maxMarks) {
      setError(`Marks (${numMarks}) cannot exceed the maximum allowed score (${maxMarks}).`);
      return;
    }

    setLoading(true);
    try {
      let res;
      if (existingEvaluation && existingEvaluation._id && !existingEvaluation._id.startsWith('synth-')) {
        res = await evaluationService.updateEvaluation(existingEvaluation._id, {
          marks: numMarks,
          feedback: feedback.trim(),
        });
      } else {
        res = await evaluationService.createEvaluation({
          submissionId: submission._id,
          marks: numMarks,
          feedback: feedback.trim(),
        });
      }

      if (res.success) {
        if (onSuccess) {
          onSuccess(res.data || { ...submission, obtainedMarks: numMarks, feedback: feedback.trim(), status: 'graded' });
        }
        onClose();
      } else {
        setError(res.message || 'Failed to record evaluation');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit evaluation');
    } finally {
      setLoading(false);
    }
  };

  // Quick preset percentages
  const applyPresetPercentage = (pct) => {
    const calculated = Math.round((pct / 100) * maxMarks);
    setMarks(calculated.toString());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Coursework Evaluation & Feedback</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Evaluate Student Deliverable
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Submission Details Card */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Student Info */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-500" />
                Student Candidate
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {student.fullName || 'Student'}
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                {student.studentId ? `ID: ${student.studentId}` : student.email}
              </p>
            </div>

            {/* Assignment Info */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                Coursework Assignment
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {assignment.title || 'Assignment'}
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Max Marks: <strong>{maxMarks}</strong>
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Submission Date & Status */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                Submission Timeline
              </span>
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                {submittedDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              {/* Late / On-Time Badge */}
              <div>
                {isLate ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                    <AlertTriangle className="w-3 h-3 text-rose-600" />
                    <span>Submitted Late</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Submitted On-Time</span>
                  </span>
                )}
                {submission.version && (
                  <span className="ml-2 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                    (Version {submission.version})
                  </span>
                )}
              </div>
            </div>

            {/* Submission Deliverable File */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-500" />
                Student Deliverable
              </span>
              <p className="text-slate-800 dark:text-slate-200 font-semibold truncate">
                {submission.fileName || 'coursework_submission.pdf'}
              </p>
              {submission.fileUrl ? (
                <a
                  href={getFileDownloadUrl(submission.fileUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download / Inspect Deliverable</span>
                </a>
              ) : (
                <span className="text-slate-400 italic">No file attached</span>
              )}
            </div>
          </div>

          {/* Student's Comment if present */}
          {submission.comment && (
            <div className="pt-2 text-xs">
              <span className="text-slate-400 font-semibold">Student Notes: </span>
              <span className="text-slate-700 dark:text-slate-300 italic">"{submission.comment}"</span>
            </div>
          )}
        </div>

        {/* Evaluation Input Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Marks Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Awarded Marks <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <span>Quick Fill:</span>
                <button
                  type="button"
                  onClick={() => applyPresetPercentage(100)}
                  className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 hover:text-emerald-700 transition-colors font-bold"
                >
                  100%
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetPercentage(85)}
                  className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 hover:text-indigo-700 transition-colors font-bold"
                >
                  85%
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetPercentage(70)}
                  className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 hover:text-amber-700 transition-colors font-bold"
                >
                  70%
                </button>
              </div>
            </div>

            <div className="relative flex items-center">
              <input
                type="number"
                min="0"
                max={maxMarks}
                step="1"
                required
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                placeholder="e.g. 87"
                className="w-full pl-4 pr-24 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-extrabold text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
              <span className="absolute right-4 text-sm font-bold text-slate-400 pointer-events-none">
                / {maxMarks} Marks
              </span>
            </div>
          </div>

          {/* Feedback Textarea */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Faculty Feedback & Constructive Remarks
            </label>
            <textarea
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="e.g. Good implementation. Improve exception handling."
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all leading-relaxed"
            />
            <p className="text-[11px] text-slate-400 italic">
              This feedback will be instantly visible on the student's dashboard and coursework report.
            </p>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || fetchLoading}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Evaluation...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>{existingEvaluation ? 'Update Evaluation' : 'Submit Evaluation'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EvaluationModal;
