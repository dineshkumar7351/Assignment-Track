import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  FileText,
  Edit3,
  Calendar,
  Send,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  ArrowRight,
  Zap,
  Clock,
  Award,
} from 'lucide-react';
import { aiService } from '../services/aiService';

export default function AiAssistantPage() {
  const [activeTab, setActiveTab] = useState('explain');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // 1. Explain Topic State
  const [explainTopicInput, setExplainTopicInput] = useState('');
  const [explainDepth, setExplainDepth] = useState('intermediate');
  const [explainSubject, setExplainSubject] = useState('Computer Science');
  const [explainResult, setExplainResult] = useState(null);

  // 2. Generate Hints State
  const [hintQuestion, setHintQuestion] = useState('');
  const [hintAssignment, setHintAssignment] = useState('');
  const [hintResult, setHintResult] = useState(null);

  // 3. Interactive Quiz State
  const [quizTopic, setQuizTopic] = useState('');
  const [quizDifficulty, setQuizDifficulty] = useState('medium');
  const [quizResult, setQuizResult] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showQuizScore, setShowQuizScore] = useState(false);

  // 4. Summarize Notes State
  const [notesText, setNotesText] = useState('');
  const [notesFormat, setNotesFormat] = useState('structured');
  const [summarizeResult, setSummarizeResult] = useState(null);

  // 5. Review Answer State
  const [reviewQuestion, setReviewQuestion] = useState('');
  const [reviewDraft, setReviewDraft] = useState('');
  const [reviewResult, setReviewResult] = useState(null);

  // 6. Study Planner State
  const [dailyHours, setDailyHours] = useState(3);
  const [plannerResult, setPlannerResult] = useState(null);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // API Handlers
  const handleExplain = async (e) => {
    e?.preventDefault();
    if (!explainTopicInput.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await aiService.explainTopic(explainTopicInput, explainDepth, explainSubject);
      setExplainResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to generate explanation');
    } finally {
      setLoading(false);
    }
  };

  const handleHints = async (e) => {
    e?.preventDefault();
    if (!hintQuestion.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await aiService.generateHints(hintQuestion, hintAssignment);
      setHintResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to generate hints');
    } finally {
      setLoading(false);
    }
  };

  const handleQuiz = async (e) => {
    e?.preventDefault();
    if (!quizTopic.trim()) return;
    setLoading(true);
    setError(null);
    setSelectedAnswers({});
    setShowQuizScore(false);
    try {
      const res = await aiService.generateQuiz(quizTopic, 4, quizDifficulty);
      setQuizResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async (e) => {
    e?.preventDefault();
    if (!notesText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await aiService.summarizeNotes(notesText, notesFormat);
      setSummarizeResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to summarize notes');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (e) => {
    e?.preventDefault();
    if (!reviewDraft.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await aiService.reviewAnswer(reviewQuestion, reviewDraft);
      setReviewResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to review draft');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanner = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await aiService.generateStudyPlan(dailyHours);
      setPlannerResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to generate study plan');
    } finally {
      setLoading(false);
    }
  };

  const calculateQuizScore = () => {
    if (!quizResult?.questions) return 0;
    let score = 0;
    quizResult.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) score++;
    });
    return score;
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>AI Learning & Study Companion</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Study Assistant
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Master coursework concepts, receive progressive hints, generate recall quizzes, and build intelligent study schedules.
          </p>
        </div>

        {/* Ethical Academic Guardrail Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium self-start md:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Academic Integrity Protected</span>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'explain', label: 'Explain Topic', icon: BookOpen },
          { id: 'hints', label: 'Socratic Hints', icon: HelpCircle },
          { id: 'quiz', label: 'Quiz Studio', icon: CheckCircle2 },
          { id: 'summarize', label: 'Notes Summarizer', icon: FileText },
          { id: 'review', label: 'Review Draft', icon: Edit3 },
          { id: 'planner', label: 'Study Planner', icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setError(null);
              }}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl text-rose-700 dark:text-rose-300 text-xs font-medium">
          {error}
        </div>
      )}

      {/* TAB 1: EXPLAIN TOPIC */}
      {activeTab === 'explain' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Conceptual Explainer
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
                Break down complex academic theories into intuitive mental models.
              </p>

              <form onSubmit={handleExplain} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Concept or Topic
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dijkstra's Algorithm, Convolutional Neural Networks"
                    value={explainTopicInput}
                    onChange={(e) => setExplainTopicInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Algorithms"
                      value={explainSubject}
                      onChange={(e) => setExplainSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Depth
                    </label>
                    <select
                      value={explainDepth}
                      onChange={(e) => setExplainDepth(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="beginner">Beginner (Foundations)</option>
                      <option value="intermediate">Intermediate (College Level)</option>
                      <option value="advanced">Advanced (Deep Dive)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !explainTopicInput.trim()}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Explain Concept</span>
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm min-h-[380px]">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Explanation Output</span>
                  {explainResult && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                      {explainResult.source}
                    </span>
                  )}
                </h4>
                {explainResult && (
                  <button
                    onClick={() => handleCopy(explainResult.content)}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-3 text-slate-400">
                  <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs">Synthesizing comprehensive explanation...</span>
                </div>
              ) : explainResult ? (
                <div className="prose dark:prose-invert max-w-none text-xs leading-relaxed text-slate-700 dark:text-slate-300 space-y-3 whitespace-pre-line">
                  {explainResult.content}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-slate-400 text-center text-xs">
                  <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-2" />
                  <span>Enter a topic and click "Explain Concept" to generate a breakdown.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SOCRATIC HINTS */}
      {activeTab === 'hints' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Socratic Hints Generator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
                Get progressive clues and strategic hints without direct solution spoilers.
              </p>

              <form onSubmit={handleHints} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Assignment Title (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lab 3: Dynamic Programming Knapsack"
                    value={hintAssignment}
                    onChange={(e) => setHintAssignment(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Where are you stuck? / Problem Statement
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe the roadblock or step you are having trouble with..."
                    value={hintQuestion}
                    onChange={(e) => setHintQuestion(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !hintQuestion.trim()}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <HelpCircle className="w-4 h-4" />}
                  <span>Generate Hints</span>
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm min-h-[380px]">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Guided Progressive Hints</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                    Socratic Mode
                  </span>
                </h4>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-3 text-slate-400">
                  <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs">Formulating strategic hints...</span>
                </div>
              ) : hintResult ? (
                <div className="prose dark:prose-invert max-w-none text-xs leading-relaxed text-slate-700 dark:text-slate-300 space-y-4 whitespace-pre-line">
                  {hintResult.hints}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-slate-400 text-center text-xs">
                  <HelpCircle className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-2" />
                  <span>State your question to receive 3 progressive learning hints.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: QUIZ STUDIO */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
            <form onSubmit={handleQuiz} className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Quiz Topic or Coursework Area
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asymmetric Cryptography, Database Normalization, Binary Trees"
                  value={quizTopic}
                  onChange={(e) => setQuizTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="w-full sm:w-44">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Difficulty
                </label>
                <select
                  value={quizDifficulty}
                  onChange={(e) => setQuizDifficulty(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="easy">Easy (Fundamentals)</option>
                  <option value="medium">Medium (College)</option>
                  <option value="hard">Hard (Rigorous)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading || !quizTopic.trim()}
                className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                <span>Generate Quiz</span>
              </button>
            </form>
          </div>

          {/* Quiz Content */}
          {quizResult && quizResult.questions && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Interactive Knowledge Quiz: {quizResult.topic}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Select your answers below and click "Submit Quiz" to reveal answers & explanations.
                  </p>
                </div>
                {showQuizScore && (
                  <div className="px-4 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs border border-indigo-200 dark:border-indigo-800">
                    Score: {calculateQuizScore()} / {quizResult.questions.length} (
                    {Math.round((calculateQuizScore() / quizResult.questions.length) * 100)}%)
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {quizResult.questions.map((q, qIdx) => (
                  <div key={qIdx} className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-3">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {qIdx + 1}. {q.question}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = selectedAnswers[qIdx] === optIdx;
                        const isCorrect = q.correctAnswer === optIdx;

                        let buttonStyle = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100';

                        if (showQuizScore) {
                          if (isCorrect) {
                            buttonStyle = 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-semibold';
                          } else if (isSelected && !isCorrect) {
                            buttonStyle = 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-700 dark:text-rose-300';
                          }
                        } else if (isSelected) {
                          buttonStyle = 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-semibold';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={showQuizScore}
                            onClick={() => setSelectedAnswers({ ...selectedAnswers, [qIdx]: optIdx })}
                            className={`p-3 rounded-xl border text-left text-xs transition-all ${buttonStyle}`}
                          >
                            <span className="font-semibold mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {showQuizScore && (
                      <div className="mt-2 p-2.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-[11px] text-slate-600 dark:text-slate-300">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">Explanation: </span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                {!showQuizScore ? (
                  <button
                    onClick={() => setShowQuizScore(true)}
                    disabled={Object.keys(selectedAnswers).length === 0}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition disabled:opacity-50"
                  >
                    Submit Quiz & Review Answers
                  </button>
                ) : (
                  <button
                    onClick={handleQuiz}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
                  >
                    Generate New Quiz
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SUMMARIZE NOTES */}
      {activeTab === 'summarize' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Study Notes Summarizer
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
                Synthesize lecture notes, textbook chapters, or review sheets into active recall summaries.
              </p>

              <form onSubmit={handleSummarize} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Lecture Notes / Raw Text
                  </label>
                  <textarea
                    required
                    rows={8}
                    placeholder="Paste lecture transcript or study notes here..."
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !notesText.trim()}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                  <span>Synthesize Notes</span>
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm min-h-[380px]">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Synthesized Summary & Flashcards
                </h4>
                {summarizeResult && (
                  <button
                    onClick={() => handleCopy(summarizeResult.summary)}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-3 text-slate-400">
                  <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs">Extracting key terminology & active recall flashcards...</span>
                </div>
              ) : summarizeResult ? (
                <div className="prose dark:prose-invert max-w-none text-xs leading-relaxed text-slate-700 dark:text-slate-300 space-y-3 whitespace-pre-line">
                  {summarizeResult.summary}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-slate-400 text-center text-xs">
                  <FileText className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-2" />
                  <span>Paste text to generate executive notes and flashcards.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: REVIEW DRAFT */}
      {activeTab === 'review' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Draft Answer Reviewer
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
                Receive constructive formative feedback on clarity, structure, and missing concepts.
              </p>

              <form onSubmit={handleReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Assignment Question / Prompt
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Explain how RSA encryption achieves asymmetric confidentiality"
                    value={reviewQuestion}
                    onChange={(e) => setReviewQuestion(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Your Draft Answer
                  </label>
                  <textarea
                    required
                    rows={7}
                    placeholder="Paste your written response draft for critique..."
                    value={reviewDraft}
                    onChange={(e) => setReviewDraft(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !reviewDraft.trim()}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Edit3 className="w-4 h-4" />}
                  <span>Review Draft Response</span>
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm min-h-[380px]">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Formative Feedback & Recommendations
                </h4>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-3 text-slate-400">
                  <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs">Evaluating answer structure & conceptual accuracy...</span>
                </div>
              ) : reviewResult ? (
                <div className="prose dark:prose-invert max-w-none text-xs leading-relaxed text-slate-700 dark:text-slate-300 space-y-3 whitespace-pre-line">
                  {reviewResult.review}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-slate-400 text-center text-xs">
                  <Edit3 className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-2" />
                  <span>Enter your draft answer to get actionable grading feedback.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: STUDY PLANNER */}
      {activeTab === 'planner' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                AI Smart Assignment Planner
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Auto-generates an optimized, milestone-driven study timetable from your active coursework deadlines.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                  Daily Study Hours:
                </label>
                <select
                  value={dailyHours}
                  onChange={(e) => setDailyHours(Number(e.target.value))}
                  className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                >
                  <option value={1}>1 hour / day</option>
                  <option value={2}>2 hours / day</option>
                  <option value={3}>3 hours / day</option>
                  <option value={4}>4 hours / day</option>
                  <option value={5}>5+ hours / day</option>
                </select>
              </div>

              <button
                onClick={handlePlanner}
                disabled={loading}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/20 flex items-center gap-2 transition disabled:opacity-50 whitespace-nowrap"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
                <span>Generate Plan</span>
              </button>
            </div>
          </div>

          {/* Planner Output */}
          {plannerResult && plannerResult.schedule && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plannerResult.schedule.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm hover:border-indigo-500/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                          {item.day}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-indigo-500" />
                          {item.allocatedHours} hrs allocated
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                        {item.subject} • Due {new Date(item.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>

                      <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                        {item.milestones?.map((m, mIdx) => (
                          <div key={mIdx} className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                            <span>{m}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {plannerResult.strategyNote && (
                <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl text-xs text-indigo-800 dark:text-indigo-300">
                  💡 <strong>Study Strategy: </strong>
                  {plannerResult.strategyNote}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
