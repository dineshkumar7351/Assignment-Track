import React, { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  Plus,
  Video,
  Play,
  Pause,
  Square,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Calendar as CalendarIcon,
  ChevronRight,
  X,
  Sparkles,
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

const StudentDashboard = () => {
  const { user } = useAuth();

  // Interactive Time Tracker state
  const [secondsElapsed, setSecondsElapsed] = useState(5048); // 01:24:08
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Add Project Modal state
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDueDate, setNewProjectDueDate] = useState('');

  // Add Member Modal state
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');

  // Meeting modal state
  const [showMeetingModal, setShowMeetingModal] = useState(false);

  // Live Timer Effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else if (!isTimerRunning && secondsElapsed !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Projects list
  const [projectsList, setProjectsList] = useState([
    {
      id: 1,
      title: 'Develop API Endpoints',
      due: 'Nov 26, 2024',
      iconType: 'blue-striped',
    },
    {
      id: 2,
      title: 'Onboarding Flow',
      due: 'Nov 28, 2024',
      iconType: 'teal-circle',
    },
    {
      id: 3,
      title: 'Build Dashboard',
      due: 'Nov 30, 2024',
      iconType: 'flower',
    },
    {
      id: 4,
      title: 'Optimize Page Load',
      due: 'Dec 5, 2024',
      iconType: 'orange-sun',
    },
    {
      id: 5,
      title: 'Cross-Browser Testing',
      due: 'Dec 6, 2024',
      iconType: 'purple-dots',
    },
  ]);

  // Team Collaboration Members
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: 'Alexandra Deff',
      task: 'Github Project Repository',
      status: 'Completed',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
      avatar: '/avatar-alexandra.jpg',
      initials: 'AD',
    },
    {
      id: 2,
      name: 'Edwin Adenike',
      task: 'Integrate User Authentication System',
      status: 'In Progress',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
      avatar: '/avatar-totok.jpg',
      initials: 'EA',
    },
    {
      id: 3,
      name: 'Isaac Oluwatemilorun',
      task: 'Develop Search and Filter Functionality',
      status: 'Pending',
      statusColor: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
      avatar: '',
      initials: 'IO',
    },
    {
      id: 4,
      name: 'David Oshodi',
      task: 'Responsive Layout for Homepage',
      status: 'In Progress',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
      avatar: '',
      initials: 'DO',
    },
  ]);

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;
    const newProj = {
      id: Date.now(),
      title: newProjectTitle,
      due: newProjectDueDate || 'Dec 15, 2024',
      iconType: 'teal-circle',
    };
    setProjectsList([newProj, ...projectsList]);
    setNewProjectTitle('');
    setNewProjectDueDate('');
    setShowAddProjectModal(false);
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    const newMem = {
      id: Date.now(),
      name: newMemberName,
      task: newMemberRole || 'Feature Development',
      status: 'In Progress',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
      avatar: '',
      initials: newMemberName.slice(0, 2).toUpperCase(),
    };
    setTeamMembers([...teamMembers, newMem]);
    setNewMemberName('');
    setNewMemberRole('');
    setShowAddMemberModal(false);
  };

  return (
    <div className="space-y-7 max-w-7xl mx-auto pb-10">
      {/* ========================================================================= */}
      {/* 1. DASHBOARD HEADER */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Plan, prioritize, and accomplish your tasks with ease.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowAddProjectModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#104f37] hover:bg-[#0d3f2c] text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>

          <button
            type="button"
            onClick={() => alert('Data imported successfully!')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-[#104f37] dark:border-emerald-500 text-[#104f37] dark:text-emerald-400 text-xs sm:text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <span>Import Data</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TOP 4 KPI METRIC CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Projects (Forest Green) */}
        <div className="p-6 rounded-3xl bg-[#104f37] text-white flex flex-col justify-between shadow-lg shadow-emerald-950/15 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-emerald-100/90">
              Total Projects
            </span>
            <button
              type="button"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              24
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#186347] text-emerald-100 text-[11px] font-bold">
              <span className="bg-white/20 px-1 py-0.2 rounded text-[10px]">5</span>
              <span>▲</span>
              <span>Increased from last month</span>
            </div>
          </div>
        </div>

        {/* Card 2: Ended Projects */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Ended Projects
            </span>
            <button
              type="button"
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              10
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-bold">
              <span className="bg-slate-200 dark:bg-slate-700 px-1 py-0.2 rounded text-[10px]">6</span>
              <span>▲</span>
              <span>Increased from last month</span>
            </div>
          </div>
        </div>

        {/* Card 3: Running Projects */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Running Projects
            </span>
            <button
              type="button"
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              12
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-bold">
              <span className="bg-slate-200 dark:bg-slate-700 px-1 py-0.2 rounded text-[10px]">2</span>
              <span>▲</span>
              <span>Increased from last month</span>
            </div>
          </div>
        </div>

        {/* Card 4: Pending Project */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Pending Project
            </span>
            <button
              type="button"
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              2
            </div>
            <div className="text-xs font-bold text-slate-400 dark:text-slate-500">
              On Discuss
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MIDDLE SECTION (3 Columns: Project Analytics, Reminders, Project List) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Column 1: Project Analytics (Col span 4) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <h2 className="text-base font-black text-slate-900 dark:text-white mb-6">
            Project Analytics
          </h2>

          {/* Custom Pill Bars Chart (7 Days) */}
          <div className="flex items-end justify-between gap-2 h-44 px-2 pb-2">
            {/* Sun: Striped */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-full h-24 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-100/60 dark:bg-slate-800/40 relative overflow-hidden">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(148,163,184,0.3)_4px,rgba(148,163,184,0.3)_8px)]" />
              </div>
              <span className="text-xs font-bold text-slate-400">S</span>
            </div>

            {/* Mon: Dark Green */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-full h-32 rounded-2xl bg-[#104f37] dark:bg-emerald-600 shadow-sm" />
              <span className="text-xs font-bold text-slate-400">M</span>
            </div>

            {/* Tue: Mint Green with 76% Tooltip */}
            <div className="flex flex-col items-center gap-2 flex-1 relative">
              <div className="absolute -top-7 px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300 shadow-sm">
                76%
              </div>
              <div className="w-full h-28 rounded-2xl bg-[#52b788] dark:bg-emerald-400 shadow-sm" />
              <span className="text-xs font-bold text-slate-400">T</span>
            </div>

            {/* Wed: Deep Forest Green (Tallest) */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-full h-38 rounded-2xl bg-[#0b3b29] dark:bg-emerald-700 shadow-sm" />
              <span className="text-xs font-bold text-slate-400">W</span>
            </div>

            {/* Thu: Striped */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-full h-30 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-100/60 dark:bg-slate-800/40 relative overflow-hidden">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(148,163,184,0.3)_4px,rgba(148,163,184,0.3)_8px)]" />
              </div>
              <span className="text-xs font-bold text-slate-400">T</span>
            </div>

            {/* Fri: Striped */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-full h-24 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-100/60 dark:bg-slate-800/40 relative overflow-hidden">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(148,163,184,0.3)_4px,rgba(148,163,184,0.3)_8px)]" />
              </div>
              <span className="text-xs font-bold text-slate-400">F</span>
            </div>

            {/* Sat: Striped */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-full h-20 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-100/60 dark:bg-slate-800/40 relative overflow-hidden">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(148,163,184,0.3)_4px,rgba(148,163,184,0.3)_8px)]" />
              </div>
              <span className="text-xs font-bold text-slate-400">S</span>
            </div>
          </div>
        </div>

        {/* Column 2: Reminders (Col span 4) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white mb-6">
              Reminders
            </h2>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900 dark:text-white leading-snug">
                Meeting with Arc <br /> Company
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-400 font-medium">
                Time : 02.00 pm - 04.00 pm
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowMeetingModal(true)}
            className="w-full mt-6 py-3 rounded-full bg-[#104f37] hover:bg-[#0d3f2c] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Video className="w-4 h-4" />
            <span>Start Meeting</span>
          </button>
        </div>

        {/* Column 3: Project List (Col span 4) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              Project
            </h2>
            <button
              type="button"
              onClick={() => setShowAddProjectModal(true)}
              className="px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              + New
            </button>
          </div>

          {/* Project Item List */}
          <div className="space-y-3.5 divide-y divide-slate-50 dark:divide-slate-800/60">
            {projectsList.map((item) => (
              <div key={item.id} className="pt-3.5 first:pt-0 flex items-center gap-3">
                {/* Geometric Icon */}
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0">
                  {item.iconType === 'blue-striped' && (
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 font-black text-xs">
                      //
                    </div>
                  )}
                  {item.iconType === 'teal-circle' && (
                    <div className="w-7 h-7 rounded-full bg-teal-500/15 flex items-center justify-center text-teal-600">
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-teal-600" />
                    </div>
                  )}
                  {item.iconType === 'flower' && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-600 font-black">
                      ✦
                    </div>
                  )}
                  {item.iconType === 'orange-sun' && (
                    <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-600">
                      ●
                    </div>
                  )}
                  {item.iconType === 'purple-dots' && (
                    <div className="w-7 h-7 rounded-lg bg-purple-500/15 flex items-center justify-center text-purple-600">
                      ::
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    Due date: {item.due}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. BOTTOM SECTION (3 Columns: Team Collaboration, Project Progress, Time Tracker) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Column 1: Team Collaboration (Col span 4) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              Team Collaboration
            </h2>
            <button
              type="button"
              onClick={() => setShowAddMemberModal(true)}
              className="px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              + Add Member
            </button>
          </div>

          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Member Avatar */}
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span>{member.initials}</span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                      {member.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[150px] sm:max-w-[170px]">
                      Working on <span className="font-semibold text-slate-600 dark:text-slate-400">{member.task}</span>
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border shrink-0 ${member.statusColor}`}
                >
                  {member.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Project Progress (Col span 4) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <h2 className="text-base font-black text-slate-900 dark:text-white mb-2">
            Project Progress
          </h2>

          {/* Semi-Circular Progress Donut Gauge */}
          <div className="flex flex-col items-center justify-center my-2">
            <div className="relative w-48 h-28 flex items-end justify-center overflow-hidden">
              {/* Semi-Circle SVG */}
              <svg viewBox="0 0 100 55" className="w-48 h-28">
                {/* Background Track */}
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="12"
                  strokeLinecap="round"
                  className="dark:stroke-slate-800"
                />
                {/* Completed Mint Arc */}
                <path
                  d="M 10 50 A 40 40 0 0 1 65 14"
                  fill="none"
                  stroke="#104f37"
                  strokeWidth="12"
                  strokeLinecap="round"
                  className="dark:stroke-emerald-500 transition-all duration-700"
                />
              </svg>

              {/* Center Stats */}
              <div className="absolute bottom-1 flex flex-col items-center">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  41%
                </span>
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                  Project Ended
                </span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-50 dark:border-slate-800/60">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#52b788]" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#104f37]" />
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600 border border-slate-400" />
              <span>Pending</span>
            </div>
          </div>
        </div>

        {/* Column 3: Time Tracker (Col span 4) */}
        <div className="lg:col-span-4 rounded-3xl bg-[#0a1f18] text-white p-6 relative overflow-hidden shadow-lg shadow-emerald-950/25 flex flex-col justify-between border border-emerald-900/40 min-h-[220px]">
          {/* 3D Wave Texture Background */}
          <img
            src="/green-wave.jpg"
            alt="Time Tracker Texture"
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f18] via-transparent to-[#0a1f18]/40" />

          <div className="relative z-10">
            <h3 className="text-sm font-semibold text-emerald-200/90">
              Time Tracker
            </h3>
          </div>

          {/* Big Digital Timer Display */}
          <div className="relative z-10 my-4 text-center">
            <div className="text-4xl sm:text-5xl font-mono font-black tracking-wider text-white">
              {formatTimer(secondsElapsed)}
            </div>
          </div>

          {/* Timer Controls: Pause & Stop */}
          <div className="relative z-10 flex items-center justify-center gap-3.5">
            {/* Pause / Play Button */}
            <button
              type="button"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="w-12 h-12 rounded-full bg-white hover:bg-slate-100 text-slate-900 flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
              title={isTimerRunning ? 'Pause Timer' : 'Resume Timer'}
            >
              {isTimerRunning ? (
                <Pause className="w-5 h-5 fill-slate-900 text-slate-900" />
              ) : (
                <Play className="w-5 h-5 fill-slate-900 text-slate-900 ml-0.5" />
              )}
            </button>

            {/* Stop / Reset Button */}
            <button
              type="button"
              onClick={() => {
                setIsTimerRunning(false);
                setSecondsElapsed(0);
              }}
              className="w-12 h-12 rounded-full bg-[#e11d48] hover:bg-[#be123c] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
              title="Reset Timer"
            >
              <Square className="w-4 h-4 fill-white" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADD PROJECT MODAL */}
      {/* ========================================================================= */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Create New Project
              </h3>
              <button
                type="button"
                onClick={() => setShowAddProjectModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design Marketing Landing Page"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Due Date
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dec 20, 2024"
                  value={newProjectDueDate}
                  onChange={(e) => setNewProjectDueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#104f37] hover:bg-[#0d3f2c] text-white text-xs font-bold shadow-sm"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD MEMBER MODAL */}
      {/* ========================================================================= */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Add Team Member
              </h3>
              <button
                type="button"
                onClick={() => setShowAddMemberModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Member Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Miller"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Working On (Task)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Database Schema Design"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#104f37] hover:bg-[#0d3f2c] text-white text-xs font-bold shadow-sm"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MEETING POPUP MODAL */}
      {/* ========================================================================= */}
      {showMeetingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-2xl p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#104f37] text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-900/20">
              <Video className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Meeting with Arc Company
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Room ID: arc-sync-2024 • 4 participants waiting
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300">
              Camera & Microphone ready. Click join to start the conference.
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowMeetingModal(false)}
                className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Connecting to meeting room...');
                  setShowMeetingModal(false);
                }}
                className="px-6 py-2.5 rounded-full bg-[#104f37] hover:bg-[#0d3f2c] text-white text-xs font-bold shadow-sm"
              >
                Join Meeting Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
