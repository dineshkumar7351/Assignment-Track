import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Download,
  Calendar,
  User,
  BookOpen,
  RefreshCw,
  Info,
  Layers,
  FileText,
  Sparkles,
} from 'lucide-react';
import similarityService from '../../services/similarityService';

const TeacherSimilarityComparePage = () => {
  const { id1, id2 } = useParams();

  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activePhraseFilter, setActivePhraseFilter] = useState('');

  useEffect(() => {
    const fetchComparison = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await similarityService.compareSubmissions(id1, id2);
        if (res.success && res.data) {
          setComparison(res.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to compare submissions');
      } finally {
        setLoading(false);
      }
    };

    if (id1 && id2) {
      fetchComparison();
    }
  }, [id1, id2]);

  // Resolve download link
  const getFileDownloadUrl = (url) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return `${apiBase.replace(/\/api$/, '')}${url}`;
  };

  // Helper to render text with highlighted matching phrases
  const renderHighlightedText = (text, phrases, activeFilter) => {
    if (!text) return <p className="text-slate-400 italic">No text content available.</p>;

    const targetPhrases = activeFilter ? [activeFilter] : (phrases || []);
    if (!targetPhrases || targetPhrases.length === 0) {
      return <div className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200">{text}</div>;
    }

    // Escape regex characters
    const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`(${targetPhrases.map(escapeRegex).join('|')})`, 'gi');

    const parts = text.split(pattern);

    return (
      <div className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200">
        {parts.map((part, index) => {
          const isMatch = targetPhrases.some(
            (phrase) => phrase.toLowerCase() === part.toLowerCase()
          );

          if (isMatch) {
            return (
              <mark
                key={index}
                className="bg-amber-200 dark:bg-amber-900/80 text-amber-950 dark:text-amber-100 px-1 py-0.5 rounded font-bold transition-all shadow-xs"
              >
                {part}
              </mark>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </div>
    );
  };

  const getRiskBadge = (risk, score) => {
    const num = Number(score) || 0;
    const r = (risk || '').toLowerCase();

    if (r === 'very_high' || num > 75) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Very High Risk</span>
        </span>
      );
    }
    if (r === 'high' || (num > 50 && num <= 75)) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase bg-orange-100 text-orange-800 dark:bg-orange-950/70 dark:text-orange-300 border border-orange-300 dark:border-orange-800">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>High Risk</span>
        </span>
      );
    }
    if (r === 'medium' || (num > 20 && num <= 50)) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
          <span>Medium Risk</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>Low Risk</span>
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Extracting text and calculating pairwise cosine similarity...
        </p>
      </div>
    );
  }

  if (error || !comparison) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Comparison Failed</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">{error || 'Unable to compare the selected submissions.'}</p>
        <Link
          to="/teacher/plagiarism"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Similarity Portal</span>
        </Link>
      </div>
    );
  }

  const { submission1, submission2, assignment, similarityScore, riskLevel, commonPhrases, disclaimer } = comparison;

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/teacher/plagiarism"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Similarity Detection Overview</span>
        </Link>
      </div>

      {/* Comparison Summary Score Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 text-xs font-bold border border-indigo-200 dark:border-indigo-900/60">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{assignment?.title || 'Coursework Assignment'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Side-by-Side Textual Similarity Inspection
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Comparing candidate submissions from <strong>{submission1?.student?.fullName}</strong> and{' '}
              <strong>{submission2?.student?.fullName}</strong>.
            </p>
          </div>

          {/* Metric Gauge Box */}
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 shrink-0">
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase text-slate-400">Similarity Metric</p>
              <p
                className={`text-3xl font-black ${
                  similarityScore > 75
                    ? 'text-rose-600 dark:text-rose-400'
                    : similarityScore > 50
                    ? 'text-orange-600 dark:text-orange-400'
                    : similarityScore > 20
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {similarityScore}%
              </p>
            </div>
            <div>{getRiskBadge(riskLevel, similarityScore)}</div>
          </div>
        </div>

        {/* Ethical Disclaimer Notice */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed font-medium">
            {disclaimer ||
              'Similarity does not automatically indicate plagiarism. Common phrases, references, templates, and legitimate collaboration can contribute to similarity.'}
          </p>
        </div>
      </div>

      {/* Overlapping Common Phrases Filter Bar */}
      {commonPhrases && commonPhrases.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Common Overlapping Phrases ({commonPhrases.length} Detected)
              </h2>
            </div>
            {activePhraseFilter && (
              <button
                onClick={() => setActivePhraseFilter('')}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
              >
                Clear filter (Highlight all)
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {commonPhrases.map((phrase, idx) => {
              const isSelected = activePhraseFilter === phrase;
              return (
                <button
                  key={idx}
                  onClick={() => setActivePhraseFilter(isSelected ? '' : phrase)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    isSelected
                      ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800/60 hover:bg-amber-100'
                  }`}
                >
                  "{phrase}"
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Side-by-Side Submissions Dual Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Submission 1 */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4 flex flex-col">
          {/* Student 1 Header */}
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-xs">
                  {submission1?.student?.fullName?.charAt(0) || <User className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {submission1?.student?.fullName || 'Student 1'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {submission1?.student?.studentId ? `ID: ${submission1.student.studentId}` : submission1?.student?.email}
                  </p>
                </div>
              </div>

              {submission1?.fileUrl && (
                <a
                  href={getFileDownloadUrl(submission1.fileUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>File</span>
                </a>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Submitted: {new Date(submission1?.submittedAt).toLocaleString()}
              </span>
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                Deliverable: {submission1?.fileName}
              </span>
            </div>
          </div>

          {/* Text Content Area */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex-1 max-h-[600px] overflow-y-auto">
            {renderHighlightedText(submission1?.text, commonPhrases, activePhraseFilter)}
          </div>
        </div>

        {/* Right: Submission 2 */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4 flex flex-col">
          {/* Student 2 Header */}
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-xs">
                  {submission2?.student?.fullName?.charAt(0) || <User className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {submission2?.student?.fullName || 'Student 2'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {submission2?.student?.studentId ? `ID: ${submission2.student.studentId}` : submission2?.student?.email}
                  </p>
                </div>
              </div>

              {submission2?.fileUrl && (
                <a
                  href={getFileDownloadUrl(submission2.fileUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>File</span>
                </a>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Submitted: {new Date(submission2?.submittedAt).toLocaleString()}
              </span>
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                Deliverable: {submission2?.fileName}
              </span>
            </div>
          </div>

          {/* Text Content Area */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex-1 max-h-[600px] overflow-y-auto">
            {renderHighlightedText(submission2?.text, commonPhrases, activePhraseFilter)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSimilarityComparePage;
