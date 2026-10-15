import React from 'react';
import {
  User,
  Award,
  CalendarCheck,
  CreditCard,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Mail
} from 'lucide-react';
import { Student, GradeRecord, FeeRecord, AttendanceRecord } from '../../types';

interface ParentDashboardProps {
  child: Student;
  grades: GradeRecord[];
  fees: FeeRecord[];
  recentAttendance: AttendanceRecord[];
  onOpenReportCard: () => void;
  onPayFee: (feeId: string) => void;
  onNavigate: (tab: string) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  child,
  grades,
  fees,
  recentAttendance,
  onOpenReportCard,
  onPayFee,
  onNavigate
}) => {
  const isLowAttendance = (child.attendanceRate ?? 100) < 75;
  const pendingFees = fees.filter(f => f.status === 'pending' || f.status === 'overdue');

  return (
    <div className="space-y-6">
      {/* Ward Info Card */}
      <div className="bg-white p-5 rounded-lg border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200 ring-2 ring-indigo-600/20 shrink-0">
              <img
                src={child.avatar}
                alt={child.firstName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  Student Ward
                </span>
                <h1 className="text-xl font-bold text-slate-900">
                  {child.firstName} {child.lastName}
                </h1>
              </div>
              <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                <span>Class: <strong className="text-slate-800">{child.className} - {child.section}</strong></span>
                <span>·</span>
                <span>Roll No: <strong className="font-mono text-slate-800">{child.rollNo}</strong></span>
                <span>·</span>
                <span>Admission No: <strong className="font-mono text-slate-800">{child.admissionNo}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenReportCard}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download Official Report Card</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Attendance Percentage */}
        <div className={`p-4 rounded-lg border ${isLowAttendance ? 'bg-rose-50/40 border-rose-200' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Attendance Ratio</span>
            <CalendarCheck className={`w-4 h-4 ${isLowAttendance ? 'text-rose-600' : 'text-emerald-600'}`} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono tabular-nums ${isLowAttendance ? 'text-rose-700' : 'text-slate-900'}`}>
              {child.attendanceRate}%
            </span>
          </div>
          {isLowAttendance ? (
            <div className="mt-2 text-xs text-rose-700 flex items-center gap-1 font-medium">
              <AlertTriangle className="w-3.5 h-3.5" /> Alert: School requires &ge; 75% for exam eligibility
            </div>
          ) : (
            <div className="mt-2 text-xs text-emerald-600 font-medium">
              Regular Attendance Record
            </div>
          )}
        </div>

        {/* Academic Standing / GPA */}
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Academic Standing</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {child.gpa?.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500">GPA</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Based on Term 1 Evaluated Courses
          </div>
        </div>

        {/* Outstanding Fee Balance */}
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pending Fee Balance</span>
            <CreditCard className="w-4 h-4 text-slate-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              ${pendingFees.reduce((acc, f) => acc + (f.amount - f.paidAmount), 0).toFixed(2)}
            </span>
            <span className="text-xs text-slate-500">due</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {pendingFees.length > 0 ? (
              <span className="text-amber-600 font-medium">{pendingFees.length} invoice(s) pending payment</span>
            ) : (
              <span className="text-emerald-600 font-medium">All tuition dues settled</span>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Gradebook breakdown & Fee invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Academic Grades */}
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-slate-600" />
              Midterm Course Marks
            </h2>
            <button
              onClick={onOpenReportCard}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Full Breakdown
            </button>
          </div>

          <div className="mt-3 divide-y divide-slate-100">
            {grades.map(g => (
              <div key={g.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-900 block">{g.subjectName}</span>
                  <span className="text-slate-500 text-[11px] italic">{g.comments}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    {g.marksObtained}/{g.maxMarks}
                  </span>
                  <span className="ml-2 px-2 py-0.5 font-mono text-xs font-semibold rounded bg-slate-100 text-slate-800">
                    {g.grade}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fee Invoices & Payment Ledger */}
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-slate-600" />
              Tuition & Service Invoices
            </h2>
            <button
              onClick={() => onNavigate('fees')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              All Invoices
            </button>
          </div>

          <div className="mt-3 space-y-2">
            {fees.map(f => {
              const due = f.amount - f.paidAmount;
              const isPaid = f.status === 'paid';
              return (
                <div
                  key={f.id}
                  className="p-3 rounded-md border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-900 block">{f.title}</span>
                    <span className="text-slate-500 font-mono text-[11px]">
                      Due: {f.dueDate} · Category: {f.category}
                    </span>
                    {f.receiptNo && (
                      <span className="block text-[10px] text-emerald-600 font-mono mt-0.5">
                        Receipt: {f.receiptNo}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900 block tabular-nums">
                      ${f.amount.toFixed(2)}
                    </span>
                    {isPaid ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                        <CheckCircle2 className="w-3 h-3" /> Paid
                      </span>
                    ) : (
                      <button
                        onClick={() => onPayFee(f.id)}
                        className="mt-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors"
                      >
                        Pay ${due.toFixed(2)}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
