import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  BookOpen,
  MessageCircle,
  FileQuestion,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Mail,
  ExternalLink,
  ShieldCheck,
  Video,
  ArrowRight,
} from 'lucide-react';

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: 'How do I create and manage project tasks?',
      a: 'Navigate to the Tasks section from the sidebar or click "+ Add Project" on the Dashboard. You can set task deadlines, assign team members, and track real-time completion percentages.',
    },
    {
      q: 'How does the live Time Tracker work?',
      a: 'The Time Tracker widget in your dashboard allows you to start, pause, and reset tracking for your daily work sprints. Time spent is automatically logged to your analytics profile.',
    },
    {
      q: 'How do I schedule and join team meetings?',
      a: 'Click "Start Meeting" on your Reminders card or create an event in the Calendar. You can invite team members and launch video conferences directly from the platform.',
    },
    {
      q: 'Can I export analytics and project reports?',
      a: 'Yes, head to the Analytics page and click "Export Report" to download CSV or PDF summaries of your project progress, member workloads, and deadline performance.',
    },
    {
      q: 'How does the AI Assistant help with tasks?',
      a: 'The AI Assistant provides intelligent conceptual outlines, rubric summaries, and code optimization recommendations while preserving intellectual rigor and privacy.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Hero Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#104f37] text-white text-center relative overflow-hidden shadow-xl shadow-emerald-950/15">
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mx-auto text-white">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            How can we help you today?
          </h1>
          <p className="text-sm text-emerald-100/90 leading-relaxed font-medium">
            Search our knowledge base, explore tutorials, or connect directly with our support engineers.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-lg mx-auto pt-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-5.5" />
            <input
              type="text"
              placeholder="Search topics, questions, shortcuts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white rounded-2xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-400/30 shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Quick Help Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">
            Documentation
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Detailed guides on project setups, workflows, and integrations.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Video className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">
            Video Tutorials
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Step-by-step walkthroughs of advanced features and dashboards.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">
            24/7 Live Support
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Talk to an academic coordinator or support specialist in real time.
          </p>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                className="w-full p-4 text-left font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-emerald-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-800/80 pt-3 bg-slate-50/50 dark:bg-slate-800/30">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Still Need Help Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Still have questions?
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Can't find the answer you're looking for? Reach out directly.
          </p>
        </div>
        <button
          type="button"
          onClick={() => alert('Support ticket initiated!')}
          className="px-6 py-2.5 rounded-full bg-[#104f37] hover:bg-[#0d3f2c] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
        >
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default HelpPage;
