import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Paperclip,
  Download,
  Calendar,
  Award,
  RefreshCw,
  History,
  Send,
  X,
  File,
  MessageSquare,
} from 'lucide-react';
import assignmentService from '../../services/assignmentService';

const StudentSubmitPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [comment, setComment] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Allowed file extensions
  const ALLOWED_EXTENSIONS = ['pdf', 'docx', 'pptx', 'txt', 'doc', 'ppt'];
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch assignment details
      const assignRes = await assignmentService.getAssignmentById(id);
      if (assignRes.success && assignRes.data) {
        setAssignment(assignRes.data);
      }

      // 2. Fetch existing submission + versions
      const subRes = await assignmentService.getAssignmentSubmission(id);
      if (subRes.success && subRes.data) {
        setSubmission(subRes.data);
        setVersions(subRes.data.versions || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load assignment or submission data');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // File validation helper
  const handleFileValidation = (file) => {
    setFileError('');
    if (!file) return false;

    const ext = file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setFileError(`Invalid file format ".${ext}". Please upload PDF, DOCX, PPTX, or TXT.`);
      setSelectedFile(null);
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError(`File size exceeds 10MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`);
      setSelectedFile(null);
      return false;
    }

    setSelectedFile(file);
    return true;
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileValidation(e.target.files[0]);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileValidation(e.dataTransfer.files[0]);
    }
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!selectedFile) {
      setFileError('Please select a file to submit');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('comment', comment.trim());

    setSubmitting(true);
    try {
      const res = await assignmentService.submitAssignment(id, formData);
      if (res.success) {
        setSuccessMsg(res.message || 'Assignment submitted successfully!');
        setSelectedFile(null);
        setComment('');
        // Reload submission and version history
        await loadData();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  // Resolve file URL for download/preview
  const getFileDownloadUrl = (url) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Local upload served by backend
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return `${apiBase.replace(/\/api$/, '')}${url}`;
  };

  if (loading) {
    return (
      <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Loading submission portal...</p>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Assignment Not Found</h2>
        <Link
          to="/assignments"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Assignments</span>
        </Link>
      </div>
    );
  }

  const deadlineDate = new Date(assignment.deadline);
  const isOverdue = deadlineDate < new Date();
  const currentVersionNum = submission?.version || 0;
  const nextVersionNum = currentVersionNum + 1;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link
          to={`/assignments/${id}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Assignment Details</span>
        </Link>
      </div>

      {/* Assignment Summary Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 text-xs font-bold border border-indigo-200 dark:border-indigo-900/60">
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

        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Submit: {assignment.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400 pt-1">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>
              Deadline:{' '}
              <strong className="text-slate-800 dark:text-slate-200">
                {deadlineDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-600" />
            <span>Max Marks:</span>
            <strong className="text-slate-800 dark:text-slate-200">{assignment.totalMarks || assignment.maxMarks}</strong>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className={`font-semibold ${isOverdue ? 'text-rose-500' : 'text-emerald-600'}`}>
              {isOverdue ? 'Deadline has Passed' : 'Open for Submissions'}
            </span>
          </div>
        </div>
      </div>

      {/* Evaluation Results Card (If already graded by faculty) */}
      {submission && submission.status === 'graded' && submission.obtainedMarks !== null && submission.obtainedMarks !== undefined && (
        <div className="p-5 rounded-3xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  Evaluated Deliverable
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Score: <strong>{submission.obtainedMarks} / {assignment.totalMarks || assignment.maxMarks || 100} Marks</strong>
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-xl bg-emerald-600 text-white text-xs font-black shrink-0">
              {Math.round((submission.obtainedMarks / (assignment.totalMarks || assignment.maxMarks || 100)) * 100)}%
            </span>
          </div>

          {submission.feedback && (
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/60 flex items-start gap-2.5 text-xs">
              <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Faculty Feedback: </span>
                <span className="text-slate-700 dark:text-slate-300 italic">"{submission.feedback}"</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Deadline Overdue Warning Alert */}
      {isOverdue && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs sm:text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <p className="font-bold">Submissions Closed</p>
            <p className="text-xs text-rose-700 dark:text-rose-400 mt-0.5">
              The submission deadline for this assignment has expired. Further uploads and resubmissions are blocked.
            </p>
          </div>
        </div>
      )}

      {/* Action Notification Alerts */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Submission Card */}
      {!isOverdue && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 text-xs font-semibold mb-2">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>
                {submission ? `Update Deliverable (Will become Version ${nextVersionNum})` : 'New Submission (Version 1)'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {submission ? 'Upload Revised Deliverable' : 'Upload Assignment Deliverable'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Supported formats: <strong>PDF, DOCX, PPTX, TXT</strong> (Maximum file size: 10MB).
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Drag & Drop File Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 scale-[1.01]'
                  : selectedFile
                  ? 'border-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20'
                  : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 bg-slate-50/50 dark:bg-slate-800/40'
              }`}
            >
              <input
                type="file"
                id="file-upload-input"
                accept=".pdf,.docx,.pptx,.txt,.doc,.ppt"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              {selectedFile ? (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <FileText className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-md mx-auto">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    className="inline-flex items-center gap-1 text-xs text-rose-600 font-semibold hover:underline mt-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Remove file</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2 pointer-events-none">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Drag and drop your file here, or{' '}
                    <span className="text-indigo-600 dark:text-indigo-400 underline">browse</span>
                  </p>
                  <p className="text-xs text-slate-400">PDF, DOCX, PPTX, or TXT up to 10MB</p>
                </div>
              )}
            </div>

            {fileError && <p className="text-xs text-rose-500 font-medium">{fileError}</p>}

            {/* Submission Comment */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Submission Notes or Comments (Optional)
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="e.g. Added section 4 experimental analysis, verified convergence graph on epoch 50..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Submit CTA */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting || !selectedFile}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-md hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading Deliverable...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {submission ? `Submit Revision (Version ${nextVersionNum})` : 'Submit Deliverable'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Version History Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Submission Version History
            </h2>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {versions.length} {versions.length === 1 ? 'Version' : 'Versions'} Recorded
          </span>
        </div>

        {versions.length === 0 ? (
          <div className="py-10 text-center">
            <FileText className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No submissions uploaded yet</p>
            <p className="text-xs text-slate-500 mt-1">
              When you upload a deliverable, all historical iterations will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {versions.map((ver) => (
              <div
                key={ver._id}
                className={`p-4 rounded-2xl border transition-all ${
                  ver.isCurrent
                    ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/20 dark:bg-emerald-950/10'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                        Version {ver.version}
                      </span>

                      {ver.isCurrent ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                          Current / Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium uppercase bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                          Historical Revision
                        </span>
                      )}

                      <span className="text-xs uppercase font-bold text-slate-400">
                        {ver.fileType}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {ver.fileName}
                    </p>

                    {ver.comment && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                        "{ver.comment}"
                      </p>
                    )}

                    <p className="text-[11px] text-slate-400">
                      Uploaded on{' '}
                      {new Date(ver.submittedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {/* Download link button */}
                  <a
                    href={getFileDownloadUrl(ver.fileUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      ver.isCurrent
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                    }`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download File</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSubmitPage;
