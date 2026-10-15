import React from 'react';
import {
  Award,
  CalendarCheck,
  Calendar,
  CreditCard,
  AlertTriangle,
  FileText,
  User,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Student, GradeRecord, TimetableSlot, FeeRecord } from '../../types';

interface StudentDashboardProps {
  student: Student;
  grades: GradeRecord[];
  timetable: TimetableSlot[];
  fees: FeeRecord[];
  onOpenReportCard: () => void;
  onNavigate: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  grades,
  timetable,
  fees,
  onOpenReportCard,
  onNavigate
}) => {
  const isLowAttendance = (student.attendanceRate ?? 100) < 75;
  const pendingFees = fees.filter(f => f.status === 'pending' || f.status === 'overdue');

  return (
    <div className="space-y-6">
      {/* Student Identity Card */}
      <div className="bg-white p-5 rounded-lg border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  {student.firstName} {student.lastName}
                </h1>
                <span className="text-xs font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-medium">
                  {student.className} - {student.section}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                <span>Admission: <strong className="font-mono text-slate-700">{student.admissionNo}</strong></span>
                <span>·</span>
                <span>Roll No: <strong className="font-mono text-slate-700">{student.rollNo}</strong></span>
                <span>·</span>
                <span>Guardian: {student.guardian.name} ({student.guardian.relationship})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenReportCard}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Official Report Card</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Attendance Score */}
        <div className={`p-4 rounded-lg border ${isLowAttendance ? 'bg-rose-50/40 border-rose-200' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Attendance Percentage</span>
            <CalendarCheck className={`w-4 h-4 ${isLowAttendance ? 'text-rose-600' : 'text-emerald-600'}`} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono tabular-nums ${isLowAttendance ? 'text-rose-700' : 'text-slate-900'}`}>
              {student.attendanceRate}%
            </span>
            <span className="text-xs text-slate-500">present</span>
          </div>
          {isLowAttendance ? (
            <div className="mt-2 text-xs text-rose-700 flex items-center gap-1 font-medium">
              <AlertTriangle className="w-3.5 h-3.5" /> Alert: Below mandatory 75% threshold
            </div>
          ) : (
            <div className="mt-2 text-xs text-emerald-600 font-medium">
              Status: Good Academic Standing
            </div>
          )}
        </div>

        {/* Current Cumulative GPA */}
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Cumulative GPA (4.0 Scale)</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {student.gpa?.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500">/ 4.00</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Total {grades.length} Evaluated Courses
          </div>
        </div>

        {/* Pending Fee Ledger */}
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pending Fee Dues</span>
            <CreditCard className="w-4 h-4 text-slate-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              ${pendingFees.reduce((acc, f) => acc + (f.amount - f.paidAmount), 0).toFixed(2)}
            </span>
            <span className="text-xs text-slate-500">outstanding</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            <button
              onClick={() => onNavigate('fees')}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View Invoices & Receipts &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Grade Breakdown & Timetable */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject-Wise Midterm Grades */}
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              Latest Exam Performance (Midterm)
            </h2>
            <button
              onClick={onOpenReportCard}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Print Card
            </button>
          </div>

          <div className="mt-3 divide-y divide-slate-100">
            {grades.length > 0 ? (
              grades.map(g => (
                <div key={g.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-900 block">{g.subjectName}</span>
                    <span className="text-[11px] text-slate-500 italic">{g.comments}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                      {g.marksObtained}/{g.maxMarks}
                    </span>
                    <span className="ml-2 px-2 py-0.5 font-mono text-xs font-semibold rounded bg-slate-100 text-slate-800">
                      {g.grade}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-slate-500">
                No exam results recorded yet for this session.
              </div>
            )}
          </div>
        </div>

        {/* Daily Schedule */}
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-600" />
              Class Timetable Schedule
            </h2>
            <button
              onClick={() => onNavigate('timetable')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Full Schedule
            </button>
          </div>

          <div className="mt-3 space-y-2">
            {timetable.slice(0, 5).map(slot => (
              <div
                key={slot.id}
                className="p-2.5 bg-slate-50 border border-slate-100 rounded-md flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-900 block">
                    {slot.subjectName}
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {slot.teacherName} · {slot.roomNo}
                  </span>
                </div>
                <div className="text-right font-mono text-slate-600 tabular-nums">
                  {slot.startTime} – {slot.endTime}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
