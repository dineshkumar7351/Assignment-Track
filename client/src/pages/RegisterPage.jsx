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
  const { register, isClerkActive } = useAuth();
  const [showDirectForm, setShowDirectForm] = useState(false);

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

    // Clear field-specific error upon typing
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
      // Redirect to respective role portal
      navigate(role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
    } else {
      setServerError(result.message);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 group mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-700 transition-colors">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="font-bold text-xl text-slate-900">Smart Assignment Tracker</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Create an Account
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Register to manage your academic assignments and coursework
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        {isClerkActive && !showDirectForm ? (
          <div className="bg-white dark:bg-slate-900 py-6 px-4 shadow-sm rounded-2xl border border-slate-200 dark:border-slate-800 transition-colors">
            <ClerkSignUpCard fallbackToggle={() => setShowDirectForm(true)} />
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-xs rounded-2xl border border-slate-200 dark:border-slate-800 sm:px-10 transition-colors">
            {/* Server error alert */}
            {serverError && (
              <Alert
                type="error"
                message={serverError}
                onClose={() => setServerError('')}
                className="mb-6"
              />
            )}

            {/* Role selector buttons: Student vs Teacher */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Registration Role
              </label>
              <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setRole('student');
                    setErrors({});
                  }}
                  className={`py-2 px-4 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    role === 'student'
                      ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole('teacher');
                    setErrors({});
                  }}
                  className={`py-2 px-4 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    role === 'teacher'
                      ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Teacher / Faculty
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
                  onClick={() => setShowDirectForm(false)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  ← Back to Clerk Quick Sign Up
                </button>
              </div>
            )}

            <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-6 text-center text-xs text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                Sign In
              </Link>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700"
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
