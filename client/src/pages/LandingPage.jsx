import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  CheckSquare,
  TrendingUp,
  ArrowRight,
  GraduationCap,
  Users,
  ShieldCheck,
  Clock,
  BookOpen,
  Sparkles,
  Zap,
  Award,
  Layers,
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="relative overflow-hidden space-y-20 sm:space-y-28 py-10 sm:py-20">
      {/* Ambient background glow orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-500/10 dark:bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-purple-500/10 dark:bg-purple-600/15 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-panel text-indigo-700 dark:text-indigo-300 text-xs font-semibold shadow-xs mb-8 hover:scale-105 transition-transform">
            <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-ping" />
            <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Next-Generation Academic Management & Tracking</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:leading-[1.1] mb-6">
            Smart Assignment <span className="gradient-hero-text">Tracker</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-2xl font-medium text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Empower your academic journey with intelligent deadline scheduling, automated grading rubrics, and similarity detection in one unified workspace.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-base font-bold rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 glass-card hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 text-base font-bold rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs hover:-translate-y-0.5 transition-all duration-200"
            >
              Portal Login
            </Link>
          </div>

          {/* Stat Banner */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass-card p-4 rounded-2xl text-center glow-card">
              <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">99.8%</p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">On-Time Submissions</p>
            </div>
            <div className="glass-card p-4 rounded-2xl text-center glow-card">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">100%</p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Similarity Check</p>
            </div>
            <div className="glass-card p-4 rounded-2xl text-center glow-card">
              <p className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400">24/7</p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">AI Academic Tutor</p>
            </div>
            <div className="glass-card p-4 rounded-2xl text-center glow-card">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-500 dark:text-amber-400">3 Roles</p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Unified Campus Sync</p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Showcase: Students, Faculty, Administrators */}
      <section id="roles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>ROLE-BASED WORKSPACES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Tailored for Every Academic Role
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
            A single seamless platform connecting students, educators, and campus administrators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Students Card */}
          <div className="glass-card rounded-3xl p-8 glow-card border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 shadow-inner">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Student Portal</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Stay on top of deadlines with visual calendar milestones, instant feedback reports, and interactive AI assignment planning.
              </p>
              <ul className="space-y-3 text-xs font-medium text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0" />
                  Personalized dynamic assignment timeline
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0" />
                  Version-controlled submission uploads
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0" />
                  Instant grading breakdown & rubrics
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80">
              <Link to="/student/dashboard" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 inline-flex items-center gap-1.5 group">
                <span>Explore Student Workspace</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Faculty Card */}
          <div className="glass-card rounded-3xl p-8 glow-card border border-indigo-200 dark:border-indigo-900/40 relative flex flex-col justify-between">
            <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
              Faculty Hub
            </div>
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 shadow-inner">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Teacher Portal</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Publish rich coursework with attachments, review submissions, and utilize AI textual similarity detection for academic honesty.
              </p>
              <ul className="space-y-3 text-xs font-medium text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 shrink-0" />
                  1-Click assignment drafting & publishing
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 shrink-0" />
                  Integrated Plagiarism & Similarity scanner
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 shrink-0" />
                  Speed-grader with customized feedback
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80">
              <Link to="/teacher/dashboard" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 inline-flex items-center gap-1.5 group">
                <span>Explore Teacher Workspace</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Administrator Card */}
          <div className="glass-card rounded-3xl p-8 glow-card border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-6 shadow-inner">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Admin Portal</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Govern institution-wide course management, oversee audit logs, enforce academic guidelines, and analyze cross-departmental success.
              </p>
              <ul className="space-y-3 text-xs font-medium text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-rose-600 dark:bg-rose-400 shrink-0" />
                  Campus-wide user & department management
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-rose-600 dark:bg-rose-400 shrink-0" />
                  Academic compliance & activity audit trails
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-rose-600 dark:bg-rose-400 shrink-0" />
                  Aggregated institutional performance metrics
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80">
              <Link to="/admin/dashboard" className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 inline-flex items-center gap-1.5 group">
                <span>Explore Admin Workspace</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-slate-200 dark:border-slate-800">
          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Modern Academic Experience</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
              Designed for Velocity, Precision, & Academic Growth
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              Smart Assignment Tracker provides colleges and universities with an intuitive platform to streamline assignment workflows, elevate institutional accountability, and empower student success.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Centralized Schedule</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Real-time calendar synced with all active enrolled courses.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">PWA Native Speed</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Installable mobile & desktop app with offline service worker.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
