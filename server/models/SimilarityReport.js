const mongoose = require('mongoose');

const similarityReportSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
      index: true,
    },
    submission1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission',
      required: true,
      index: true,
    },
    submission2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission',
      required: true,
      index: true,
    },
    student1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    student2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    similarityScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'very_high'],
      required: true,
      default: 'low',
    },
    commonPhrases: [
      {
        type: String,
      },
    ],
    calculatedAt: {
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

// Compound index to quickly find pairwise comparisons
similarityReportSchema.index({ submission1: 1, submission2: 1 }, { unique: true });
similarityReportSchema.index({ assignment: 1, similarityScore: -1 });

const SimilarityReport = mongoose.model('SimilarityReport', similarityReportSchema);

module.exports = SimilarityReport;
