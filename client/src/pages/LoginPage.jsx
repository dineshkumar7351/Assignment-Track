import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, ArrowLeft, LogIn, Mail, Lock } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { ClerkSignInCard } from '../components/ClerkAuthCard';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, isClerkActive } = useAuth();
  const [showDirectForm, setShowDirectForm] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  // If user is already authenticated, redirect to their role dashboard
  useEffect(() => {
    if (user) {
      const targetPath =
        user.role === 'admin'
          ? '/admin/dashboard'
          : user.role === 'teacher'
          ? '/teacher/dashboard'
          : '/student/dashboard';
      navigate(targetPath, { replace: true });
    }
  }, [user, navigate]);

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

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email.trim())) {
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
      if (location.state?.from?.pathname) {
        navigate(location.state.from.pathname, { replace: true });
      } else {
        const userRole = result.user?.role;
        const targetPath =
          userRole === 'admin'
            ? '/admin/dashboard'
            : userRole === 'teacher'
            ? '/teacher/dashboard'
            : '/student/dashboard';
        navigate(targetPath, { replace: true });
      }
    } else {
      setServerError(result.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 group mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-700 transition-colors">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="font-bold text-xl text-slate-900 dark:text-white">
            Smart Assignment Tracker
          </span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Sign In
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Enter your institutional credentials to access your dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        {isClerkActive && !showDirectForm ? (
          <div className="bg-white dark:bg-slate-900 py-6 px-4 shadow-sm rounded-2xl border border-slate-200 dark:border-slate-800 transition-colors">
            <ClerkSignInCard fallbackToggle={() => setShowDirectForm(true)} />
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-xs rounded-2xl border border-slate-200 dark:border-slate-800 sm:px-10 transition-colors">
            {/* Server error message */}
            {serverError && (
              <Alert
                type="error"
                message={serverError}
                onClose={() => setServerError('')}
                className="mb-6"
              />
            )}

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <Input
                id="email"
                name="email"
                type="email"
                label="Academic Email"
                placeholder="e.g. alex@college.edu"
                icon={Mail}
                required
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />

              <Input
                id="password"
                name="password"
                type="password"
                label="Password"
                placeholder="Enter your password"
                icon={Lock}
                required
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  loadingText="Signing In..."
                  icon={LogIn}
                  className="w-full"
                >
                  Sign In
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
                  ← Back to Clerk Social / Fast Sign In
                </button>
              </div>
            )}

            <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-6 text-center text-xs text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                Create an Account
              </Link>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
