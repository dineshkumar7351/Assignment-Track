import React from 'react';
import { Activity, ShieldCheck, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

export default function AcademicHealthCard({ academicHealth }) {
  if (!academicHealth) return null;

  const { score, status, color, breakdown, disclaimer } = academicHealth;

  // Determine gradient / text based on status
  let scoreColorClass = 'text-emerald-500';
  let badgeColorClass = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
  let progressBg = 'bg-emerald-500';

  if (score < 50) {
    scoreColorClass = 'text-rose-500';
    badgeColorClass = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
    progressBg = 'bg-rose-500';
  } else if (score < 70) {
    scoreColorClass = 'text-amber-500';
    badgeColorClass = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    progressBg = 'bg-amber-500';
  } else if (score < 85) {
    scoreColorClass = 'text-sky-500';
    badgeColorClass = 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20';
    progressBg = 'bg-sky-500';
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Academic Health Score
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deterministic progress assessment across submissions & performance
            </p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badgeColorClass}`}>
          {status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Score Display */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
          <div className="flex items-baseline gap-1 mb-1">
            <span className={`text-5xl font-extrabold tracking-tight ${scoreColorClass}`}>
              {score}
            </span>
            <span className="text-xl font-bold text-slate-400 dark:text-slate-500">
              / 100
            </span>
          </div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">
            Current Health Index
          </span>

          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${progressBg}`}
              style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
            />
          </div>
        </div>

        {/* Component Breakdown */}
        <div className="md:col-span-8 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Component Breakdown
          </h4>

          {breakdown && (
            <div className="space-y-2.5">
              {/* Completion */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <span>{breakdown.completion?.label} ({breakdown.completion?.weight})</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {breakdown.completion?.value}% (+{breakdown.completion?.contribution} pts)
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full"
                    style={{ width: `${breakdown.completion?.value || 0}%` }}
                  />
                </div>
              </div>

              {/* On-Time Rate */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <span>{breakdown.onTimeRate?.label} ({breakdown.onTimeRate?.weight})</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {breakdown.onTimeRate?.value}% (+{breakdown.onTimeRate?.contribution} pts)
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${breakdown.onTimeRate?.value || 0}%` }}
                  />
                </div>
              </div>

              {/* Academic Performance */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <span>{breakdown.academicPerformance?.label} ({breakdown.academicPerformance?.weight})</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {breakdown.academicPerformance?.value}% (+{breakdown.academicPerformance?.contribution} pts)
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-500 h-full rounded-full"
                    style={{ width: `${breakdown.academicPerformance?.value || 0}%` }}
                  />
                </div>
              </div>

              {/* Overdue Penalty */}
              {breakdown.overdueImpact?.value > 0 && (
                <div>
                  <div className="flex justify-between text-xs font-medium text-rose-600 dark:text-rose-400 mb-1">
                    <span>{breakdown.overdueImpact?.label} ({breakdown.overdueImpact?.value} overdue)</span>
                    <span className="font-semibold">
                      -{breakdown.overdueImpact?.deduction} pts
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-500 h-full rounded-full"
                      style={{ width: `${Math.min(100, breakdown.overdueImpact?.deduction * 5)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer Notice */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-start gap-2 text-slate-400 dark:text-slate-500 text-[11px] leading-relaxed">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        <span>
          {disclaimer || 'This is a deterministic academic progress assessment and does not constitute an official university grade.'}
        </span>
      </div>
    </div>
  );
}
