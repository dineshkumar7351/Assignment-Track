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
  SearchCheck,
  CheckCircle2,
  Lock,
  Cpu,
  Star,
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="relative overflow-hidden space-y-24 sm:space-y-32 py-10 sm:py-16">
      {/* Dynamic Ambient Background Light Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-pink-500/10 dark:from-indigo-600/25 dark:via-purple-600/20 dark:to-cyan-500/15 blur-[130px] rounded-full pointer-events-none -z-10 animate-pulse-subtle" />
      <div className="absolute top-1/2 right-4 sm:right-16 w-[450px] h-[350px] bg-cyan-500/15 dark:bg-cyan-600/20 blur-[110px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[400px] bg-indigo-500/10 dark:bg-indigo-700/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-4 sm:pt-8">
        <div className="max-w-4xl mx-auto">
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-xs mb-8 hover:scale-105 transition-transform border border-indigo-200/60 dark:border-indigo-800/60">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600 dark:bg-indigo-400"></span>
            </span>
            <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Next-Generation Academic Management & Intelligence</span>
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
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-base font-bold rounded-2xl shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 glass-card hover:bg-slate-100/90 dark:hover:bg-slate-800/90 text-slate-800 dark:text-slate-100 text-base font-bold rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              Portal Login
            </Link>
          </div>

          {/* Key Stat Cards */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass-card p-4 sm:p-5 rounded-2xl text-center glow-card">
              <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">99.8%</p>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">On-Time Submissions</p>
            </div>
            <div className="glass-card p-4 sm:p-5 rounded-2xl text-center glow-card">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">100%</p>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">Similarity Check</p>
            </div>
            <div className="glass-card p-4 sm:p-5 rounded-2xl text-center glow-card">
              <p className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400">24/7</p>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">AI Academic Tutor</p>
            </div>
            <div className="glass-card p-4 sm:p-5 rounded-2xl text-center glow-card">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-500 dark:text-amber-400">3 Roles</p>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">Unified Campus Sync</p>
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
          <div className="glass-card rounded-3xl p-8 glow-card border border-indigo-100 dark:border-slate-800 flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-600/50">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 shadow-sm">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Student Portal</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Stay on top of deadlines with visual calendar milestones, instant feedback reports, and interactive AI assignment planning.
              </p>
              <ul className="space-y-3 text-xs font-medium text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>Personalized dynamic assignment timeline</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>Version-controlled submission uploads</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>Instant grading breakdown & rubrics</span>
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
          <div className="glass-card rounded-3xl p-8 glow-card border border-emerald-100 dark:border-slate-800 relative flex flex-col justify-between hover:border-emerald-300 dark:hover:border-emerald-600/50">
            <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
              Faculty Hub
            </div>
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 shadow-sm">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Teacher Portal</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Publish rich coursework with attachments, review submissions, and utilize AI textual similarity detection for academic honesty.
              </p>
              <ul className="space-y-3 text-xs font-medium text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>1-Click assignment drafting & publishing</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Integrated Plagiarism & Similarity scanner</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Speed-grader with customized feedback</span>
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
          <div className="glass-card rounded-3xl p-8 glow-card border border-rose-100 dark:border-slate-800 flex flex-col justify-between hover:border-rose-300 dark:hover:border-rose-600/50">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-6 shadow-sm">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Admin Portal</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Govern institution-wide course management, oversee audit logs, enforce academic guidelines, and analyze cross-departmental success.
              </p>
              <ul className="space-y-3 text-xs font-medium text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  <span>Campus-wide user & department management</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  <span>Academic compliance & activity audit trails</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  <span>Aggregated institutional performance metrics</span>
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

      {/* Feature Highlights Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xl">
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
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Centralized Schedule</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">Real-time calendar synced with all active enrolled courses.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">AI Assistant & Tutor</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">Interactive academic guidance, outline generation & smart feedback.</p>
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
