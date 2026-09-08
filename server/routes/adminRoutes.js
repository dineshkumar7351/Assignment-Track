const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getAllUsers,
  toggleUserStatus,
  getAllSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  getCampusAssignments,
  getInstitutionalReports,
} = require('../controllers/adminController');

// All Admin routes require Admin authentication
router.use(protect, authorize('admin'));

// User Governance
router.get('/users', getAllUsers);
router.put('/users/:id/status', toggleUserStatus);

// Subject Curriculum
router.get('/subjects', getAllSubjects);
router.post('/subjects', createSubject);
router.put('/subjects/:id', updateSubject);
router.delete('/subjects/:id', deleteSubject);

// Coursework Oversight
router.get('/assignments', getCampusAssignments);

// Institutional Reports
router.get('/reports', getInstitutionalReports);

module.exports = router;
