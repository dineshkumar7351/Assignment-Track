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
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

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
    q: 'How does the N-Gram Plagiarism & Similarity scanner work?',
    a: 'Our built-in similarity engine decomposes submissions into multi-token n-grams and computes cosine similarity matrices against all current and historical cohort submissions, generating real-time match reports with side-by-side textual diffs.',
  },
  {
    q: 'Can students access AI tutoring without cheating risks?',
    a: 'Yes! The AI Academic Assistant is engineered with pedagogical guidelines—it provides structural outlines, concept explanations, and debugging hints rather than raw assignment answers.',
  },
  {
    q: 'Is Smart Assignment Tracker compatible with mobile devices?',
    a: 'Absolutely. The platform features an ultra-responsive web application as well as a dedicated React Native mobile app with offline local caching and push notifications.',
  },
  {
    q: 'How are different roles (Student, Teacher, Admin) authenticated?',
    a: 'Authentication is secured via industry-standard cryptographically signed JSON Web Tokens (JWT) with bcrypt salt rounds and Clerk SSO authentication fallback.',
  },
];

const LandingPage = () => {
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

  // Active Role Persona Card
  const [activeRoleCard, setActiveRoleCard] = useState('student');

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
    <div className="relative overflow-hidden space-y-20 sm:space-y-28 py-6 sm:py-12">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-cyan-500/15 dark:from-indigo-600/25 dark:via-purple-600/20 dark:to-cyan-500/20 blur-[140px] rounded-full pointer-events-none -z-10 animate-pulse-subtle" />
      <div className="absolute top-1/3 -right-20 w-[550px] h-[450px] bg-cyan-500/15 dark:bg-cyan-600/20 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 -left-20 w-[600px] h-[500px] bg-indigo-500/15 dark:bg-indigo-700/20 blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* ========================================================= */}
      {/* 1. HERO SECTION & LIVE INTERACTIVE WORKSPACE DEMO */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="text-center max-w-4xl mx-auto mb-10">
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-indigo-700 dark:text-indigo-300 text-xs font-extrabold shadow-sm border border-indigo-200/80 dark:border-indigo-800/80 mb-6 hover:scale-105 transition-all">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600 dark:bg-indigo-400"></span>
            </span>
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Smart Academic Workflow System v2.6 • Active JWT & Clerk SSO</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white sm:leading-[1.08] mb-6">
            Where Academic Excellence <br />
            <span className="gradient-hero-text">Meets AI Velocity</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl font-medium text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            The intelligent assignment workspace for universities. Automated rubric grading, instant similarity detection, and 24/7 AI tutor guidance for Students, Faculty, and Administrators.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-8">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-base font-bold rounded-2xl shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 glass-card hover:bg-slate-100/90 dark:hover:bg-slate-800/90 text-slate-800 dark:text-slate-100 text-base font-bold rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Campus Portal Login</span>
            </Link>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <Check className="w-3.5 h-3.5 text-emerald-500" /> 100% Anti-Plagiarism Engine
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <Check className="w-3.5 h-3.5 text-emerald-500" /> Gemini AI Academic Tutor
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <Check className="w-3.5 h-3.5 text-emerald-500" /> Role-Based Access Control
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* INTERACTIVE LIVE PRODUCT DEMO PREVIEW (HERO SHOWCASE) */}
        {/* ========================================================= */}
        <div className="max-w-5xl mx-auto rounded-3xl p-1.5 bg-gradient-to-b from-indigo-500/30 via-purple-500/20 to-slate-200/50 dark:to-slate-800/50 shadow-2xl backdrop-blur-xl">
          <div className="bg-white/95 dark:bg-slate-900/95 rounded-[22px] border border-slate-200/80 dark:border-slate-800 overflow-hidden">
            {/* Demo Header Bar with Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80">
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
                      ? 'bg-indigo-600 text-white shadow-xs'
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold">
                        CS-402
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                        Distributed Systems & Raft Consensus Lab
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Due: Tomorrow at 11:59 PM • Max Marks: 100 • Submission Type: PDF / Code Repo
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> 23h 14m remaining
                    </span>
                  </div>
                </div>

                {/* Submissions & Deliverables status card */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                      <span>Status</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">Ready to Submit</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Version 1.2 drafted</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                      <span>File Attached</span>
                      <FileText className="w-4 h-4 text-indigo-500" />
                    </div>
                    <p className="text-base font-extrabold text-slate-900 dark:text-white truncate">raft_consensus_report.pdf</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">2.4 MB • Textual Verified</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                      <span>Target Grade</span>
                      <Award className="w-4 h-4 text-purple-500" />
                    </div>
                    <p className="text-base font-extrabold text-purple-600 dark:text-purple-400">95 / 100 (A+)</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Automated Rubric Target</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500 font-medium">Click explore to view real student portal</span>
                  <Link
                    to="/student/dashboard"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    <span>Open Student Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Tab 2: Teacher & Plagiarism Preview */}
            {activeHeroTab === 'teacher' && (
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <SearchCheck className="w-5 h-5 text-emerald-500" />
                      Anti-Plagiarism & Textual Similarity Scanner
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Drag slider to test live similarity threshold detection & highlight flags
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                      similarityScore > 50
                        ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                        : similarityScore > 25
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                        : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    }`}>
                      {similarityScore}% Text Match
                    </span>
                  </div>
                </div>

                {/* Similarity interactive slider */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                    <span>Similarity Gauge Test:</span>
                    <span>{similarityScore}% Match Detected</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={similarityScore}
                    onChange={(e) => setSimilarityScore(Number(e.target.value))}
                    className="w-full accent-emerald-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>0% (Original)</span>
                    <span>25% (Acceptable Quotes)</span>
                    <span>50% (High Overlap)</span>
                    <span>100% (Flagged Duplicate)</span>
                  </div>
                </div>

                {/* Live Mock Text Comparison */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-2">
                  <div className="text-[11px] font-bold text-slate-400">SUBMISSION EXCERPT WITH SCANNER HIGHLIGHTS:</div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    The Byzantine fault-tolerant algorithm coordinates consensus among replicated nodes{' '}
                    <span className={similarityScore > 20 ? 'bg-amber-200 dark:bg-amber-900/60 px-1 py-0.5 rounded font-bold' : ''}>
                      by executing two-phase commit rounds with cryptographic signatures.
                    </span>{' '}
                    Each replica maintains a deterministic state machine{' '}
                    <span className={similarityScore > 50 ? 'bg-rose-200 dark:bg-rose-900/60 px-1 py-0.5 rounded font-bold text-rose-700 dark:text-rose-300' : ''}>
                      and validates incoming block proposals before appending to the local ledger.
                    </span>
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500 font-medium">Automatic n-gram comparison against cohort database</span>
                  <Link
                    to="/teacher/dashboard"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    <span>Open Teacher Workspace</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Tab 3: AI Assistant Preview */}
            {activeHeroTab === 'ai' && (
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Gemini AI Study Tutor</h3>
                      <p className="text-[11px] text-slate-400">Pedagogical assignment guidance & code debugging</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-[11px] font-extrabold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Online
                  </span>
                </div>

                {/* Chat window */}
                <div className="h-48 overflow-y-auto space-y-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 text-xs">
                  {aiChatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 text-[10px] font-bold">
                          AI
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl whitespace-pre-line leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-indigo-600 text-white rounded-br-xs'
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-bl-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Prompt suggestion chips */}
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSendAiPrompt('Explain Dijkstra shortest path with Python pseudocode')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 border border-slate-200 dark:border-slate-700 cursor-pointer"
                  >
                    💡 Dijkstra Algorithm Explanation
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendAiPrompt('Generate rubric self-evaluation checklist')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 border border-slate-200 dark:border-slate-700 cursor-pointer"
                  >
                    📋 Rubric Checklist
                  </button>
                </div>

                {/* Input box */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={aiPromptInput}
                    onChange={(e) => setAiPromptInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendAiPrompt()}
                    placeholder="Ask AI tutor anything about your assignment..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleSendAiPrompt()}
                    className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white cursor-pointer transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. REAL-TIME CAMPUS VELOCITY TICKER & STATS */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-lg">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-200/80 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold uppercase tracking-wider mb-1">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Live Campus Velocity Feed</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Institutional Activity in Real-Time
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Stream Synchronized</span>
            </div>
          </div>

          {/* Activity Cards Stream */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {liveCampusActivity.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all"
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-base">{item.icon}</span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[10px] font-extrabold">
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{item.user}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                  {item.action}
                </p>
                <p className="text-[10px] text-slate-400 mt-2 font-medium">{item.time}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. INTERACTIVE ROLE PERSONA SHOWCASE */}
      {/* ========================================================= */}
      <section id="roles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>ROLE-SPECIFIC ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Tailored Experiences for Every Stakeholder
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Select a persona below to explore the dedicated tools built for your academic workflow.
          </p>
        </div>

        {/* Persona Pill Switcher */}
        <div className="flex justify-center mb-8">
          <div className="p-1.5 rounded-2xl glass-panel inline-flex gap-2">
            <button
              type="button"
              onClick={() => setActiveRoleCard('student')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                activeRoleCard === 'student'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Student Workspace</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveRoleCard('teacher')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                activeRoleCard === 'teacher'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Teacher / Faculty</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveRoleCard('admin')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                activeRoleCard === 'admin'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Campus Admin</span>
            </button>
          </div>
        </div>

        {/* Persona Spotlight Card */}
        <div className="glass-card rounded-3xl p-8 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-xl glow-card">
          {activeRoleCard === 'student' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                  <BookOpen className="w-3.5 h-3.5" /> Student Edition
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  Conquer Deadlines with Intelligent Study Tools
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Never miss an assignment again. View automated timeline schedules, draft versioned deliverables, check real-time evaluation rubrics, and request 24/7 AI tutor guidance on tough concepts.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Visual Calendar Milestones</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>PDF & Code File Uploads</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Personalized GPA Analytics</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Instant Teacher Feedback</span>
                  </div>
                </div>
                <div className="pt-4">
                  <Link
                    to="/student/dashboard"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/20 transition-all"
                  >
                    <span>Launch Student Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Visual Mockup Box */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-500">Upcoming Coursework Pipeline</span>
                  <span className="text-indigo-600 dark:text-indigo-400">4 Active</span>
                </div>
                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Operating Systems Virtual Memory</p>
                      <p className="text-[10px] text-slate-400">Due: Tomorrow • 100 Pts</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[10px] font-extrabold">
                      Pending
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Database Normalization Report</p>
                      <p className="text-[10px] text-slate-400">Graded: Score 96/100</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold">
                      Completed A+
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeRoleCard === 'teacher' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                  <Users className="w-3.5 h-3.5" /> Faculty Hub
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  Speed-Grading & Automated Plagiarism Defense
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Design complex multi-criteria rubrics in seconds. Review cohort submissions with side-by-side textual diffs, broadcast batch grades, and automatically detect dishonest duplicate deliverables.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>N-Gram Similarity Scanner</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>1-Click Assignment Publisher</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Side-by-Side Code Diff Compare</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Class Grade Distribution Curve</span>
                  </div>
                </div>
                <div className="pt-4">
                  <Link
                    to="/teacher/dashboard"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 transition-all"
                  >
                    <span>Launch Teacher Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Visual Mockup Box */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-500">Grading Queue Status</span>
                  <span className="text-emerald-600 dark:text-emerald-400">42 / 45 Graded (93%)</span>
                </div>
                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Dr. Sarah Mitchell (Cloud Architecture)</p>
                      <p className="text-[10px] text-slate-400">Plagiarism Check: 0% Match (Original)</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold">
                      Verified
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Batch Evaluation Auto-Publish</p>
                      <p className="text-[10px] text-slate-400">Syncs grades directly to student notification feed</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-extrabold">
                      Auto-Sync
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeRoleCard === 'admin' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Institutional Administration
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  Campus-Wide Governance & Audit Intelligence
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Manage hundreds of courses, department enrollments, and academic credentials from one authoritative central dashboard. Inspect system health, compliance records, and aggregate performance metrics.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Campus User Lifecycle Control</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Department Course Management</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Cross-Cohort Analytics Reports</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Audit & Compliance Security Logs</span>
                  </div>
                </div>
                <div className="pt-4">
                  <Link
                    to="/admin/dashboard"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-500/20 transition-all"
                  >
                    <span>Launch Admin Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Visual Mockup Box */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-500">Institution Metrics</span>
                  <span className="text-rose-600 dark:text-rose-400">All Systems Operational</span>
                </div>
                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Active Academic Departments</p>
                      <p className="text-[10px] text-slate-400">Computer Science, IT, Electronics, Mechanical</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[10px] font-extrabold">
                      8 Depts
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">System Security Status</p>
                      <p className="text-[10px] text-slate-400">JWT Token Security & Clerk SSO Enabled</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold">
                      Encrypted
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. INTERACTIVE GPA & GRADE RUBRIC SIMULATOR */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800 shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-extrabold mb-3">
                <Sliders className="w-3.5 h-3.5" />
                <span>INTERACTIVE RUBRIC CALCULATOR</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
                Simulate Your Course Grade & Rubric Outcomes
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Adjust the interactive sliders to observe how individual coursework weights, lab assignments, and milestone deliverables impact your final semester GPA prediction.
              </p>

              {/* Interactive Sliders */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Assignments & Homework Score</span>
                    <span className="text-indigo-600 dark:text-indigo-400">{homeworkWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={homeworkWeight}
                    onChange={(e) => setHomeworkWeight(Number(e.target.value))}
                    className="w-full accent-indigo-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Quizzes & Knowledge Checks</span>
                    <span className="text-purple-600 dark:text-purple-400">{quizScore}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={quizScore}
                    onChange={(e) => setQuizScore(Number(e.target.value))}
                    className="w-full accent-purple-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Laboratory / Practical Deliverables</span>
                    <span className="text-emerald-600 dark:text-emerald-400">{labScore}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={labScore}
                    onChange={(e) => setLabScore(Number(e.target.value))}
                    className="w-full accent-emerald-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Capstone / Final Term Project</span>
                    <span className="text-cyan-600 dark:text-cyan-400">{projectScore}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={projectScore}
                    onChange={(e) => setProjectScore(Number(e.target.value))}
                    className="w-full accent-cyan-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Calculated Result Display Card */}
            <div className="p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Predicted Academic Grade</p>
                <h3 className={`text-5xl sm:text-6xl font-black mt-2 ${gradeInfo.color}`}>
                  {computedGrade}%
                </h3>
                <p className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-1">
                  Grade: {gradeInfo.grade}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {gradeInfo.text}
                </p>
              </div>

              {/* Mini Trend Area Chart */}
              <div className="h-32 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockPerformanceData}>
                    <defs>
                      <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="week" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '11px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="avgScore"
                      stroke="#6366f1"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#scoreGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <Link
                to="/register"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all"
              >
                <span>Track Your Actual Course Grades</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. 4-STEP ACADEMIC WORKFLOW PIPELINE */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-3">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>SEAMLESS WORKFLOW</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            From Syllabus to Final Evaluation in 4 Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-3xl glow-card border border-slate-200/80 dark:border-slate-800 relative">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm mb-4">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">Assignment Creation</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Faculty publish assignments with attachments, deadlines, and multi-tier rubric criteria.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl glow-card border border-slate-200/80 dark:border-slate-800 relative">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black text-sm mb-4">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">Student Deliverable Upload</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Students upload versioned PDFs or code files with real-time submission confirmations.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl glow-card border border-slate-200/80 dark:border-slate-800 relative">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-sm mb-4">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">Similarity & AI Scan</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Automated anti-plagiarism comparison scans cohort files and generates detailed overlap reports.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl glow-card border border-slate-200/80 dark:border-slate-800 relative">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center font-black text-sm mb-4">
              04
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">Feedback & Analytics</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Instant feedback delivery, score publishing, and campus-wide cohort analytics synchronization.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. INTERACTIVE FAQ ACCORDION */}
      {/* ========================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                {openFaq === index ? (
                  <Minus className="w-4 h-4 text-indigo-600 shrink-0" />
                ) : (
                  <Plus className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {openFaq === index && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. HIGH-IMPACT FINAL CALL-TO-ACTION BANNER */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-indigo-900 via-indigo-950 to-purple-950 text-white overflow-hidden shadow-2xl border border-indigo-700/50 text-center">
          {/* Ambient light elements */}
          <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-purple-500/20 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-indigo-300 text-xs font-extrabold">
              <GraduationCap className="w-4 h-4" />
              <span>Transform Your Campus Assignment Experience</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Ready to Upgrade Your Academic Workflow?
            </h2>

            <p className="text-sm sm:text-base text-indigo-200 max-w-xl mx-auto leading-relaxed">
              Join thousands of students and faculty streamlining deadlines, rubrics, and plagiarism checks with Smart Assignment Tracker.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-100 text-indigo-900 text-base font-extrabold rounded-2xl shadow-xl shadow-black/20 hover:scale-[1.02] transition-all cursor-pointer"
              >
                <span>Create Free Academic Account</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/15 text-white text-base font-bold rounded-2xl border border-white/20 backdrop-blur-md transition-all cursor-pointer"
              >
                Sign In to Existing Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
