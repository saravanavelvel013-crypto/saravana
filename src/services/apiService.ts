import {
  Student,
  Teacher,
  ClassSection,
  Subject,
  AttendanceRecord,
  GradeRecord,
  TimetableSlot,
  FeeRecord,
  Announcement,
  User,
  DashboardStats,
  AttendanceStatus
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_ATTENDANCE,
  INITIAL_GRADES,
  INITIAL_TIMETABLE,
  INITIAL_FEES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_USERS
} from './seedData';

const STORAGE_KEYS = {
  STUDENTS: 'edupulse_students_v1',
  TEACHERS: 'edupulse_teachers_v1',
  CLASSES: 'edupulse_classes_v1',
  SUBJECTS: 'edupulse_subjects_v1',
  ATTENDANCE: 'edupulse_attendance_v1',
  GRADES: 'edupulse_grades_v1',
  TIMETABLE: 'edupulse_timetable_v1',
  FEES: 'edupulse_fees_v1',
  ANNOUNCEMENTS: 'edupulse_announcements_v1',
  USERS: 'edupulse_users_v1'
};

function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

export function calculateGrade(marks: number, maxMarks: number = 100): { grade: string; gpa: number } {
  const percentage = (marks / maxMarks) * 100;
  if (percentage >= 90) return { grade: 'A+', gpa: 4.0 };
  if (percentage >= 80) return { grade: 'A', gpa: 3.7 };
  if (percentage >= 70) return { grade: 'B', gpa: 3.0 };
  if (percentage >= 60) return { grade: 'C', gpa: 2.0 };
  if (percentage >= 50) return { grade: 'D', gpa: 1.0 };
  return { grade: 'F', gpa: 0.0 };
}

export const apiService = {
  // Reset all data to factory demo state
  resetToDemo(): void {
    localStorage.clear();
    setStored(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
    setStored(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS);
    setStored(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
    setStored(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
    setStored(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
    setStored(STORAGE_KEYS.GRADES, INITIAL_GRADES);
    setStored(STORAGE_KEYS.TIMETABLE, INITIAL_TIMETABLE);
    setStored(STORAGE_KEYS.FEES, INITIAL_FEES);
    setStored(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    setStored(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  // USERS
  getUsers(): User[] {
    return getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  // STUDENTS
  getStudents(): Student[] {
    const students = getStored<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
    const attendance = this.getAttendance();
    const grades = this.getGrades();

    // compute real-time attendance rate and gpa
    return students.map(st => {
      const stAtt = attendance.filter(a => a.studentId === st.id);
      const presentCount = stAtt.filter(a => a.status === 'present').length;
      const rate = stAtt.length > 0 ? Math.round((presentCount / stAtt.length) * 1000) / 10 : st.attendanceRate || 90;

      const stGrades = grades.filter(g => g.studentId === st.id);
      let gpa = st.gpa || 3.5;
      if (stGrades.length > 0) {
        const totalPoints = stGrades.reduce((acc, curr) => acc + calculateGrade(curr.marksObtained, curr.maxMarks).gpa, 0);
        gpa = Math.round((totalPoints / stGrades.length) * 100) / 100;
      }

      return {
        ...st,
        attendanceRate: rate,
        gpa
      };
    });
  },

  getStudentById(id: string): Student | undefined {
    return this.getStudents().find(s => s.id === id);
  },

  saveStudent(studentData: Omit<Student, 'id'> & { id?: string }): Student {
    const list = this.getStudents();
    if (studentData.id) {
      const idx = list.findIndex(s => s.id === studentData.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...studentData } as Student;
        setStored(STORAGE_KEYS.STUDENTS, list);
        return list[idx];
      }
    }
    const newStudent: Student = {
      ...studentData,
      id: `stu-${Date.now()}`,
      admissionNo: studentData.admissionNo || `ADM-2026-${Math.floor(100 + Math.random() * 900)}`,
      enrollmentDate: studentData.enrollmentDate || new Date().toISOString().split('T')[0],
      status: studentData.status || 'active',
      attendanceRate: 100,
      gpa: 4.0
    } as Student;
    list.unshift(newStudent);
    setStored(STORAGE_KEYS.STUDENTS, list);

    // Update class enrolled count
    this.recalculateClassEnrollment();
    return newStudent;
  },

  deleteStudent(id: string): boolean {
    const list = this.getStudents().filter(s => s.id !== id);
    setStored(STORAGE_KEYS.STUDENTS, list);
    this.recalculateClassEnrollment();
    return true;
  },

  // TEACHERS
  getTeachers(): Teacher[] {
    return getStored<Teacher[]>(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS);
  },

  saveTeacher(teacherData: Omit<Teacher, 'id'> & { id?: string }): Teacher {
    const list = this.getTeachers();
    if (teacherData.id) {
      const idx = list.findIndex(t => t.id === teacherData.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...teacherData } as Teacher;
        setStored(STORAGE_KEYS.TEACHERS, list);
        return list[idx];
      }
    }
    const newTeacher: Teacher = {
      ...teacherData,
      id: `tch-${Date.now()}`,
      employeeId: teacherData.employeeId || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      joiningDate: teacherData.joiningDate || new Date().toISOString().split('T')[0]
    } as Teacher;
    list.unshift(newTeacher);
    setStored(STORAGE_KEYS.TEACHERS, list);
    return newTeacher;
  },

  deleteTeacher(id: string): boolean {
    const list = this.getTeachers().filter(t => t.id !== id);
    setStored(STORAGE_KEYS.TEACHERS, list);
    return true;
  },

  // CLASSES
  getClasses(): ClassSection[] {
    return getStored<ClassSection[]>(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
  },

  saveClass(classData: Omit<ClassSection, 'id'> & { id?: string }): ClassSection {
    const list = this.getClasses();
    if (classData.id) {
      const idx = list.findIndex(c => c.id === classData.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...classData } as ClassSection;
        setStored(STORAGE_KEYS.CLASSES, list);
        return list[idx];
      }
    }
    const newClass: ClassSection = {
      ...classData,
      id: `cls-${Date.now()}`,
      enrolledCount: 0
    } as ClassSection;
    list.push(newClass);
    setStored(STORAGE_KEYS.CLASSES, list);
    return newClass;
  },

  recalculateClassEnrollment(): void {
    const students = getStored<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
    const classes = this.getClasses();
    const updated = classes.map(c => ({
      ...c,
      enrolledCount: students.filter(s => s.classId === c.id).length
    }));
    setStored(STORAGE_KEYS.CLASSES, updated);
  },

  // SUBJECTS
  getSubjects(): Subject[] {
    return getStored<Subject[]>(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
  },

  // ATTENDANCE
  getAttendance(): AttendanceRecord[] {
    return getStored<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
  },

  saveAttendanceBatch(
    classId: string,
    date: string,
    records: { studentId: string; status: AttendanceStatus; remarks?: string }[],
    recordedBy: string
  ): void {
    const existing = this.getAttendance();
    const students = this.getStudents();
    // remove existing for this class & date
    const filtered = existing.filter(a => !(a.classId === classId && a.date === date));

    const newRecords: AttendanceRecord[] = records.map(r => {
      const st = students.find(s => s.id === r.studentId);
      return {
        id: `att-${Date.now()}-${r.studentId}`,
        studentId: r.studentId,
        studentName: st ? `${st.firstName} ${st.lastName}` : 'Unknown',
        rollNo: st?.rollNo || '',
        classId,
        date,
        status: r.status,
        remarks: r.remarks,
        recordedBy
      };
    });

    const combined = [...filtered, ...newRecords];
    setStored(STORAGE_KEYS.ATTENDANCE, combined);
  },

  getLowAttendanceStudents(thresholdPercent: number = 75): { student: Student; rate: number }[] {
    const students = this.getStudents();
    return students
      .filter(s => (s.attendanceRate ?? 100) < thresholdPercent)
      .map(s => ({ student: s, rate: s.attendanceRate ?? 0 }));
  },

  // GRADES & EXAMS
  getGrades(): GradeRecord[] {
    return getStored<GradeRecord[]>(STORAGE_KEYS.GRADES, INITIAL_GRADES);
  },

  saveGrade(gradeData: Omit<GradeRecord, 'id' | 'grade'> & { id?: string }): GradeRecord {
    const list = this.getGrades();
    const { grade } = calculateGrade(gradeData.marksObtained, gradeData.maxMarks);

    if (gradeData.id) {
      const idx = list.findIndex(g => g.id === gradeData.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...gradeData, grade } as GradeRecord;
        setStored(STORAGE_KEYS.GRADES, list);
        return list[idx];
      }
    }

    const newGrade: GradeRecord = {
      ...gradeData,
      id: `grd-${Date.now()}`,
      grade,
      recordedDate: new Date().toISOString().split('T')[0]
    } as GradeRecord;
    list.unshift(newGrade);
    setStored(STORAGE_KEYS.GRADES, list);
    return newGrade;
  },

  saveGradesBatch(records: Omit<GradeRecord, 'id' | 'grade'>[]): void {
    const existing = this.getGrades();
    const updated = [...existing];

    records.forEach(r => {
      const { grade } = calculateGrade(r.marksObtained, r.maxMarks);
      const existingIdx = updated.findIndex(
        item => item.studentId === r.studentId && item.examId === r.examId && item.subjectId === r.subjectId
      );
      if (existingIdx !== -1) {
        updated[existingIdx] = {
          ...updated[existingIdx],
          ...r,
          grade,
          recordedDate: new Date().toISOString().split('T')[0]
        };
      } else {
        updated.unshift({
          ...r,
          id: `grd-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          grade,
          recordedDate: new Date().toISOString().split('T')[0]
        });
      }
    });

    setStored(STORAGE_KEYS.GRADES, updated);
  },

  // TIMETABLE
  getTimetable(classId?: string, teacherId?: string): TimetableSlot[] {
    const slots = getStored<TimetableSlot[]>(STORAGE_KEYS.TIMETABLE, INITIAL_TIMETABLE);
    if (classId) return slots.filter(s => s.classId === classId);
    if (teacherId) return slots.filter(s => s.teacherId === teacherId);
    return slots;
  },

  saveTimetableSlot(slotData: Omit<TimetableSlot, 'id'> & { id?: string }): TimetableSlot {
    const list = getStored<TimetableSlot[]>(STORAGE_KEYS.TIMETABLE, INITIAL_TIMETABLE);
    if (slotData.id) {
      const idx = list.findIndex(s => s.id === slotData.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...slotData } as TimetableSlot;
        setStored(STORAGE_KEYS.TIMETABLE, list);
        return list[idx];
      }
    }
    const newSlot: TimetableSlot = {
      ...slotData,
      id: `tt-${Date.now()}`
    } as TimetableSlot;
    list.push(newSlot);
    setStored(STORAGE_KEYS.TIMETABLE, list);
    return newSlot;
  },

  deleteTimetableSlot(id: string): boolean {
    const list = getStored<TimetableSlot[]>(STORAGE_KEYS.TIMETABLE, INITIAL_TIMETABLE).filter(s => s.id !== id);
    setStored(STORAGE_KEYS.TIMETABLE, list);
    return true;
  },

  // FEES
  getFees(): FeeRecord[] {
    return getStored<FeeRecord[]>(STORAGE_KEYS.FEES, INITIAL_FEES);
  },

  recordFeePayment(feeId: string, amount: number, paymentMethod: 'Card' | 'Bank Transfer' | 'Cash' | 'Cheque'): FeeRecord | null {
    const list = this.getFees();
    const idx = list.findIndex(f => f.id === feeId);
    if (idx === -1) return null;

    const fee = list[idx];
    const newPaid = Number(fee.paidAmount) + Number(amount);
    const isPaid = newPaid >= fee.amount;

    list[idx] = {
      ...fee,
      paidAmount: Math.min(newPaid, fee.amount),
      status: isPaid ? 'paid' : 'partial',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod,
      receiptNo: fee.receiptNo || `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    };

    setStored(STORAGE_KEYS.FEES, list);
    return list[idx];
  },

  createFeeInvoice(data: Omit<FeeRecord, 'id' | 'paidAmount' | 'status'>): FeeRecord {
    const list = this.getFees();
    const newFee: FeeRecord = {
      ...data,
      id: `fee-${Date.now()}`,
      paidAmount: 0,
      status: 'pending'
    };
    list.unshift(newFee);
    setStored(STORAGE_KEYS.FEES, list);
    return newFee;
  },

  // ANNOUNCEMENTS
  getAnnouncements(role?: string): Announcement[] {
    const all = getStored<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    if (!role || role === 'admin') return all;
    return all.filter(a => a.targetRole === 'all' || a.targetRole === `${role}s` || a.targetRole === role);
  },

  createAnnouncement(ann: Omit<Announcement, 'id' | 'postedDate'>): Announcement {
    const list = getStored<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    const newAnn: Announcement = {
      ...ann,
      id: `ann-${Date.now()}`,
      postedDate: new Date().toISOString().split('T')[0]
    };
    list.unshift(newAnn);
    setStored(STORAGE_KEYS.ANNOUNCEMENTS, list);
    return newAnn;
  },

  deleteAnnouncement(id: string): boolean {
    const list = getStored<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS).filter(a => a.id !== id);
    setStored(STORAGE_KEYS.ANNOUNCEMENTS, list);
    return true;
  },

  // DASHBOARD AGGREGATES
  getStats(): DashboardStats {
    const students = this.getStudents();
    const teachers = this.getTeachers();
    const classes = this.getClasses();
    const fees = this.getFees();

    const totalStudents = students.length;
    const totalTeachers = teachers.length;
    const totalClasses = classes.length;

    const totalAttRate = students.reduce((acc, s) => acc + (s.attendanceRate || 0), 0);
    const overallAttendanceRate = totalStudents > 0 ? Math.round((totalAttRate / totalStudents) * 10) / 10 : 0;

    const feeCollectionTotal = fees.reduce((acc, f) => acc + (Number(f.paidAmount) || 0), 0);
    const feePendingTotal = fees.reduce((acc, f) => acc + Math.max(0, Number(f.amount) - (Number(f.paidAmount) || 0)), 0);

    const lowAttendanceCount = students.filter(s => (s.attendanceRate ?? 100) < 75).length;
    const avgGpa = students.length > 0 ? Math.round((students.reduce((acc, s) => acc + (s.gpa || 0), 0) / students.length) * 100) / 100 : 0;

    return {
      totalStudents,
      totalTeachers,
      totalClasses,
      overallAttendanceRate,
      feeCollectionTotal,
      feePendingTotal,
      lowAttendanceCount,
      averageGpa: avgGpa
    };
  },

  // CSV EXPORT GENERATOR
  exportToCsv(entity: 'students' | 'attendance' | 'grades' | 'fees'): void {
    let filename = `edupulse-${entity}-${new Date().toISOString().split('T')[0]}.csv`;
    let csvContent = '';

    if (entity === 'students') {
      const students = this.getStudents();
      const headers = ['Admission No', 'Roll No', 'Full Name', 'Gender', 'Class', 'Contact', 'Guardian Name', 'Guardian Phone', 'Attendance %', 'GPA', 'Status'];
      const rows = students.map(s => [
        `"${s.admissionNo}"`,
        `"${s.rollNo}"`,
        `"${s.firstName} ${s.lastName}"`,
        `"${s.gender}"`,
        `"${s.className} ${s.section}"`,
        `"${s.contactNumber}"`,
        `"${s.guardian.name}"`,
        `"${s.guardian.contact}"`,
        s.attendanceRate ?? '',
        s.gpa ?? '',
        `"${s.status}"`
      ]);
      csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    } else if (entity === 'attendance') {
      const att = this.getAttendance();
      const headers = ['Date', 'Roll No', 'Student Name', 'Class ID', 'Status', 'Remarks', 'Recorded By'];
      const rows = att.map(a => [
        `"${a.date}"`,
        `"${a.rollNo}"`,
        `"${a.studentName}"`,
        `"${a.classId}"`,
        `"${a.status}"`,
        `"${a.remarks || ''}"`,
        `"${a.recordedBy}"`
      ]);
      csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    } else if (entity === 'grades') {
      const grades = this.getGrades();
      const headers = ['Exam', 'Roll No', 'Student Name', 'Subject', 'Marks Obtained', 'Max Marks', 'Grade', 'Comments'];
      const rows = grades.map(g => [
        `"${g.examName}"`,
        `"${g.rollNo}"`,
        `"${g.studentName}"`,
        `"${g.subjectName}"`,
        g.marksObtained,
        g.maxMarks,
        `"${g.grade}"`,
        `"${g.comments || ''}"`
      ]);
      csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    } else if (entity === 'fees') {
      const fees = this.getFees();
      const headers = ['Receipt No', 'Admission No', 'Student Name', 'Class', 'Title', 'Category', 'Amount', 'Paid Amount', 'Due Date', 'Status', 'Method'];
      const rows = fees.map(f => [
        `"${f.receiptNo || 'N/A'}"`,
        `"${f.admissionNo}"`,
        `"${f.studentName}"`,
        `"${f.className}"`,
        `"${f.title}"`,
        `"${f.category}"`,
        f.amount,
        f.paidAmount,
        `"${f.dueDate}"`,
        `"${f.status}"`,
        `"${f.paymentMethod || 'Unpaid'}"`
      ]);
      csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
