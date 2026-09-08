import React, { useState } from 'react';
import {
  User,
  Mail,
  Building2,
  BadgeCheck,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Lock,
  Phone,
  FileText,
  Save,
  KeyRound,
  AlertCircle,
  Award,
  Sparkles,
  Smartphone,
  Bell,
  Palette,
  Clock,
  Zap,
  Globe,
  Download,
  Flame,
  Star,
  Check,
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useTheme from '../hooks/useTheme';
import api from '../services/api';

const AVATAR_OPTIONS = [
  { id: 'grad', emoji: '🎓', label: 'Scholar', bg: 'bg-indigo-600' },
  { id: 'tech', emoji: '💻', label: 'Tech Lead', bg: 'bg-sky-600' },
  { id: 'ai', emoji: '🤖', label: 'AI Engineer', bg: 'bg-purple-600' },
  { id: 'star', emoji: '🌟', label: 'Achiever', bg: 'bg-amber-500' },
  { id: 'prof', emoji: '👨‍🏫', label: 'Professor', bg: 'bg-emerald-600' },
  { id: 'shield', emoji: '🛡️', label: 'Guardian', bg: 'bg-rose-600' },
];

const BADGES = [
  {
    id: 'ontime',
    title: 'On-Time Scholar',
    desc: 'Maintained 100% on-time submission rate this term',
    icon: Clock,
    color: 'from-emerald-500 to-teal-600',
    unlocked: true,
  },
  {
    id: 'ai_pro',
    title: 'AI Study Pioneer',
    desc: 'Practiced concepts with the Socratic AI Study Assistant',
    icon: Sparkles,
    color: 'from-indigo-500 to-purple-600',
    unlocked: true,
  },
  {
    id: 'integrity',
    title: 'Integrity Champion',
    desc: 'Maintained low textual similarity across all deliverables',
    icon: ShieldCheck,
    color: 'from-sky-500 to-blue-600',
    unlocked: true,
  },
  {
    id: 'streak',
    title: 'Semester Streak',
    desc: 'Completed all required coursework milestones',
    icon: Flame,
    color: 'from-amber-500 to-orange-600',
    unlocked: true,
  },
];

const ProfilePage = () => {
  const { user, isClerkActive } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState('overview');

  // Selected Avatar
  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    return localStorage.getItem('user_avatar_id') || 'grad';
  });

  // Profile Edit State
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || 'Academic scholar focused on data-driven excellence & coursework mastery.');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);
  const [profileError, setProfileError] = useState(null);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  // Preference Toggles
  const [notifyDeadline, setNotifyDeadline] = useState(true);
  const [notifyGrades, setNotifyGrades] = useState(true);
  const [notifyAi, setNotifyAi] = useState(false);

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Spring Semester';

  const currentAvatarObj = AVATAR_OPTIONS.find((a) => a.id === selectedAvatar) || AVATAR_OPTIONS[0];

  const handleSelectAvatar = (avatarId) => {
    setSelectedAvatar(avatarId);
    localStorage.setItem('user_avatar_id', avatarId);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage(null);
    setProfileError(null);

    try {
      const res = await api.put('/auth/profile', {
        fullName,
        phone,
        bio,
      });

      const saved = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...saved, ...res.data.user }));

      setProfileMessage('Profile information saved successfully.');
    } catch (err) {
      setProfileError(err.response?.data?.message || err.message || 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordMessage(null);
    setPasswordError(null);

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      setPasswordSaving(false);
      return;
    }

    try {
      const res = await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
        confirmNewPassword: confirmPassword,
      });

      setPasswordMessage(res.data.message || 'Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.response?.data?.message || err.message || 'Failed to change password.');
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-2 sm:py-6 space-y-6 sm:space-y-8 pb-20">
      {/* 1. Header Banner & Profile Snapshot */}
      <div className="relative overflow-hidden glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-80 h-40 bg-gradient-to-l from-indigo-500/20 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            {/* Custom Avatar with Glow Ring */}
            <div className={`w-16 sm:w-20 h-16 sm:h-20 rounded-3xl ${currentAvatarObj.bg} text-white flex items-center justify-center text-3xl sm:text-4xl shadow-lg ring-4 ring-white dark:ring-slate-800 shrink-0 transform hover:scale-105 transition-transform`}>
              {currentAvatarObj.emoji}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {user?.fullName}
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                  user?.role === 'admin'
                    ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200'
                    : user?.role === 'teacher'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200'
                    : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200'
                }`}>
                  {user?.role} Workspace
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {user?.email} • Member since {formattedDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-100 dark:border-slate-800 pt-3 sm:pt-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Verified Account</span>
            </div>

            {isClerkActive && (
              <div className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
                <Globe className="w-3.5 h-3.5" />
                <span>Clerk Synced</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Interactive Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'overview', label: 'Profile & Bio', icon: User },
          { id: 'badges', label: 'Academic Badges', icon: Award },
          { id: 'avatars', label: 'Avatar Customizer', icon: Palette },
          { id: 'preferences', label: 'Notifications & Theme', icon: Bell },
          { id: 'security', label: 'Security & Auth', icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB 1: OVERVIEW & PROFILE INFO */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Personal & Academic Details</span>
            </h2>

            {profileMessage && (
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 rounded-2xl text-xs text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{profileMessage}</span>
              </div>
            )}

            {profileError && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 rounded-2xl text-xs text-rose-700 dark:text-rose-300 font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                  Academic Bio / Statement of Purpose
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share your academic research focus or learning objectives..."
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none resize-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/25 transition disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{profileSaving ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>

            {/* Department & Identifier Metadata */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-start gap-3">
                <Building2 className="w-5 h-5 text-indigo-500 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-xs mt-0.5">{user?.department || 'Computer Science & Engineering'}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-start gap-3">
                <BadgeCheck className="w-5 h-5 text-indigo-500 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Academic Identifier</span>
                  <p className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs mt-0.5">{user?.studentId || user?.employeeId || 'ID-2026-CS'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACADEMIC BADGES */}
      {activeTab === 'badges' && (
        <div className="space-y-6">
          <div className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>Academic Milestones & Badges</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Earned recognitions for punctual submissions, academic integrity, and coursework excellence.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 font-extrabold text-xs">
                4 / 4 Unlocked
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BADGES.map((b) => {
                const Icon = b.icon;
                return (
                  <div
                    key={b.id}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex items-start gap-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all glow-card"
                  >
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${b.color} text-white flex items-center justify-center shrink-0 shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{b.title}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {b.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AVATAR CUSTOMIZER */}
      {activeTab === 'avatars' && (
        <div className="space-y-6">
          <div className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Choose Profile Avatar</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Select your academic avatar icon to personalize your workspace.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {AVATAR_OPTIONS.map((a) => {
                const isSelected = selectedAvatar === a.id;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => handleSelectAvatar(a.id)}
                    className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-indigo-600 border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 scale-105'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl ${a.bg} text-white flex items-center justify-center text-2xl shadow-sm`}>
                      {a.emoji}
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{a.label}</span>
                    {isSelected && (
                      <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase">Active</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PREFERENCES & NOTIFICATIONS */}
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          <div className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Workspace Preferences & Alerts</span>
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">Assignment Deadline Reminders</p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">Receive in-app alerts 24 hours and 1 hour before coursework due dates.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyDeadline}
                  onChange={(e) => setNotifyDeadline(e.target.checked)}
                  className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">Grading & Feedback Notifications</p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">Instant alert when faculty grades and attaches feedback to your submissions.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyGrades}
                  onChange={(e) => setNotifyGrades(e.target.checked)}
                  className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">AI Study Recommendations</p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">Get weekly automated Socratic hints and quiz prompts based on syllabus.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyAi}
                  onChange={(e) => setNotifyAi(e.target.checked)}
                  className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SECURITY & PASSWORD */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Security & Password Protection</span>
            </h2>

            {passwordMessage && (
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 rounded-2xl text-xs text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{passwordMessage}</span>
              </div>
            )}

            {passwordError && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 rounded-2xl text-xs text-rose-700 dark:text-rose-300 font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full sm:w-80 px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{passwordSaving ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
