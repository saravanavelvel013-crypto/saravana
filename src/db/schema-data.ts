export interface SchemaTable {
  name: string;
  description: string;
  columns: {
    name: string;
    type: string;
    constraints?: string;
    description: string;
  }[];
  relationships: {
    type: '1:1' | '1:N' | 'N:1' | 'M:N';
    targetTable: string;
    foreignKey: string;
    onDelete?: string;
  }[];
}

export const SCHEMA_TABLES: SchemaTable[] = [
  {
    name: 'users',
    description: 'Central credential registry and role assignments (Admin, Teacher, Student, Parent)',
    columns: [
      { name: 'id', type: 'VARCHAR(36)', constraints: 'PRIMARY KEY', description: 'Unique user identifier (UUID)' },
      { name: 'name', type: 'VARCHAR(120)', constraints: 'NOT NULL', description: 'Full legal name' },
      { name: 'email', type: 'VARCHAR(180)', constraints: 'UNIQUE, NOT NULL', description: 'Account email / login identifier' },
      { name: 'password_hash', type: 'VARCHAR(255)', constraints: 'NOT NULL', description: 'Bcrypt hashed password' },
      { name: 'role', type: 'VARCHAR(20)', constraints: 'CHECK(role IN (...))', description: 'admin | teacher | student | parent' },
      { name: 'phone', type: 'VARCHAR(30)', description: 'Primary contact telephone' },
      { name: 'avatar_url', type: 'TEXT', description: 'Profile picture avatar URL or base64' },
      { name: 'created_at', type: 'TIMESTAMP', constraints: 'DEFAULT CURRENT_TIMESTAMP', description: 'Account creation time' }
    ],
    relationships: [
      { type: '1:1', targetTable: 'teachers', foreignKey: 'teachers.user_id', onDelete: 'CASCADE' },
      { type: '1:1', targetTable: 'students', foreignKey: 'students.user_id', onDelete: 'SET NULL' }
    ]
  },
  {
    name: 'classes',
    description: 'Academic grades, sections, classrooms and assigned class teachers',
    columns: [
      { name: 'id', type: 'VARCHAR(36)', constraints: 'PRIMARY KEY', description: 'Unique class identifier' },
      { name: 'grade', type: 'VARCHAR(20)', constraints: 'NOT NULL', description: 'Grade level (e.g. Grade 10, Grade 11)' },
      { name: 'section', type: 'VARCHAR(10)', constraints: 'NOT NULL', description: 'Section designator (e.g. A, B, Sci)' },
      { name: 'room_no', type: 'VARCHAR(20)', description: 'Physical classroom location' },
      { name: 'capacity', type: 'INTEGER', constraints: 'DEFAULT 40', description: 'Maximum student capacity' },
      { name: 'academic_year', type: 'VARCHAR(20)', constraints: 'NOT NULL', description: 'E.g. 2026-2027' },
      { name: 'class_teacher_id', type: 'VARCHAR(36)', constraints: 'FK -> teachers(id)', description: 'Assigned homeroom lead teacher' }
    ],
    relationships: [
      { type: '1:N', targetTable: 'students', foreignKey: 'students.class_id', onDelete: 'RESTRICT' },
      { type: '1:N', targetTable: 'timetables', foreignKey: 'timetables.class_id', onDelete: 'CASCADE' },
      { type: 'M:N', targetTable: 'teacher_class_subjects', foreignKey: 'teacher_class_subjects.class_id' }
    ]
  },
  {
    name: 'teachers',
    description: 'Faculty details, academic credentials, and subject specializations',
    columns: [
      { name: 'id', type: 'VARCHAR(36)', constraints: 'PRIMARY KEY', description: 'Teacher identifier' },
      { name: 'user_id', type: 'VARCHAR(36)', constraints: 'UNIQUE, FK -> users(id)', description: 'Linked authentication account' },
      { name: 'employee_id', type: 'VARCHAR(30)', constraints: 'UNIQUE, NOT NULL', description: 'Staff badge / payroll ID' },
      { name: 'qualification', type: 'VARCHAR(100)', constraints: 'NOT NULL', description: 'Degree (e.g. M.Sc, Ph.D, B.Ed)' },
      { name: 'specialization', type: 'VARCHAR(100)', constraints: 'NOT NULL', description: 'Subject domain expertise' },
      { name: 'joining_date', type: 'DATE', constraints: 'NOT NULL', description: 'Date joined school' }
    ],
    relationships: [
      { type: '1:1', targetTable: 'users', foreignKey: 'teachers.user_id' },
      { type: '1:N', targetTable: 'classes', foreignKey: 'classes.class_teacher_id' },
      { type: 'M:N', targetTable: 'teacher_class_subjects', foreignKey: 'teacher_class_subjects.teacher_id' }
    ]
  },
  {
    name: 'students',
    description: 'Complete student academic records, demographics, and parent/guardian contact',
    columns: [
      { name: 'id', type: 'VARCHAR(36)', constraints: 'PRIMARY KEY', description: 'Unique student UUID' },
      { name: 'user_id', type: 'VARCHAR(36)', constraints: 'UNIQUE, FK -> users(id)', description: 'Student portal account' },
      { name: 'admission_no', type: 'VARCHAR(30)', constraints: 'UNIQUE, NOT NULL', description: 'Official institution admission code' },
      { name: 'roll_no', type: 'VARCHAR(20)', constraints: 'NOT NULL', description: 'Class roll number' },
      { name: 'class_id', type: 'VARCHAR(36)', constraints: 'FK -> classes(id)', description: 'Current enrolled class' },
      { name: 'first_name', type: 'VARCHAR(60)', constraints: 'NOT NULL', description: 'First name' },
      { name: 'last_name', type: 'VARCHAR(60)', constraints: 'NOT NULL', description: 'Last name' },
      { name: 'gender', type: 'VARCHAR(10)', constraints: 'CHECK(gender IN (...))', description: 'male | female | other' },
      { name: 'dob', type: 'DATE', constraints: 'NOT NULL', description: 'Date of birth' },
      { name: 'contact_number', type: 'VARCHAR(30)', constraints: 'NOT NULL', description: 'Primary phone' },
      { name: 'address', type: 'TEXT', description: 'Residential street address' },
      { name: 'guardian_name', type: 'VARCHAR(120)', constraints: 'NOT NULL', description: 'Parent or legal guardian name' },
      { name: 'guardian_relation', type: 'VARCHAR(30)', constraints: 'NOT NULL', description: 'Father | Mother | Guardian' },
      { name: 'guardian_phone', type: 'VARCHAR(30)', constraints: 'NOT NULL', description: 'Emergency guardian phone' },
      { name: 'guardian_email', type: 'VARCHAR(180)', constraints: 'NOT NULL', description: 'Guardian communication email' },
      { name: 'status', type: 'VARCHAR(20)', constraints: 'DEFAULT active', description: 'active | graduated | suspended' }
    ],
    relationships: [
      { type: '1:N', targetTable: 'attendances', foreignKey: 'attendances.student_id', onDelete: 'CASCADE' },
      { type: '1:N', targetTable: 'grades', foreignKey: 'grades.student_id', onDelete: 'CASCADE' },
      { type: '1:N', targetTable: 'fees', foreignKey: 'fees.student_id', onDelete: 'CASCADE' }
    ]
  },
  {
    name: 'attendances',
    description: 'Daily morning attendance ledger with presence status and verification',
    columns: [
      { name: 'id', type: 'VARCHAR(36)', constraints: 'PRIMARY KEY', description: 'Attendance record UUID' },
      { name: 'student_id', type: 'VARCHAR(36)', constraints: 'FK -> students(id)', description: 'Student identifier' },
      { name: 'class_id', type: 'VARCHAR(36)', constraints: 'FK -> classes(id)', description: 'Class where attendance taken' },
      { name: 'date', type: 'DATE', constraints: 'NOT NULL', description: 'Attendance calendar date (YYYY-MM-DD)' },
      { name: 'status', type: 'VARCHAR(15)', constraints: 'CHECK(status IN (...))', description: 'present | absent | late | excused' },
      { name: 'remarks', type: 'VARCHAR(255)', description: 'Absence reason or late excuse notes' },
      { name: 'recorded_by', type: 'VARCHAR(36)', constraints: 'FK -> users(id)', description: 'Staff member who marked attendance' }
    ],
    relationships: [
      { type: 'N:1', targetTable: 'students', foreignKey: 'attendances.student_id' },
      { type: 'N:1', targetTable: 'classes', foreignKey: 'attendances.class_id' }
    ]
  },
  {
    name: 'grades',
    description: 'Exam marks, computed GPA, percentage, and teacher evaluation comments',
    columns: [
      { name: 'id', type: 'VARCHAR(36)', constraints: 'PRIMARY KEY', description: 'Grade entry UUID' },
      { name: 'student_id', type: 'VARCHAR(36)', constraints: 'FK -> students(id)', description: 'Graded student' },
      { name: 'exam_id', type: 'VARCHAR(36)', constraints: 'FK -> exams(id)', description: 'Examination session' },
      { name: 'subject_id', type: 'VARCHAR(36)', constraints: 'FK -> subjects(id)', description: 'Evaluated subject' },
      { name: 'marks_obtained', type: 'NUMERIC(5,2)', constraints: 'NOT NULL', description: 'Score achieved (e.g. 88.5)' },
      { name: 'max_marks', type: 'NUMERIC(5,2)', constraints: 'DEFAULT 100.00', description: 'Maximum possible marks' },
      { name: 'grade', type: 'VARCHAR(5)', constraints: 'NOT NULL', description: 'Letter grade: A+, A, B, C, D, F' },
      { name: 'comments', type: 'TEXT', description: 'Instructor remarks for report card' }
    ],
    relationships: [
      { type: 'N:1', targetTable: 'students', foreignKey: 'grades.student_id' },
      { type: 'N:1', targetTable: 'exams', foreignKey: 'grades.exam_id' },
      { type: 'N:1', targetTable: 'subjects', foreignKey: 'grades.subject_id' }
    ]
  },
  {
    name: 'timetables',
    description: 'Weekly scheduled periods by class, day of week, subject, and classroom',
    columns: [
      { name: 'id', type: 'VARCHAR(36)', constraints: 'PRIMARY KEY', description: 'Slot UUID' },
      { name: 'class_id', type: 'VARCHAR(36)', constraints: 'FK -> classes(id)', description: 'Assigned class' },
      { name: 'day_of_week', type: 'VARCHAR(15)', constraints: 'Monday-Saturday', description: 'Day of instructional week' },
      { name: 'period_number', type: 'INTEGER', constraints: '1 to 8', description: 'Period number in daily bell schedule' },
      { name: 'start_time', type: 'TIME', constraints: 'NOT NULL', description: 'Period start (e.g. 08:30)' },
      { name: 'end_time', type: 'TIME', constraints: 'NOT NULL', description: 'Period end (e.g. 09:20)' },
      { name: 'subject_id', type: 'VARCHAR(36)', constraints: 'FK -> subjects(id)', description: 'Taught subject' },
      { name: 'teacher_id', type: 'VARCHAR(36)', constraints: 'FK -> teachers(id)', description: 'Instructing teacher' },
      { name: 'room_no', type: 'VARCHAR(20)', constraints: 'NOT NULL', description: 'Room / Lab identifier' }
    ],
    relationships: [
      { type: 'N:1', targetTable: 'classes', foreignKey: 'timetables.class_id' },
      { type: 'N:1', targetTable: 'subjects', foreignKey: 'timetables.subject_id' },
      { type: 'N:1', targetTable: 'teachers', foreignKey: 'timetables.teacher_id' }
    ]
  },
  {
    name: 'fees',
    description: 'Tuition and auxiliary fee billing, payments, dues tracking and receipt records',
    columns: [
      { name: 'id', type: 'VARCHAR(36)', constraints: 'PRIMARY KEY', description: 'Invoice UUID' },
      { name: 'student_id', type: 'VARCHAR(36)', constraints: 'FK -> students(id)', description: 'Billed student' },
      { name: 'title', type: 'VARCHAR(120)', constraints: 'NOT NULL', description: 'E.g. Term 1 Tuition Fee, Lab Equipment Fee' },
      { name: 'category', type: 'VARCHAR(30)', constraints: 'Tuition|Library|Lab|Transport|Sports|Exam', description: 'Fee classification' },
      { name: 'amount', type: 'NUMERIC(10,2)', constraints: 'NOT NULL', description: 'Total invoiced amount ($)' },
      { name: 'paid_amount', type: 'NUMERIC(10,2)', constraints: 'DEFAULT 0.00', description: 'Amount collected to date ($)' },
      { name: 'due_date', type: 'DATE', constraints: 'NOT NULL', description: 'Payment deadline' },
      { name: 'status', type: 'VARCHAR(15)', constraints: 'paid | pending | overdue | partial', description: 'Settlement state' },
      { name: 'receipt_no', type: 'VARCHAR(50)', constraints: 'UNIQUE', description: 'Official transaction receipt code' }
    ],
    relationships: [
      { type: 'N:1', targetTable: 'students', foreignKey: 'fees.student_id' }
    ]
  }
];

export const REST_ENDPOINTS = [
  { method: 'POST', path: '/api/auth/login', desc: 'Authenticate user with email and password, return JWT token & user profile' },
  { method: 'POST', path: '/api/auth/register', desc: 'Create a new user account with role assignment' },
  { method: 'GET', path: '/api/students', desc: 'List students with query params (?classId, ?search, ?page, ?limit, ?sort)' },
  { method: 'POST', path: '/api/students', desc: 'Enroll new student with guardian info and validation' },
  { method: 'PUT', path: '/api/students/:id', desc: 'Update student record, contact, or guardian details' },
  { method: 'DELETE', path: '/api/students/:id', desc: 'Remove student record (admin only)' },
  { method: 'GET', path: '/api/teachers', desc: 'List all faculty members with assigned classes' },
  { method: 'POST', path: '/api/teachers', desc: 'Register teacher with qualifications and subjects' },
  { method: 'GET', path: '/api/classes', desc: 'Get all classes, sections, capacities, and enrolled counts' },
  { method: 'POST', path: '/api/classes', desc: 'Create new class section with assigned homeroom teacher' },
  { method: 'GET', path: '/api/attendance', desc: 'Query attendance records by date, classId, and studentId' },
  { method: 'POST', path: '/api/attendance/bulk', desc: 'Batch submit class attendance for a specific date' },
  { method: 'GET', path: '/api/attendance/alerts', desc: 'Retrieve list of students with attendance < 75%' },
  { method: 'GET', path: '/api/grades', desc: 'Query grades by examId, classId, and subjectId' },
  { method: 'POST', path: '/api/grades/batch', desc: 'Batch save or update exam marks with GPA auto-calc' },
  { method: 'GET', path: '/api/timetables', desc: 'Get weekly timetable schedule filtered by classId or teacherId' },
  { method: 'POST', path: '/api/timetables', desc: 'Create or update timetable period slot' },
  { method: 'GET', path: '/api/fees', desc: 'List fee invoices with status filters (paid, pending, overdue)' },
  { method: 'POST', path: '/api/fees/:id/pay', desc: 'Record payment transaction and generate receipt number' },
  { method: 'GET', path: '/api/announcements', desc: 'Get notices targeted to current user role' },
  { method: 'POST', path: '/api/announcements', desc: 'Publish high/urgent school announcements' },
  { method: 'GET', path: '/api/stats', desc: 'System-wide analytics (enrollment, fee collection, attendance rates)' },
  { method: 'GET', path: '/api/export/:entity', desc: 'Stream CSV export for students, attendance, grades, or fees' }
];
