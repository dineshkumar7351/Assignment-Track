import api from './api';

/**
 * Service to manage assignments, subjects, and student submissions
 */
export const assignmentService = {
  /**
   * Fetch assignments with optional search, filters, and sort options
   * @param {Object} params - { search, subjectId, priority, difficulty, status, sortBy, myAssignments }
   */
  getAssignments: async (params = {}) => {
    const response = await api.get('/assignments', { params });
    return response.data;
  },

  /**
   * Fetch single assignment details by ID
   * @param {string} id - Assignment ObjectId
   */
  getAssignmentById: async (id) => {
    const response = await api.get(`/assignments/${id}`);
    return response.data;
  },

  /**
   * Create a new assignment (Teacher/Admin)
   * @param {Object} data - Assignment payload
   */
  createAssignment: async (data) => {
    const response = await api.post('/assignments', data);
    return response.data;
  },

  /**
   * Update an existing assignment (Teacher owner/Admin)
   * @param {string} id - Assignment ObjectId
   * @param {Object} data - Updated fields
   */
  updateAssignment: async (id, data) => {
    const response = await api.put(`/assignments/${id}`, data);
    return response.data;
  },

  /**
   * Delete an assignment (Teacher owner/Admin)
   * @param {string} id - Assignment ObjectId
   */
  deleteAssignment: async (id) => {
    const response = await api.delete(`/assignments/${id}`);
    return response.data;
  },

  /**
   * Fetch all active academic subjects for dropdowns and filtering
   */
  getSubjects: async () => {
    const response = await api.get('/subjects');
    return response.data;
  },

  /**
   * Submit coursework deliverable (Multipart FormData)
   * @param {string} assignmentId
   * @param {FormData} formData - Contains 'file' and optional 'comment'
   */
  submitAssignment: async (assignmentId, formData) => {
    const response = await api.post(`/submissions/${assignmentId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get student's submission and version history for an assignment
   * @param {string} assignmentId
   */
  getAssignmentSubmission: async (assignmentId) => {
    const response = await api.get(`/submissions/assignment/${assignmentId}`);
    return response.data;
  },

  /**
   * Get submissions for teacher's coursework
   * @param {Object} params - { assignmentId, status, search }
   */
  getTeacherSubmissions: async (params = {}) => {
    const response = await api.get('/submissions/teacher', { params });
    return response.data;
  },

  /**
   * Get single submission by ID with versions
   * @param {string} id
   */
  getSubmissionById: async (id) => {
    const response = await api.get(`/submissions/${id}`);
    return response.data;
  },
};

export default assignmentService;
