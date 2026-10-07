const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address',
      ],
    },
    clerkId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.clerkId;
      },
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
      type: String,
      enum: {
        values: ['student', 'teacher', 'admin'],
        message: '{VALUE} is not a valid role',
      },
      default: 'student',
    },
    department: {
      type: String,
      trim: true,
      default: '',
    },
    studentId: {
      type: String,
      trim: true,
      sparse: true,
      default: undefined,
    },
    employeeId: {
      type: String,
      trim: true,
      sparse: true,
      default: undefined,
    },
    profileImage: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    bio: {
      type: String,
      trim: true,
      default: '',
    },
    semester: {
      type: String,
      trim: true,
      default: '',
    },
    academicBatch: {
      type: String,
      trim: true,
      default: '',
    },
    branch: {
      type: String,
      trim: true,
      default: '',
    },
    section: {
      type: String,
      trim: true,
      default: '',
    },
    githubUrl: {
      type: String,
      trim: true,
      default: '',
    },
    linkedinUrl: {
      type: String,
      trim: true,
      default: '',
    },
    websiteUrl: {
      type: String,
      trim: true,
      default: '',
    },
    preferences: {
      theme: { type: String, default: 'light' },
      accentColor: { type: String, default: 'emerald' },
      defaultView: { type: String, default: 'kanban' },
      timeFormat: { type: String, default: '12h' },
      dateFormat: { type: String, default: 'DD/MM/YYYY' },
      density: { type: String, default: 'comfortable' },
    },
    notificationPreferences: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      deadline48h: { type: Boolean, default: true },
      deadline24h: { type: Boolean, default: true },
      deadline2h: { type: Boolean, default: true },
      gradeReleased: { type: Boolean, default: true },
      teacherFeedback: { type: Boolean, default: true },
      announcements: { type: Boolean, default: true },
      quietHoursEnabled: { type: Boolean, default: false },
      quietHoursStart: { type: String, default: '22:00' },
      quietHoursEnd: { type: String, default: '07:00' },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt before saving
userSchema.pre('save', async function (next) {
  if (!this.password || !this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare user-entered password with hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
