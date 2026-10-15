import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Download,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  AlertTriangle,
  GraduationCap
} from 'lucide-react';
import { Student, ClassSection } from '../../types';

interface StudentListProps {
  students: Student[];
  classes: ClassSection[];
  onOpenAdd: () => void;
  onOpenEdit: (student: Student) => void;
  onOpenDetail: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onExportCsv: () => void;
  userRole: string;
}

export const StudentList: React.FC<StudentListProps> = ({
  students,
  classes,
  onOpenAdd,
  onOpenEdit,
  onOpenDetail,
  onDeleteStudent,
  onExportCsv,
  userRole
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'roll' | 'attendance' | 'gpa'>('roll');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filtering & Sorting
  const filteredStudents = useMemo(() => {
    return students
      .filter(s => {
        const matchesSearch =
          s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.rollNo.includes(searchTerm) ||
          s.guardian.name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesClass = selectedClass === 'all' || s.classId === selectedClass;
        const matchesGender = selectedGender === 'all' || s.gender === selectedGender;

        return matchesSearch && matchesClass && matchesGender;
      })
      .sort((a, b) => {
        let valA: any = '';
        let valB: any = '';
        if (sortBy === 'name') {
          valA = `${a.firstName} ${a.lastName}`.toLowerCase();
          valB = `${b.firstName} ${b.lastName}`.toLowerCase();
        } else if (sortBy === 'roll') {
          valA = parseInt(a.rollNo, 10) || 0;
          valB = parseInt(b.rollNo, 10) || 0;
        } else if (sortBy === 'attendance') {
          valA = a.attendanceRate ?? 0;
          valB = b.attendanceRate ?? 0;
        } else if (sortBy === 'gpa') {
          valA = a.gpa ?? 0;
          valB = b.gpa ?? 0;
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [students, searchTerm, selectedClass, selectedGender, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPage, itemsPerPage]);

  const toggleSort = (field: 'name' | 'roll' | 'attendance' | 'gpa') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const isAdminOrTeacher = userRole === 'admin' || userRole === 'teacher';
  const isAdmin = userRole === 'admin';

  return (
    <div className="space-y-4">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Student Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {students.length} students enrolled · Showing {filteredStudents.length} matching criteria
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          {isAdmin && (
            <button
              onClick={onOpenAdd}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors whitespace-nowrap shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Enroll Student</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, roll, admission..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Filter by Class */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-500 shrink-0">Class:</span>
          <select
            value={selectedClass}
            onChange={e => {
              setSelectedClass(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-auto text-xs border border-slate-200 rounded-md px-2.5 py-1.5 bg-white text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Classes</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>
                {c.grade} - {c.section}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Gender */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-500 shrink-0">Gender:</span>
          <select
            value={selectedGender}
            onChange={e => {
              setSelectedGender(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-auto text-xs border border-slate-200 rounded-md px-2.5 py-1.5 bg-white text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="ml-auto text-xs text-slate-400 font-mono">
          Page {currentPage} of {totalPages}
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th
                  onClick={() => toggleSort('roll')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Roll / Adm.</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('name')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Student Name</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Class & Section</th>
                <th className="py-3 px-4">Guardian Contact</th>
                <th
                  onClick={() => toggleSort('attendance')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Attendance</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('gpa')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>GPA</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map(student => {
                  const isLowAtt = (student.attendanceRate ?? 100) < 75;
                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Roll / Admission */}
                      <td className="py-3 px-4">
                        <span className="font-mono font-semibold text-slate-900 block">
                          #{student.rollNo}
                        </span>
                        <span className="font-mono text-[10px] text-slate-500">
                          {student.admissionNo}
                        </span>
                      </td>

                      {/* Student Info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 shrink-0">
                            <img
                              src={student.avatar}
                              alt={student.firstName}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 block text-xs">
                              {student.firstName} {student.lastName}
                            </span>
                            <span className="text-[11px] text-slate-500 font-mono">
                              {student.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Class */}
                      <td className="py-3 px-4 text-slate-700">
                        <span className="font-medium">{student.className}</span>
                        <span className="text-slate-500 text-[11px] block">Sec {student.section}</span>
                      </td>

                      {/* Guardian */}
                      <td className="py-3 px-4 text-slate-600">
                        <span className="font-medium text-slate-800 block text-xs">
                          {student.guardian.name}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono block">
                          {student.guardian.contact}
                        </span>
                      </td>

                      {/* Attendance % */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 font-mono tabular-nums font-semibold">
                          {isLowAtt && <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                          <span className={isLowAtt ? 'text-rose-600 font-bold' : 'text-slate-800'}>
                            {student.attendanceRate?.toFixed(1)}%
                          </span>
                        </div>
                      </td>

                      {/* GPA */}
                      <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-slate-800">
                        {student.gpa?.toFixed(2)}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <span className="capitalize text-[11px] font-medium text-slate-600">
                          {student.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onOpenDetail(student)}
                            title="View Student Dossier"
                            className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {isAdminOrTeacher && (
                            <button
                              onClick={() => onOpenEdit(student)}
                              title="Edit Details"
                              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {isAdmin && (
                            <button
                              onClick={() => setDeleteConfirmId(student.id)}
                              title="Delete Student"
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-slate-500">
                    No students match the current filter or search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>Show:</span>
            <select
              value={itemsPerPage}
              onChange={e => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-slate-200 rounded px-2 py-1 bg-white text-xs"
            >
              <option value={6}>6 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
            </select>
            <span>of {filteredStudents.length} entries</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-slate-200 rounded bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono tabular-nums">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-slate-200 rounded bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-5 max-w-sm w-full space-y-4 shadow-lg border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="font-bold text-slate-900 text-sm">Confirm Student Deletion</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete this student record? This will remove attendance, grades, and associated ledger entries.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteStudent(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-md transition-colors"
              >
                Delete Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
