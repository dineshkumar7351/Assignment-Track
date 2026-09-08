import api from './api';

/**
 * Service to manage teacher evaluation and student feedback
 */
export const evaluationService = {
  /**
   * Submit evaluation / marks and feedback for a submission
   * @param {Object} data - { submissionId, marks, feedback }
   */
  createEvaluation: async (data) => {
    const response = await api.post('/evaluations', data);
    return response.data;
  },

  /**
   * Update an existing evaluation record
   * @param {string} id - Evaluation ID or submission ID
   * @param {Object} data - { marks, feedback }
   */
  updateEvaluation: async (id, data) => {
    const response = await api.put(`/evaluations/${id}`, data);
    return response.data;
  },

  /**
   * Get evaluation details for a specific submission ID
   * @param {string} submissionId
   */
  getEvaluationBySubmissionId: async (submissionId) => {
    const response = await api.get(`/evaluations/${submissionId}`);
    return response.data;
  },
};

export default evaluationService;
