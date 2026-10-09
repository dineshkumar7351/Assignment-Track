import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { ClerkSignInCard } from '../components/ClerkAuthCard';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, isClerkActive } = useAuth();

  const [authMode, setAuthMode] = useState(isClerkActive ? 'clerk' : 'institutional');

  useEffect(() => {
    if (user) {
      const userRole = user?.role;
      const targetPath =
        userRole === 'admin'
          ? '/admin/dashboard'
          : userRole === 'teacher'
          ? '/teacher/dashboard'
          : '/dashboard';
      navigate(location.state?.from?.pathname || targetPath, { replace: true });
    }
  }, [user, navigate, location]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setLoading(true);
    const result = await login(formData.email.trim(), formData.password);
    setLoading(false);

    if (result.success) {
      const userRole = result.user?.role;
      const targetPath =
        userRole === 'admin'
          ? '/admin/dashboard'
          : userRole === 'teacher'
          ? '/teacher/dashboard'
          : '/dashboard';
      navigate(location.state?.from?.pathname || targetPath, { replace: true });
    } else {
      setServerError(result.message || 'Invalid credentials');
    }
  };

  const handleQuickDemoLogin = async (demoEmail, demoPassword) => {
    setFormData({ email: demoEmail, password: demoPassword });
    setServerError('');
    setLoading(true);

    const result = await login(demoEmail, demoPassword);
    setLoading(false);

    if (result.success) {
      const userRole = result.user?.role;
      const targetPath =
        userRole === 'admin'
          ? '/admin/dashboard'
          : userRole === 'teacher'
          ? '/teacher/dashboard'
          : '/dashboard';
      navigate(targetPath, { replace: true });
    } else {
      setServerError(result.message || 'Demo login failed');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-3 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl shadow-slate-900/10 dark:shadow-none overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Visual Column: Dark Forest Green with Wave Texture (Col span 5) */}
        <div className="lg:col-span-5 relative bg-[#0a1f18] text-white p-6 sm:p-12 flex flex-col justify-between overflow-hidden min-h-[280px] sm:min-h-[360px]">
          {/* Wave Background */}
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

          {/* Center Motivational Card */}
          <div className="relative z-10 my-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-xs font-bold border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Task Management</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight">
              Plan, prioritize, and accomplish your tasks with ease.
            </h2>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Unify coursework schedules, automated milestones, and collaborative sprints into one workspace.
            </p>
          </div>

          {/* Bottom Live Metric */}
          <div className="relative z-10 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-between">
            <div className="text-xs">
              <div className="font-extrabold text-white">100% On-Time Sprints</div>
              <div className="text-emerald-200/70 text-[10px]">Real-time progress sync</div>
            </div>
            <span className="text-xl font-black text-emerald-400">4.0 GPA</span>
          </div>
        </div>

        {/* Right Form Column (Col span 7) */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Welcome back
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Access your Assignment Track workspace using Clerk SSO or Campus ID.
              </p>
            </div>

            {/* Auth Mode Switcher if Clerk is configured */}
            {isClerkActive && (
              <div className="flex items-center p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 w-full">
                <button
                  type="button"
                  onClick={() => setAuthMode('clerk')}
                  className={`flex-1 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    authMode === 'clerk'
                      ? 'bg-[#104f37] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  ⚡ Clerk SSO / Google
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('institutional')}
                  className={`flex-1 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    authMode === 'institutional'
                      ? 'bg-[#104f37] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  🔑 Campus Email & Pass
                </button>
              </div>
            )}

            {isClerkActive && authMode === 'clerk' ? (
              <div className="pt-2">
                <ClerkSignInCard fallbackToggle={() => setAuthMode('institutional')} />
              </div>
            ) : (
              <>
                {/* Error Message */}
                {serverError && (
                  <div className="p-4 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{serverError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                      <input
                        type="email"
                        name="email"
                        placeholder="name@organization.edu"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-rose-500 font-semibold mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                      <input
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                      />
                    </div>
                    {errors.password && (
                      <p className="text-xs text-rose-500 font-semibold mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-full bg-[#104f37] hover:bg-[#0d3f2c] text-white text-sm font-bold shadow-md shadow-emerald-950/20 hover:shadow-emerald-950/35 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <span>Signing In...</span>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Quick 1-Click Demo Logins */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    ⚡ Quick Demo Accounts
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleQuickDemoLogin('student@smarttracker.edu', 'StudentPass123!')
                      }
                      className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      🎓 Student
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleQuickDemoLogin('teacher@smarttracker.edu', 'TeacherPass123!')
                      }
                      className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      👨‍🏫 Faculty
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleQuickDemoLogin('admin@smarttracker.edu', 'AdminPass123!')
                      }
                      className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      🛡️ Admin
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Link */}
          <div className="pt-6 text-center text-xs text-slate-500 font-medium">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-bold text-[#104f37] hover:underline dark:text-emerald-400"
            >
              Sign up free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
