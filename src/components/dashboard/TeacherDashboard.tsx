import React from 'react';
import {
  BookOpen,
  CalendarCheck,
  Award,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Teacher, TimetableSlot, Student } from '../../types';

interface TeacherDashboardProps {
  teacher: Teacher;
  todaySchedule: TimetableSlot[];
  students: Student[];
  onNavigate: (tab: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  teacher,
  todaySchedule,
  students,
  onNavigate
}) => {
  const homeroomClass = teacher.isClassTeacherOf;
  const homeroomStudents = homeroomClass
    ? students.filter(s => s.classId === homeroomClass.classId)
    : [];

  return (
    <div className="space-y-6">
      {/* Teacher Profile Header */}
      <div className="bg-white p-5 rounded-lg border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-200 ring-2 ring-indigo-600/20 shrink-0">
              <img
                src={teacher.avatar}
                alt={teacher.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">{teacher.name}</h1>
              <div className="text-xs text-slate-500 mt-0.5">
                <span>Staff ID: </span>
                <span className="font-mono text-slate-700 font-medium">{teacher.employeeId}</span>
                <span className="mx-1.5">·</span>
                <span>{teacher.specialization}</span>
                <span className="mx-1.5">·</span>
                <span>{teacher.qualification}</span>
              </div>
              {homeroomClass && (
                <div className="text-xs text-indigo-700 font-medium mt-1">
                  Homeroom Class Teacher: {homeroomClass.className} - Section {homeroomClass.section} ({homeroomStudents.length} students)
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('attendance')}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors shadow-xs"
            >
              Take Today's Roll
            </button>
            <button
              onClick={() => onNavigate('grades')}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
            >
              Input Marks
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Bell Schedule & Assigned Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Teaching Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-600" />
                Today's Teaching Schedule (Monday)
              </h2>
              <button
                onClick={() => onNavigate('timetable')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Full Weekly Timetable
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {todaySchedule.length > 0 ? (
                todaySchedule.map(slot => (
                  <div
                    key={slot.id}
                    className="p-3 rounded-md border border-slate-100 hover:border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 text-center py-1 bg-white rounded border border-slate-200">
                        <span className="font-mono text-slate-700 font-semibold block">P{slot.period}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 text-sm block">
                          {slot.subjectName} · {slot.className}
                        </span>
                        <span className="text-slate-500 font-mono text-[11px]">
                          {slot.startTime} – {slot.endTime} · {slot.roomNo}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigate('attendance')}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      Class Attendance <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-500">
                  No lectures scheduled for today.
                </div>
              )}
            </div>
          </div>

          {/* Assigned Classes Roster */}
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-600" />
              Assigned Classes & Subjects
            </h2>

            <div className="divide-y divide-slate-100">
              {teacher.assignedClasses.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-900">
                      {item.className} - Section {item.section}
                    </span>
                    <span className="text-slate-500 ml-2">Course: {item.subjectName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigate('grades')}
                      className="px-2.5 py-1 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded font-medium transition-colors"
                    >
                      Enter Marks
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Homeroom Quick Action & Attendance Checklist */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h2 className="text-sm font-bold text-slate-900 mb-2">Homeroom Quick Roll</h2>
            <p className="text-xs text-slate-500 mb-3">
              Daily morning registration for {homeroomClass?.className} - {homeroomClass?.section}.
            </p>

            <div className="space-y-2">
              {homeroomStudents.slice(0, 4).map(st => (
                <div key={st.id} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-50">
                  <span className="font-medium text-slate-900 truncate max-w-[140px]">
                    {st.firstName} {st.lastName}
                  </span>
                  <span className="font-mono text-slate-500">Roll #{st.rollNo}</span>
                  <span className="text-[11px] font-mono text-emerald-600 font-semibold">
                    {st.attendanceRate}% Att.
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('attendance')}
              className="mt-4 w-full py-2 text-center text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
            >
              Open Class Roster
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
