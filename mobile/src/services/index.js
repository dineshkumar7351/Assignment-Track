import api from '../config/api';

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (payload) => {
    const res = await api.post('/auth/register', payload);
    return res.data;
  },
  getCurrentUser: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};

export const assignmentService = {
  getAssignments: async (params = {}) => {
    const res = await api.get('/assignments', { params });
    return res.data;
  },
  getAssignmentById: async (id) => {
    const res = await api.get(`/assignments/${id}`);
    return res.data;
  },
};

export const calendarService = {
  getCalendarEvents: async (month, year) => {
    const res = await api.get('/calendar', { params: { month, year } });
    return res.data;
  },
};

export const notificationService = {
  getNotifications: async (limit = 50) => {
    const res = await api.get(`/notifications?limit=${limit}`);
    return res.data;
  },
  markAllAsRead: async () => {
    const res = await api.patch('/notifications/read-all');
    return res.data;
  },
};

export const analyticsService = {
  getStudentAnalytics: async () => {
    const res = await api.get('/analytics/student');
    return res.data;
  },
  getTeacherAnalytics: async () => {
    const res = await api.get('/analytics/teacher');
    return res.data;
  },
};

export const aiService = {
  explainTopic: async (topic, subject, depth = 'intermediate') => {
    const res = await api.post('/ai/explain-topic', { topic, subject, depth });
    return res.data;
  },
  generateHints: async (questionText, assignmentTitle) => {
    const res = await api.post('/ai/generate-hints', { questionText, assignmentTitle });
    return res.data;
  },
  generateQuiz: async (topic, difficulty = 'medium') => {
    const res = await api.post('/ai/generate-quiz', { topic, difficulty });
    return res.data;
  },
};

export default {
  authService,
  assignmentService,
  calendarService,
  notificationService,
  analyticsService,
  aiService,
};
