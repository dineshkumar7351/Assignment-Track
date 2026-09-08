const mongoose = require('mongoose');

const submissionVersionSchema = new mongoose.Schema(
  {
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission',
      required: [true, 'Submission ID reference is required'],
      index: true,
    },
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: [true, 'Assignment reference is required'],
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required'],
      index: true,
    },
    version: {
      type: Number,
      required: [true, 'Version number is required'],
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
    },
    fileType: {
      type: String,
      default: '',
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    comment: {
      type: String,
      default: '',
      trim: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    isCurrent: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to guarantee unique version per submission
submissionVersionSchema.index({ submissionId: 1, version: 1 }, { unique: true });

const SubmissionVersion = mongoose.model('SubmissionVersion', submissionVersionSchema);

module.exports = SubmissionVersion;
