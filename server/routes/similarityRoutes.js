const express = require('express');
const router = express.Router();
const {
  getTeacherSimilarityOverview,
  compareSubmissions,
  scanAssignmentSimilarity,
} = require('../controllers/similarityController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All similarity routes are protected for Faculty (Teacher) and Admins only
router.use(protect);
router.use(authorize('teacher', 'admin'));

// GET /api/similarity/teacher - Overview metrics and submissions list
router.get('/teacher', getTeacherSimilarityOverview);

// GET /api/similarity/compare/:id1/:id2 - Side-by-side comparison between two submissions
router.get('/compare/:id1/:id2', compareSubmissions);

// POST /api/similarity/scan/:assignmentId - Force batch similarity scan for assignment cohort
router.post('/scan/:assignmentId', scanAssignmentSimilarity);

module.exports = router;
