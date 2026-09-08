const Notification = require('../models/Notification');
const User = require('../models/User');

class NotificationService {
  /**
   * Helper to create a single notification record
   */
  async createNotification({ userId, title, message, type = 'system', relatedId = null, actionUrl = '' }) {
    try {
      if (!userId) return null;
      return await Notification.create({
        userId,
        title,
        message,
        type,
        relatedId,
        actionUrl,
        isRead: false,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('Error creating notification:', error.message);
      return null;
    }
  }

  /**
   * 1. New Assignment Published -> Notify students in the target department
   */
  async notifyNewAssignment(assignment) {
    try {
      if (!assignment) return;
      const dept = assignment.department || 'General';
      const deptPrefix = dept.split(/[\s,&]+/)[0];

      const studentQuery = {
        role: 'student',
        $or: [
          { department: dept },
          { department: { $regex: new RegExp(`^${deptPrefix}`, 'i') } },
          { department: 'General' },
        ],
      };

      const students = await User.find(studentQuery).select('_id');
      if (students.length === 0) return;

      const deadlineStr = new Date(assignment.deadline).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      const docs = students.map((s) => ({
        userId: s._id,
        title: `New Assignment: ${assignment.title}`,
        message: `A new coursework assignment for "${assignment.subject || 'Coursework'}" has been published. Due on ${deadlineStr}.`,
        type: 'new_assignment',
        relatedId: assignment._id,
        actionUrl: `/assignments/${assignment._id}`,
        isRead: false,
        createdAt: new Date(),
      }));

      await Notification.insertMany(docs);
    } catch (error) {
      console.error('Error notifying new assignment:', error.message);
    }
  }

  /**
   * 2. Deadline Changed -> Notify enrolled students in department
   */
  async notifyDeadlineChanged(assignment, oldDeadline = null) {
    try {
      if (!assignment) return;
      const dept = assignment.department || 'General';
      const deptPrefix = dept.split(/[\s,&]+/)[0];

      const students = await User.find({
        role: 'student',
        $or: [
          { department: dept },
          { department: { $regex: new RegExp(`^${deptPrefix}`, 'i') } },
          { department: 'General' },
        ],
      }).select('_id');

      if (students.length === 0) return;

      const newDateStr = new Date(assignment.deadline).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const docs = students.map((s) => ({
        userId: s._id,
        title: `Deadline Updated: ${assignment.title}`,
        message: `The deadline for "${assignment.title}" has been updated to ${newDateStr}.`,
        type: 'deadline_changed',
        relatedId: assignment._id,
        actionUrl: `/assignments/${assignment._id}`,
        isRead: false,
        createdAt: new Date(),
      }));

      await Notification.insertMany(docs);
    } catch (error) {
      console.error('Error notifying deadline change:', error.message);
    }
  }

  /**
   * 3. Submission Successful -> Notify submitting student & assignment instructor
   */
  async notifySubmissionSuccess(submission, assignment, student) {
    try {
      if (!submission || !assignment) return;

      // Student confirmation notification
      await this.createNotification({
        userId: student?._id || submission.student,
        title: `Submission Received: ${assignment.title}`,
        message: `Your deliverable (Version ${submission.version || 1}) has been successfully submitted and logged.`,
        type: 'submission_success',
        relatedId: assignment._id,
        actionUrl: `/assignments/${assignment._id}`,
      });

      // Faculty instructor notification
      const teacherId = assignment.teacherId?._id || assignment.teacherId || assignment.teacher;
      if (teacherId) {
        await this.createNotification({
          userId: teacherId,
          title: `New Deliverable Submitted`,
          message: `${student?.fullName || 'A student'} submitted Version ${submission.version || 1} for "${assignment.title}".`,
          type: 'submission_success',
          relatedId: submission._id,
          actionUrl: `/teacher/submissions`,
        });
      }
    } catch (error) {
      console.error('Error notifying submission success:', error.message);
    }
  }

  /**
   * 4. Evaluation Completed & Feedback Added -> Notify student
   */
  async notifyEvaluationCompleted(evaluation, assignment, student) {
    try {
      if (!evaluation || !assignment) return;

      const studentId = student?._id || evaluation.student;
      const maxMarks = evaluation.maxMarks || assignment.maxMarks || assignment.totalMarks || 100;

      await this.createNotification({
        userId: studentId,
        title: `Evaluation Completed: ${assignment.title}`,
        message: `Your deliverable has been graded: ${evaluation.marks}/${maxMarks} Marks.${
          evaluation.feedback ? ` Feedback: "${evaluation.feedback}"` : ''
        }`,
        type: 'evaluation_completed',
        relatedId: assignment._id,
        actionUrl: `/assignments/${assignment._id}`,
      });

      if (evaluation.feedback) {
        await this.createNotification({
          userId: studentId,
          title: `Feedback Added: ${assignment.title}`,
          message: `Faculty provided feedback: "${evaluation.feedback}"`,
          type: 'feedback_added',
          relatedId: assignment._id,
          actionUrl: `/assignments/${assignment._id}`,
        });
      }
    } catch (error) {
      console.error('Error notifying evaluation completed:', error.message);
    }
  }

  /**
   * 5. High Textual Similarity Detected -> Notify faculty
   */
  async notifyHighSimilarity(report, assignment, teacherId) {
    try {
      if (!teacherId || !assignment || !report) return;

      await this.createNotification({
        userId: teacherId,
        title: `High Textual Similarity Detected (${report.similarityScore}%)`,
        message: `Potential high textual overlap (${report.similarityScore}%) detected for "${assignment.title}". Review comparison.`,
        type: 'high_similarity',
        relatedId: report._id,
        actionUrl: `/teacher/plagiarism/compare/${report.submission1}/${report.submission2}`,
      });
    } catch (error) {
      console.error('Error notifying high similarity:', error.message);
    }
  }

  /**
   * 6. Check and notify due soon / overdue assignments for a student
   */
  async checkAndNotifyDueSoonAndOverdue(studentId) {
    try {
      const student = await User.findById(studentId);
      if (!student || student.role !== 'student') return;

      const dept = student.department || 'General';
      const deptPrefix = dept.split(/[\s,&]+/)[0];
      const now = new Date();
      const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);

      const Assignment = require('../models/Assignment');
      const Submission = require('../models/Submission');

      const assignments = await Assignment.find({
        status: 'published',
        $or: [
          { department: dept },
          { department: { $regex: new RegExp(`^${deptPrefix}`, 'i') } },
          { department: 'General' },
        ],
      }).lean();

      const submissions = await Submission.find({
        $or: [{ student: studentId }, { studentId: studentId }],
      }).lean();

      const submittedMap = new Set(submissions.map((s) => (s.assignment || s.assignmentId).toString()));

      for (const assign of assignments) {
        const hasSubmitted = submittedMap.has(assign._id.toString());
        if (hasSubmitted) continue;

        const deadline = new Date(assign.deadline);

        // Due soon (within 48 hours and not past deadline)
        if (deadline > now && deadline <= in48Hours) {
          const existing = await Notification.findOne({
            userId: studentId,
            relatedId: assign._id,
            type: 'due_soon',
            createdAt: { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
          });

          if (!existing) {
            await this.createNotification({
              userId: studentId,
              title: `Due Soon: ${assign.title}`,
              message: `Coursework is due in less than 48 hours (${deadline.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}).`,
              type: 'due_soon',
              relatedId: assign._id,
              actionUrl: `/assignments/${assign._id}/submit`,
            });
          }
        }

        // Overdue (past deadline by up to 7 days)
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (deadline < now && deadline >= sevenDaysAgo) {
          const existing = await Notification.findOne({
            userId: studentId,
            relatedId: assign._id,
            type: 'overdue',
            createdAt: { $gte: new Date(now.getTime() - 48 * 60 * 60 * 1000) },
          });

          if (!existing) {
            await this.createNotification({
              userId: studentId,
              title: `Overdue Assignment: ${assign.title}`,
              message: `The deadline for "${assign.title}" has passed.`,
              type: 'overdue',
              relatedId: assign._id,
              actionUrl: `/assignments/${assign._id}`,
            });
          }
        }
      }
    } catch (error) {
      console.error('Error checking due soon / overdue notifications:', error.message);
    }
  }
}

module.exports = new NotificationService();
