const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  explainTopic,
  generateHints,
  generateQuiz,
  summarizeNotes,
  reviewAnswer,
  generateStudyPlan,
} = require('../controllers/aiController');

// All AI endpoints are protected for authenticated users
router.use(protect);

router.post('/explain', explainTopic);
router.post('/hints', generateHints);
router.post('/quiz', generateQuiz);
router.post('/summarize', summarizeNotes);
router.post('/review', reviewAnswer);
router.post('/planner', generateStudyPlan);

module.exports = router;
