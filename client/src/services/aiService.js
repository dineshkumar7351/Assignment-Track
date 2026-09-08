import api from './api';

export const aiService = {
  // 1. Explain a topic conceptually
  explainTopic: async (topic, depth = 'intermediate', subject = 'General Science') => {
    const response = await api.post('/ai/explain', { topic, depth, subject });
    return response.data;
  },

  // 2. Generate progressive Socratic hints
  generateHints: async (question, assignmentTitle) => {
    const response = await api.post('/ai/hints', { question, assignmentTitle });
    return response.data;
  },

  // 3. Generate interactive quiz
  generateQuiz: async (topic, count = 4, difficulty = 'medium') => {
    const response = await api.post('/ai/quiz', { topic, count, difficulty });
    return response.data;
  },

  // 4. Summarize study notes
  summarizeNotes: async (text, format = 'structured') => {
    const response = await api.post('/ai/summarize', { text, format });
    return response.data;
  },

  // 5. Review draft answer (Pedagogical feedback)
  reviewAnswer: async (question, studentDraft) => {
    const response = await api.post('/ai/review', { question, studentDraft });
    return response.data;
  },

  // 6. Generate AI personalized study schedule
  generateStudyPlan: async (dailyAvailableHours = 3, assignments = null) => {
    const response = await api.post('/ai/planner', { dailyAvailableHours, assignments });
    return response.data;
  },
};

export default aiService;
