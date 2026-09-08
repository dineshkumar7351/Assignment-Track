const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Assignment title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Assignment description is required'],
      trim: true,
    },
    instructions: {
      type: String,
      trim: true,
      default: '',
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      default: null,
    },
    subject: {
      type: String,
      default: '',
      trim: true,
    },
    department: {
      type: String,
      default: 'Computer Science & Engineering',
      trim: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Teacher reference is required'],
    },
    deadline: {
      type: Date,
      required: [true, 'Submission deadline is required'],
    },
    maxMarks: {
      type: Number,
      required: [true, 'Max marks are required'],
      min: [1, 'Marks must be at least 1'],
      default: 100,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    attachmentUrl: {
      type: String,
      default: '',
      trim: true,
    },
    attachmentName: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for totalMarks alias
assignmentSchema.virtual('totalMarks').get(function () {
  return this.maxMarks;
});

// Virtual populate for 'teacher'
assignmentSchema.virtual('teacher', {
  ref: 'User',
  localField: 'teacherId',
  foreignField: '_id',
  justOne: true,
});

// Indexes for high performance querying
assignmentSchema.index({ department: 1, status: 1, deadline: 1 });
assignmentSchema.index({ teacherId: 1, createdAt: -1 });
assignmentSchema.index({ subjectId: 1 });

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
