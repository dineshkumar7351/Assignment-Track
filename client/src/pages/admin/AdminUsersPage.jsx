import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, CheckCircle2, XCircle, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchUsers = async () => {
    try {
      setError(null);
      const res = await adminService.getUsers({
        search: search || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined,
      });
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleStatus = async (userId) => {
    try {
      setActionLoading(userId);
      const res = await adminService.toggleUserStatus(userId);
      setUsers(users.map((u) => (u._id === userId ? { ...u, isActive: res.data.isActive } : u)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User & Account Governance</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage student, faculty, and administrator accounts across departments.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearch} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="teacher">Faculty / Teachers</option>
            <option value="admin">Administrators</option>
          </select>
          <button
            onClick={fetchUsers}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 rounded-xl text-xs text-rose-700 dark:text-rose-300">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
            <span>Loading user registry...</span>
          </div>
        ) : users.length > 0 ? (
          <div>
            {/* Mobile Card List View (< 768px) */}
            <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((u) => (
                <div key={u._id} className="p-4 space-y-3 bg-white dark:bg-slate-900">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{u.fullName}</h4>
                      <p className="text-[11px] text-slate-400">{u.email}</p>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold capitalize ${
                        u.role === 'admin'
                          ? 'bg-purple-50 text-purple-600 border border-purple-200 dark:bg-purple-950/50 dark:border-purple-800'
                          : u.role === 'teacher'
                          ? 'bg-sky-50 text-sky-600 border border-sky-200 dark:bg-sky-950/50 dark:border-sky-800'
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-800'
                      }`}
                    >
                      {u.role}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Department</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {u.department || 'General'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Identifier / ID</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">
                        {u.studentId || u.employeeId || '—'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                        u.isActive !== false ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'
                      }`}
                    >
                      {u.isActive !== false ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>{u.isActive !== false ? 'Active Account' : 'Account Disabled'}</span>
                    </span>

                    {u.role !== 'admin' && (
                      <button
                        onClick={() => handleToggleStatus(u._id)}
                        disabled={actionLoading === u._id}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${
                          u.isActive !== false
                            ? 'border-rose-200 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50'
                            : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
                        }`}
                      >
                        {actionLoading === u._id ? 'Updating...' : u.isActive !== false ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (>= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/30">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Identifier</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">{u.fullName}</div>
                        <div className="text-[11px] text-slate-400">{u.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          u.role === 'admin'
                            ? 'bg-purple-50 text-purple-600 border border-purple-200 dark:bg-purple-950/50 dark:border-purple-800'
                            : u.role === 'teacher'
                            ? 'bg-sky-50 text-sky-600 border border-sky-200 dark:bg-sky-950/50 dark:border-sky-800'
                            : 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {u.department || 'General'}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {u.studentId || u.employeeId || '—'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                          u.isActive !== false ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'
                        }`}>
                          {u.isActive !== false ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          <span>{u.isActive !== false ? 'Active' : 'Disabled'}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleToggleStatus(u._id)}
                            disabled={actionLoading === u._id}
                            className={`px-3 py-1 rounded-lg text-[11px] font-semibold border transition ${
                              u.isActive !== false
                                ? 'border-rose-200 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50'
                                : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
                            }`}
                          >
                            {actionLoading === u._id ? 'Updating...' : u.isActive !== false ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="py-16 text-center text-slate-400 text-xs">
            <Users className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
            <span>No user records matching your query.</span>
          </div>
        )}
      </div>
    </div>
  );
}
