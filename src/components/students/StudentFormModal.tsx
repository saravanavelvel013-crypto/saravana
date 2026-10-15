import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { Student, ClassSection } from '../../types';

interface StudentFormModalProps {
  initialData?: Student | null;
  classes: ClassSection[];
  onSave: (data: Omit<Student, 'id'> & { id?: string }) => void;
  onClose: () => void;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  initialData,
  classes,
  onSave,
  onClose
}) => {
  const isEdit = !!initialData?.id;

  const [firstName, setFirstName] = useState(initialData?.firstName || '');
  const [lastName, setLastName] = useState(initialData?.lastName || '');
  const [rollNo, setRollNo] = useState(initialData?.rollNo || '');
  const [admissionNo, setAdmissionNo] = useState(
    initialData?.admissionNo || `ADM-2026-${Math.floor(100 + Math.random() * 900)}`
  );
  const [classId, setClassId] = useState(initialData?.classId || classes[0]?.id || '');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(initialData?.gender || 'male');
  const [dob, setDob] = useState(initialData?.dob || '2010-01-15');
  const [email, setEmail] = useState(initialData?.email || '');
  const [contactNumber, setContactNumber] = useState(initialData?.contactNumber || '+1 (555) 000-0000');
  const [address, setAddress] = useState(initialData?.address || '');
  const [avatar, setAvatar] = useState(
    initialData?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  );
  const [status, setStatus] = useState<'active' | 'graduated' | 'suspended'>(initialData?.status || 'active');

  // Guardian details
  const [guardianName, setGuardianName] = useState(initialData?.guardian.name || '');
  const [guardianRelation, setGuardianRelation] = useState<'Father' | 'Mother' | 'Guardian'>(
    initialData?.guardian.relationship || 'Father'
  );
  const [guardianContact, setGuardianContact] = useState(initialData?.guardian.contact || '');
  const [guardianEmail, setGuardianEmail] = useState(initialData?.guardian.email || '');
  const [guardianOccupation, setGuardianOccupation] = useState(initialData?.guardian.occupation || '');

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !rollNo.trim() || !guardianName.trim()) {
      setError('First Name, Last Name, Roll Number, and Guardian Name are mandatory.');
      return;
    }

    const selectedCls = classes.find(c => c.id === classId);
    const className = selectedCls?.grade || 'Grade 10';
    const section = selectedCls?.section || 'A';

    onSave({
      id: initialData?.id,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      rollNo: rollNo.trim(),
      admissionNo: admissionNo.trim(),
      classId,
      className,
      section,
      gender,
      dob,
      email: email.trim() || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@edupulse.edu`,
      contactNumber: contactNumber.trim(),
      address: address.trim(),
      avatar,
      enrollmentDate: initialData?.enrollmentDate || new Date().toISOString().split('T')[0],
      status,
      guardian: {
        name: guardianName.trim(),
        relationship: guardianRelation,
        contact: guardianContact.trim() || '+1 (555) 123-4567',
        email: guardianEmail.trim() || 'guardian@gmail.com',
        occupation: guardianOccupation.trim()
      },
      attendanceRate: initialData?.attendanceRate ?? 100,
      gpa: initialData?.gpa ?? 4.0
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 space-y-4 shadow-xl border border-slate-200 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h2 className="text-base font-bold text-slate-900">
            {isEdit ? 'Edit Student Record' : 'Enroll New Student'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Section 1: Academic & Identity */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider">
              1. Student Identity & Enrollment
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Roll Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1007"
                  value={rollNo}
                  onChange={e => setRollNo(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Class & Section *</label>
                <select
                  value={classId}
                  onChange={e => setClassId(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded bg-white"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.grade} - Section {c.section}
                    </option>
                  ))}
                </select>
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

              <div>
                <label className="block text-slate-600 font-medium mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Student Contact Phone</label>
                <input
                  type="text"
                  value={contactNumber}
                  onChange={e => setContactNumber(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Avatar Image URL</label>
                <input
                  type="text"
                  value={avatar}
                  onChange={e => setAvatar(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded font-mono text-[11px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Residential Address</label>
              <input
                type="text"
                placeholder="Street address, City, State"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded"
              />
            </div>
          </div>

          {/* Section 2: Guardian Details */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider">
              2. Parent & Guardian Contact
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Guardian Name *</label>
                <input
                  type="text"
                  required
                  value={guardianName}
                  onChange={e => setGuardianName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Relationship</label>
                <select
                  value={guardianRelation}
                  onChange={e => setGuardianRelation(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded bg-white"
                >
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Guardian">Guardian</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Guardian Contact Phone *</label>
                <input
                  type="text"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={guardianContact}
                  onChange={e => setGuardianContact(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Guardian Email</label>
                <input
                  type="email"
                  value={guardianEmail}
                  onChange={e => setGuardianEmail(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Occupation</label>
                <input
                  type="text"
                  placeholder="e.g. Architect, Physician, Engineer"
                  value={guardianOccupation}
                  onChange={e => setGuardianOccupation(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isEdit ? 'Update Student' : 'Save & Enroll'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
