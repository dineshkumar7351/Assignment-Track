import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  Info,
  CheckCircle2,
  Layers,
  ArrowRight,
  FileText,
  User,
  BookOpen,
  Calendar,
  Sparkles,
  BarChart2,
  ExternalLink,
} from 'lucide-react';
import similarityService from '../../services/similarityService';

const TeacherPlagiarismPage = () => {
  const [data, setData] = useState({
    metrics: {
      totalSubmissions: 0,
      lowSimilarity: 0,
      mediumSimilarity: 0,
      highSimilarity: 0,
      veryHighSimilarity: 0,
      highRiskTotal: 0,
      averageSimilarity: 0,
    },
    submissions: [],
    teacherAssignments: [],
    disclaimer: '',
  });

  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('all');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(selectedAssignment ? { assignmentId: selectedAssignment } : {}),
        ...(selectedRisk !== 'all' ? { risk: selectedRisk } : {}),
      };

      const res = await similarityService.getTeacherSimilarityOverview(params);
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load similarity overview');
    } finally {
      setLoading(false);
    }
  }, [search, selectedAssignment, selectedRisk]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadData]);

  // Force re-scan for the currently selected assignment
  const handleScanAssignment = async () => {
    if (!selectedAssignment) {
      setError('Please select a specific coursework assignment to run the similarity scan.');
      return;
    }

    setScanning(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await similarityService.scanAssignmentSimilarity(selectedAssignment);
      if (res.success) {
        setSuccessMsg(res.message || 'Textual similarity analysis completed successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
        await loadData();
      }
    } catch (err) {
      setError(err.message || 'Failed to analyze assignment similarity');
    } finally {
      setScanning(false);
    }
  };

  const getRiskBadge = (risk, score) => {
    const num = Number(score) || 0;
    const r = (risk || '').toLowerCase();

    if (r === 'very_high' || num > 75) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wide bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
          <ShieldAlert className="w-3 h-3" />
          <span>Very High Risk</span>
        </span>
      );
    }
    if (r === 'high' || (num > 50 && num <= 75)) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wide bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-300 dark:border-orange-800">
          <AlertTriangle className="w-3 h-3" />
          <span>High Risk</span>
        </span>
      );
    }
    if (r === 'medium' || (num > 20 && num <= 50)) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
          <span>Medium Risk</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
        <CheckCircle2 className="w-3 h-3" />
        <span>Low Risk</span>
      </span>
    );
  };

  const metrics = data.metrics || {};

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-900/40 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold mb-2 tracking-wide uppercase text-indigo-300 border border-indigo-700/50">
            <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
            <span>Academic Integrity Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Textual Similarity Detection
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Automated TF-IDF vectorization and cosine similarity checking against peer submissions for the same assignment to assist faculty review.
          </p>
        </div>

        {selectedAssignment && (
          <button
            onClick={handleScanAssignment}
            disabled={scanning}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${scanning ? 'animate-spin' : ''}`} />
            <span>{scanning ? 'Analyzing Text Vectors...' : 'Re-Analyze Assignment'}</span>
          </button>
        )}
      </div>

      {/* Prominent Ethical Disclaimer Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3.5 shadow-xs">
        <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
            Important Academic Notice
          </p>
          <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed font-medium">
            Similarity does not automatically indicate plagiarism. Common phrases, references, templates, and legitimate collaboration can contribute to similarity. This tool is intended as a review aid for faculty instructors.
          </p>
        </div>
      </div>

      {/* Action Notification Toast */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs sm:text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 5 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Total Submissions */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-bold uppercase text-slate-400">Total Submissions</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {metrics.totalSubmissions || 0}
          </p>
          <span className="text-[10px] text-slate-500">Across course cohorts</span>
        </div>

        {/* Low Similarity */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-bold uppercase text-emerald-600 dark:text-emerald-400">Low (0 - 20%)</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {metrics.lowSimilarity || 0}
          </p>
          <span className="text-[10px] text-slate-500">Unique content</span>
        </div>

        {/* Medium Similarity */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-bold uppercase text-amber-600 dark:text-amber-400">Medium (21 - 50%)</p>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {metrics.mediumSimilarity || 0}
          </p>
          <span className="text-[10px] text-slate-500">Moderate overlap</span>
        </div>

        {/* High & Very High Similarity */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-bold uppercase text-rose-600 dark:text-rose-400">High (&gt; 50%)</p>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {metrics.highRiskTotal || 0}
          </p>
          <span className="text-[10px] text-slate-500">Requires review</span>
        </div>

        {/* Cohort Average Similarity */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-bold uppercase text-indigo-600 dark:text-indigo-400">Average Similarity</p>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            {metrics.averageSimilarity || 0}%
          </p>
          <span className="text-[10px] text-slate-500">Mean TF-IDF score</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name, candidate ID, or assignment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Assignment Filter */}
          <div className="md:col-span-4">
            <select
              value={selectedAssignment}
              onChange={(e) => setSelectedAssignment(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="">All Coursework Assignments</option>
              {data.teacherAssignments?.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.title}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="all">Risk Level: All</option>
              <option value="low">Low Risk (0 - 20%)</option>
              <option value="medium">Medium Risk (21 - 50%)</option>
              <option value="high">High Risk (51 - 75%)</option>
              <option value="very_high">Very High Risk (&gt; 75%)</option>
            </select>
          </div>
        </div>

        {/* Reset Filter Button */}
        <div className="flex items-center justify-end pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          <button
            onClick={() => {
              setSearch('');
              setSelectedAssignment('');
              setSelectedRisk('all');
              loadData();
            }}
            className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset filters</span>
          </button>
        </div>
      </div>

      {/* Submissions Similarity Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Evaluating textual similarity across cohort...
            </p>
          </div>
        ) : data.submissions?.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No submissions found</h3>
            <p className="text-xs text-slate-500 mt-1">
              No submissions match your selected filter criteria or no deliverables have been uploaded yet.
            </p>
          </div>
        ) : (
          <div>
            {/* Mobile Card List View (Visible on Phone Screens < 768px) */}
            <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {data.submissions.map((sub) => {
                const score = typeof sub.similarityScore === 'number' ? sub.similarityScore : 0;
                const targetMatchId = sub.highestSimilarSubmission?._id || sub.highestSimilarSubmission;

                return (
                  <div key={sub._id} className="p-4 space-y-3 bg-white dark:bg-slate-900">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {sub.student?.fullName || 'Student'}
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          {sub.student?.studentId ? `ID: ${sub.student.studentId}` : sub.student?.email}
                        </p>
                      </div>

                      <div>{getRiskBadge(sub.similarityStatus, score)}</div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-2">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">
                          {sub.assignment?.title || 'Coursework Assignment'}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {sub.assignment?.subjectId?.name || sub.assignment?.subject || 'Subject'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/50">
                        <span className="text-slate-500 font-semibold">Similarity:</span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-black text-xs ${
                              score > 75
                                ? 'text-rose-600 dark:text-rose-400'
                                : score > 50
                                ? 'text-orange-600 dark:text-orange-400'
                                : score > 20
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {score}%
                          </span>
                          <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                score > 75
                                  ? 'bg-rose-500'
                                  : score > 50
                                  ? 'bg-orange-500'
                                  : score > 20
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {sub.matchedStudent && (
                        <div className="flex items-center justify-between text-[11px] pt-1">
                          <span className="text-slate-500">Matching Peer:</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {sub.matchedStudent.fullName}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Compare Action Button */}
                    <div className="pt-1">
                      {targetMatchId ? (
                        <Link
                          to={`/teacher/plagiarism/compare/${sub._id}/${targetMatchId}`}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
                        >
                          <span>Side-by-Side Dual Compare</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <span className="block text-center text-slate-400 text-xs italic py-1">
                          Single submission in cohort
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (Visible on Tablet/Desktop >= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Assignment</th>
                    <th className="py-3.5 px-4">Similarity Score</th>
                    <th className="py-3.5 px-4">Risk Classification</th>
                    <th className="py-3.5 px-4">Highest Matching Peer</th>
                    <th className="py-3.5 px-4 text-right">Faculty Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {data.submissions.map((sub) => {
                    const score = typeof sub.similarityScore === 'number' ? sub.similarityScore : 0;
                    const targetMatchId = sub.highestSimilarSubmission?._id || sub.highestSimilarSubmission;

                    return (
                      <tr key={sub._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                        {/* Student */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {sub.student?.fullName || 'Student'}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {sub.student?.studentId ? `ID: ${sub.student.studentId}` : sub.student?.email}
                          </div>
                        </td>

                        {/* Assignment */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {sub.assignment?.title || 'Coursework Assignment'}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {sub.assignment?.subjectId?.name || sub.assignment?.subject || 'Subject'}
                          </div>
                        </td>

                        {/* Similarity Score */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-black text-sm ${
                                score > 75
                                  ? 'text-rose-600 dark:text-rose-400'
                                  : score > 50
                                  ? 'text-orange-600 dark:text-orange-400'
                                  : score > 20
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : 'text-emerald-600 dark:text-emerald-400'
                              }`}
                            >
                              {score}%
                            </span>
                            <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  score > 75
                                    ? 'bg-rose-500'
                                    : score > 50
                                    ? 'bg-orange-500'
                                    : score > 20
                                    ? 'bg-amber-500'
                                    : 'bg-emerald-500'
                                }`}
                                style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Risk Classification */}
                        <td className="py-3.5 px-4">
                          {getRiskBadge(sub.similarityStatus, score)}
                        </td>

                        {/* Highest Matching Peer */}
                        <td className="py-3.5 px-4">
                          {sub.matchedStudent ? (
                            <div>
                              <p className="font-semibold text-slate-800 dark:text-slate-200">
                                {sub.matchedStudent.fullName}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {sub.matchedStudent.studentId || sub.matchedStudent.email}
                              </p>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">No peer match</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          {targetMatchId ? (
                            <Link
                              to={`/teacher/plagiarism/compare/${sub._id}/${targetMatchId}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                              <span>Compare</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          ) : (
                            <span className="text-slate-400 text-xs italic">Single submission</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherPlagiarismPage;
