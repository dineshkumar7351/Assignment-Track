import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Clock, CheckCircle2, RefreshCw } from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function AdminAssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAssignments = async () => {
    try {
      setError(null);
      const res = await adminService.getAssignments();
      setAssignments(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Campus Coursework Oversight</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Audit university-wide coursework volume, active deadlines, and student submission compliance.
          </p>
        </div>
        <button
          onClick={fetchAssignments}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
            <span>Loading campus coursework audit...</span>
          </div>
        ) : (
          <div>
            {/* Mobile Card List View (< 768px) */}
            <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {assignments.map((a) => (
                <div key={a._id} className="p-4 space-y-3 bg-white dark:bg-slate-900">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{a.title}</h4>
                      <p className="text-[11px] text-slate-400">
                        {a.subjectId?.name || a.subject || 'Subject'} • {a.teacherId?.fullName || 'Faculty'}
                      </p>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-800">
                      {a.status || 'Published'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Submissions</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {a.submissionCount || 0} ({a.gradedCount || 0} graded)
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Due Deadline</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {new Date(a.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (>= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/30">
                    <th className="py-3 px-4">Assignment Title</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Faculty</th>
                    <th className="py-3 px-4">Deadline</th>
                    <th className="py-3 px-4">Submissions</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                  {assignments.map((a) => (
                    <tr key={a._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        {a.title}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {a.subjectId?.name || a.subject || 'Subject'}
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                        {a.teacherId?.fullName || 'Faculty'}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {new Date(a.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-200">
                        <span className="font-bold">{a.submissionCount || 0}</span> ({a.gradedCount || 0} graded)
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-600 border border-emerald-200">
                          {a.status || 'Published'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
