const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: [true, 'Assignment reference is required'],
    },
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required'],
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    fileUrl: {
      type: String,
      default: '',
    },
    fileName: {
      type: String,
      default: '',
    },
    fileType: {
      type: String,
      default: '',
    },
    version: {
      type: Number,
      default: 1,
    },
    comment: {
      type: String,
      default: '',
      trim: true,
    },
    content: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['submitted', 'graded', 'late', 'resubmitted'],
      default: 'submitted',
    },
    obtainedMarks: {
      type: Number,
      min: 0,
      default: null,
    },
    feedback: {
      type: String,
      default: '',
    },
    similarityScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    similarityStatus: {
      type: String,
      enum: ['low', 'medium', 'high', 'very_high', 'clean', 'moderate'],
      default: 'low',
    },
    highestSimilarSubmission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission',
      default: null,
    },
    matchedStudent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    gradedAt: {
      type: Date,
      default: null,
    },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Synchronize assignmentId and studentId before saving
submissionSchema.pre('save', function (next) {
  if (this.assignment && !this.assignmentId) {
    this.assignmentId = this.assignment;
  }
  if (this.student && !this.studentId) {
    this.studentId = this.student;
  }
  next();
});

// Prevent duplicate submissions per student-assignment pair
submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });
submissionSchema.index({ assignmentId: 1, studentId: 1 });

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
