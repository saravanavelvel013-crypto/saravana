import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Save,
  Download,
  Clock,
  UserX,
  FileSpreadsheet
} from 'lucide-react';
import { Student, ClassSection, AttendanceRecord, AttendanceStatus } from '../../types';

interface AttendanceManagerProps {
  students: Student[];
  classes: ClassSection[];
  attendanceRecords: AttendanceRecord[];
  onSaveAttendance: (
    classId: string,
    date: string,
    records: { studentId: string; status: AttendanceStatus; remarks?: string }[]
  ) => void;
  onExportCsv: () => void;
  currentUserId: string;
}

export const AttendanceManager: React.FC<AttendanceManagerProps> = ({
  students,
  classes,
  attendanceRecords,
  onSaveAttendance,
  onExportCsv,
  currentUserId
}) => {
  const [selectedDate, setSelectedDate] = useState('2026-10-15');
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || 'cls-10a');
  const [activeTab, setActiveTab] = useState<'daily' | 'lowAttendance' | 'analytics'>('daily');

  // Filter students belonging to this class
  const classStudents = students.filter(s => s.classId === selectedClassId);

  // Local state for current attendance roll
  const [rollMap, setRollMap] = useState<Record<string, { status: AttendanceStatus; remarks: string }>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize roll map when class or date changes
  useEffect(() => {
    const existing = attendanceRecords.filter(
      a => a.classId === selectedClassId && a.date === selectedDate
    );

    const initial: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    classStudents.forEach(st => {
      const match = existing.find(a => a.studentId === st.id);
      if (match) {
        initial[st.id] = { status: match.status, remarks: match.remarks || '' };
      } else {
        // default to present
        initial[st.id] = { status: 'present', remarks: '' };
      }
    });
    setRollMap(initial);
  }, [selectedClassId, selectedDate, attendanceRecords, students]);

  const setStudentStatus = (studentId: string, status: AttendanceStatus) => {
    setRollMap(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { remarks: '' }),
        status
      }
    }));
    setSaveSuccess(false);
  };

  const setStudentRemarks = (studentId: string, remarks: string) => {
    setRollMap(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { status: 'present' }),
        remarks
      }
    }));
  };

  const setAllStatus = (status: AttendanceStatus) => {
    const updated: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    classStudents.forEach(st => {
      updated[st.id] = {
        status,
        remarks: rollMap[st.id]?.remarks || ''
      };
    });
    setRollMap(updated);
    setSaveSuccess(false);
  };

  const handleSave = () => {
    const records = classStudents.map(st => ({
      studentId: st.id,
      status: rollMap[st.id]?.status || 'present',
      remarks: rollMap[st.id]?.remarks || ''
    }));

    onSaveAttendance(selectedClassId, selectedDate, records);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Low attendance students list (< 75%)
  const lowAttendanceList = students.filter(s => (s.attendanceRate ?? 100) < 75);

  // Stats for current class sheet
  const presentCount = Object.values(rollMap).filter(v => v.status === 'present').length;
  const absentCount = Object.values(rollMap).filter(v => v.status === 'absent').length;
  const lateCount = Object.values(rollMap).filter(v => v.status === 'late').length;
  const excusedCount = Object.values(rollMap).filter(v => v.status === 'excused').length;
  const dailyRate = classStudents.length > 0 ? Math.round((presentCount / classStudents.length) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Attendance Center</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daily register marking, low-attendance alerts, and historical attendance tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Register CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs / Subnavigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs">
        <button
          onClick={() => setActiveTab('daily')}
          className={`pb-2 px-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'daily'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Daily Roll Call
        </button>
        <button
          onClick={() => setActiveTab('lowAttendance')}
          className={`pb-2 px-3 font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'lowAttendance'
              ? 'border-rose-600 text-rose-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Low Attendance Alerts (&lt;75%)</span>
          <span className="font-mono bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded text-[10px]">
            {lowAttendanceList.length}
          </span>
        </button>
      </div>

      {activeTab === 'daily' && (
        <div className="space-y-4">
          {/* Controls Bar: Class selector, date picker, quick batch buttons */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">Class:</span>
                <select
                  value={selectedClassId}
                  onChange={e => setSelectedClassId(e.target.value)}
                  className="px-2.5 py-1.5 border border-slate-200 rounded-md bg-white font-medium text-slate-800"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.grade} - Section {c.section}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">Date:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="px-2.5 py-1.5 border border-slate-200 rounded-md bg-white font-mono text-slate-800"
                />
              </div>
            </div>

            {/* Batch actions & save */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px] hidden sm:inline">Bulk:</span>
              <button
                type="button"
                onClick={() => setAllStatus('present')}
                className="px-2.5 py-1.5 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md font-medium transition-colors"
              >
                All Present
              </button>
              <button
                type="button"
                onClick={() => setAllStatus('absent')}
                className="px-2.5 py-1.5 text-xs text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md font-medium transition-colors"
              >
                All Absent
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-xs ml-2"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Attendance</span>
              </button>
            </div>
          </div>

          {/* Feedback banner */}
          {saveSuccess && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Attendance register successfully updated and persisted for {selectedDate}.</span>
            </div>
          )}

          {/* Daily Quick Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="p-2.5 bg-white rounded-md border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Enrolled in Class</span>
              <span className="font-mono font-bold text-slate-900 text-base">{classStudents.length}</span>
            </div>
            <div className="p-2.5 bg-white rounded-md border border-slate-200">
              <span className="text-emerald-600 block text-[11px]">Present</span>
              <span className="font-mono font-bold text-emerald-700 text-base">{presentCount}</span>
            </div>
            <div className="p-2.5 bg-white rounded-md border border-slate-200">
              <span className="text-rose-600 block text-[11px]">Absent</span>
              <span className="font-mono font-bold text-rose-700 text-base">{absentCount}</span>
            </div>
            <div className="p-2.5 bg-white rounded-md border border-slate-200">
              <span className="text-amber-600 block text-[11px]">Late</span>
              <span className="font-mono font-bold text-amber-700 text-base">{lateCount}</span>
            </div>
            <div className="p-2.5 bg-white rounded-md border border-slate-200">
              <span className="text-indigo-600 block text-[11px]">Day Attendance Rate</span>
              <span className="font-mono font-bold text-indigo-700 text-base">{dailyRate}%</span>
            </div>
          </div>

          {/* Roll Call Table */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                    <th className="py-3 px-4 w-16">Roll</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4 text-center">Status Selection</th>
                    <th className="py-3 px-4">Remarks / Excuse</th>
                    <th className="py-3 px-4 text-right">Term Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classStudents.map(student => {
                    const currentStatus = rollMap[student.id]?.status || 'present';
                    const currentRemarks = rollMap[student.id]?.remarks || '';

                    return (
                      <tr key={student.id} className="hover:bg-slate-50/60">
                        {/* Roll */}
                        <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                          #{student.rollNo}
                        </td>

                        {/* Student Name */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-200 shrink-0">
                              <img
                                src={student.avatar}
                                alt={student.firstName}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div>
                              <span className="font-semibold text-slate-900 block">
                                {student.firstName} {student.lastName}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {student.admissionNo}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Status Toggle Buttons */}
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-md">
                            <button
                              type="button"
                              onClick={() => setStudentStatus(student.id, 'present')}
                              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                                currentStatus === 'present'
                                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              type="button"
                              onClick={() => setStudentStatus(student.id, 'absent')}
                              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                                currentStatus === 'absent'
                                  ? 'bg-rose-600 text-white font-semibold shadow-xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Absent
                            </button>
                            <button
                              type="button"
                              onClick={() => setStudentStatus(student.id, 'late')}
                              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                                currentStatus === 'late'
                                  ? 'bg-amber-600 text-white font-semibold shadow-xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Late
                            </button>
                            <button
                              type="button"
                              onClick={() => setStudentStatus(student.id, 'excused')}
                              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                                currentStatus === 'excused'
                                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Excused
                            </button>
                          </div>
                        </td>

                        {/* Remarks Input */}
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            placeholder="Add note (e.g. sick leave, medical appointment)"
                            value={currentRemarks}
                            onChange={e => setStudentRemarks(student.id, e.target.value)}
                            className="w-full px-2 py-1 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-indigo-500"
                          />
                        </td>

                        {/* Cumulative Attendance Rate */}
                        <td className="py-3 px-4 text-right font-mono tabular-nums">
                          <span
                            className={
                              (student.attendanceRate ?? 100) < 75
                                ? 'text-rose-600 font-bold'
                                : 'text-slate-700 font-medium'
                            }
                          >
                            {student.attendanceRate?.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Low Attendance Alerts Tab (< 75%) */}
      {activeTab === 'lowAttendance' && (
        <div className="space-y-4">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800">
            <div className="flex items-center gap-2 font-bold text-sm mb-1">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Institutional 75% Attendance Compliance Monitor
            </div>
            <p className="leading-relaxed">
              In accordance with academic regulations, students with cumulative attendance below 75% are ineligible to sit for end-of-term examinations without formal medical dispensation. Automatic warning notices have been triggered for guardians below.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                  <th className="py-3 px-4">Roll</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4 text-right">Attendance %</th>
                  <th className="py-3 px-4">Parent / Guardian Contact</th>
                  <th className="py-3 px-4 text-center">Action Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lowAttendanceList.length > 0 ? (
                  lowAttendanceList.map(st => (
                    <tr key={st.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-semibold">#{st.rollNo}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {st.firstName} {st.lastName}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{st.className} - {st.section}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-rose-600 tabular-nums">
                        {st.attendanceRate?.toFixed(1)}%
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-800 block">
                          {st.guardian.name} ({st.guardian.relationship})
                        </span>
                        <span className="font-mono text-slate-500 text-[11px]">
                          {st.guardian.contact} · {st.guardian.email}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded">
                          Warning Dispatched
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      Excellent! No students currently fall below the 75% attendance threshold.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
