const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema(
  {
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission',
      required: [true, 'Submission reference is required'],
      unique: true,
    },
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission',
    },
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
    evaluator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Evaluator (Teacher) reference is required'],
    },
    evaluatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    marks: {
      type: Number,
      required: [true, 'Obtained marks are required'],
      min: [0, 'Marks cannot be negative'],
    },
    maxMarks: {
      type: Number,
      default: 100,
      min: [1, 'Max marks must be at least 1'],
    },
    feedback: {
      type: String,
      default: '',
      trim: true,
    },
    isLate: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['graded', 're-evaluated', 'pending'],
      default: 'graded',
    },
    evaluatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Synchronize duplicated ID fields for compatibility
evaluationSchema.pre('save', function (next) {
  if (this.submission && !this.submissionId) this.submissionId = this.submission;
  if (this.assignment && !this.assignmentId) this.assignmentId = this.assignment;
  if (this.student && !this.studentId) this.studentId = this.student;
  if (this.evaluator && !this.evaluatorId) this.evaluatorId = this.evaluator;
  next();
});

// Compound indexes
evaluationSchema.index({ assignment: 1, student: 1 });
evaluationSchema.index({ evaluator: 1 });
evaluationSchema.index({ evaluatedAt: -1 });

const Evaluation = mongoose.model('Evaluation', evaluationSchema);

module.exports = Evaluation;
