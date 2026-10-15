import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Search,
  Phone,
  Mail,
  BookOpen,
  Calendar,
  X,
  Save,
  Trash2
} from 'lucide-react';
import { Teacher, Subject } from '../../types';

interface TeacherListProps {
  teachers: Teacher[];
  subjects: Subject[];
  onSaveTeacher: (teacher: Omit<Teacher, 'id'> & { id?: string }) => void;
  onDeleteTeacher: (id: string) => void;
  userRole: string;
}

export const TeacherList: React.FC<TeacherListProps> = ({
  teachers,
  subjects,
  onSaveTeacher,
  onDeleteTeacher,
  userRole
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+1 (555) 000-0000');
  const [qualification, setQualification] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('female');

  const filtered = teachers.filter(
    t =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !qualification.trim()) return;

    onSaveTeacher({
      employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@edupulse.edu`,
      phone: phone.trim(),
      gender,
      qualification: qualification.trim(),
      specialization: specialization.trim() || 'General Studies',
      joiningDate: new Date().toISOString().split('T')[0],
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      assignedClasses: []
    });

    setName('');
    setQualification('');
    setSpecialization('');
    setIsAddModalOpen(false);
  };

  const isAdmin = userRole === 'admin';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Faculty & Staff Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Academic teaching staff, departmental appointments, and subject allocations
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register Faculty Member</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search teacher by name or specialization..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <span className="text-xs text-slate-400 font-mono ml-auto">
          {filtered.length} Faculty Members
        </span>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(teacher => (
          <div
            key={teacher.id}
            className="bg-white rounded-lg border border-slate-200 p-4 space-y-3 shadow-xs hover:border-slate-300 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 shrink-0 ring-1 ring-slate-200">
                  <img
                    src={teacher.avatar}
                    alt={teacher.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{teacher.name}</h3>
                  <span className="text-[11px] font-mono text-indigo-700 block">
                    {teacher.employeeId}
                  </span>
                </div>
              </div>
              {isAdmin && (
                <button
                  onClick={() => onDeleteTeacher(teacher.id)}
                  title="Remove Teacher"
                  className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="space-y-1 text-xs text-slate-600">
              <div>
                <span className="text-slate-400 text-[11px]">Specialization: </span>
                <span className="font-medium text-slate-800">{teacher.specialization}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Degree: </span>
                <span>{teacher.qualification}</span>
              </div>
              <div className="pt-1 flex items-center gap-3 text-[11px] font-mono text-slate-500">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" /> {teacher.email}
                </span>
              </div>
            </div>

            {/* Assigned classes count */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-slate-400" />
                {teacher.assignedClasses.length} Assigned Class(es)
              </span>
              <span className="font-mono text-[10px]">
                Joined {teacher.joiningDate}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Teacher Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-5 max-w-md w-full space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm">Register Teaching Faculty</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Jennifer Hayes"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Email</label>
                <input
                  type="email"
                  placeholder="faculty@edupulse.edu"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded bg-white"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Academic Qualification *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ph.D. in Organic Chemistry, Stanford"
                  value={qualification}
                  onChange={e => setQualification(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Specialization Domain</label>
                <input
                  type="text"
                  placeholder="e.g. Organic Chemistry & Biochemistry"
                  value={specialization}
                  onChange={e => setSpecialization(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow-xs"
                >
                  Register Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
