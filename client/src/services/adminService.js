import api from './api';

export const adminService = {
  // User Governance
  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  toggleUserStatus: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/status`);
    return response.data;
  },

  // Subject Curriculum
  getSubjects: async () => {
    const response = await api.get('/admin/subjects');
    return response.data;
  },

  createSubject: async (subjectData) => {
    const response = await api.post('/admin/subjects', subjectData);
    return response.data;
  },

  updateSubject: async (id, subjectData) => {
    const response = await api.put(`/admin/subjects/${id}`, subjectData);
    return response.data;
  },

  deleteSubject: async (id) => {
    const response = await api.delete(`/admin/subjects/${id}`);
    return response.data;
  },

  // Assignments Oversight
  getAssignments: async () => {
    const response = await api.get('/admin/assignments');
    return response.data;
  },

  // Institutional Reports
  getReports: async () => {
    const response = await api.get('/admin/reports');
    return response.data;
  },
};

export default adminService;
