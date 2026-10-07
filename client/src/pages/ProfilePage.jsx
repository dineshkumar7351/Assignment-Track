import React, { useState } from 'react';
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
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

const ProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || user?.name || 'Totok Michael',
    email: user?.email || 'tmichael20@mail.com',
    role: user?.role || 'Product Designer',
    department: 'Engineering & Design',
    bio: 'Passionate about building intuitive interfaces, optimizing workflows, and staying ahead of deadlines.',
    notifyEmail: true,
    notifyDeadlines: true,
    notifyMeetings: true,
  });

  const [passData, setPassData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-7 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Settings & Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Manage your account credentials, notifications, and security preferences.
          </p>
        </div>

        {savedSuccess && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Changes saved successfully!</span>
          </div>
        )}
      </div>

      {/* User Overview Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-emerald-50 dark:border-slate-800 shadow-md bg-amber-100 shrink-0">
              <img
                src="/avatar-totok.jpg"
                alt="Profile Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <button
              type="button"
              className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#104f37] text-white shadow-md hover:scale-110 transition-transform"
              title="Change Avatar"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {formData.fullName}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-extrabold uppercase border border-emerald-200 dark:border-emerald-800">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">{formData.email}</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
              {formData.role} • {formData.department}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-center min-w-[90px]">
            <div className="text-lg font-black text-slate-900 dark:text-white">24</div>
            <div className="text-[10px] text-slate-400 font-bold">Total Tasks</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-center min-w-[90px]">
            <div className="text-lg font-black text-emerald-600">96.5%</div>
            <div className="text-[10px] text-slate-400 font-bold">On Time</div>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center gap-2 p-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 w-fit">
        {[
          { id: 'account', label: 'Account Details', icon: User },
          { id: 'security', label: 'Security & Password', icon: Lock },
          { id: 'notifications', label: 'Notification Preferences', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#104f37] text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Account Details */}
      {activeTab === 'account' && (
        <form
          onSubmit={handleSaveProfile}
          className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Role / Title
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Bio Summary
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#104f37] hover:bg-[#0d3f2c] text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Security & Password */}
      {activeTab === 'security' && (
        <form
          onSubmit={handleSaveProfile}
          className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6"
        >
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={passData.currentPassword}
                onChange={(e) =>
                  setPassData({ ...passData, currentPassword: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={passData.newPassword}
                onChange={(e) =>
                  setPassData({ ...passData, newPassword: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={passData.confirmPassword}
                onChange={(e) =>
                  setPassData({ ...passData, confirmPassword: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#104f37] hover:bg-[#0d3f2c] text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Update Password</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Notification Preferences */}
      {activeTab === 'notifications' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Email Notifications
                </h4>
                <p className="text-xs text-slate-400">
                  Receive assignment submissions and grade releases by email
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.notifyEmail}
                onChange={(e) =>
                  setFormData({ ...formData, notifyEmail: e.target.checked })
                }
                className="w-5 h-5 accent-[#104f37] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Deadline Countdown Reminders
                </h4>
                <p className="text-xs text-slate-400">
                  Alerts sent 24 hours and 2 hours before submission milestones
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.notifyDeadlines}
                onChange={(e) =>
                  setFormData({ ...formData, notifyDeadlines: e.target.checked })
                }
                className="w-5 h-5 accent-[#104f37] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Team Meeting Invitations
                </h4>
                <p className="text-xs text-slate-400">
                  Instant popups when team members start conference calls
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.notifyMeetings}
                onChange={(e) =>
                  setFormData({ ...formData, notifyMeetings: e.target.checked })
                }
                className="w-5 h-5 accent-[#104f37] rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
