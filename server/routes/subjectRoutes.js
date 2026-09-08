const express = require('express');
const router = express.Router();
const { getSubjects } = require('../controllers/subjectController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getSubjects);

module.exports = router;
