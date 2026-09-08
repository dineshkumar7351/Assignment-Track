import React from 'react';
import { Target, Clock, ArrowRight, CheckCircle2, Award, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WhatShouldIDoNowCard({ recommendationData }) {
  if (!recommendationData || !recommendationData.hasRecommendation || !recommendationData.recommendation) {
    return (
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 rounded-2xl p-6 text-slate-800 dark:text-slate-100 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              🎯 What Should I Do Now?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              All caught up! You have no pending coursework requiring immediate attention.
            </p>
          </div>
        </div>
        <Link
          to="/student/assignments"
          className="px-4 py-2 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition"
        >
          View Archive
        </Link>
      </div>
    );
  }

  const { recommendation } = recommendationData;

  // Badge color based on risk level
  let riskBadgeColor = 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
  if (recommendation.riskLevel === 'Critical') {
    riskBadgeColor = 'bg-rose-500/10 text-rose-600 border-rose-500/20';
  } else if (recommendation.riskLevel === 'High') {
    riskBadgeColor = 'bg-amber-500/10 text-amber-600 border-amber-500/20';
  } else if (recommendation.riskLevel === 'Medium') {
    riskBadgeColor = 'bg-sky-500/10 text-sky-600 border-sky-500/20';
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-500/30">
      {/* Decorative background glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header Tag */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold">
            <Target className="w-4 h-4 text-indigo-400" />
            <span>🎯 What Should I Do Now?</span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${riskBadgeColor}`}>
              {recommendation.riskLevel} Risk
            </span>
            <span className="text-xs text-indigo-300/80">
              Deterministic Priority Rank
            </span>
          </div>
        </div>

        {/* Main Recommendation Text */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
            You should work on{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-200 to-pink-300 font-extrabold">
              "{recommendation.title}"
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            {recommendation.subject} ({recommendation.subjectCode}) • Assigned Coursework
          </p>
        </div>

        {/* Reason Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {recommendation.reasons?.map((reason, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 px-3.5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors text-xs text-slate-200 font-medium"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{reason}</span>
            </div>
          ))}
        </div>

        {/* Footer Action */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>
              Deadline: {new Date(recommendation.deadline).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          <Link
            to={recommendation.actionUrl}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform active:scale-95"
          >
            <span>Start Working on Deliverable</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
