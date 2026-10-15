-- =====================================================================
-- EduPulse Student Management System: Normalized Relational Database Schema
-- Compatible with PostgreSQL 14+ / MySQL 8.0+ / SQLite 3
-- 3NF Normalized with Foreign Keys, Cascades, Indexes, and Integrity Constraints
-- =====================================================================

-- 1. Users Table (Core Authentication & Role Mapping)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(180) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'teacher', 'student', 'parent')),
    phone VARCHAR(30),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Classes & Sections Table
CREATE TABLE IF NOT EXISTS classes (
    id VARCHAR(36) PRIMARY KEY,
    grade VARCHAR(20) NOT NULL,
    section VARCHAR(10) NOT NULL,
    room_no VARCHAR(20),
    capacity INTEGER NOT NULL DEFAULT 40,
    academic_year VARCHAR(20) NOT NULL,
    class_teacher_id VARCHAR(36),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_grade_section_year UNIQUE (grade, section, academic_year)
);

-- 3. Teachers Profile Table
CREATE TABLE IF NOT EXISTS teachers (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) UNIQUE NOT NULL,
    employee_id VARCHAR(30) UNIQUE NOT NULL,
    qualification VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    joining_date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Circular FK resolution: Class teacher reference
ALTER TABLE classes 
    ADD CONSTRAINT fk_classes_teacher 
    FOREIGN KEY (class_teacher_id) REFERENCES teachers(id) ON DELETE SET NULL;

-- 4. Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    credits INTEGER NOT NULL DEFAULT 3,
    department VARCHAR(80) NOT NULL
);

-- 5. Students Profile Table
CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) UNIQUE,
    admission_no VARCHAR(30) UNIQUE NOT NULL,
    roll_no VARCHAR(20) NOT NULL,
    class_id VARCHAR(36) NOT NULL,
    first_name VARCHAR(60) NOT NULL,
    last_name VARCHAR(60) NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    dob DATE NOT NULL,
    contact_number VARCHAR(30) NOT NULL,
    address TEXT,
    avatar_url TEXT,
    enrollment_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'graduated', 'suspended')),
    guardian_name VARCHAR(120) NOT NULL,
    guardian_relation VARCHAR(30) NOT NULL,
    guardian_phone VARCHAR(30) NOT NULL,
    guardian_email VARCHAR(180) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE RESTRICT,
    CONSTRAINT uq_class_roll UNIQUE (class_id, roll_no)
);

-- 6. Teacher Subject Allocation (Many-to-Many Bridge)
CREATE TABLE IF NOT EXISTS teacher_class_subjects (
    id VARCHAR(36) PRIMARY KEY,
    teacher_id VARCHAR(36) NOT NULL,
    class_id VARCHAR(36) NOT NULL,
    subject_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    CONSTRAINT uq_teacher_class_subject UNIQUE (teacher_id, class_id, subject_id)
);

-- 7. Daily Attendance Records
CREATE TABLE IF NOT EXISTS attendances (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL,
    class_id VARCHAR(36) NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(15) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
    remarks VARCHAR(255),
    recorded_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT uq_student_date UNIQUE (student_id, date)
);

-- 8. Examination Table
CREATE TABLE IF NOT EXISTS exams (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    term VARCHAR(30) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL
);

-- 9. Marks & Grades Table
CREATE TABLE IF NOT EXISTS grades (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL,
    exam_id VARCHAR(36) NOT NULL,
    subject_id VARCHAR(36) NOT NULL,
    marks_obtained NUMERIC(5,2) NOT NULL CHECK (marks_obtained >= 0),
    max_marks NUMERIC(5,2) NOT NULL DEFAULT 100.00,
    grade VARCHAR(5) NOT NULL,
    comments TEXT,
    recorded_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    CONSTRAINT uq_student_exam_subject UNIQUE (student_id, exam_id, subject_id)
);

-- 10. Weekly Timetable Slots
CREATE TABLE IF NOT EXISTS timetables (
    id VARCHAR(36) PRIMARY KEY,
    class_id VARCHAR(36) NOT NULL,
    day_of_week VARCHAR(15) NOT NULL CHECK (day_of_week IN ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday')),
    period_number INTEGER NOT NULL CHECK (period_number BETWEEN 1 AND 8),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    subject_id VARCHAR(36) NOT NULL,
    teacher_id VARCHAR(36) NOT NULL,
    room_no VARCHAR(20) NOT NULL,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    CONSTRAINT uq_class_period UNIQUE (class_id, day_of_week, period_number),
    CONSTRAINT uq_teacher_period UNIQUE (teacher_id, day_of_week, period_number)
);

-- 11. Student Fees & Payments Ledger
CREATE TABLE IF NOT EXISTS fees (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL,
    title VARCHAR(120) NOT NULL,
    category VARCHAR(30) NOT NULL CHECK (category IN ('Tuition', 'Library', 'Laboratory', 'Transport', 'Sports', 'Exam')),
    amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
    paid_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (paid_amount >= 0),
    due_date DATE NOT NULL,
    status VARCHAR(15) NOT NULL CHECK (status IN ('paid', 'pending', 'overdue', 'partial')),
    payment_date DATE,
    payment_method VARCHAR(30) CHECK (payment_method IN ('Card', 'Bank Transfer', 'Cash', 'Cheque')),
    receipt_no VARCHAR(50) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 12. School Announcements / Notices
CREATE TABLE IF NOT EXISTS announcements (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    target_role VARCHAR(20) NOT NULL DEFAULT 'all' CHECK (target_role IN ('all', 'teachers', 'students', 'parents')),
    author_id VARCHAR(36) NOT NULL,
    priority VARCHAR(15) NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'high', 'urgent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================================
-- Performance Indexes
-- =====================================================================
CREATE INDEX IF NOT EXISTS idx_students_class ON students(class_id);
CREATE INDEX IF NOT EXISTS idx_students_admission ON students(admission_no);
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendances(student_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_class_date ON attendances(class_id, date);
CREATE INDEX IF NOT EXISTS idx_grades_student ON grades(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_exam ON grades(exam_id);
CREATE INDEX IF NOT EXISTS idx_fees_student ON fees(student_id);
CREATE INDEX IF NOT EXISTS idx_fees_status ON fees(status);
CREATE INDEX IF NOT EXISTS idx_timetables_class_day ON timetables(class_id, day_of_week);

-- =====================================================================
-- Analytical Views for Rapid Dashboard Querying
-- =====================================================================
CREATE OR REPLACE VIEW view_student_attendance_summary AS
SELECT 
    s.id AS student_id,
    s.admission_no,
    s.first_name || ' ' || s.last_name AS student_name,
    s.class_id,
    c.grade || ' - ' || c.section AS class_name,
    COUNT(a.id) AS total_days,
    COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS present_days,
    COUNT(CASE WHEN a.status = 'absent' THEN 1 END) AS absent_days,
    COUNT(CASE WHEN a.status = 'late' THEN 1 END) AS late_days,
    ROUND(
        (COUNT(CASE WHEN a.status = 'present' THEN 1 END)::NUMERIC / NULLIF(COUNT(a.id), 0)) * 100, 
        1
    ) AS attendance_percentage
FROM students s
JOIN classes c ON s.class_id = c.id
LEFT JOIN attendances a ON s.id = a.student_id
GROUP BY s.id, s.admission_no, s.first_name, s.last_name, s.class_id, c.grade, c.section;

-- View for Low Attendance Alerts (< 75%)
CREATE OR REPLACE VIEW view_low_attendance_alerts AS
SELECT * 
FROM view_student_attendance_summary
WHERE attendance_percentage < 75.0 AND total_days >= 5;
