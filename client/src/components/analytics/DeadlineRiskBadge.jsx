import React from 'react';
import { AlertTriangle, Clock, CheckCircle, ShieldAlert } from 'lucide-react';

export default function DeadlineRiskBadge({ level, showIcon = true, size = 'sm' }) {
  let badgeStyle = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
  let Icon = CheckCircle;

  switch (level?.toLowerCase()) {
    case 'critical':
      badgeStyle = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 animate-pulse';
      Icon = ShieldAlert;
      break;
    case 'high':
      badgeStyle = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      Icon = AlertTriangle;
      break;
    case 'medium':
      badgeStyle = 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20';
      Icon = Clock;
      break;
    case 'low':
      badgeStyle = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      Icon = CheckCircle;
      break;
    default:
      badgeStyle = 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
      Icon = CheckCircle;
  }

  const sizeClass = size === 'xs' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${sizeClass} ${badgeStyle}`}
    >
      {showIcon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{level || 'Low'} Risk</span>
    </span>
  );
}
