export type Role = 'admin' | 'teacher' | 'student' | 'parent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  phone?: string;
  studentId?: string; // If student or parent linked to student
  childId?: string; // If parent
  teacherId?: string; // If teacher
}

export interface Student {
  id: string;
  admissionNo: string;
  rollNo: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: 'male' | 'female' | 'other';
  dob: string;
  classId: string;
  className: string;
  section: string;
  contactNumber: string;
  address: string;
  avatar: string;
  enrollmentDate: string;
  status: 'active' | 'graduated' | 'suspended';
  guardian: {
    name: string;
    relationship: 'Father' | 'Mother' | 'Guardian';
    contact: string;
    email: string;
    occupation?: string;
  };
  attendanceRate?: number; // computed
  gpa?: number; // computed
}

export interface Teacher {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  qualification: string;
  specialization: string;
  joiningDate: string;
  avatar: string;
  assignedClasses: {
    classId: string;
    className: string;
    section: string;
    subjectId: string;
    subjectName: string;
  }[];
  isClassTeacherOf?: {
    classId: string;
    className: string;
    section: string;
  };
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
  department: string;
}

export interface ClassSection {
  id: string;
  grade: string;
  section: string;
  roomNo: string;
  capacity: number;
  classTeacherId: string;
  classTeacherName: string;
  academicYear: string;
  enrolledCount: number;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  classId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  remarks?: string;
  recordedBy: string;
}

export interface Exam {
  id: string;
  name: string;
  term: 'Midterm' | 'Final' | 'Unit Test 1' | 'Unit Test 2';
  startDate: string;
  endDate: string;
  academicYear: string;
}

export interface GradeRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  classId: string;
  examId: string;
  examName: string;
  subjectId: string;
  subjectName: string;
  marksObtained: number;
  maxMarks: number;
  grade: string;
  comments?: string;
  recordedDate: string;
}

export interface TimetableSlot {
  id: string;
  classId: string;
  className: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  period: number;
  startTime: string;
  endTime: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  roomNo: string;
}

export type FeeStatus = 'paid' | 'pending' | 'overdue' | 'partial';

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  classId: string;
  className: string;
  title: string;
  category: 'Tuition' | 'Library' | 'Laboratory' | 'Transport' | 'Sports' | 'Exam';
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: FeeStatus;
  paymentDate?: string;
  paymentMethod?: 'Card' | 'Bank Transfer' | 'Cash' | 'Cheque';
  receiptNo?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetRole: 'all' | 'teachers' | 'students' | 'parents';
  authorName: string;
  authorRole: string;
  postedDate: string;
  priority: 'normal' | 'high' | 'urgent';
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  overallAttendanceRate: number;
  feeCollectionTotal: number;
  feePendingTotal: number;
  lowAttendanceCount: number;
  averageGpa: number;
}
