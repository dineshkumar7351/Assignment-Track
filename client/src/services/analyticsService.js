import api from './api';

export const analyticsService = {
  // Get student analytics (KPIs, Academic Health Score, Deadline Risk, Recommendations, Charts)
  getStudentAnalytics: async () => {
    const response = await api.get('/analytics/student');
    return response.data;
  },

  // Get teacher analytics (Cohort stats, Grade distribution, Assignment matrix, Similarity stats)
  getTeacherAnalytics: async () => {
    const response = await api.get('/analytics/teacher');
    return response.data;
  },

  // Get standalone "What Should I Do Now?" recommendation
  getRecommendation: async () => {
    const response = await api.get('/analytics/recommendation');
    return response.data;
  },
};

export default analyticsService;
