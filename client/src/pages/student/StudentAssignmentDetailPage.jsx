import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileText,
  User,
  ShieldCheck,
  UploadCloud,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import assignmentService from '../../services/assignmentService';
import evaluationService from '../../services/evaluationService';

const StudentAssignmentDetailPage = () => {
  const { id } = useParams();

  const [assignment, setAssignment] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssignmentAndEvaluation = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await assignmentService.getAssignmentById(id);
        if (res.success && res.data) {
          setAssignment(res.data);

          // If submission exists, check for evaluation details
          if (res.data.submission?._id) {
            try {
              const evalRes = await evaluationService.getEvaluationBySubmissionId(res.data.submission._id);
              if (evalRes.success && evalRes.data) {
                setEvaluation(evalRes.data);
              }
            } catch {
              // Ignore if no evaluation yet
            }
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to retrieve assignment details');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentAndEvaluation();
  }, [id]);

  if (loading) {
    return (
      <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Loading coursework details...</p>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Assignment Not Found</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">{error || 'Unable to load assignment details.'}</p>
        <Link
          to="/assignments"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Assignments</span>
        </Link>
      </div>
    );
  }

  const deadlineDate = new Date(assignment.deadline);
  const isOverdue = deadlineDate < new Date();
  const submission = assignment.submission;
  const isGraded =
    (assignment.status || '').toLowerCase() === 'graded' ||
    (submission && submission.status === 'graded') ||
    evaluation !== null;

  const currentMarks = evaluation?.marks ?? submission?.obtainedMarks;
  const maxMarksVal = assignment.totalMarks || assignment.maxMarks || 100;
  const feedbackText = evaluation?.feedback || submission?.feedback;
  const evalDate = evaluation?.evaluatedAt || submission?.gradedAt;
  const evaluatorName = evaluation?.evaluator?.fullName || assignment.teacherId?.fullName || 'Faculty Instructor';

  const renderStatusBanner = () => {
    const statusLower = (assignment.status || '').toLowerCase();

    if (isGraded && currentMarks !== undefined && currentMarks !== null) {
      return (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-600/10 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-emerald-950/40 border border-emerald-300 dark:border-emerald-800/80 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold uppercase tracking-wide mb-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Evaluation Completed</span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Coursework Graded & Evaluated
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Evaluated by <strong>{evaluatorName}</strong>
                  {evalDate && (
                    <span> on {new Date(evalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  )}
                </p>
              </div>
            </div>

            {/* Score Card */}
            <div className="flex items-center gap-3 bg-white dark:bg-slate-900/80 px-4 py-2.5 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 shadow-xs shrink-0">
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-slate-400">Awarded Score</p>
                <p className="text-xl font-black text-slate-900 dark:text-white">
                  {currentMarks} <span className="text-xs font-bold text-slate-400">/ {maxMarksVal}</span>
                </p>
              </div>
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-xl bg-emerald-600 text-white">
                {Math.round((currentMarks / maxMarksVal) * 100)}%
              </span>
            </div>
          </div>

          {/* Feedback Display */}
          {feedbackText && (
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-emerald-200/80 dark:border-emerald-900/60 flex items-start gap-2.5 text-xs">
              <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Faculty Feedback: </span>
                <span className="text-slate-700 dark:text-slate-300 italic">"{feedbackText}"</span>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (statusLower === 'submitted' && submission) {
      return (
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
          <div>
            <p className="text-xs font-bold text-blue-900 dark:text-blue-300">Submission Received</p>
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-0.5">
              Your assignment deliverable was submitted on{' '}
              {new Date(submission.submittedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}{' '}
              and is currently awaiting evaluation by your teacher.
            </p>
          </div>
        </div>
      );
    }

    if (statusLower === 'due soon') {
      return (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center gap-3 animate-pulse">
          <Clock className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <p className="text-xs font-bold text-amber-900 dark:text-amber-300">Deadline Approaching Soon</p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
              This assignment is due within the next 48 hours. Ensure your deliverables are prepared on time.
            </p>
          </div>
        </div>
      );
    }

    if (statusLower === 'overdue') {
      return (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <p className="text-xs font-bold text-rose-900 dark:text-rose-300">Submission Past Deadline</p>
            <p className="text-xs text-rose-700 dark:text-rose-400 mt-0.5">
              The deadline for this coursework has passed. Please contact your instructor regarding late submission policies.
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/assignments"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Coursework List</span>
        </Link>

        <div>
          {submission ? (
            <Link
              to={`/assignments/${assignment._id}/submit`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-all shadow-sm"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{isOverdue ? 'View Submitted Deliverable' : 'Manage / Update Submission'}</span>
            </Link>
          ) : isOverdue ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>Submissions Closed</span>
            </span>
          ) : (
            <Link
              to={`/assignments/${assignment._id}/submit`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Submit Coursework Deliverable</span>
            </Link>
          )}
        </div>
      </div>

      {/* Dynamic Status Alert Banner */}
      {renderStatusBanner()}

      {/* Main Details Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Coursework Header */}
        <div className="space-y-3 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 text-xs font-bold border border-indigo-200 dark:border-indigo-900/60">
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
              <Calendar className="w-4 h-4 text-indigo-600" />
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
              <span className={`font-semibold ${isOverdue ? 'text-rose-500' : 'text-indigo-600'}`}>
                ({isOverdue ? 'Overdue' : 'Open'})
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Max Marks:</span>
              <strong className="text-slate-800 dark:text-slate-200">{maxMarksVal}</strong>
            </div>

            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-400" />
              <span>Faculty:</span>
              <strong className="text-slate-800 dark:text-slate-200">
                {assignment.teacherId?.fullName || 'Faculty Instructor'}
              </strong>
            </div>
          </div>
        </div>

        {/* Overview & Description */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Coursework Overview</h3>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {assignment.description}
          </p>
        </div>

        {/* Instructions */}
        {assignment.instructions && (
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Specific Instructions & Rubric
            </h3>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
              {assignment.instructions}
            </div>
          </div>
        )}

        {/* Reference Attachment */}
        {assignment.attachmentUrl && (
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Paperclip className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {assignment.attachmentName || 'Assignment Attachment Document'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Downloadable reference guidelines</p>
              </div>
            </div>
            <a
              href={assignment.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Download / View</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAssignmentDetailPage;
