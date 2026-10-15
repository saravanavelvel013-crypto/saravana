import React from 'react';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Download,
  Plus,
  BookOpen,
  DollarSign,
  Award
} from 'lucide-react';
import { DashboardStats, Announcement, Student, ClassSection } from '../../types';

interface AdminDashboardProps {
  stats: DashboardStats;
  announcements: Announcement[];
  lowAttendanceStudents: { student: Student; rate: number }[];
  classes: ClassSection[];
  onNavigate: (tab: string) => void;
  onExportCsv: (entity: 'students' | 'attendance' | 'grades' | 'fees') => void;
  onOpenAddStudent: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  announcements,
  lowAttendanceStudents,
  classes,
  onNavigate,
  onExportCsv,
  onOpenAddStudent
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner / Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Administrative Operations & Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Oakridge Academy · Academic Year 2026-2027 · Term 1 In Progress
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onExportCsv('students')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Students CSV</span>
          </button>
          <button
            onClick={onOpenAddStudent}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors whitespace-nowrap shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Enroll New Student</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Strip - 4 Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Enrolled Students</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {stats.totalStudents}
            </span>
            <span className="text-xs text-slate-500">across {stats.totalClasses} classes</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            <span>Capacity Utilization: </span>
            <span className="font-mono tabular-nums font-medium text-slate-700">82%</span>
          </div>
        </div>

        {/* Faculty & Staff */}
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Teaching Faculty</span>
            <GraduationCap className="w-4 h-4 text-slate-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {stats.totalTeachers}
            </span>
            <span className="text-xs text-slate-500">Active Teachers</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            <span>Student-Teacher Ratio: </span>
            <span className="font-mono tabular-nums font-medium text-slate-700">
              {stats.totalTeachers > 0 ? (stats.totalStudents / stats.totalTeachers).toFixed(1) : 0}:1
            </span>
          </div>
        </div>

        {/* Institution Attendance */}
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Avg. Attendance Rate</span>
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {stats.overallAttendanceRate}%
            </span>
            <span className="text-xs text-emerald-600 flex items-center font-medium">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +1.4%
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <span>Low Attendance (&lt;75%):</span>
            <span className="font-mono tabular-nums font-semibold text-rose-600">
              {stats.lowAttendanceCount} students
            </span>
          </div>
        </div>

        {/* Fees Collected */}
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Fee Collection (Term 1)</span>
            <CreditCard className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              ${stats.feeCollectionTotal.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">collected</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            <span>Pending Dues: </span>
            <span className="font-mono tabular-nums font-medium text-amber-600">
              ${stats.feePendingTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Low Attendance Alert & Quick Class Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Low Attendance Alerts & Class Section Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Low Attendance Action Card */}
          {lowAttendanceStudents.length > 0 && (
            <div className="bg-white rounded-lg border border-rose-200 p-4">
              <div className="flex items-center justify-between pb-3 border-b border-rose-100">
                <div className="flex items-center gap-2 text-rose-700">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Low Attendance Action Required
                  </span>
                </div>
                <button
                  onClick={() => onNavigate('attendance')}
                  className="text-xs font-semibold text-rose-700 hover:text-rose-900 flex items-center gap-1"
                >
                  Open Attendance Manager <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="mt-3 space-y-2">
                {lowAttendanceStudents.map(({ student, rate }) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-2.5 bg-rose-50/50 rounded-md text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-900">
                        {student.firstName} {student.lastName}
                      </span>
                      <span className="text-slate-500 ml-2">
                        Roll: <span className="font-mono">{student.rollNo}</span> · {student.className} {student.section}
                      </span>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Guardian: {student.guardian.name} ({student.guardian.contact})
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-rose-700 text-sm tabular-nums">
                        {rate.toFixed(1)}%
                      </span>
                      <div className="text-[10px] text-rose-600 font-medium">Critical (&lt;75%)</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Classes & Enrollment Distribution */}
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-slate-600" />
                Active Class Sections & Headcount
              </h2>
              <button
                onClick={() => onNavigate('students')}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
              >
                View All Enrolled
              </button>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              {classes.map(cls => (
                <div key={cls.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-900 text-sm">
                      {cls.grade} - Section {cls.section}
                    </span>
                    <span className="text-slate-500 ml-2">
                      {cls.roomNo} · Class Teacher: {cls.classTeacherName}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="font-mono font-semibold text-slate-900 tabular-nums">
                        {cls.enrolledCount}
                      </span>
                      <span className="text-slate-500"> / {cls.capacity} students</span>
                    </div>
                    {/* Visual capacity bar */}
                    <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden hidden sm:block">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (cls.enrolledCount / cls.capacity) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: School Bulletin & Quick Actions */}
        <div className="space-y-6">
          {/* Quick Operations Palette */}
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h2 className="text-sm font-bold text-slate-900 mb-3">Quick Navigation</h2>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onNavigate('attendance')}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-left transition-colors"
              >
                <CalendarCheck className="w-4 h-4 text-slate-700 mb-1" />
                <span className="font-semibold text-slate-900 block">Mark Attendance</span>
                <span className="text-[11px] text-slate-500">Daily classroom roll</span>
              </button>

              <button
                onClick={() => onNavigate('grades')}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-left transition-colors"
              >
                <Award className="w-4 h-4 text-slate-700 mb-1" />
                <span className="font-semibold text-slate-900 block">Gradebook</span>
                <span className="text-[11px] text-slate-500">Midterm evaluation</span>
              </button>

              <button
                onClick={() => onNavigate('timetable')}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-left transition-colors"
              >
                <TrendingUp className="w-4 h-4 text-slate-700 mb-1" />
                <span className="font-semibold text-slate-900 block">Timetable</span>
                <span className="text-[11px] text-slate-500">Bell schedule & labs</span>
              </button>

              <button
                onClick={() => onNavigate('fees')}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-left transition-colors"
              >
                <DollarSign className="w-4 h-4 text-slate-700 mb-1" />
                <span className="font-semibold text-slate-900 block">Fee Payments</span>
                <span className="text-[11px] text-slate-500">Receipts & dues</span>
              </button>
            </div>
          </div>

          {/* Announcements Feed */}
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Latest Bulletins</h2>
              <button
                onClick={() => onNavigate('announcements')}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
              >
                Manage
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {announcements.slice(0, 3).map(ann => (
                <div key={ann.id} className="text-xs border-b border-slate-100 pb-2.5 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 hover:text-indigo-600 cursor-pointer">
                      {ann.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 tabular-nums">
                      {ann.postedDate}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1 line-clamp-2 text-[11px] leading-relaxed">
                    {ann.content}
                  </p>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Audience: {ann.targetRole} · By {ann.authorName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
