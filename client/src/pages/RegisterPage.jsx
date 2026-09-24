import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  ArrowLeft,
  UserPlus,
  User,
  Mail,
  Lock,
  Building2,
  BadgeCheck,
  LogOut,
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { ClerkSignUpCard } from '../components/ClerkAuthCard';

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical & Electronics',
  'Business Administration',
  'Mathematics & Natural Sciences',
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, user, logout, isClerkActive } = useAuth();
  const [showClerkForm, setShowClerkForm] = useState(false);

  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    department: '',
    studentId: '',
    employeeId: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email format';
    }

    if (!formData.department) {
      newErrors.department = 'Please select your department';
    }

    if (role === 'student' && !formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    }

    if (role === 'teacher' && !formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setLoading(true);

    const payload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      role,
      department: formData.department,
      ...(role === 'student'
        ? { studentId: formData.studentId.trim() }
        : { employeeId: formData.employeeId.trim() }),
    };

    const result = await register(payload);
    setLoading(false);

    if (result.success) {
      navigate(role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
    } else {
      setServerError(result.message);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Glow orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[320px] bg-purple-500/15 dark:bg-purple-600/20 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 group mb-6 hover:scale-105 transition-transform">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
            Smart Assignment Tracker
          </span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Create an Account
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
          Register to manage your academic assignments and coursework
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        {/* Active Session Notice Banner */}
        {user && (
          <div className="mb-4 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between shadow-xs">
            <div>
              <p className="font-bold text-indigo-700 dark:text-indigo-300">Signed in as: {user.fullName}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">{user.role} Account</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors shadow-xs"
              >
                Go to Dashboard
              </Link>
              <button
                type="button"
                onClick={logout}
                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/40"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {isClerkActive && showClerkForm ? (
          <div className="glass-card py-6 px-4 shadow-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 transition-colors">
            <ClerkSignUpCard fallbackToggle={() => setShowClerkForm(false)} />
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setShowClerkForm(false)}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
              >
                ← Back to Direct Registration Form
              </button>
            </div>
          </div>
        ) : (
          <div className="glass-card py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 transition-colors">
            {/* Server error alert */}
            {serverError && (
              <Alert
                type="error"
                message={serverError}
                onClose={() => setServerError('')}
                className="mb-6"
              />
            )}

            {/* Role selector buttons */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Registration Role
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                <button
                  type="button"
                  onClick={() => {
                    setRole('student');
                    setErrors({});
                  }}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    role === 'student'
                      ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  🎓 Student
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole('teacher');
                    setErrors({});
                  }}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    role === 'teacher'
                      ? 'bg-white dark:bg-emerald-600 text-emerald-600 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  👨‍🏫 Teacher / Faculty
                </button>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <Input
                id="fullName"
                name="fullName"
                label="Full Name"
                placeholder={role === 'student' ? 'e.g. Alex Johnson' : 'e.g. Dr. Robert Miller'}
                icon={User}
                required
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
              />

              <Input
                id="email"
                name="email"
                type="email"
                label="Academic Email"
                placeholder={role === 'student' ? 'student@college.edu' : 'faculty@college.edu'}
                icon={Mail}
                required
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />

              <Select
                id="department"
                name="department"
                label="Department"
                placeholder="Select your academic department"
                icon={Building2}
                required
                options={DEPARTMENTS}
                value={formData.department}
                onChange={handleChange}
                error={errors.department}
              />

              {role === 'student' ? (
                <Input
                  id="studentId"
                  name="studentId"
                  label="Student ID"
                  placeholder="e.g. STU-2026-042"
                  icon={BadgeCheck}
                  required
                  value={formData.studentId}
                  onChange={handleChange}
                  error={errors.studentId}
                />
              ) : (
                <Input
                  id="employeeId"
                  name="employeeId"
                  label="Employee ID"
                  placeholder="e.g. FAC-2026-101"
                  icon={BadgeCheck}
                  required
                  value={formData.employeeId}
                  onChange={handleChange}
                  error={errors.employeeId}
                />
              )}

              <Input
                id="password"
                name="password"
                type="password"
                label="Password"
                placeholder="Minimum 6 characters"
                icon={Lock}
                required
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
              />

              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="Re-enter password"
                icon={Lock}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  loadingText="Creating Account..."
                  icon={UserPlus}
                  className="w-full"
                >
                  Create {role === 'student' ? 'Student' : 'Teacher'} Account
                </Button>
              </div>
            </form>

            {isClerkActive && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setShowClerkForm(true)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
                >
                  Or Quick Sign Up via Social / Google (Clerk) →
                </button>
              </div>
            )}

            <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-6 text-center text-xs text-slate-600 dark:text-slate-400 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                Sign In
              </Link>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
