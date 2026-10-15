import React, { useState, useEffect } from 'react';
import {
  Award,
  Save,
  CheckCircle2,
  Download,
  FileText,
  TrendingUp,
  Percent
} from 'lucide-react';
import { Student, ClassSection, Subject, Exam, GradeRecord } from '../../types';
import { calculateGrade } from '../../services/apiService';

interface GradebookProps {
  students: Student[];
  classes: ClassSection[];
  subjects: Subject[];
  exams: Exam[];
  grades: GradeRecord[];
  onSaveGradesBatch: (records: Omit<GradeRecord, 'id' | 'grade'>[]) => void;
  onOpenReportCard: (student: Student) => void;
  onExportCsv: () => void;
}

export const Gradebook: React.FC<GradebookProps> = ({
  students,
  classes,
  subjects,
  exams,
  grades,
  onSaveGradesBatch,
  onOpenReportCard,
  onExportCsv
}) => {
  const [selectedExamId, setSelectedExamId] = useState(exams[0]?.id || 'ex-midterm');
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || 'cls-10a');
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || 'sub-math');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const classStudents = students.filter(s => s.classId === selectedClassId);
  const currentExam = exams.find(e => e.id === selectedExamId);
  const currentSubject = subjects.find(s => s.id === selectedSubjectId);

  // Editable local state: mapping studentId -> { marks: number, maxMarks: number, comments: string }
  const [marksMap, setMarksMap] = useState<Record<string, { marks: number; maxMarks: number; comments: string }>>({});

  useEffect(() => {
    const existing = grades.filter(
      g => g.classId === selectedClassId && g.examId === selectedExamId && g.subjectId === selectedSubjectId
    );

    const initial: Record<string, { marks: number; maxMarks: number; comments: string }> = {};
    classStudents.forEach(st => {
      const match = existing.find(g => g.studentId === st.id);
      if (match) {
        initial[st.id] = {
          marks: match.marksObtained,
          maxMarks: match.maxMarks || 100,
          comments: match.comments || ''
        };
      } else {
        initial[st.id] = {
          marks: 75,
          maxMarks: 100,
          comments: ''
        };
      }
    });
    setMarksMap(initial);
  }, [selectedExamId, selectedClassId, selectedSubjectId, grades, students]);

  const handleMarksChange = (studentId: string, val: number) => {
    const cleanVal = isNaN(val) ? 0 : Math.min(100, Math.max(0, val));
    setMarksMap(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { maxMarks: 100, comments: '' }),
        marks: cleanVal
      }
    }));
    setSaveSuccess(false);
  };

  const handleCommentsChange = (studentId: string, comments: string) => {
    setMarksMap(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { marks: 75, maxMarks: 100 }),
        comments
      }
    }));
  };

  const handleSave = () => {
    if (!currentExam || !currentSubject) return;

    const records: Omit<GradeRecord, 'id' | 'grade'>[] = classStudents.map(st => {
      const data = marksMap[st.id] || { marks: 0, maxMarks: 100, comments: '' };
      return {
        studentId: st.id,
        studentName: `${st.firstName} ${st.lastName}`,
        rollNo: st.rollNo,
        classId: selectedClassId,
        examId: selectedExamId,
        examName: currentExam.name,
        subjectId: selectedSubjectId,
        subjectName: currentSubject.name,
        marksObtained: data.marks,
        maxMarks: data.maxMarks,
        comments: data.comments,
        recordedDate: new Date().toISOString().split('T')[0]
      };
    });

    onSaveGradesBatch(records);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Class analytics on this exam subject
  const marksArray = Object.values(marksMap).map(v => v.marks);
  const avgMarks = marksArray.length > 0
    ? Math.round((marksArray.reduce((acc, m) => acc + m, 0) / marksArray.length) * 10) / 10
    : 0;
  const highestMarks = marksArray.length > 0 ? Math.max(...marksArray) : 0;
  const lowestMarks = marksArray.length > 0 ? Math.min(...marksArray) : 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Exams & Gradebook Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Marks entry, GPA calculation, and automated institutional report card generation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Grades CSV</span>
          </button>
        </div>
      </div>

      {/* Selector Controls Bar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Exam Selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Exam:</span>
            <select
              value={selectedExamId}
              onChange={e => setSelectedExamId(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 rounded-md bg-white font-medium text-slate-800"
            >
              {exams.map(e => (
                <option key={e.id} value={e.id}>
                  {e.name} ({e.term})
                </option>
              ))}
            </select>
          </div>

          {/* Class Selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Class:</span>
            <select
              value={selectedClassId}
              onChange={e => setSelectedClassId(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 rounded-md bg-white font-medium text-slate-800"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.grade} - {c.section}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Subject:</span>
            <select
              value={selectedSubjectId}
              onChange={e => setSelectedSubjectId(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 rounded-md bg-white font-medium text-slate-800"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-xs"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Exam Marks</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Grades successfully saved and grade points recalculated!</span>
        </div>
      )}

      {/* Analytics KPI strip for current course exam */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-2.5 bg-white rounded-md border border-slate-200">
          <span className="text-slate-500 block text-[11px]">Class Average Score</span>
          <span className="font-mono font-bold text-slate-900 text-base">{avgMarks}%</span>
        </div>
        <div className="p-2.5 bg-white rounded-md border border-slate-200">
          <span className="text-emerald-600 block text-[11px]">Highest Score</span>
          <span className="font-mono font-bold text-emerald-700 text-base">{highestMarks} / 100</span>
        </div>
        <div className="p-2.5 bg-white rounded-md border border-slate-200">
          <span className="text-amber-600 block text-[11px]">Lowest Score</span>
          <span className="font-mono font-bold text-amber-700 text-base">{lowestMarks} / 100</span>
        </div>
        <div className="p-2.5 bg-white rounded-md border border-slate-200">
          <span className="text-indigo-600 block text-[11px]">Tested Students</span>
          <span className="font-mono font-bold text-indigo-700 text-base">{classStudents.length}</span>
        </div>
      </div>

      {/* Marks Entry Spreadsheet Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                <th className="py-3 px-4 w-16">Roll</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4 w-36">Marks (0-100)</th>
                <th className="py-3 px-4 text-center w-24">Grade</th>
                <th className="py-3 px-4 text-center w-24">GPA Point</th>
                <th className="py-3 px-4">Instructor Feedback</th>
                <th className="py-3 px-4 text-right">Report Card</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map(student => {
                const data = marksMap[student.id] || { marks: 75, maxMarks: 100, comments: '' };
                const gradeInfo = calculateGrade(data.marks, data.maxMarks);

                return (
                  <tr key={student.id} className="hover:bg-slate-50/70">
                    {/* Roll */}
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                      #{student.rollNo}
                    </td>

                    {/* Name */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 block">
                        {student.firstName} {student.lastName}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {student.admissionNo}
                      </span>
                    </td>

                    {/* Marks Input */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={data.marks}
                          onChange={e => handleMarksChange(student.id, parseFloat(e.target.value))}
                          className="w-20 px-2 py-1 border border-slate-300 rounded font-mono font-semibold text-slate-900 text-xs focus:ring-1 focus:ring-indigo-500"
                        />
                        <span className="text-slate-400 font-mono text-[11px]">/ 100</span>
                      </div>
                    </td>

                    {/* Computed Grade */}
                    <td className="py-3 px-4 text-center">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-900">
                        {gradeInfo.grade}
                      </span>
                    </td>

                    {/* Computed GPA */}
                    <td className="py-3 px-4 text-center font-mono font-semibold text-slate-700">
                      {gradeInfo.gpa.toFixed(1)}
                    </td>

                    {/* Comments */}
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        placeholder="Evaluation notes for transcript"
                        value={data.comments}
                        onChange={e => handleCommentsChange(student.id, e.target.value)}
                        className="w-full px-2 py-1 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>

                    {/* View Report Card */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onOpenReportCard(student)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Transcript</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
