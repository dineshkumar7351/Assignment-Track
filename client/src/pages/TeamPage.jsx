import React, { useState } from 'react';
import {
  Users,
  Plus,
  Mail,
  MoreVertical,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ArrowUpRight,
  Shield,
  Briefcase,
  X,
} from 'lucide-react';

const TeamPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  // New member form
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: '',
    department: 'Engineering',
  });

  const [members, setMembers] = useState([
    {
      id: 1,
      name: 'Alexandra Deff',
      email: 'alexandra.d@company.com',
      role: 'Lead Architect',
      department: 'Engineering',
      status: 'Active',
      tasksAssigned: 8,
      completedTasks: 6,
      avatar: '/avatar-alexandra.jpg',
      initials: 'AD',
    },
    {
      id: 2,
      name: 'Totok Michael',
      email: 'tmichael20@mail.com',
      role: 'Product Designer',
      department: 'Design',
      status: 'Active',
      tasksAssigned: 12,
      completedTasks: 9,
      avatar: '/avatar-totok.jpg',
      initials: 'TM',
    },
    {
      id: 3,
      name: 'Edwin Adenike',
      email: 'edwin.a@company.com',
      role: 'Full Stack Engineer',
      department: 'Engineering',
      status: 'In Progress',
      tasksAssigned: 7,
      completedTasks: 4,
      avatar: '',
      initials: 'EA',
    },
    {
      id: 4,
      name: 'Isaac Oluwatemilorun',
      email: 'isaac.o@company.com',
      role: 'Backend Developer',
      department: 'Engineering',
      status: 'Active',
      tasksAssigned: 6,
      completedTasks: 3,
      avatar: '',
      initials: 'IO',
    },
    {
      id: 5,
      name: 'David Oshodi',
      email: 'david.o@company.com',
      role: 'Frontend Developer',
      department: 'Design & UI',
      status: 'Active',
      tasksAssigned: 9,
      completedTasks: 7,
      avatar: '',
      initials: 'DO',
    },
    {
      id: 6,
      name: 'Sarah Connor',
      email: 'sarah.c@company.com',
      role: 'Project Manager',
      department: 'Management',
      status: 'Active',
      tasksAssigned: 15,
      completedTasks: 13,
      avatar: '',
      initials: 'SC',
    },
  ]);

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) return;
    const memberToAdd = {
      id: Date.now(),
      ...newMember,
      status: 'Active',
      tasksAssigned: 0,
      completedTasks: 0,
      avatar: '',
      initials: newMember.name.slice(0, 2).toUpperCase(),
    };
    setMembers([memberToAdd, ...members]);
    setNewMember({ name: '', email: '', role: '', department: 'Engineering' });
    setShowAddMemberModal(false);
  };

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept =
      selectedDepartment === 'All' || m.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-7 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Team
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Manage your project collaborators, roles, and departmental permissions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddMemberModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#104f37] hover:bg-[#0d3f2c] text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Top 3 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-[#104f37] text-white shadow-lg shadow-emerald-950/15 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-emerald-100/90">Total Members</span>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-4xl font-extrabold">{members.length}</div>
          <p className="text-xs text-emerald-200/80 mt-2">Active across 4 departments</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Tasks in Progress</span>
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-4xl font-black text-slate-900 dark:text-white">18</div>
          <p className="text-xs text-slate-400 mt-2">Distributed to 6 team members</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Completion Rate</span>
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-4xl font-black text-slate-900 dark:text-white">88.4%</div>
          <p className="text-xs text-slate-400 mt-2">▲ 4.2% higher this sprint</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name, role or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
          />
        </div>

        {/* Department filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', 'Engineering', 'Design', 'Management'].map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => setSelectedDepartment(dept)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedDepartment === dept
                  ? 'bg-[#104f37] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-5 group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shadow-sm flex items-center justify-center font-bold text-sm text-slate-700 dark:text-slate-300 shrink-0">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span>{member.initials}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-[#104f37] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                    {member.role}
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {member.status}
              </span>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-center">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {member.tasksAssigned}
                </div>
                <div className="text-[10px] text-slate-400">Assigned Tasks</div>
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {member.completedTasks}
                </div>
                <div className="text-[10px] text-slate-400">Completed</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                <span>{member.department}</span>
              </span>
              <a
                href={`mailto:${member.email}`}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 transition-colors"
                title={`Send email to ${member.name}`}
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Add New Team Member
              </h3>
              <button
                type="button"
                onClick={() => setShowAddMemberModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Vance"
                  value={newMember.name}
                  onChange={(e) =>
                    setNewMember({ ...newMember, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. jordan.v@company.com"
                  value={newMember.email}
                  onChange={(e) =>
                    setNewMember({ ...newMember, email: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Role Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={newMember.role}
                  onChange={(e) =>
                    setNewMember({ ...newMember, role: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Department
                </label>
                <select
                  value={newMember.department}
                  onChange={(e) =>
                    setNewMember({ ...newMember, department: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Management">Management</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#104f37] hover:bg-[#0d3f2c] text-white text-xs font-bold shadow-sm"
                >
                  Add to Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamPage;
