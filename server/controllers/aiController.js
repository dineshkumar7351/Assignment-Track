const aiService = require('../services/aiService');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

/**
 * @desc    Explain a topic conceptually
 * @route   POST /api/ai/explain
 * @access  Private (Student, Teacher, Admin)
 */
const explainTopic = async (req, res) => {
  try {
    const { topic, depth, subject } = req.body;
    if (!topic || !topic.trim()) {
      return res.status(400).json({ success: false, message: 'Topic is required' });
    }

    const result = await aiService.explainTopic({ topic, depth, subject });
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('AI explain error:', error);
    return res.status(500).json({ success: false, message: 'AI explanation error', error: error.message });
  }
};

/**
 * @desc    Generate progressive Socratic hints
 * @route   POST /api/ai/hints
 * @access  Private (Student, Teacher, Admin)
 */
const generateHints = async (req, res) => {
  try {
    const { question, assignmentTitle } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ success: false, message: 'Question/Problem text is required' });
    }

    const result = await aiService.generateHints({ question, assignmentTitle });
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('AI hints error:', error);
    return res.status(500).json({ success: false, message: 'AI hints error', error: error.message });
  }
};

/**
 * @desc    Generate interactive quiz
 * @route   POST /api/ai/quiz
 * @access  Private (Student, Teacher, Admin)
 */
const generateQuiz = async (req, res) => {
  try {
    const { topic, count, difficulty } = req.body;
    if (!topic || !topic.trim()) {
      return res.status(400).json({ success: false, message: 'Topic is required' });
    }

    const result = await aiService.generateQuiz({ topic, count: count || 4, difficulty });
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('AI quiz error:', error);
    return res.status(500).json({ success: false, message: 'AI quiz error', error: error.message });
  }
};

/**
 * @desc    Summarize notes & generate flashcards
 * @route   POST /api/ai/summarize
 * @access  Private (Student, Teacher, Admin)
 */
const summarizeNotes = async (req, res) => {
  try {
    const { text, format } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Notes text is required' });
    }

    const result = await aiService.summarizeNotes({ text, format });
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('AI summarize error:', error);
    return res.status(500).json({ success: false, message: 'AI summarize error', error: error.message });
  }
};

/**
 * @desc    Review student draft answer (Pedagogical feedback)
 * @route   POST /api/ai/review
 * @access  Private (Student, Teacher, Admin)
 */
const reviewAnswer = async (req, res) => {
  try {
    const { question, studentDraft } = req.body;
    if (!studentDraft || !studentDraft.trim()) {
      return res.status(400).json({ success: false, message: 'Draft answer text is required' });
    }

    const result = await aiService.reviewAnswer({ question: question || 'Assignment prompt', studentDraft });
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('AI review error:', error);
    return res.status(500).json({ success: false, message: 'AI review error', error: error.message });
  }
};

/**
 * @desc    Generate personalized AI study schedule
 * @route   POST /api/ai/planner
 * @access  Private (Student, Teacher, Admin)
 */
const generateStudyPlan = async (req, res) => {
  try {
    const user = req.user;
    const { dailyAvailableHours = 3 } = req.body;

    // Fetch user's pending assignments automatically
    let assignments = req.body.assignments;
    if (!assignments || assignments.length === 0) {
      const studentDept = user.department || 'Computer Science & Engineering';
      const deptPrefix = studentDept.split(/[\s,&]+/)[0];

      const allAss = await Assignment.find({
        status: 'published',
        $or: [
          { department: studentDept },
          { department: { $regex: new RegExp(`^${deptPrefix}`, 'i') } },
          { department: 'General' },
        ],
      })
        .populate('subjectId', 'name code')
        .lean();

      const userSubmissions = await Submission.find({ student: user._id }).select('assignment status');
      const submittedIds = new Set(userSubmissions.map((s) => s.assignment.toString()));

      assignments = allAss.filter((a) => !submittedIds.has(a._id.toString()));
    }

    const result = await aiService.generateStudyPlan({ assignments, dailyAvailableHours });
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('AI planner error:', error);
    return res.status(500).json({ success: false, message: 'AI study planner error', error: error.message });
  }
};

module.exports = {
  explainTopic,
  generateHints,
  generateQuiz,
  summarizeNotes,
  reviewAnswer,
  generateStudyPlan,
};
