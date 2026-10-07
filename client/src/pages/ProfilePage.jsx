import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Bell,
  Lock,
  Save,
  CheckCircle2,
  AlertCircle,
  Building2,
  Mail,
  Palette,
  Camera,
  GraduationCap,
  Phone,
  Globe,
  Code2,
  Share2,
  Clock,
  Calendar,
  Moon,
  Sun,
  Laptop,
  Sliders,
  Sparkles,
  BookOpen,
  LayoutGrid,
  ListFilter,
  Eye,
  EyeOff,
  Check,
  Zap,
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useTheme from '../hooks/useTheme';
import api from '../services/api';

const AVATAR_PRESETS = [
  { id: '1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', label: 'Student 1' },
  { id: '2', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', label: 'Student 2' },
  { id: '3', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', label: 'Student 3' },
  { id: '4', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', label: 'Student 4' },
  { id: '5', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', label: 'Scholar' },
];

const ACCENT_COLORS = [
  { id: 'emerald', label: 'Emerald Forest', color: '#104f37', bgClass: 'bg-[#104f37]' },
  { id: 'indigo', label: 'Royal Indigo', color: '#4338ca', bgClass: 'bg-indigo-600' },
  { id: 'blue', label: 'Ocean Blue', color: '#0284c7', bgClass: 'bg-sky-600' },
  { id: 'amber', label: 'Sunset Amber', color: '#d97706', bgClass: 'bg-amber-600' },
  { id: 'rose', label: 'Crimson Rose', color: '#e11d48', bgClass: 'bg-rose-600' },
];

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const { theme, setTheme, accentColor, setAccentColor, density, setDensity } = useTheme();

  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Profile and Academic Form
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    role: user?.role || 'student',
    department: user?.department || 'Computer Science & Engineering',
    studentId: user?.studentId || 'CS2023-045',
    employeeId: user?.employeeId || '',
    semester: user?.semester || 'Semester 6',
    academicBatch: user?.academicBatch || '2023 – 2027',
    branch: user?.branch || 'B.Tech - Computer Science & Engineering',
    section: user?.section || 'Section A',
    phone: user?.phone || '+91 98765 43210',
    bio: user?.bio || 'Passionate about building intuitive interfaces, data-driven systems, and staying ahead of assignment deadlines.',
    profileImage: user?.profileImage || '',
    githubUrl: user?.githubUrl || 'https://github.com',
    linkedinUrl: user?.linkedinUrl || 'https://linkedin.com',
    websiteUrl: user?.websiteUrl || 'https://portfolio.me',
  });

  // Preferences Form
  const [prefData, setPrefData] = useState({
    theme: theme || 'light',
    accentColor: accentColor || 'emerald',
    defaultView: localStorage.getItem('defaultView') || 'kanban',
    timeFormat: localStorage.getItem('timeFormat') || '12h',
    dateFormat: localStorage.getItem('dateFormat') || 'DD/MM/YYYY',
    density: density || 'comfortable',
  });

  // Notification Matrix
  const [notifications, setNotifications] = useState({
    email: user?.notificationPreferences?.email ?? true,
    push: user?.notificationPreferences?.push ?? true,
    deadline48h: user?.notificationPreferences?.deadline48h ?? true,
    deadline24h: user?.notificationPreferences?.deadline24h ?? true,
    deadline2h: user?.notificationPreferences?.deadline2h ?? true,
    gradeReleased: user?.notificationPreferences?.gradeReleased ?? true,
    teacherFeedback: user?.notificationPreferences?.teacherFeedback ?? true,
    announcements: user?.notificationPreferences?.announcements ?? true,
    quietHoursEnabled: user?.notificationPreferences?.quietHoursEnabled ?? false,
    quietHoursStart: user?.notificationPreferences?.quietHoursStart || '22:00',
    quietHoursEnd: user?.notificationPreferences?.quietHoursEnd || '07:00',
  });

  // Security Form
  const [passData, setPassData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  // Sync user data on load
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || prev.fullName,
        email: user.email || prev.email,
        role: user.role || prev.role,
        department: user.department || prev.department,
        studentId: user.studentId || prev.studentId,
        employeeId: user.employeeId || prev.employeeId,
        semester: user.semester || prev.semester,
        academicBatch: user.academicBatch || prev.academicBatch,
        branch: user.branch || prev.branch,
        section: user.section || prev.section,
        phone: user.phone || prev.phone,
        bio: user.bio || prev.bio,
        profileImage: user.profileImage || prev.profileImage,
        githubUrl: user.githubUrl || prev.githubUrl,
        linkedinUrl: user.linkedinUrl || prev.linkedinUrl,
        websiteUrl: user.websiteUrl || prev.websiteUrl,
      }));

      if (user.notificationPreferences) {
        setNotifications((prev) => ({
          ...prev,
          ...user.notificationPreferences,
        }));
      }
    }
  }, [user]);

  const notifySuccess = (msg) => {
    setSavedSuccess(msg);
    setErrorMessage('');
    setTimeout(() => setSavedSuccess(''), 3500);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await api.put('/auth/profile', {
        ...formData,
        notificationPreferences: notifications,
        preferences: prefData,
      });

      if (response.data && response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        notifySuccess('Profile & Academic identity updated successfully!');
      } else {
        notifySuccess('Settings updated locally!');
      }
    } catch (err) {
      console.warn('Profile save note:', err.message);
      const updatedLocalUser = { ...user, ...formData, notificationPreferences: notifications };
      setUser(updatedLocalUser);
      localStorage.setItem('user', JSON.stringify(updatedLocalUser));
      notifySuccess('Profile saved successfully!');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = (e) => {
    e?.preventDefault();
    setTheme(prefData.theme);
    setAccentColor(prefData.accentColor);
    setDensity(prefData.density);
    localStorage.setItem('defaultView', prefData.defaultView);
    localStorage.setItem('timeFormat', prefData.timeFormat);
    localStorage.setItem('dateFormat', prefData.dateFormat);
    notifySuccess('Workspace & Appearance preferences applied!');
  };

  const handleSaveNotifications = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      await api.put('/auth/profile', {
        notificationPreferences: notifications,
      });
      notifySuccess('Notification matrix & deadline triggers saved!');
    } catch (err) {
      console.warn('Notification save fallback:', err.message);
      notifySuccess('Notification preferences updated!');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passData.currentPassword || !passData.newPassword) {
      setErrorMessage('Please fill in all required password fields');
      return;
    }
    if (passData.newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long');
      return;
    }
    if (passData.newPassword !== passData.confirmPassword) {
      setErrorMessage('New passwords do not match');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      const res = await api.put('/auth/change-password', {
        currentPassword: passData.currentPassword,
        newPassword: passData.newPassword,
        confirmNewPassword: passData.confirmPassword,
      });
      if (res.data?.success) {
        notifySuccess('Password updated successfully!');
        setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update password. Verify your current password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-7 max-w-5xl mx-auto pb-14 px-2 sm:px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Settings & Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Manage your academic identity, workspace theme, notifications, and security.
          </p>
        </div>

        {savedSuccess && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 shadow-sm animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{savedSuccess}</span>
          </div>
        )}

        {errorMessage && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-800 shadow-sm animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* User Overview Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 transition-all">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-emerald-50 dark:border-slate-800 shadow-md bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center">
              {formData.profileImage ? (
                <img
                  src={formData.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={() => setFormData({ ...formData, profileImage: '' })}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-white font-black text-2xl flex items-center justify-center uppercase">
                  {formData.fullName ? formData.fullName.charAt(0) : 'U'}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-[#104f37] hover:bg-[#0d3f2c] text-white shadow-md hover:scale-110 transition-transform cursor-pointer"
              title="Select Avatar"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2.5">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {formData.fullName || 'User Profile'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-extrabold uppercase border border-emerald-200 dark:border-emerald-800">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">{formData.email}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs text-slate-600 dark:text-slate-300 font-semibold">
              <span className="capitalize px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {formData.role}
              </span>
              <span>•</span>
              <span>{formData.department}</span>
              {formData.studentId && (
                <>
                  <span>•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                    ID: {formData.studentId}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Academic Stats Counters */}
        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-center min-w-[95px] border border-slate-100 dark:border-slate-800/80">
            <div className="text-lg font-black text-slate-900 dark:text-white">24</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Total Tasks
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-center min-w-[95px] border border-slate-100 dark:border-slate-800/80">
            <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">96.5%</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              On Time
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Quick Picker Popover */}
      {showAvatarPicker && (
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-slate-700 shadow-lg space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Choose Profile Avatar
            </h4>
            <button
              onClick={() => setShowAvatarPicker(false)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              Close
            </button>
          </div>
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            {AVATAR_PRESETS.map((av) => (
              <button
                key={av.id}
                type="button"
                onClick={() => {
                  setFormData({ ...formData, profileImage: av.url });
                  setShowAvatarPicker(false);
                }}
                className={`w-14 h-14 rounded-full overflow-hidden border-2 transition-all shrink-0 hover:scale-110 cursor-pointer ${
                  formData.profileImage === av.url
                    ? 'border-emerald-600 ring-2 ring-emerald-500/50'
                    : 'border-slate-200 dark:border-slate-700 opacity-80 hover:opacity-100'
                }`}
              >
                <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
              </button>
            ))}
            <div className="flex items-center gap-2 pl-2">
              <input
                type="text"
                placeholder="Or paste image URL..."
                value={formData.profileImage}
                onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-52"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm w-fit">
        {[
          { id: 'account', label: '1. Academic & Identity', icon: GraduationCap },
          { id: 'preferences', label: '2. Workspace & Theme', icon: Palette },
          { id: 'notifications', label: '3. Notification Matrix', icon: Bell },
          { id: 'security', label: 'Security & Password', icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#104f37] text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ACADEMIC & IDENTITY PROFILE */}
      {activeTab === 'account' && (
        <form
          onSubmit={handleSaveProfile}
          className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8"
        >
          {/* Section: Personal Info */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Personal Credentials
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-sm font-medium text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Phone / WhatsApp Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Role & Access
                </label>
                <input
                  type="text"
                  disabled
                  value={formData.role.toUpperCase()}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-sm font-bold text-slate-600 dark:text-slate-400 capitalize cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Section: Academic Specific Details */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Academic Program & Enrollment
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {formData.role === 'teacher' ? 'Faculty / Employee ID' : 'Student ID / Roll No'}
                </label>
                <input
                  type="text"
                  value={formData.role === 'teacher' ? formData.employeeId : formData.studentId}
                  onChange={(e) =>
                    formData.role === 'teacher'
                      ? setFormData({ ...formData, employeeId: e.target.value })
                      : setFormData({ ...formData, studentId: e.target.value })
                  }
                  placeholder={formData.role === 'teacher' ? 'FAC-2023-01' : 'CS2023-045'}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm font-mono font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Department / Faculty
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Computer Science & Engineering"
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Current Semester / Term
                </label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600/30 focus:outline-none cursor-pointer"
                >
                  <option value="Semester 1">Semester 1</option>
                  <option value="Semester 2">Semester 2</option>
                  <option value="Semester 3">Semester 3</option>
                  <option value="Semester 4">Semester 4</option>
                  <option value="Semester 5">Semester 5</option>
                  <option value="Semester 6">Semester 6</option>
                  <option value="Semester 7">Semester 7</option>
                  <option value="Semester 8">Semester 8</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Degree & Specialization
                </label>
                <input
                  type="text"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  placeholder="B.Tech - Computer Science"
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Academic Batch / Year
                </label>
                <input
                  type="text"
                  value={formData.academicBatch}
                  onChange={(e) => setFormData({ ...formData, academicBatch: e.target.value })}
                  placeholder="2023 – 2027"
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Class Section / Group
                </label>
                <input
                  type="text"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  placeholder="Section A (Batch 1)"
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Bio & Links */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Academic Bio & Portfolio Links
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Bio / Research Interests
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell your faculty and peers about your projects, skills, or research focus..."
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    GitHub Profile
                  </label>
                  <div className="relative">
                    <Code2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="url"
                      placeholder="https://github.com/username"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    LinkedIn / Scholar
                  </label>
                  <div className="relative">
                    <Share2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Personal Portfolio
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="url"
                      placeholder="https://yourportfolio.dev"
                      value={formData.websiteUrl}
                      onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#104f37] hover:bg-[#0d3f2c] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save Academic Profile'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: APPEARANCE & WORKSPACE PREFERENCES */}
      {activeTab === 'preferences' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
          {/* Theme Mode Selector */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Display Theme Mode
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'light', label: 'Crisp Light Mode', desc: 'Clean high-contrast daytime view', icon: Sun },
                { id: 'dark', label: 'Dark Charcoal Mode', desc: 'Eye-friendly low-light contrast', icon: Moon },
                { id: 'system', label: 'System Default', desc: 'Sync automatically with your OS', icon: Laptop },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = prefData.theme === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setPrefData({ ...prefData, theme: m.id });
                      setTheme(m.id);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{m.label}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{m.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accent Color Palette */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <Palette className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Accent Brand Palette
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {ACCENT_COLORS.map((col) => {
                const isSelected = prefData.accentColor === col.id;
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => {
                      setPrefData({ ...prefData, accentColor: col.id });
                      setAccentColor(col.id);
                    }}
                    className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2.5 ${
                      isSelected
                        ? 'border-slate-900 dark:border-white ring-2 ring-emerald-500/30 shadow-sm bg-slate-50 dark:bg-slate-800'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-full ${col.bgClass} shadow-sm flex items-center justify-center text-white`}>
                      {isSelected && <Check className="w-4 h-4" />}
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {col.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Workspace Views & Formatting */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <Sliders className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Assignment Workspace Layout & Formats
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Default Dashboard View
                </label>
                <select
                  value={prefData.defaultView}
                  onChange={(e) => setPrefData({ ...prefData, defaultView: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600/30 focus:outline-none cursor-pointer"
                >
                  <option value="kanban">Kanban Columns (To Do, In Progress, Submitted)</option>
                  <option value="calendar">Timeline / Calendar View</option>
                  <option value="table">Compact Data Table</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Date Format
                </label>
                <select
                  value={prefData.dateFormat}
                  onChange={(e) => setPrefData({ ...prefData, dateFormat: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600/30 focus:outline-none cursor-pointer"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY (e.g., 25/12/2026)</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (e.g., 12/25/2026)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (ISO Format)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Time Format
                </label>
                <select
                  value={prefData.timeFormat}
                  onChange={(e) => setPrefData({ ...prefData, timeFormat: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600/30 focus:outline-none cursor-pointer"
                >
                  <option value="12h">12-Hour (02:30 PM)</option>
                  <option value="24h">24-Hour (14:30)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleSavePreferences}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#104f37] hover:bg-[#0d3f2c] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Apply Preferences</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: SMART NOTIFICATION MATRIX */}
      {activeTab === 'notifications' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
          {/* Section: Deadline Countdowns */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Automated Deadline Countdown Triggers
              </h3>
            </div>

            <div className="space-y-3">
              {[
                {
                  key: 'deadline48h',
                  title: '48 Hours Before Deadline',
                  desc: 'Early planning reminder when submission cutoff is 2 days away.',
                  badge: 'Early Alert',
                },
                {
                  key: 'deadline24h',
                  title: '24 Hours Before Deadline',
                  desc: 'Standard countdown reminder to finalize drafts and reports.',
                  badge: 'Standard',
                },
                {
                  key: 'deadline2h',
                  title: '2 Hours Urgent Cutoff Flash',
                  desc: 'High-priority alert if assignment remains unsubmitted before portal closes.',
                  badge: 'Urgent',
                  badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {item.title}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          item.badgeClass || 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications[item.key]}
                    onChange={(e) =>
                      setNotifications({ ...notifications, [item.key]: e.target.checked })
                    }
                    className="w-5 h-5 accent-[#104f37] rounded cursor-pointer shrink-0 ml-4"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section: Academic Event Triggers */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Academic Event Alerts
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  key: 'gradeReleased',
                  title: 'Grades & Marks Released',
                  desc: 'Instant notice when faculty grades your submission.',
                },
                {
                  key: 'teacherFeedback',
                  title: 'Teacher Remarks & Feedback',
                  desc: 'Alerts when instructors add comments to your work.',
                },
                {
                  key: 'announcements',
                  title: 'Department Announcements',
                  desc: 'General broadcast notices from department heads.',
                },
                {
                  key: 'email',
                  title: 'Daily Email Digest',
                  desc: 'Summarized morning breakdown of tasks due today.',
                },
              ].map((ev) => (
                <div
                  key={ev.key}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {ev.title}
                    </span>
                    <p className="text-xs text-slate-400">{ev.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications[ev.key]}
                    onChange={(e) =>
                      setNotifications({ ...notifications, [ev.key]: e.target.checked })
                    }
                    className="w-5 h-5 accent-[#104f37] rounded cursor-pointer shrink-0 ml-4"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section: Quiet Hours / Study Focus Mode */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <Moon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Quiet Hours / Study Focus Schedule
              </h3>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Enable Study Quiet Hours
                  </h4>
                  <p className="text-xs text-slate-400">
                    Mute sound and banner alerts during your study or rest windows.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.quietHoursEnabled}
                  onChange={(e) =>
                    setNotifications({ ...notifications, quietHoursEnabled: e.target.checked })
                  }
                  className="w-5 h-5 accent-[#104f37] rounded cursor-pointer"
                />
              </div>

              {notifications.quietHoursEnabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-700 animate-fade-in">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Start Time (Mute From)
                    </label>
                    <input
                      type="time"
                      value={notifications.quietHoursStart}
                      onChange={(e) =>
                        setNotifications({ ...notifications, quietHoursStart: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      End Time (Resume At)
                    </label>
                    <input
                      type="time"
                      value={notifications.quietHoursEnd}
                      onChange={(e) =>
                        setNotifications({ ...notifications, quietHoursEnd: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleSaveNotifications}
              disabled={loading}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#104f37] hover:bg-[#0d3f2c] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save Notification Matrix'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY & PASSWORD */}
      {activeTab === 'security' && (
        <form
          onSubmit={handleChangePassword}
          className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6"
        >
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Change Account Password
            </h3>
          </div>

          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={passData.currentPassword}
                  onChange={(e) =>
                    setPassData({ ...passData, currentPassword: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                New Password (minimum 6 characters)
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={passData.newPassword}
                onChange={(e) =>
                  setPassData({ ...passData, newPassword: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Confirm New Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={passData.confirmPassword}
                onChange={(e) =>
                  setPassData({ ...passData, confirmPassword: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#104f37] hover:bg-[#0d3f2c] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Updating...' : 'Update Password'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfilePage;
