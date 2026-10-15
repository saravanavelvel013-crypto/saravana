import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { TeacherDashboard } from './components/dashboard/TeacherDashboard';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { ParentDashboard } from './components/dashboard/ParentDashboard';
import { StudentList } from './components/students/StudentList';
import { StudentFormModal } from './components/students/StudentFormModal';
import { StudentDetailModal } from './components/students/StudentDetailModal';
import { TeacherList } from './components/teachers/TeacherList';
import { AttendanceManager } from './components/attendance/AttendanceManager';
import { Gradebook } from './components/grades/Gradebook';
import { ReportCardModal } from './components/grades/ReportCardModal';
import { TimetableManager } from './components/timetable/TimetableManager';
import { FeeManagement } from './components/fees/FeeManagement';
import { AnnouncementManager } from './components/announcements/AnnouncementManager';
import { SchemaViewer } from './components/schema/SchemaViewer';

import {
  Role,
  User,
  Student,
  Teacher,
  ClassSection,
  Subject,
  AttendanceRecord,
  Exam,
  GradeRecord,
  TimetableSlot,
  FeeRecord,
  Announcement,
  AttendanceStatus
} from './types';
import { apiService } from './services/apiService';
import { INITIAL_USERS, INITIAL_EXAMS } from './services/seedData';

export default function App() {
  // Navigation & Role State
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // default to Admin

  // Domain Entity States
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<ClassSection[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [timetables, setTimetables] = useState<TimetableSlot[]>([]);
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [exams, setExams] = useState<Exam[]>(INITIAL_EXAMS);

  // Modal States
  const [formModalStudent, setFormModalStudent] = useState<Student | null | undefined>(undefined);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [detailModalStudent, setDetailModalStudent] = useState<Student | null>(null);
  const [reportCardStudent, setReportCardStudent] = useState<Student | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Reload all domain entities from apiService
  const refreshData = () => {
    setStudents(apiService.getStudents());
    setTeachers(apiService.getTeachers());
    setClasses(apiService.getClasses());
    setSubjects(apiService.getSubjects());
    setAttendance(apiService.getAttendance());
    setGrades(apiService.getGrades());
    setTimetables(apiService.getTimetable());
    setFees(apiService.getFees());
    setAnnouncements(apiService.getAnnouncements());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Quick Role Switching
  const handleSwitchRole = (role: Role) => {
    const userMatch = INITIAL_USERS.find(u => u.role === role);
    if (userMatch) {
      setCurrentUser(userMatch);
      showToast(`Switched portal session to: ${userMatch.name} (${role.toUpperCase()})`);
    }
  };

  // Reset to initial demo database
  const handleResetDemo = () => {
    if (window.confirm('Reset all records to standard Oakridge Academy demo dataset?')) {
      apiService.resetToDemo();
      refreshData();
      showToast('Database successfully reloaded with factory demo data.');
    }
  };

  // STUDENT ACTIONS
  const handleSaveStudent = (data: Omit<Student, 'id'> & { id?: string }) => {
    apiService.saveStudent(data);
    refreshData();
    setIsFormModalOpen(false);
    showToast(data.id ? 'Student record updated.' : 'New student enrolled.');
  };

  const handleDeleteStudent = (id: string) => {
    apiService.deleteStudent(id);
    refreshData();
    showToast('Student record removed.');
  };

  // ATTENDANCE ACTIONS
  const handleSaveAttendance = (
    classId: string,
    date: string,
    records: { studentId: string; status: AttendanceStatus; remarks?: string }[]
  ) => {
    apiService.saveAttendanceBatch(classId, date, records, currentUser.id);
    refreshData();
    showToast('Class attendance register recorded.');
  };

  // GRADE ACTIONS
  const handleSaveGradesBatch = (records: Omit<GradeRecord, 'id' | 'grade'>[]) => {
    apiService.saveGradesBatch(records);
    refreshData();
    showToast('Course marks and GPAs saved.');
  };

  // TIMETABLE ACTIONS
  const handleSaveSlot = (slot: Omit<TimetableSlot, 'id'> & { id?: string }) => {
    apiService.saveTimetableSlot(slot);
    refreshData();
    showToast('Timetable schedule updated.');
  };

  const handleDeleteSlot = (id: string) => {
    apiService.deleteTimetableSlot(id);
    refreshData();
    showToast('Lecture period slot removed.');
  };

  // FEE ACTIONS
  const handleRecordPayment = (
    feeId: string,
    amount: number,
    paymentMethod: 'Card' | 'Bank Transfer' | 'Cash' | 'Cheque'
  ) => {
    apiService.recordFeePayment(feeId, amount, paymentMethod);
    refreshData();
    showToast('Fee payment confirmed and official receipt generated.');
  };

  const handleCreateInvoice = (data: Omit<FeeRecord, 'id' | 'paidAmount' | 'status'>) => {
    apiService.createFeeInvoice(data);
    refreshData();
    showToast('New fee invoice dispatched.');
  };

  // ANNOUNCEMENT ACTIONS
  const handleCreateAnnouncement = (data: Omit<Announcement, 'id' | 'postedDate'>) => {
    apiService.createAnnouncement(data);
    refreshData();
    showToast('Announcement broadcasted.');
  };

  const handleDeleteAnnouncement = (id: string) => {
    apiService.deleteAnnouncement(id);
    refreshData();
    showToast('Announcement removed.');
  };

  // TEACHER ACTIONS
  const handleSaveTeacher = (data: Omit<Teacher, 'id'> & { id?: string }) => {
    apiService.saveTeacher(data);
    refreshData();
    showToast('Faculty member registered.');
  };

  const handleDeleteTeacher = (id: string) => {
    apiService.deleteTeacher(id);
    refreshData();
    showToast('Faculty record removed.');
  };

  // Context-specific active user entities
  const activeStudent = students.find(s => s.id === (currentUser.studentId || currentUser.childId)) || students[0];
  const activeTeacher = teachers.find(t => t.id === currentUser.teacherId) || teachers[0];

  // System stats
  const dashboardStats = apiService.getStats();
  const lowAttendanceList = apiService.getLowAttendanceStudents(75);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        onSwitchRole={handleSwitchRole}
        onResetDemo={handleResetDemo}
      />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="no-print fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium border border-slate-700 animate-fade-in flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB 1: DASHBOARD (Role-Adaptive) */}
        {currentTab === 'dashboard' && (
          <>
            {currentUser.role === 'admin' && (
              <AdminDashboard
                stats={dashboardStats}
                announcements={announcements}
                lowAttendanceStudents={lowAttendanceList}
                classes={classes}
                onNavigate={setCurrentTab}
                onExportCsv={entity => apiService.exportToCsv(entity)}
                onOpenAddStudent={() => {
                  setFormModalStudent(null);
                  setIsFormModalOpen(true);
                }}
              />
            )}

            {currentUser.role === 'teacher' && activeTeacher && (
              <TeacherDashboard
                teacher={activeTeacher}
                todaySchedule={timetables.filter(t => t.teacherId === activeTeacher.id && t.dayOfWeek === 'Monday')}
                students={students}
                onNavigate={setCurrentTab}
              />
            )}

            {currentUser.role === 'student' && activeStudent && (
              <StudentDashboard
                student={activeStudent}
                grades={grades.filter(g => g.studentId === activeStudent.id)}
                timetable={timetables.filter(t => t.classId === activeStudent.classId && t.dayOfWeek === 'Monday')}
                fees={fees.filter(f => f.studentId === activeStudent.id)}
                onOpenReportCard={() => setReportCardStudent(activeStudent)}
                onNavigate={setCurrentTab}
              />
            )}

            {currentUser.role === 'parent' && activeStudent && (
              <ParentDashboard
                child={activeStudent}
                grades={grades.filter(g => g.studentId === activeStudent.id)}
                fees={fees.filter(f => f.studentId === activeStudent.id)}
                recentAttendance={attendance.filter(a => a.studentId === activeStudent.id)}
                onOpenReportCard={() => setReportCardStudent(activeStudent)}
                onPayFee={feeId => {
                  const feeItem = fees.find(f => f.id === feeId);
                  if (feeItem) {
                    handleRecordPayment(feeId, feeItem.amount - feeItem.paidAmount, 'Card');
                  }
                }}
                onNavigate={setCurrentTab}
              />
            )}
          </>
        )}

        {/* TAB 2: STUDENTS DIRECTORY */}
        {currentTab === 'students' && (
          <StudentList
            students={students}
            classes={classes}
            userRole={currentUser.role}
            onOpenAdd={() => {
              setFormModalStudent(null);
              setIsFormModalOpen(true);
            }}
            onOpenEdit={st => {
              setFormModalStudent(st);
              setIsFormModalOpen(true);
            }}
            onOpenDetail={st => setDetailModalStudent(st)}
            onDeleteStudent={handleDeleteStudent}
            onExportCsv={() => apiService.exportToCsv('students')}
          />
        )}

        {/* TAB 3: ATTENDANCE */}
        {currentTab === 'attendance' && (
          <AttendanceManager
            students={students}
            classes={classes}
            attendanceRecords={attendance}
            onSaveAttendance={handleSaveAttendance}
            onExportCsv={() => apiService.exportToCsv('attendance')}
            currentUserId={currentUser.id}
          />
        )}

        {/* TAB 4: GRADES & REPORT CARD */}
        {currentTab === 'grades' && (
          <Gradebook
            students={students}
            classes={classes}
            subjects={subjects}
            exams={exams}
            grades={grades}
            onSaveGradesBatch={handleSaveGradesBatch}
            onOpenReportCard={st => setReportCardStudent(st)}
            onExportCsv={() => apiService.exportToCsv('grades')}
          />
        )}

        {/* TAB 5: TIMETABLE */}
        {currentTab === 'timetable' && (
          <TimetableManager
            timetableSlots={timetables}
            classes={classes}
            teachers={teachers}
            subjects={subjects}
            onSaveSlot={handleSaveSlot}
            onDeleteSlot={handleDeleteSlot}
            userRole={currentUser.role}
          />
        )}

        {/* TAB 6: FEES & BILLING */}
        {currentTab === 'fees' && (
          <FeeManagement
            fees={fees}
            students={students}
            classes={classes}
            onRecordPayment={handleRecordPayment}
            onCreateInvoice={handleCreateInvoice}
            onExportCsv={() => apiService.exportToCsv('fees')}
            userRole={currentUser.role}
          />
        )}

        {/* TAB 7: ANNOUNCEMENTS */}
        {currentTab === 'announcements' && (
          <AnnouncementManager
            announcements={announcements}
            onCreateAnnouncement={handleCreateAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
            userRole={currentUser.role}
            userName={currentUser.name}
          />
        )}

        {/* TAB 8: DATABASE SCHEMA & API REFERENCE */}
        {currentTab === 'schema' && <SchemaViewer />}
      </main>

      {/* FOOTER */}
      <footer className="no-print mt-auto border-t border-slate-200 bg-white py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span>EduPulse Student Management System</span>
            <span className="mx-2">·</span>
            <span>Oakridge International Academy</span>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Node.js / Express REST API · PostgreSQL 3NF Schema · React TypeScript
          </div>
        </div>
      </footer>

      {/* MODAL: ADD / EDIT STUDENT */}
      {isFormModalOpen && (
        <StudentFormModal
          initialData={formModalStudent}
          classes={classes}
          onSave={handleSaveStudent}
          onClose={() => setIsFormModalOpen(false)}
        />
      )}

      {/* MODAL: STUDENT DOSSIER */}
      {detailModalStudent && (
        <StudentDetailModal
          student={detailModalStudent}
          grades={grades.filter(g => g.studentId === detailModalStudent.id)}
          fees={fees.filter(f => f.studentId === detailModalStudent.id)}
          attendanceHistory={attendance.filter(a => a.studentId === detailModalStudent.id)}
          onClose={() => setDetailModalStudent(null)}
          onOpenReportCard={st => {
            setDetailModalStudent(null);
            setReportCardStudent(st);
          }}
        />
      )}

      {/* MODAL: OFFICIAL REPORT CARD TRANSCRIPT */}
      {reportCardStudent && (
        <ReportCardModal
          student={reportCardStudent}
          grades={grades}
          allSubjects={subjects}
          onClose={() => setReportCardStudent(null)}
        />
      )}
    </div>
  );
}
