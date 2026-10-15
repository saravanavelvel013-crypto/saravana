import React, { useState } from 'react';
import { Calendar, Clock, Plus, Filter, X, Save } from 'lucide-react';
import { TimetableSlot, ClassSection, Teacher, Subject } from '../../types';

interface TimetableManagerProps {
  timetableSlots: TimetableSlot[];
  classes: ClassSection[];
  teachers: Teacher[];
  subjects: Subject[];
  onSaveSlot: (slot: Omit<TimetableSlot, 'id'> & { id?: string }) => void;
  onDeleteSlot: (id: string) => void;
  userRole: string;
}

export const TimetableManager: React.FC<TimetableManagerProps> = ({
  timetableSlots,
  classes,
  teachers,
  subjects,
  onSaveSlot,
  onDeleteSlot,
  userRole
}) => {
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || 'cls-10a');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for new/edit slot
  const [dayOfWeek, setDayOfWeek] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('Monday');
  const [period, setPeriod] = useState(1);
  const [startTime, setStartTime] = useState('08:30');
  const [endTime, setEndTime] = useState('09:20');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || 'sub-math');
  const [teacherId, setTeacherId] = useState(teachers[0]?.id || 'tch-1');
  const [roomNo, setRoomNo] = useState('Room 201');

  const days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday')[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday'
  ];
  const periods = [1, 2, 3, 4, 5];

  const currentClass = classes.find(c => c.id === selectedClassId);

  // Group slots for this class by day and period
  const getSlot = (day: string, p: number) => {
    return timetableSlots.find(
      s => s.classId === selectedClassId && s.dayOfWeek === day && s.period === p
    );
  };

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const selSubject = subjects.find(s => s.id === subjectId);
    const selTeacher = teachers.find(t => t.id === teacherId);
    const selClass = classes.find(c => c.id === selectedClassId);

    onSaveSlot({
      classId: selectedClassId,
      className: `${selClass?.grade} - ${selClass?.section}`,
      dayOfWeek,
      period,
      startTime,
      endTime,
      subjectId,
      subjectName: selSubject?.name || 'Subject',
      teacherId,
      teacherName: selTeacher?.name || 'Faculty',
      roomNo
    });

    setIsAddModalOpen(false);
  };

  const isAdmin = userRole === 'admin';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Academic Schedule & Timetables
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Weekly period allocations, lecture schedules, and classroom assignments
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Assign Lecture Slot</span>
            </button>
          )}
        </div>
      </div>

      {/* Class Selector Bar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Viewing Schedule For:</span>
          <select
            value={selectedClassId}
            onChange={e => setSelectedClassId(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-md bg-white font-semibold text-slate-800"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>
                {c.grade} - Section {c.section} (Lead: {c.classTeacherName})
              </option>
            ))}
          </select>
        </div>

        <div className="text-slate-400 font-mono text-[11px] hidden sm:block">
          Standard 50-Min Periods · 10-Min Passing
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-[11px]">
                <th className="py-3 px-4 w-28">Period / Time</th>
                {days.map(day => (
                  <th key={day} className="py-3 px-4 text-center">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {periods.map(p => {
                const times = [
                  '08:30 – 09:20',
                  '09:25 – 10:15',
                  '10:30 – 11:20',
                  '11:25 – 12:15',
                  '13:00 – 13:50'
                ];

                return (
                  <tr key={p} className="hover:bg-slate-50/50">
                    {/* Period label */}
                    <td className="py-3 px-4 bg-slate-50/70 border-r border-slate-100">
                      <span className="font-mono font-bold text-slate-900 block">Period {p}</span>
                      <span className="font-mono text-[10px] text-slate-500">{times[p - 1]}</span>
                    </td>

                    {/* Day Columns */}
                    {days.map(day => {
                      const slot = getSlot(day, p);
                      return (
                        <td key={day} className="py-3 px-3 align-top min-w-[150px]">
                          {slot ? (
                            <div className="p-2.5 rounded-md border border-indigo-100 bg-indigo-50/40 text-xs space-y-1 relative group">
                              <span className="font-bold text-slate-900 block leading-tight">
                                {slot.subjectName}
                              </span>
                              <span className="text-[11px] text-slate-600 block">
                                {slot.teacherName}
                              </span>
                              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-0.5">
                                <span>{slot.roomNo}</span>
                                {isAdmin && (
                                  <button
                                    onClick={() => onDeleteSlot(slot.id)}
                                    title="Remove Slot"
                                    className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-700 transition-opacity"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="p-2.5 rounded border border-dashed border-slate-200 text-center text-slate-400 text-[11px]">
                              Free Period
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Lecture Slot Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-5 max-w-md w-full space-y-4 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm">Assign New Timetable Slot</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSlot} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Day of Week</label>
                  <select
                    value={dayOfWeek}
                    onChange={e => setDayOfWeek(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded bg-white"
                  >
                    {days.map(d => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Period Number</label>
                  <select
                    value={period}
                    onChange={e => setPeriod(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded bg-white"
                  >
                    {periods.map(p => (
                      <option key={p} value={p}>
                        Period {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Subject</label>
                <select
                  value={subjectId}
                  onChange={e => setSubjectId(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded bg-white"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Instructor Faculty</label>
                <select
                  value={teacherId}
                  onChange={e => setTeacherId(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded bg-white"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Classroom / Lab</label>
                  <input
                    type="text"
                    required
                    value={roomNo}
                    onChange={e => setRoomNo(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Period Timing</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={startTime}
                      onChange={e => setStartTime(e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded font-mono text-[11px]"
                    />
                    <span>-</span>
                    <input
                      type="text"
                      value={endTime}
                      onChange={e => setEndTime(e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded font-mono text-[11px]"
                    />
                  </div>
                </div>
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
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Assign Slot</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
