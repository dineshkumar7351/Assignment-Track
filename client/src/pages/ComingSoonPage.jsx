import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Clock } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const ComingSoonPage = ({
  title = 'Module In Development',
  description = 'This feature is scheduled for implementation in upcoming roadmap milestones.',
  milestone = 'Upcoming Milestone',
}) => {
  const { user } = useAuth();
  const role = user?.role || 'student';

  return (
    <div className="max-w-4xl mx-auto py-10 sm:py-16">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-7 h-7" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 mb-4">
          <Clock className="w-3.5 h-3.5" />
          <span>{milestone}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
          {title}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-lg mx-auto mb-8 leading-relaxed">
          {description}
        </p>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-center">
          <Link
            to={`/${role}/dashboard`}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
