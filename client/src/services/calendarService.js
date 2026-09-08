import api from './api';

export const calendarService = {
  /**
   * Get calendar monthly assignment deadlines and color-coded statuses
   * @param {Object} params - { month, year }
   */
  getCalendarEvents: async (params = {}) => {
    const response = await api.get('/calendar', { params });
    return response.data;
  },
};

export default calendarService;
