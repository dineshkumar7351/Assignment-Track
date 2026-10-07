import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserPlus,
  User,
  Mail,
  Lock,
  Building2,
  BadgeCheck,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

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
  const { register } = useAuth();

  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    department: 'Computer Science & Engineering',
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
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email';
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
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
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
      role,
      department: formData.department,
      ...(role === 'student'
        ? { studentId: formData.studentId.trim() }
        : { employeeId: formData.employeeId.trim() }),
    };

    const result = await register(payload);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setServerError(result.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-3 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl shadow-slate-900/10 dark:shadow-none overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Visual Column (Col span 5) */}
        <div className="lg:col-span-5 relative bg-[#0a1f18] text-white p-6 sm:p-12 flex flex-col justify-between overflow-hidden min-h-[280px] sm:min-h-[360px]">
          <img
            src="/green-wave.jpg"
            alt="Wave pattern"
            className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f18] via-transparent to-[#0a1f18]/40" />

          {/* Top Logo */}
          <div className="relative z-10 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-emerald-400">
              <svg
                viewBox="0 0 32 32"
                fill="none"
                className="w-7 h-7"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="16" cy="16" r="14" stroke="#10b981" strokeWidth="2.5" />
                <path
                  d="M11 15C11 12.2386 13.2386 10 16 10C18.7614 10 21 12.2386 21 15C21 17.5 17.5 21 16 22C14.5 21 11 17.5 11 15Z"
                  stroke="#10b981"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="16" cy="14.5" r="2" fill="#10b981" />
              </svg>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              Assignment Track
            </span>
          </div>

          <div className="relative z-10 my-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-xs font-bold border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Join Assignment Track Workspace</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight">
              Create your account and elevate your productivity.
            </h2>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Track deadlines, collaborate seamlessly with teammates, and manage milestones effortlessly.
            </p>
          </div>

          <div className="relative z-10 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-xs text-emerald-200">
            ✓ Instant setup &nbsp;•&nbsp; ✓ Free tier included &nbsp;•&nbsp; ✓ Sync across devices
          </div>
        </div>

        {/* Right Form Column (Col span 7) */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Create an account
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Choose your role to get started with Assignment Track.
              </p>
            </div>

            {/* Role Switcher Pills */}
            <div className="flex items-center p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 w-full">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex-1 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  role === 'student'
                    ? 'bg-[#104f37] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                🎓 Student
              </button>
              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`flex-1 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  role === 'teacher'
                    ? 'bg-[#104f37] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                👨‍🏫 Faculty / Teacher
              </button>
            </div>

            {/* Error message */}
            {serverError && (
              <div className="p-4 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="e.g. Alexandra Vance"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                />
                {errors.fullName && (
                  <p className="text-xs text-rose-500 font-semibold mt-1">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@organization.edu"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                  />
                  {errors.email && (
                    <p className="text-xs text-rose-500 font-semibold mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {role === 'student' ? 'Student ID' : 'Employee ID'}
                  </label>
                  <input
                    type="text"
                    name={role === 'student' ? 'studentId' : 'employeeId'}
                    placeholder={role === 'student' ? 'e.g. STU-2026-09' : 'e.g. FAC-2026-01'}
                    value={role === 'student' ? formData.studentId : formData.employeeId}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                  />
                  {(errors.studentId || errors.employeeId) && (
                    <p className="text-xs text-rose-500 font-semibold mt-1">
                      {errors.studentId || errors.employeeId}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                  />
                  {errors.password && (
                    <p className="text-xs text-rose-500 font-semibold mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-rose-500 font-semibold mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-[#104f37] hover:bg-[#0d3f2c] text-white text-sm font-bold shadow-md shadow-emerald-950/20 hover:shadow-emerald-950/35 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="pt-6 text-center text-xs text-slate-500 font-medium">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-[#104f37] hover:underline dark:text-emerald-400"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
