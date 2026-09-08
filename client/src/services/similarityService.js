import api from './api';

/**
 * Service to manage Textual Similarity Detection operations
 */
export const similarityService = {
  /**
   * Fetch similarity metrics and submission risk records for teacher's coursework
   * @param {Object} params - { assignmentId, risk, search }
   */
  getTeacherSimilarityOverview: async (params = {}) => {
    const response = await api.get('/similarity/teacher', { params });
    return response.data;
  },

  /**
   * Fetch side-by-side comparison for two student submissions
   * @param {string} id1 - Submission ID 1
   * @param {string} id2 - Submission ID 2
   */
  compareSubmissions: async (id1, id2) => {
    const response = await api.get(`/similarity/compare/${id1}/${id2}`);
    return response.data;
  },

  /**
   * Force on-demand batch similarity calculation for an assignment cohort
   * @param {string} assignmentId
   */
  scanAssignmentSimilarity: async (assignmentId) => {
    const response = await api.post(`/similarity/scan/${assignmentId}`);
    return response.data;
  },
};

export default similarityService;
