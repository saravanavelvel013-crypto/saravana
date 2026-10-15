import React from 'react';
import { X, Printer, Award, CheckCircle2 } from 'lucide-react';
import { Student, GradeRecord, Subject } from '../../types';
import { calculateGrade } from '../../services/apiService';

interface ReportCardModalProps {
  student: Student;
  grades: GradeRecord[];
  allSubjects: Subject[];
  onClose: () => void;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({
  student,
  grades,
  allSubjects,
  onClose
}) => {
  const studentGrades = grades.filter(g => g.studentId === student.id);

  // Compute aggregate metrics
  const totalObtained = studentGrades.reduce((acc, g) => acc + Number(g.marksObtained), 0);
  const totalMax = studentGrades.reduce((acc, g) => acc + Number(g.maxMarks), 0);
  const aggregatePercentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 1000) / 10 : 0;

  const totalPoints = studentGrades.reduce(
    (acc, g) => acc + calculateGrade(g.marksObtained, g.maxMarks).gpa,
    0
  );
  const calculatedGpa = studentGrades.length > 0
    ? Math.round((totalPoints / studentGrades.length) * 100) / 100
    : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-8">
        {/* Modal Controls (Hidden in Print) */}
        <div className="no-print flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-slate-900 text-sm">Official Academic Report Card</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PRINTABLE TRANSCRIPT SECTION */}
        <div id="printable-report" className="space-y-6 text-slate-900 font-sans print:p-0">
          {/* Institutional Letterhead */}
          <div className="text-center pb-4 border-b-2 border-slate-900">
            <div className="text-xl font-extrabold tracking-tight uppercase text-slate-900 font-serif">
              Oakridge International Academy
            </div>
            <div className="text-xs text-slate-600 mt-1">
              Affiliated to State Board of Secondary & Higher Secondary Education · Estd. 1994
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
              Campus: 742 Oakridge Boulevard, Academic District · Web: www.oakridge-academy.edu
            </div>
            <div className="mt-3 inline-block px-4 py-1 bg-slate-900 text-white text-xs font-bold tracking-wider uppercase rounded-xs">
              Midterm Academic Performance Transcript (2026-2027)
            </div>
          </div>

          {/* Student Dossier Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3.5 rounded border border-slate-200">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Student Name</span>
              <span className="font-bold text-slate-900 text-sm">
                {student.firstName} {student.lastName}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Admission / Roll</span>
              <span className="font-mono text-slate-900 font-semibold">
                {student.admissionNo} / #{student.rollNo}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Class & Section</span>
              <span className="font-bold text-slate-900">
                {student.className} - {student.section}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Attendance Rate</span>
              <span className="font-mono text-slate-900 font-bold">
                {student.attendanceRate?.toFixed(1)}%
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Parent / Guardian</span>
              <span className="text-slate-800">{student.guardian.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Date of Birth</span>
              <span className="font-mono text-slate-800">{student.dob}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Academic Term</span>
              <span className="text-slate-800">Term 1 - Midterm 2026</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Issue Date</span>
              <span className="font-mono text-slate-800">{new Date().toISOString().split('T')[0]}</span>
            </div>
          </div>

          {/* Grades Table */}
          <div className="border border-slate-300 rounded overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 font-bold uppercase text-[11px]">
                  <th className="py-2.5 px-3">Subject Name</th>
                  <th className="py-2.5 px-3 text-center">Max Marks</th>
                  <th className="py-2.5 px-3 text-center">Obtained</th>
                  <th className="py-2.5 px-3 text-center">Grade</th>
                  <th className="py-2.5 px-3 text-center">Grade Point</th>
                  <th className="py-2.5 px-3">Teacher Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {studentGrades.length > 0 ? (
                  studentGrades.map(g => {
                    const gradeDetail = calculateGrade(g.marksObtained, g.maxMarks);
                    return (
                      <tr key={g.id}>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {g.subjectName}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono">{g.maxMarks}</td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold">
                          {g.marksObtained}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold">
                          {g.grade}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono">
                          {gradeDetail.gpa.toFixed(1)}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 text-[11px] italic">
                          {g.comments || 'Satisfactory academic progress'}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-slate-500">
                      No evaluation records available for this exam term.
                    </td>
                  </tr>
                )}
              </tbody>
              {/* Table Footer Totals */}
              <tfoot>
                <tr className="bg-slate-50 border-t-2 border-slate-300 font-bold text-xs">
                  <td className="py-2.5 px-3">Total / Aggregate</td>
                  <td className="py-2.5 px-3 text-center font-mono">{totalMax}</td>
                  <td className="py-2.5 px-3 text-center font-mono text-indigo-700">
                    {totalObtained}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-emerald-700">
                    {aggregatePercentage}%
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-indigo-700">
                    GPA {calculatedGpa.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 text-[11px]">
                    Result: {aggregatePercentage >= 50 ? 'PROMOTED / PASSED' : 'REMEDIAL REQUIRED'}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Grading Scale Guide */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-600">
            <span className="font-bold text-slate-800 uppercase block mb-1">
              Grading Standard Key:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 font-mono">
              <div>A+ : 90-100% (4.0 GPA)</div>
              <div>A : 80-89% (3.7 GPA)</div>
              <div>B : 70-79% (3.0 GPA)</div>
              <div>C : 60-69% (2.0 GPA)</div>
              <div>D : 50-59% (1.0 GPA)</div>
              <div>F : &lt;50% (0.0 GPA)</div>
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-8 grid grid-cols-3 gap-6 text-center text-xs text-slate-600">
            <div>
              <div className="border-b border-slate-400 pb-1 mb-1 font-semibold text-slate-800">
                Prof. Marcus Bennett
              </div>
              <span className="text-[10px] text-slate-500">Homeroom Class Teacher</span>
            </div>
            <div>
              <div className="border-b border-slate-400 pb-1 mb-1 font-semibold text-slate-800">
                Dr. Evelyn Vance
              </div>
              <span className="text-[10px] text-slate-500">Principal / Academic Dean</span>
            </div>
            <div>
              <div className="border-b border-slate-400 pb-1 mb-1 font-mono text-[11px] text-slate-700">
                [ SEAL OF THE ACADEMY ]
              </div>
              <span className="text-[10px] text-slate-500">Official Institutional Stamp</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
