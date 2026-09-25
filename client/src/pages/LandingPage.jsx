import React, { useState } from 'react';
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
  X,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import heroImg from '../assets/hero-3d.jpg';

const mockPerformanceData = [
  { week: 'Wk 1', submissions: 45, avgScore: 78 },
  { week: 'Wk 2', submissions: 92, avgScore: 82 },
  { week: 'Wk 3', submissions: 138, avgScore: 85 },
  { week: 'Wk 4', submissions: 185, avgScore: 88 },
  { week: 'Wk 5', submissions: 240, avgScore: 91 },
  { week: 'Wk 6', submissions: 310, avgScore: 94 },
];

const liveCampusActivity = [
  { id: 1, user: 'Alex Chen', role: 'Student', action: 'submitted Algorithm Analysis Lab 4', time: 'Just now', icon: '📝', badge: 'On Time' },
  { id: 2, user: 'Dr. Sarah Mitchell', role: 'Professor', action: 'graded 28 submissions for CS-301', time: '2m ago', icon: '⚡', badge: 'Auto-Rubric' },
  { id: 3, user: 'AI Assistant', role: 'Tutor', action: 'generated custom study flashcards for 45 students', time: '5m ago', icon: '🤖', badge: 'AI Tutor' },
  { id: 4, user: 'Priya Sharma', role: 'Student', action: 'achieved 98% on Cloud Computing Milestone', time: '8m ago', icon: '🌟', badge: 'Grade: A+' },
];

const faqs = [
  {
    q: 'How does AssignTrack help students stay on top of deadlines?',
    a: 'AssignTrack automatically syncs assignments from all enrolled courses into a single real-time timeline. It provides push notifications, milestone progress trackers, and dynamic calendar sync so you never miss a submission.',
  },
  {
    q: 'How does the built-in Plagiarism & Similarity scanner work?',
    a: 'Our anti-plagiarism engine evaluates student submissions using cosine n-gram similarity matrices across historical and cohort submissions, providing faculty with instant percentage match reports and color-coded textual diffs.',
  },
  {
    q: 'Can students chat with the AI Study Companion safely?',
    a: 'Yes! The AI Academic Assistant is designed with strict pedagogical boundaries: it provides concept explanations, code debugging guidance, and structured outlines without giving away direct answers.',
  },
  {
    q: 'Is AssignTrack accessible on mobile devices?',
    a: 'Yes. AssignTrack offers a mobile responsive web application and an Expo React Native mobile app with full offline token caching and push alerts.',
  },
];

const LandingPage = () => {
  // Demo Video Modal state
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Hero interactive demo tab state
  const [activeHeroTab, setActiveHeroTab] = useState('student');
  const [similarityScore, setSimilarityScore] = useState(14);
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [aiChatMessages, setAiChatMessages] = useState([
    { role: 'assistant', text: 'Hello! I am your AI Academic Tutor. How can I help you excel in your coursework today?' },
    { role: 'user', text: 'Can you give me a structured outline for an Operating Systems Virtual Memory report?' },
    { role: 'assistant', text: 'Here is an optimal structure:\n1. Introduction to Paging & Segmentation\n2. Page Replacement Algorithms (LRU vs FIFO)\n3. TLB Cache Miss Penalty Analysis\n4. Thrashing Mitigation Strategies.' },
  ]);

  // Interactive Grade Estimator State
  const [homeworkWeight, setHomeworkWeight] = useState(90);
  const [quizScore, setQuizScore] = useState(85);
  const [labScore, setLabScore] = useState(95);
  const [projectScore, setProjectScore] = useState(92);

  // Active FAQ Accordion index
  const [openFaq, setOpenFaq] = useState(0);

  // Compute live estimated GPA
  const computedGrade = Math.round(
    homeworkWeight * 0.25 + quizScore * 0.25 + labScore * 0.25 + projectScore * 0.25
  );

  const getLetterGrade = (score) => {
    if (score >= 93) return { grade: 'A', text: 'Outstanding Performance', color: 'text-emerald-500' };
    if (score >= 85) return { grade: 'B+', text: 'Very Good Progress', color: 'text-indigo-500' };
    if (score >= 75) return { grade: 'B', text: 'Good Academic Standing', color: 'text-blue-500' };
    if (score >= 65) return { grade: 'C', text: 'Satisfactory', color: 'text-amber-500' };
    return { grade: 'Needs Improvement', text: 'Academic Warning', color: 'text-rose-500' };
  };

  const gradeInfo = getLetterGrade(computedGrade);

  const handleSendAiPrompt = (promptText) => {
    const query = promptText || aiPromptInput;
    if (!query.trim()) return;

    setAiChatMessages((prev) => [
      ...prev,
      { role: 'user', text: query },
      {
        role: 'assistant',
        text: `Analyzing "${query}"...\nKey insights generated with rubric alignment and verified reference citations.`,
      },
    ]);
    setAiPromptInput('');
  };

  return (
    <div className="relative overflow-hidden space-y-24 sm:space-y-32 py-4 sm:py-8">
      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-[650px] h-[550px] bg-gradient-to-tr from-purple-400/20 via-indigo-400/20 to-cyan-300/20 dark:from-purple-900/20 dark:via-indigo-900/20 dark:to-cyan-900/15 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 -left-20 w-[550px] h-[450px] bg-indigo-400/15 dark:bg-indigo-900/20 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* ========================================================= */}
      {/* 1. HERO SECTION (MATCHING DESIGN SPECIFICATION) */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 lg:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Column: Typography & CTAs */}
          <div className="lg:col-span-6 space-y-8 text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f3f0ff] dark:bg-indigo-950/60 border border-[#e0e7ff] dark:border-indigo-800 text-[#4338ca] dark:text-indigo-300 text-xs sm:text-sm font-bold shadow-xs">
              <span className="text-amber-500 font-black text-sm">✦</span>
              <span>Your Study Companion</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-black tracking-tight text-[#0f172a] dark:text-white leading-[1.08]">
              Never Miss a <br />
              <span className="bg-gradient-to-r from-[#2563eb] via-[#4338ca] to-[#6366f1] bg-clip-text text-transparent">
                Deadline Again.
              </span>
            </h1>

            {/* Paragraph Subtitle */}
            <p className="text-base sm:text-lg font-medium text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              Organize, track, submit and manage your assignments in one place. Stay focused, be consistent and achieve more in your academic journey.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-[#3730a3] via-[#4338ca] to-[#4f46e5] hover:from-[#312e81] hover:to-[#4338ca] text-white text-base font-bold rounded-full shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={() => setShowDemoModal(true)}
                className="inline-flex items-center justify-center gap-3 px-7 py-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-[#4338ca] dark:text-indigo-300 text-base font-bold rounded-full border border-slate-200 dark:border-slate-700 shadow-md shadow-slate-200/50 dark:shadow-none hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-[#4338ca] dark:text-indigo-400">
                  <Play className="w-3.5 h-3.5 fill-[#4338ca] dark:fill-indigo-400 ml-0.5" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Bottom Stats Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200/80 dark:border-slate-800 max-w-lg">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-[#4338ca] dark:text-indigo-400">
                  1000+
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  Students
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-black text-[#4338ca] dark:text-indigo-400">
                  50+
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  Faculty Members
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-black text-[#4338ca] dark:text-indigo-400">
                  95%
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  On-time Submission
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Column: 3D Illustration */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Ambient circular backdrops */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/15 to-cyan-400/10 rounded-full blur-3xl -z-10 scale-95" />
            
            <div className="relative group w-full max-w-[540px] rounded-3xl overflow-hidden p-2 transition-transform duration-500 hover:scale-[1.01]">
              <img
                src={heroImg}
                alt="AssignTrack 3D Study Companion"
                className="w-full h-auto object-cover rounded-[22px] shadow-2xl shadow-indigo-500/15 dark:shadow-indigo-950/40 border border-white/60 dark:border-slate-800"
              />

              {/* Floating Live Badge Overlay */}
              <div className="absolute bottom-6 left-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-700 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white">CS-304 Submitted</div>
                  <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">100% On Time • No Plagiarism</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* DEMO MODAL POPUP */}
      {/* ========================================================= */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-[#4338ca] flex items-center justify-center text-white">
                <Play className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">AssignTrack Live Platform Demo</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">See how students and faculty streamline submissions and grading</p>
              </div>
            </div>

            <div className="aspect-video bg-gradient-to-tr from-slate-900 to-indigo-950 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-white border border-slate-700">
              <Sparkles className="w-12 h-12 text-indigo-400 mb-4 animate-bounce" />
              <h4 className="text-lg font-bold mb-2">Interactive Walkthrough Experience</h4>
              <p className="text-xs text-slate-300 max-w-md mb-6">
                Explore the live Student Portal, Anti-Plagiarism Engine, and AI Assistant in the interactive sandbox below!
              </p>
              <button
                onClick={() => {
                  setShowDemoModal(false);
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-2.5 rounded-full bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Open Live Interactive Sandbox ↓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. CORE FEATURES HIGHLIGHTS (#features) */}
      {/* ========================================================= */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-[#4338ca] dark:text-indigo-400 text-xs font-bold border border-indigo-100 dark:border-indigo-800 mb-4">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Built for Modern Higher Education</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">
            Engineered from the ground up with university-grade tools, automated rubric grading, and real-time deadline monitoring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 flex items-center justify-center text-[#4338ca] dark:text-indigo-400 mb-5 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Smart Deadline Calendar</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Consolidate all university course tasks into a unified chronological schedule with smart milestone alerts.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
              <SearchCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Anti-Plagiarism Engine</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Instant cosine n-gram similarity detection comparing cohort and historical coursework with highlighted match diffs.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/80 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-5 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">AI Academic Companion</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              24/7 AI-powered tutoring, report outline generation, conceptual breakdowns, and debugging tips.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/80 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-5 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Auto-Rubric Grading</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Speed up grading workflows for professors with automated evaluation rubrics and instant feedback distribution.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. INTERACTIVE LIVE PRODUCT DEMO SANDBOX */}
      {/* ========================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f3f0ff] dark:bg-indigo-950/60 text-[#4338ca] dark:text-indigo-400 text-xs font-bold mb-3 border border-indigo-100 dark:border-indigo-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Interactive Live Product Preview</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Experience the Workspace Sandbox
          </h2>
        </div>

        <div className="rounded-3xl p-1.5 bg-gradient-to-b from-indigo-500/30 via-purple-500/20 to-slate-200/50 dark:to-slate-800/50 shadow-2xl backdrop-blur-xl">
          <div className="bg-white dark:bg-slate-900 rounded-[22px] border border-slate-200/80 dark:border-slate-800 overflow-hidden">
            {/* Header with Switcher Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span className="ml-2 text-xs font-bold text-slate-500 dark:text-slate-400 hidden sm:inline">
                  Interactive Live Workspace Sandbox
                </span>
              </div>

              {/* Tab Selector Buttons */}
              <div className="flex items-center p-1 rounded-xl bg-slate-200/80 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveHeroTab('student')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeHeroTab === 'student'
                      ? 'bg-[#4338ca] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Student View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveHeroTab('teacher')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeHeroTab === 'teacher'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <SearchCheck className="w-3.5 h-3.5" />
                  <span>Teacher & Plagiarism</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveHeroTab('ai')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeHeroTab === 'ai'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>AI Tutor Chat</span>
                </button>
              </div>
            </div>

            {/* Tab 1: Student View Preview */}
            {activeHeroTab === 'student' && (
              <div className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60">
                    <div className="text-xs font-bold text-indigo-700 dark:text-indigo-400">Total Tasks</div>
                    <div className="text-2xl font-black text-indigo-950 dark:text-white mt-1">12 Active</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60">
                    <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Submitted</div>
                    <div className="text-2xl font-black text-emerald-950 dark:text-white mt-1">10 Done</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/60">
                    <div className="text-xs font-bold text-amber-700 dark:text-amber-400">Pending</div>
                    <div className="text-2xl font-black text-amber-950 dark:text-white mt-1">2 Due Soon</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/60">
                    <div className="text-xs font-bold text-purple-700 dark:text-purple-400">Avg Grade</div>
                    <div className="text-2xl font-black text-purple-950 dark:text-white mt-1">94.5% (A)</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs">CS</div>
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white">Distributed Systems Lab 4</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Due Tomorrow, 11:59 PM • Max 100 Pts</div>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">Ready to Submit</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Teacher & Plagiarism Preview */}
            {activeHeroTab === 'teacher' && (
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">N-Gram Similarity Scanner Test</div>
                    <div className="text-xs text-slate-500">Live test against campus cohort database</div>
                  </div>
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    {similarityScore}% Match (Clean)
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 block">
                    Simulate Similarity Match Percentage: {similarityScore}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={similarityScore}
                    onChange={(e) => setSimilarityScore(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#4338ca]"
                  />
                </div>
              </div>
            )}

            {/* Tab 3: AI Tutor Chat */}
            {activeHeroTab === 'ai' && (
              <div className="p-6 sm:p-8 space-y-4">
                <div className="h-48 overflow-y-auto space-y-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  {aiChatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-2xl text-xs font-medium leading-relaxed max-w-[85%] ${
                        msg.role === 'user'
                          ? 'ml-auto bg-[#4338ca] text-white'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiPromptInput}
                    onChange={(e) => setAiPromptInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendAiPrompt()}
                    placeholder="Ask AI Tutor for assignment outline or concept debugging..."
                    className="flex-1 px-4 py-2.5 rounded-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:border-[#4338ca]"
                  />
                  <button
                    onClick={() => handleSendAiPrompt()}
                    className="px-5 py-2.5 rounded-full bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. ABOUT / MULTI-ROLE PORTALS (#about) */}
      {/* ========================================================= */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f3f0ff] dark:bg-indigo-950/60 text-[#4338ca] dark:text-indigo-400 text-xs font-bold mb-4 border border-indigo-100 dark:border-indigo-800">
            <Users className="w-3.5 h-3.5" />
            <span>Dedicated Multi-Role Experience</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
            Tailored for Every Academic Role
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">
            From seamless student submissions to fast faculty grading and university administrator oversight.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Student Persona */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md hover:border-indigo-500 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-[#4338ca] dark:text-indigo-400 mb-6">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Student Workspace</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                Submit coursework, view upcoming deadline reminders, calculate live course GPA, and ask the AI Tutor for guidance.
              </p>
            </div>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#4338ca] dark:text-indigo-400 hover:gap-3 transition-all"
            >
              <span>Join as Student</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Faculty Persona */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md hover:border-emerald-500 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Faculty & Professor Hub</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                Create assignments, configure scoring rubrics, review automated plagiarism check results, and publish grades instantly.
              </p>
            </div>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:gap-3 transition-all"
            >
              <span>Join as Faculty</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Admin Persona */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md hover:border-rose-500 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Campus Administration</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                Manage university departments, faculty assignments, system audits, and monitor overall campus performance metrics.
              </p>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:gap-3 transition-all"
            >
              <span>Admin Access</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      {/* ========================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Everything you need to know about AssignTrack.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                className="w-full p-5 text-left font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center justify-between cursor-pointer"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <Minus className="w-4 h-4 text-[#4338ca]" /> : <Plus className="w-4 h-4 text-slate-400" />}
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

      {/* ========================================================= */}
      {/* 6. CALL TO ACTION BANNER (#contact) */}
      {/* ========================================================= */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-[#1e1b4b] via-[#312e81] to-[#4338ca] text-white text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Ready to Upgrade Your Academic Workflow?
            </h2>
            <p className="text-sm sm:text-base text-indigo-100 leading-relaxed">
              Join over 1,000+ students and faculty members. Never miss another deadline and elevate your academic performance today.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/register"
                className="px-8 py-4 bg-white text-[#4338ca] hover:bg-slate-100 text-sm sm:text-base font-bold rounded-full shadow-lg hover:scale-105 transition-all cursor-pointer"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-indigo-950/60 hover:bg-indigo-950 text-white text-sm sm:text-base font-bold rounded-full border border-indigo-400/40 hover:scale-105 transition-all cursor-pointer"
              >
                Sign In to Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
