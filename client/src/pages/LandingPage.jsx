import React, { useState, useEffect } from 'react';
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
  FileText,
  BarChart3,
  Bot,
  Flame,
  ChevronRight,
  HelpCircle,
  Plus,
  Minus,
  RefreshCw,
  Send,
  Sliders,
  Check,
  AlertCircle,
  Play,
  Copy,
  ExternalLink,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  AlertTriangle,
  FolderGit2,
  SlidersHorizontal,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const mockChartData = [
  { month: 'Week 1', onTime: 92, avgScore: 84 },
  { month: 'Week 2', onTime: 95, avgScore: 86 },
  { month: 'Week 3', onTime: 91, avgScore: 88 },
  { month: 'Week 4', onTime: 98, avgScore: 91 },
  { month: 'Week 5', onTime: 96, avgScore: 93 },
  { month: 'Week 6', onTime: 99, avgScore: 95 },
];

const mockAssignments = [
  {
    id: 'CS-304',
    title: 'Distributed Systems - Raft Consensus & Replication',
    subject: 'Computer Science',
    due: 'Tomorrow, 11:59 PM',
    status: 'In Progress',
    priority: 'High',
    maxPoints: 100,
    similarity: '4% (Clean)',
    progress: 75,
  },
  {
    id: 'AI-401',
    title: 'Computer Vision - YOLOv8 Real-Time Object Detection',
    subject: 'Artificial Intelligence',
    due: 'Oct 28, 5:00 PM',
    status: 'Submitted',
    priority: 'Normal',
    maxPoints: 100,
    similarity: '2% (Clean)',
    progress: 100,
  },
  {
    id: 'MATH-202',
    title: 'Multivariable Calculus - Stokes Theorem Problem Set',
    subject: 'Applied Mathematics',
    due: 'Nov 02, 11:59 PM',
    status: 'Pending',
    priority: 'Medium',
    maxPoints: 50,
    similarity: '0% (Clean)',
    progress: 20,
  },
];

const testimonials = [
  {
    name: 'Dr. Sarah Connor',
    role: 'Associate Professor of Computer Science',
    university: 'Stanford University',
    avatar: 'SC',
    content:
      'AssignTrack reduced our grading turnaround from 10 days to under 48 hours. The automatic cosine similarity checker gives us confidence in academic integrity without tedious manual verification.',
  },
  {
    name: 'Alex Chen',
    role: 'Senior CS Student (Class of 2026)',
    university: 'UC Berkeley',
    avatar: 'AC',
    content:
      'The unified deadline timeline and AI concept breakdown feature changed my semester. I went from pulling all-nighters to having every assignment submitted 24 hours ahead of schedule.',
  },
  {
    name: 'Marcus Vance',
    role: 'Dean of Academic Technology',
    university: 'MIT',
    avatar: 'MV',
    content:
      'The role-based security, instant department analytics, and audit logging make AssignTrack the gold standard for institutional coursework management.',
  },
];

const faqs = [
  {
    q: 'How does AssignTrack differ from generic tools like Google Classroom or Canvas?',
    a: 'AssignTrack is purpose-built with modern engineering workflows in mind. It includes integrated N-Gram cosine similarity analysis, automated rubric grading engines, an AI-powered academic concept outliner, and deep student performance analytics that standard LMS tools lack.',
  },
  {
    q: 'How does the Anti-Plagiarism & Textual Similarity Engine work?',
    a: 'Our similarity engine breaks down student submissions into rolling n-gram tokens and calculates pairwise cosine similarity matrices across all cohort and historical submissions, highlighting identical code and textual snippets with side-by-side visual diffs.',
  },
  {
    q: 'Is my university data private and secured with RBAC?',
    a: 'Yes. All communication is secured via cryptographically signed JSON Web Tokens (JWT) with bcrypt salt rounds. Data access is strictly isolated across Student, Teacher, and Administrator roles with HTTPS encryption.',
  },
  {
    q: 'Can students use the mobile app offline?',
    a: 'Yes! Our React Native mobile application caches assignments locally, enabling students to review problem statements, check deadlines, and track milestones even without active internet connectivity.',
  },
];

const LandingPage = () => {
  // Active Interactive App tab
  const [activeAppTab, setActiveAppTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Similarity Slider Demo
  const [similarityDemoVal, setSimilarityDemoVal] = useState(12);

  // Interactive Live GPA Estimator
  const [homeworkScore, setHomeworkScore] = useState(94);
  const [labScore, setLabScore] = useState(90);
  const [midtermScore, setMidtermScore] = useState(88);
  const [projectScore, setProjectScore] = useState(96);

  // Active Role Persona Tab
  const [activePersona, setActivePersona] = useState('student');

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState(0);

  // Live estimated GPA calculation
  const computedTotal = Math.round(
    homeworkScore * 0.25 + labScore * 0.25 + midtermScore * 0.25 + projectScore * 0.25
  );

  const getGradeMeta = (score) => {
    if (score >= 93) return { grade: 'A (4.0 GPA)', badge: 'Outstanding', color: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-800' };
    if (score >= 85) return { grade: 'B+ (3.5 GPA)', badge: 'Very Good', color: 'text-indigo-600 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/50 dark:border-indigo-800' };
    if (score >= 75) return { grade: 'B (3.0 GPA)', badge: 'Good Standing', color: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/50 dark:border-blue-800' };
    return { grade: 'C (2.0 GPA)', badge: 'Needs Attention', color: 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/50 dark:border-amber-800' };
  };

  const gradeMeta = getGradeMeta(computedTotal);

  return (
    <div className="space-y-24 sm:space-y-32 py-6 sm:py-12">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Clean, High-Craft Human SaaS Layout) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-4 sm:pt-10">
        {/* Release Pill Badge */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-8 shadow-xs hover:border-indigo-300 transition-colors">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600 dark:bg-indigo-400" />
          </span>
          <span>AssignTrack 2.6 is live</span>
          <span className="text-slate-400 dark:text-slate-600">•</span>
          <span className="text-slate-600 dark:text-slate-300 font-medium">Auto-Rubric & Plagiarism Diff</span>
          <ChevronRight className="w-3.5 h-3.5 text-indigo-500" />
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-5xl mx-auto leading-[1.08] mb-6">
          The intelligent assignment OS <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 dark:from-indigo-400 dark:via-purple-400 dark:to-cyan-400">
            for high-performing universities.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl font-normal text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Unify course submissions, automated rubric grading, and real-time plagiarism detection into one ultra-fast workspace. Built for students who care about deadlines and faculty who demand rigor.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-6">
          <Link
            to="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm sm:text-base font-bold rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <span>Sign In to Portal</span>
          </Link>
        </div>

        {/* Trust Mini Text */}
        <div className="flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-500" /> No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-500" /> Instant JWT & Clerk SSO
          </span>
          <span className="flex items-center gap-1.5 hidden sm:flex">
            <CheckCircle className="w-4 h-4 text-emerald-500" /> Mobile & Web Synced
          </span>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE DESKTOP APP WORKSPACE PREVIEW (Realistic Product UI) */}
        {/* ========================================================================= */}
        <div className="mt-14 max-w-6xl mx-auto rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-900/10 dark:shadow-none overflow-hidden text-left">
          {/* Top Window Chrome Bar */}
          <div className="px-4 py-3 bg-slate-100/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" />
              <div className="ml-4 px-3 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-500 flex items-center gap-2">
                <Lock className="w-3 h-3 text-emerald-500" />
                <span>app.assigntrack.edu/workspace/fall-2026</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span>Search courses...</span>
                <kbd className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">⌘K</kbd>
              </div>
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                JS
              </div>
            </div>
          </div>

          {/* Interactive Workspace App Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Active Academic Term</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Department of Computer Science & Engineering • 4 Enrolled Courses</p>
              </div>

              {/* Tab Pills */}
              <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80">
                <button
                  onClick={() => setActiveAppTab('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeAppTab === 'all'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All Tasks (3)
                </button>
                <button
                  onClick={() => setActiveAppTab('urgent')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeAppTab === 'urgent'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Due Soon
                </button>
                <button
                  onClick={() => setActiveAppTab('graded')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeAppTab === 'graded'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Graded
                </button>
              </div>
            </div>

            {/* Task Cards List */}
            <div className="space-y-3">
              {mockAssignments
                .filter((item) => (activeAppTab === 'urgent' ? item.priority === 'High' : activeAppTab === 'graded' ? item.status === 'Submitted' : true))
                .map((task) => (
                  <div
                    key={task.id}
                    className="p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-slate-900/60 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {task.id}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{task.subject}</span>
                        {task.priority === 'High' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-900">
                            Urgent
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">{task.title}</h3>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {task.due}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Similarity: {task.similarity}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="text-right hidden sm:block">
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{task.maxPoints} Points</div>
                        <div className="text-[10px] text-slate-500">{task.status}</div>
                      </div>
                      <Link
                        to="/login"
                        className="px-4 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 dark:text-indigo-300 text-xs font-bold transition-all"
                      >
                        Open Task →
                      </Link>
                    </div>
                  </div>
                ))}
            </div>

            {/* Quick KPI Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                <div className="text-[11px] font-semibold text-slate-500">Term Average</div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">3.94 GPA</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                <div className="text-[11px] font-semibold text-slate-500">Submission Rate</div>
                <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">100% On Time</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                <div className="text-[11px] font-semibold text-slate-500">AI Tutor Queries</div>
                <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">24 Concepts</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                <div className="text-[11px] font-semibold text-slate-500">Academic Standing</div>
                <div className="text-xl font-extrabold text-purple-600 dark:text-purple-400 mt-0.5">Dean's List</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. UNIVERSITY TRUST STRIP */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 mb-6">
            Empowering students and professors across premier academic institutions
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 opacity-60 dark:opacity-50 grayscale hover:grayscale-0 transition-all font-serif font-black text-base sm:text-lg text-slate-700 dark:text-slate-300">
            <span>STANFORD UNIVERSITY</span>
            <span>UC BERKELEY</span>
            <span>MIT COMPUTING</span>
            <span>OXFORD ACADEMICS</span>
            <span>HARVARD ENG</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. BENTO GRID FEATURES ("Engineered for Academic Rigor") */}
      {/* ========================================================================= */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-xs uppercase font-bold tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">
            Engineered For Clarity
          </h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Features built for how universities actually operate.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Bento 1: Plagiarism & Similarity Scanner (Span 7) */}
          <div className="md:col-span-7 p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                <SearchCheck className="w-5 h-5" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Automated Cosine Similarity Scanner</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Evaluates every submission against current cohort and historical repositories using tokenized rolling n-grams. Faculty receive instant percentage diffs.
              </p>
            </div>

            {/* Interactive Demo Widget */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Simulate Cohort Overlap:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{similarityDemoVal}% Match (Safe)</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={similarityDemoVal}
                onChange={(e) => setSimilarityDemoVal(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 text-[11px] font-mono text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                <span className="text-emerald-500 font-bold">✓ 0 Critical Token Overlaps</span> • Shingle size: 3 • Cosine Confidence: 99.4%
              </div>
            </div>
          </div>

          {/* Bento 2: AI Study Outliner & Companion (Span 5) */}
          <div className="md:col-span-5 p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                <Bot className="w-5 h-5" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Pedagogical AI Study Outliner</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Break down complex rubrics, generate study roadmaps, and debug algorithmic logic without academic integrity violations.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/60 text-xs space-y-2">
              <div className="font-bold text-purple-900 dark:text-purple-200">Example Outline Generation:</div>
              <div className="text-slate-600 dark:text-slate-300 font-medium">
                1. Thread Pools & Work-Stealing Scheduling <br />
                2. Deadlock Prevention (Resource Hierarchy) <br />
                3. Lock-Free Atomic Operations (CAS)
              </div>
            </div>
          </div>

          {/* Bento 3: Timeline & Deadline Radar (Span 6) */}
          <div className="md:col-span-6 p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-2">
              <Calendar className="w-5 h-5" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white">Unified Timeline & Deadline Radar</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Eliminate surprise due dates. Color-coded milestone badges and chronological schedules synchronize seamlessly across web and mobile.
            </p>
          </div>

          {/* Bento 4: Automated Rubrics & Fast Grading (Span 6) */}
          <div className="md:col-span-6 p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-2">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white">Configurable Rubrics & Feedback</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Define modular point breakdowns (Correctness, Code Quality, Documentation). Grade whole cohorts with 1-click feedback distribution.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. LIVE INTERACTIVE GPA ESTIMATOR */}
      {/* ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-lg">
          <div className="max-w-2xl mb-8">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400">Interactive Tool</span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">Course Grade Projector</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Adjust your expected component scores below to see your projected letter grade and GPA impact in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Sliders (Span 7) */}
            <div className="md:col-span-7 space-y-5">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  <span>Assignments & Problem Sets (25%)</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">{homeworkScore}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={homeworkScore}
                  onChange={(e) => setHomeworkScore(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  <span>Laboratory Milestones (25%)</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">{labScore}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={labScore}
                  onChange={(e) => setLabScore(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  <span>Midterm Examination (25%)</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">{midtermScore}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={midtermScore}
                  onChange={(e) => setMidtermScore(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  <span>Final Capstone Project (25%)</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">{projectScore}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={projectScore}
                  onChange={(e) => setProjectScore(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>

            {/* Live Result Card (Span 5) */}
            <div className="md:col-span-5 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-center space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Projected Final Grade</div>
              <div className="text-5xl font-black text-slate-900 dark:text-white font-mono">
                {computedTotal}%
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${gradeMeta.color}`}>
                {gradeMeta.grade} • {gradeMeta.badge}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Calculated based on standard 4-point university honors grading rubric.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. USER TESTIMONIALS & SOCIAL PROOF */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs uppercase font-bold tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">
            Social Proof
          </h2>
          <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Loved by students. Trusted by professors.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-6 shadow-xs"
            >
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                "{t.content}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{t.role}</div>
                  <div className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">{t.university}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FAQ ACCORDION */}
      {/* ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h3 className="text-3xl font-black text-slate-900 dark:text-white">Frequently Asked Questions</h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Everything you need to know about the platform.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                className="w-full p-5 text-left font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center justify-between cursor-pointer"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <Minus className="w-4 h-4 text-indigo-600" /> : <Plus className="w-4 h-4 text-slate-400" />}
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. HIGH-CONVERTING BOTTOM CALL TO ACTION */}
      {/* ========================================================================= */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-14 bg-slate-950 text-white text-center relative overflow-hidden border border-slate-800 shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Ready to elevate your academic trajectory?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Join thousands of students and faculty members who have streamlined assignments, submissions, and grading.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/register"
                className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm sm:text-base font-bold rounded-xl shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all cursor-pointer"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white text-sm sm:text-base font-bold rounded-xl border border-slate-700 hover:scale-105 transition-all cursor-pointer"
              >
                Sign In to Campus Portal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
