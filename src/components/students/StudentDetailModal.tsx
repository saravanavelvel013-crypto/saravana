import React from 'react';
import { X, Award, CalendarCheck, CreditCard, FileText, Phone, Mail, MapPin } from 'lucide-react';
import { Student, GradeRecord, FeeRecord, AttendanceRecord } from '../../types';

interface StudentDetailModalProps {
  student: Student;
  grades: GradeRecord[];
  fees: FeeRecord[];
  attendanceHistory: AttendanceRecord[];
  onClose: () => void;
  onOpenReportCard: (student: Student) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  grades,
  fees,
  attendanceHistory,
  onClose,
  onOpenReportCard
}) => {
  const isLowAttendance = (student.attendanceRate ?? 100) < 75;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-3xl w-full p-6 space-y-6 shadow-xl border border-slate-200 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-900">Student Profile & Dossier</h2>
            <span className="text-xs font-mono text-slate-500">{student.admissionNo}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Identity & Contact Strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200 ring-2 ring-indigo-600/20 shrink-0">
              <img
                src={student.avatar}
                alt={student.firstName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {student.firstName} {student.lastName}
              </h3>
              <div className="text-xs text-slate-600 mt-0.5 space-x-2">
                <span>Class: <strong>{student.className} - {student.section}</strong></span>
                <span>·</span>
                <span>Roll: <strong className="font-mono">#{student.rollNo}</strong></span>
                <span>·</span>
                <span className="capitalize">{student.gender}</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-3">
                <span className="flex items-center gap-1 font-mono">
                  <Phone className="w-3 h-3 text-slate-400" /> {student.contactNumber}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Mail className="w-3 h-3 text-slate-400" /> {student.email}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onOpenReportCard(student)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-xs shrink-0"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Report Card</span>
          </button>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className={`p-3 rounded-md border ${isLowAttendance ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-200'}`}>
            <span className="text-[11px] text-slate-500 block">Attendance Rate</span>
            <span className={`text-xl font-bold font-mono tabular-nums ${isLowAttendance ? 'text-rose-600' : 'text-slate-900'}`}>
              {student.attendanceRate?.toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              {isLowAttendance ? 'Attendance below 75% limit' : 'Regular class standing'}
            </span>
          </div>

          <div className="bg-white p-3 rounded-md border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Current Cumulative GPA</span>
            <span className="text-xl font-bold font-mono tabular-nums text-slate-900">
              {student.gpa?.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Across {grades.length} graded courses
            </span>
          </div>

          <div className="bg-white p-3 rounded-md border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Enrollment Status</span>
            <span className="text-xl font-bold capitalize text-slate-900">
              {student.status}
            </span>
            <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
              Enrolled: {student.enrollmentDate}
            </span>
          </div>
        </div>

        {/* Guardian & Residence */}
        <div className="p-3 bg-white rounded-md border border-slate-200 text-xs">
          <h4 className="font-semibold text-slate-800 mb-2">Guardian & Emergency Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-600">
            <div>
              <span className="text-slate-400 block text-[11px]">Guardian Name</span>
              <span className="font-medium text-slate-900">
                {student.guardian.name} ({student.guardian.relationship})
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Contact & Email</span>
              <span className="font-mono text-slate-900 block">{student.guardian.contact}</span>
              <span className="font-mono text-[11px] text-slate-500 block">{student.guardian.email}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Home Address</span>
              <span className="text-slate-900">{student.address || 'Address on file'}</span>
            </div>
          </div>
        </div>

        {/* Grades Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-indigo-600" />
            Midterm Examination Course Marks
          </h4>
          <div className="border border-slate-200 rounded-md overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                  <th className="py-2 px-3">Subject</th>
                  <th className="py-2 px-3 text-right">Score</th>
                  <th className="py-2 px-3 text-center">Grade</th>
                  <th className="py-2 px-3">Instructor Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {grades.length > 0 ? (
                  grades.map(g => (
                    <tr key={g.id} className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 font-medium text-slate-900">{g.subjectName}</td>
                      <td className="py-2 px-3 text-right font-mono tabular-nums font-semibold">
                        {g.marksObtained} / {g.maxMarks}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className="font-mono font-bold text-slate-800">{g.grade}</span>
                      </td>
                      <td className="py-2 px-3 text-slate-500 italic text-[11px]">{g.comments}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-slate-400">
                      No grades published yet for this student.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fee Ledgers */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-slate-600" />
            Fee Invoices & Settlement History
          </h4>
          <div className="border border-slate-200 rounded-md overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                  <th className="py-2 px-3">Invoice</th>
                  <th className="py-2 px-3">Category</th>
                  <th className="py-2 px-3 text-right">Amount</th>
                  <th className="py-2 px-3 text-right">Paid</th>
                  <th className="py-2 px-3 text-center">Status</th>
                  <th className="py-2 px-3">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fees.map(f => (
                  <tr key={f.id}>
                    <td className="py-2 px-3 font-medium text-slate-900">{f.title}</td>
                    <td className="py-2 px-3 text-slate-500">{f.category}</td>
                    <td className="py-2 px-3 text-right font-mono tabular-nums">${f.amount.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right font-mono tabular-nums font-semibold">${f.paidAmount.toFixed(2)}</td>
                    <td className="py-2 px-3 text-center capitalize">
                      <span className={f.status === 'paid' ? 'text-emerald-600 font-semibold' : 'text-amber-600'}>
                        {f.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-600">{f.receiptNo || 'Unissued'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
