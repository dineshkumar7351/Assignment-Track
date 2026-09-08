import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  FileText,
  ArrowLeft,
  Save,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Paperclip,
  BookOpen,
  Award,
  Layers,
  Flag,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';
import assignmentService from '../../services/assignmentService';
import useAuth from '../../hooks/useAuth';

const TeacherAssignmentFormPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [subjects, setSubjects] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    subjectId: '',
    deadline: '',
    maxMarks: 100,
    difficulty: 'medium',
    priority: 'medium',
    attachmentUrl: '',
    attachmentName: '',
  });

  // Fetch subjects on mount
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

  // If in Edit Mode, fetch existing assignment details
  useEffect(() => {
    if (!isEditMode) return;

    const fetchAssignment = async () => {
      setLoadingInitial(true);
      try {
        const res = await assignmentService.getAssignmentById(id);
        if (res.success && res.data) {
          const a = res.data;

          // Check if teacher owns this assignment
          const teacherOwnerId = a.teacherId?._id || a.teacherId;
          if (user?.role !== 'admin' && teacherOwnerId && teacherOwnerId !== user?._id) {
            setApiError('You are not authorized to edit this assignment because you did not create it.');
            setLoadingInitial(false);
            return;
          }

          // Format deadline to local datetime-local format (YYYY-MM-DDTHH:mm)
          let formattedDeadline = '';
          if (a.deadline) {
            const d = new Date(a.deadline);
            const offset = d.getTimezoneOffset() * 60000;
            const localISOTime = new Date(d.getTime() - offset).toISOString().slice(0, 16);
            formattedDeadline = localISOTime;
          }

          setFormData({
            title: a.title || '',
            description: a.description || '',
            instructions: a.instructions || '',
            subjectId: a.subjectId?._id || a.subjectId || '',
            deadline: formattedDeadline,
            maxMarks: a.maxMarks || 100,
            difficulty: a.difficulty || 'medium',
            priority: a.priority || 'medium',
            attachmentUrl: a.attachmentUrl || '',
            attachmentName: a.attachmentName || '',
          });
        }
      } catch (err) {
        setApiError(err.message || 'Failed to load assignment details');
      } finally {
        setLoadingInitial(false);
      }
    };

    fetchAssignment();
  }, [id, isEditMode, user]);

  // Validation function
  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.trim().length > 150) {
      errors.title = 'Title cannot exceed 150 characters';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    if (!formData.subjectId) {
      errors.subjectId = 'Subject selection is required';
    }

    if (!formData.deadline) {
      errors.deadline = 'Submission deadline is required';
    } else {
      const selectedTime = new Date(formData.deadline).getTime();
      if (!isEditMode && selectedTime <= Date.now()) {
        errors.deadline = 'Deadline must be set in the future';
      }
    }

    const marks = Number(formData.maxMarks);
    if (!marks || isNaN(marks) || marks <= 0) {
      errors.maxMarks = 'Max marks must be a positive number greater than 0';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field-specific error
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccessMsg('');

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        maxMarks: Number(formData.maxMarks),
        deadline: new Date(formData.deadline).toISOString(),
      };

      if (isEditMode) {
        const res = await assignmentService.updateAssignment(id, payload);
        if (res.success) {
          setSuccessMsg('Assignment updated successfully!');
          setTimeout(() => {
            navigate(`/teacher/assignments/${id}`);
          }, 1200);
        }
      } else {
        const res = await assignmentService.createAssignment(payload);
        if (res.success) {
          setSuccessMsg('Assignment created and published successfully!');
          setTimeout(() => {
            navigate('/teacher/assignments');
          }, 1200);
        }
      }
    } catch (err) {
      setApiError(err.message || `Failed to ${isEditMode ? 'update' : 'create'} assignment`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Loading assignment details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/teacher/assignments"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Assignments</span>
        </Link>
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        {/* Title Header */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>{isEditMode ? 'Edit Existing Coursework' : 'New Academic Assignment'}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {isEditMode ? 'Update Assignment' : 'Create Assignment'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isEditMode
              ? 'Modify instructions, deadline, or grading criteria for this assignment.'
              : 'Fill out the coursework details below to schedule and publish an assignment for your students.'}
          </p>
        </div>

        {/* Notifications */}
        {apiError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Assignment Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">
              Assignment Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Distributed Database Architecture & Sharding Benchmark"
              maxLength={150}
              className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border ${
                formErrors.title ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              } text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500`}
            />
            {formErrors.title && <p className="text-xs text-rose-500 mt-1.5">{formErrors.title}</p>}
            <p className="text-[11px] text-slate-400 mt-1 text-right">{formData.title.length} / 150 characters</p>
          </div>

          {/* Subject & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">
                Subject Course <span className="text-rose-500">*</span>
              </label>
              <select
                name="subjectId"
                value={formData.subjectId}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border ${
                  formErrors.subjectId ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                } text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500`}
              >
                <option value="">-- Select Subject Course --</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.code}) - {s.department}
                  </option>
                ))}
              </select>
              {formErrors.subjectId && <p className="text-xs text-rose-500 mt-1.5">{formErrors.subjectId}</p>}
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">
                Submission Deadline <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border ${
                  formErrors.deadline ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                } text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500`}
              />
              {formErrors.deadline && <p className="text-xs text-rose-500 mt-1.5">{formErrors.deadline}</p>}
            </div>
          </div>

          {/* Marks, Difficulty & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">
                Max Marks <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="maxMarks"
                min="1"
                max="1000"
                value={formData.maxMarks}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border ${
                  formErrors.maxMarks ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                } text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500`}
              />
              {formErrors.maxMarks && <p className="text-xs text-rose-500 mt-1.5">{formErrors.maxMarks}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">
                Difficulty Level
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">
                Priority Tier
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">
              Assignment Overview & Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a comprehensive summary of what this coursework covers..."
              className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border ${
                formErrors.description ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              } text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500`}
            />
            {formErrors.description && <p className="text-xs text-rose-500 mt-1.5">{formErrors.description}</p>}
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">
              Step-by-Step Instructions & Submission Guidelines (Optional)
            </label>
            <textarea
              name="instructions"
              rows={5}
              value={formData.instructions}
              onChange={handleChange}
              placeholder="1. Clone the repository...&#10;2. Implement unit tests...&#10;3. Submit code archive or PDF report..."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
            />
          </div>

          {/* Attachment Details */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
              <Paperclip className="w-4 h-4 text-emerald-600" />
              <span>Reference Material & Attachment URL (Optional)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Attachment Name
                </label>
                <input
                  type="text"
                  name="attachmentName"
                  value={formData.attachmentName}
                  onChange={handleChange}
                  placeholder="e.g. Lab_Manual_v2.pdf"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Attachment URL
                </label>
                <input
                  type="url"
                  name="attachmentUrl"
                  value={formData.attachmentUrl}
                  onChange={handleChange}
                  placeholder="https://storage.googleapis.com/... or Google Drive URL"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/teacher/assignments"
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-md hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>{isEditMode ? 'Update Assignment' : 'Create & Publish'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherAssignmentFormPage;
