import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Download, RefreshCw, CheckCircle2, TrendingUp, Users, BookOpen } from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function AdminReportsPage() {
  const [reportsData, setReportsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    try {
      setError(null);
      const res = await adminService.getReports();
      setReportsData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to generate reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleExportCSV = () => {
    if (!reportsData) return;
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Metric,Value\n" +
      `Total Users,${reportsData.metrics?.totalUsers}\n` +
      `Total Students,${reportsData.metrics?.totalStudents}\n` +
      `Total Teachers,${reportsData.metrics?.totalTeachers}\n` +
      `Total Subjects,${reportsData.metrics?.totalSubjects}\n` +
      `Total Assignments,${reportsData.metrics?.totalAssignments}\n` +
      `Total Submissions,${reportsData.metrics?.totalSubmissions}\n` +
      `Institutional Average Grade,${reportsData.metrics?.institutionalAverage}%\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `academic_institutional_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Institutional Reports & Audit Logs</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Export university academic metrics, department breakdowns, and automated system compliance logs.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={!reportsData}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {reportsData && (
        <div className="space-y-6">
          {/* Key University Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 uppercase">Institutional Average</span>
              <div className="text-3xl font-extrabold text-emerald-600 mt-1">{reportsData.metrics?.institutionalAverage}%</div>
              <span className="text-[11px] text-slate-400">across all evaluations</span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 uppercase">Enrolled Students</span>
              <div className="text-3xl font-extrabold text-indigo-600 mt-1">{reportsData.metrics?.totalStudents}</div>
              <span className="text-[11px] text-slate-400">active student accounts</span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 uppercase">Faculty Teachers</span>
              <div className="text-3xl font-extrabold text-sky-600 mt-1">{reportsData.metrics?.totalTeachers}</div>
              <span className="text-[11px] text-slate-400">teaching staff</span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 uppercase">Course Submissions</span>
              <div className="text-3xl font-extrabold text-purple-600 mt-1">{reportsData.metrics?.totalSubmissions}</div>
              <span className="text-[11px] text-slate-400">processed submissions</span>
            </div>
          </div>

          {/* Department Breakdown */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Department Enrollment Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reportsData.departmentBreakdown?.map((dept, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-white text-xs mb-1">{dept.department}</div>
                  <div className="text-[11px] text-slate-500">
                    {dept.students} Students • {dept.teachers} Faculty
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Audit Logs */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Automated Academic Audit Logs</h3>
            <div className="space-y-3">
              {reportsData.auditLogs?.map((log, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-medium text-slate-800 dark:text-slate-200">{log.action}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                    <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 font-bold text-[10px]">{log.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
