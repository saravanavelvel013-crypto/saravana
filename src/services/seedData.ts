import {
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
  Announcement
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-1',
    name: 'Dr. Evelyn Vance',
    email: 'admin@edupulse.edu',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 019-2834'
  },
  {
    id: 'usr-teacher-1',
    name: 'Prof. Marcus Bennett',
    email: 'marcus.bennett@edupulse.edu',
    role: 'teacher',
    teacherId: 'tch-1',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 234-8901'
  },
  {
    id: 'usr-teacher-2',
    name: 'Dr. Sarah Jenkins',
    email: 'sarah.jenkins@edupulse.edu',
    role: 'teacher',
    teacherId: 'tch-2',
    avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 345-6712'
  },
  {
    id: 'usr-student-1',
    name: 'Liam Alexander Foster',
    email: 'liam.foster@edupulse.edu',
    role: 'student',
    studentId: 'stu-1',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 789-0123'
  },
  {
    id: 'usr-parent-1',
    name: 'Arthur Foster',
    email: 'arthur.foster@gmail.com',
    role: 'parent',
    childId: 'stu-1',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 456-7890'
  }
];

export const INITIAL_CLASSES: ClassSection[] = [
  {
    id: 'cls-10a',
    grade: 'Grade 10',
    section: 'A',
    roomNo: 'Room 201',
    capacity: 35,
    classTeacherId: 'tch-1',
    classTeacherName: 'Prof. Marcus Bennett',
    academicYear: '2026-2027',
    enrolledCount: 6
  },
  {
    id: 'cls-10b',
    grade: 'Grade 10',
    section: 'B',
    roomNo: 'Room 202',
    capacity: 35,
    classTeacherId: 'tch-2',
    classTeacherName: 'Dr. Sarah Jenkins',
    academicYear: '2026-2027',
    enrolledCount: 4
  },
  {
    id: 'cls-9a',
    grade: 'Grade 9',
    section: 'A',
    roomNo: 'Room 101',
    capacity: 30,
    classTeacherId: 'tch-3',
    classTeacherName: 'Mr. David Morales',
    academicYear: '2026-2027',
    enrolledCount: 3
  },
  {
    id: 'cls-11sci',
    grade: 'Grade 11',
    section: 'Science',
    roomNo: 'Science Lab 3',
    capacity: 30,
    classTeacherId: 'tch-4',
    classTeacherName: 'Ms. Elena Rostova',
    academicYear: '2026-2027',
    enrolledCount: 3
  }
];

export const INITIAL_SUBJECTS: Subject[] = [
  { id: 'sub-math', code: 'MTH-101', name: 'Mathematics', credits: 4, department: 'Mathematics & Stats' },
  { id: 'sub-phys', code: 'PHY-101', name: 'Physics', credits: 4, department: 'Physical Sciences' },
  { id: 'sub-chem', code: 'CHM-101', name: 'Chemistry', credits: 3, department: 'Chemical Sciences' },
  { id: 'sub-eng', code: 'ENG-101', name: 'English Literature', credits: 3, department: 'Languages' },
  { id: 'sub-cs', code: 'CSC-101', name: 'Computer Science', credits: 4, department: 'Information Tech' },
  { id: 'sub-bio', code: 'BIO-101', name: 'Biology', credits: 3, department: 'Life Sciences' },
  { id: 'sub-hist', code: 'HST-101', name: 'World History', credits: 2, department: 'Social Studies' }
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'tch-1',
    employeeId: 'EMP-1042',
    name: 'Prof. Marcus Bennett',
    email: 'marcus.bennett@edupulse.edu',
    phone: '+1 (555) 234-8901',
    gender: 'male',
    qualification: 'M.Sc. Physics (MIT), B.Ed',
    specialization: 'Quantum Mechanics & Applied Physics',
    joiningDate: '2021-08-15',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isClassTeacherOf: { classId: 'cls-10a', className: 'Grade 10', section: 'A' },
    assignedClasses: [
      { classId: 'cls-10a', className: 'Grade 10', section: 'A', subjectId: 'sub-phys', subjectName: 'Physics' },
      { classId: 'cls-10b', className: 'Grade 10', section: 'B', subjectId: 'sub-phys', subjectName: 'Physics' },
      { classId: 'cls-11sci', className: 'Grade 11', section: 'Science', subjectId: 'sub-phys', subjectName: 'Physics' }
    ]
  },
  {
    id: 'tch-2',
    employeeId: 'EMP-1088',
    name: 'Dr. Sarah Jenkins',
    email: 'sarah.jenkins@edupulse.edu',
    phone: '+1 (555) 345-6712',
    gender: 'female',
    qualification: 'Ph.D. Pure Mathematics (Stanford)',
    specialization: 'Calculus & Linear Algebra',
    joiningDate: '2020-01-10',
    avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80',
    isClassTeacherOf: { classId: 'cls-10b', className: 'Grade 10', section: 'B' },
    assignedClasses: [
      { classId: 'cls-10a', className: 'Grade 10', section: 'A', subjectId: 'sub-math', subjectName: 'Mathematics' },
      { classId: 'cls-10b', className: 'Grade 10', section: 'B', subjectId: 'sub-math', subjectName: 'Mathematics' }
    ]
  },
  {
    id: 'tch-3',
    employeeId: 'EMP-1104',
    name: 'Mr. David Morales',
    email: 'david.morales@edupulse.edu',
    phone: '+1 (555) 456-1192',
    gender: 'male',
    qualification: 'M.A. English Literature (Columbia)',
    specialization: 'Modern Literature & Rhetoric',
    joiningDate: '2022-09-01',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    isClassTeacherOf: { classId: 'cls-9a', className: 'Grade 9', section: 'A' },
    assignedClasses: [
      { classId: 'cls-10a', className: 'Grade 10', section: 'A', subjectId: 'sub-eng', subjectName: 'English Literature' },
      { classId: 'cls-9a', className: 'Grade 9', section: 'A', subjectId: 'sub-eng', subjectName: 'English Literature' }
    ]
  },
  {
    id: 'tch-4',
    employeeId: 'EMP-1120',
    name: 'Ms. Elena Rostova',
    email: 'elena.rostova@edupulse.edu',
    phone: '+1 (555) 567-9934',
    gender: 'female',
    qualification: 'M.S. Computer Science (UC Berkeley)',
    specialization: 'Algorithms, Data Structures & Python',
    joiningDate: '2023-01-15',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    isClassTeacherOf: { classId: 'cls-11sci', className: 'Grade 11', section: 'Science' },
    assignedClasses: [
      { classId: 'cls-10a', className: 'Grade 10', section: 'A', subjectId: 'sub-cs', subjectName: 'Computer Science' },
      { classId: 'cls-11sci', className: 'Grade 11', section: 'Science', subjectId: 'sub-cs', subjectName: 'Computer Science' }
    ]
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'stu-1',
    admissionNo: 'ADM-2024-001',
    rollNo: '1001',
    firstName: 'Liam',
    lastName: 'Foster',
    email: 'liam.foster@edupulse.edu',
    gender: 'male',
    dob: '2010-04-12',
    classId: 'cls-10a',
    className: 'Grade 10',
    section: 'A',
    contactNumber: '+1 (555) 789-0123',
    address: '742 Evergreen Terrace, Springfield, OR',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    enrollmentDate: '2024-09-01',
    status: 'active',
    guardian: {
      name: 'Arthur Foster',
      relationship: 'Father',
      contact: '+1 (555) 456-7890',
      email: 'arthur.foster@gmail.com',
      occupation: 'Civil Engineer'
    },
    attendanceRate: 94.2,
    gpa: 3.85
  },
  {
    id: 'stu-2',
    admissionNo: 'ADM-2024-002',
    rollNo: '1002',
    firstName: 'Sophia',
    lastName: 'Chen',
    email: 'sophia.chen@edupulse.edu',
    gender: 'female',
    dob: '2010-08-22',
    classId: 'cls-10a',
    className: 'Grade 10',
    section: 'A',
    contactNumber: '+1 (555) 890-1234',
    address: '120 Blossom Hill Rd, Los Gatos, CA',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    enrollmentDate: '2024-09-01',
    status: 'active',
    guardian: {
      name: 'Dr. Wei Chen',
      relationship: 'Father',
      contact: '+1 (555) 901-2345',
      email: 'wei.chen@techcorp.com',
      occupation: 'Physician'
    },
    attendanceRate: 98.0,
    gpa: 3.96
  },
  {
    id: 'stu-3',
    admissionNo: 'ADM-2024-003',
    rollNo: '1003',
    firstName: 'Noah',
    lastName: 'Patel',
    email: 'noah.patel@edupulse.edu',
    gender: 'male',
    dob: '2010-02-17',
    classId: 'cls-10a',
    className: 'Grade 10',
    section: 'A',
    contactNumber: '+1 (555) 912-3456',
    address: '58 Oakwood Avenue, Seattle, WA',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    enrollmentDate: '2024-09-01',
    status: 'active',
    guardian: {
      name: 'Sunita Patel',
      relationship: 'Mother',
      contact: '+1 (555) 923-4567',
      email: 'sunita.patel@seattlelaw.com',
      occupation: 'Attorney'
    },
    attendanceRate: 88.5,
    gpa: 3.62
  },
  {
    id: 'stu-4',
    admissionNo: 'ADM-2024-004',
    rollNo: '1004',
    firstName: 'Emma',
    lastName: 'Williams',
    email: 'emma.williams@edupulse.edu',
    gender: 'female',
    dob: '2010-11-05',
    classId: 'cls-10a',
    className: 'Grade 10',
    section: 'A',
    contactNumber: '+1 (555) 934-5678',
    address: '314 Maple Crest, Austin, TX',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    enrollmentDate: '2024-09-01',
    status: 'active',
    guardian: {
      name: 'Robert Williams',
      relationship: 'Father',
      contact: '+1 (555) 945-6789',
      email: 'r.williams@austinfin.com',
      occupation: 'Financial Analyst'
    },
    attendanceRate: 91.0,
    gpa: 3.78
  },
  {
    id: 'stu-5',
    admissionNo: 'ADM-2024-005',
    rollNo: '1005',
    firstName: 'Chloe',
    lastName: 'Davis',
    email: 'chloe.davis@edupulse.edu',
    gender: 'female',
    dob: '2010-06-30',
    classId: 'cls-10a',
    className: 'Grade 10',
    section: 'A',
    contactNumber: '+1 (555) 956-7890',
    address: '88 Whispering Pines, Boulder, CO',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    enrollmentDate: '2024-09-01',
    status: 'active',
    guardian: {
      name: 'Rebecca Davis',
      relationship: 'Mother',
      contact: '+1 (555) 967-8901',
      email: 'rebecca.davis@boulderhealth.org',
      occupation: 'Registered Nurse'
    },
    attendanceRate: 68.4, // Low attendance alert trigger (< 75%)
    gpa: 2.75
  },
  {
    id: 'stu-6',
    admissionNo: 'ADM-2024-006',
    rollNo: '1006',
    firstName: 'Lucas',
    lastName: 'Rodriguez',
    email: 'lucas.rodriguez@edupulse.edu',
    gender: 'male',
    dob: '2010-09-14',
    classId: 'cls-10a',
    className: 'Grade 10',
    section: 'A',
    contactNumber: '+1 (555) 978-9012',
    address: '402 Sunset Blvd, Phoenix, AZ',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    enrollmentDate: '2024-09-01',
    status: 'active',
    guardian: {
      name: 'Carlos Rodriguez',
      relationship: 'Father',
      contact: '+1 (555) 989-0123',
      email: 'carlos.rod@archdesign.com',
      occupation: 'Architect'
    },
    attendanceRate: 85.0,
    gpa: 3.40
  },
  {
    id: 'stu-7',
    admissionNo: 'ADM-2024-010',
    rollNo: '1011',
    firstName: 'Ethan',
    lastName: 'Taylor',
    email: 'ethan.taylor@edupulse.edu',
    gender: 'male',
    dob: '2010-01-19',
    classId: 'cls-10b',
    className: 'Grade 10',
    section: 'B',
    contactNumber: '+1 (555) 811-2233',
    address: '19 Pinecrest Drive, Denver, CO',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
    enrollmentDate: '2024-09-01',
    status: 'active',
    guardian: {
      name: 'Grace Taylor',
      relationship: 'Mother',
      contact: '+1 (555) 811-4455',
      email: 'grace.taylor@email.com',
      occupation: 'Accountant'
    },
    attendanceRate: 92.5,
    gpa: 3.55
  },
  {
    id: 'stu-8',
    admissionNo: 'ADM-2024-011',
    rollNo: '1012',
    firstName: 'Maya',
    lastName: 'Sharma',
    email: 'maya.sharma@edupulse.edu',
    gender: 'female',
    dob: '2010-05-11',
    classId: 'cls-10b',
    className: 'Grade 10',
    section: 'B',
    contactNumber: '+1 (555) 822-3344',
    address: '90 Valley Rd, San Jose, CA',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    enrollmentDate: '2024-09-01',
    status: 'active',
    guardian: {
      name: 'Vikram Sharma',
      relationship: 'Father',
      contact: '+1 (555) 822-5566',
      email: 'vikram.sharma@tech.com',
      occupation: 'Software Architect'
    },
    attendanceRate: 97.2,
    gpa: 3.92
  }
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'ex-midterm',
    name: 'Midterm Examination 2026',
    term: 'Midterm',
    startDate: '2026-10-01',
    endDate: '2026-10-10',
    academicYear: '2026-2027'
  },
  {
    id: 'ex-unit1',
    name: 'Unit Evaluation Test 1',
    term: 'Unit Test 1',
    startDate: '2026-09-15',
    endDate: '2026-09-18',
    academicYear: '2026-2027'
  }
];

export const INITIAL_GRADES: GradeRecord[] = [
  {
    id: 'grd-1',
    studentId: 'stu-1',
    studentName: 'Liam Foster',
    rollNo: '1001',
    classId: 'cls-10a',
    examId: 'ex-midterm',
    examName: 'Midterm Examination 2026',
    subjectId: 'sub-math',
    subjectName: 'Mathematics',
    marksObtained: 92,
    maxMarks: 100,
    grade: 'A+',
    comments: 'Exceptional problem solving in analytical geometry.',
    recordedDate: '2026-10-12'
  },
  {
    id: 'grd-2',
    studentId: 'stu-1',
    studentName: 'Liam Foster',
    rollNo: '1001',
    classId: 'cls-10a',
    examId: 'ex-midterm',
    examName: 'Midterm Examination 2026',
    subjectId: 'sub-phys',
    subjectName: 'Physics',
    marksObtained: 88,
    maxMarks: 100,
    grade: 'A',
    comments: 'Strong grasp of electromagnetic principles and lab practice.',
    recordedDate: '2026-10-12'
  },
  {
    id: 'grd-3',
    studentId: 'stu-1',
    studentName: 'Liam Foster',
    rollNo: '1001',
    classId: 'cls-10a',
    examId: 'ex-midterm',
    examName: 'Midterm Examination 2026',
    subjectId: 'sub-chem',
    subjectName: 'Chemistry',
    marksObtained: 85,
    maxMarks: 100,
    grade: 'A',
    comments: 'Consistent performance in stoichiometry and organic reactions.',
    recordedDate: '2026-10-12'
  },
  {
    id: 'grd-4',
    studentId: 'stu-1',
    studentName: 'Liam Foster',
    rollNo: '1001',
    classId: 'cls-10a',
    examId: 'ex-midterm',
    examName: 'Midterm Examination 2026',
    subjectId: 'sub-eng',
    subjectName: 'English Literature',
    marksObtained: 89,
    maxMarks: 100,
    grade: 'A',
    comments: 'Insightful essay interpretations and persuasive clarity.',
    recordedDate: '2026-10-12'
  },
  {
    id: 'grd-5',
    studentId: 'stu-1',
    studentName: 'Liam Foster',
    rollNo: '1001',
    classId: 'cls-10a',
    examId: 'ex-midterm',
    examName: 'Midterm Examination 2026',
    subjectId: 'sub-cs',
    subjectName: 'Computer Science',
    marksObtained: 96,
    maxMarks: 100,
    grade: 'A+',
    comments: 'Top of class in algorithm design and modular Python code.',
    recordedDate: '2026-10-12'
  },
  // Grades for Sophia Chen
  {
    id: 'grd-6',
    studentId: 'stu-2',
    studentName: 'Sophia Chen',
    rollNo: '1002',
    classId: 'cls-10a',
    examId: 'ex-midterm',
    examName: 'Midterm Examination 2026',
    subjectId: 'sub-math',
    subjectName: 'Mathematics',
    marksObtained: 99,
    maxMarks: 100,
    grade: 'A+',
    comments: 'Flawless proof executions and perfect scoring.',
    recordedDate: '2026-10-12'
  },
  {
    id: 'grd-7',
    studentId: 'stu-2',
    studentName: 'Sophia Chen',
    rollNo: '1002',
    classId: 'cls-10a',
    examId: 'ex-midterm',
    examName: 'Midterm Examination 2026',
    subjectId: 'sub-phys',
    subjectName: 'Physics',
    marksObtained: 95,
    maxMarks: 100,
    grade: 'A+',
    comments: 'Deep analytical insight into kinematic mechanisms.',
    recordedDate: '2026-10-12'
  },
  // Grades for Chloe Davis (struggling)
  {
    id: 'grd-8',
    studentId: 'stu-5',
    studentName: 'Chloe Davis',
    rollNo: '1005',
    classId: 'cls-10a',
    examId: 'ex-midterm',
    examName: 'Midterm Examination 2026',
    subjectId: 'sub-math',
    subjectName: 'Mathematics',
    marksObtained: 58,
    maxMarks: 100,
    grade: 'C-',
    comments: 'Needs remedial support in quadratic equations and functions.',
    recordedDate: '2026-10-12'
  },
  {
    id: 'grd-9',
    studentId: 'stu-5',
    studentName: 'Chloe Davis',
    rollNo: '1005',
    classId: 'cls-10a',
    examId: 'ex-midterm',
    examName: 'Midterm Examination 2026',
    subjectId: 'sub-phys',
    subjectName: 'Physics',
    marksObtained: 62,
    maxMarks: 100,
    grade: 'C',
    comments: 'Struggles with dimensional analysis; attendance impacting lab scores.',
    recordedDate: '2026-10-12'
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  // Today's attendance for Grade 10-A
  { id: 'att-1', studentId: 'stu-1', studentName: 'Liam Foster', rollNo: '1001', classId: 'cls-10a', date: '2026-10-15', status: 'present', recordedBy: 'tch-1' },
  { id: 'att-2', studentId: 'stu-2', studentName: 'Sophia Chen', rollNo: '1002', classId: 'cls-10a', date: '2026-10-15', status: 'present', recordedBy: 'tch-1' },
  { id: 'att-3', studentId: 'stu-3', studentName: 'Noah Patel', rollNo: '1003', classId: 'cls-10a', date: '2026-10-15', status: 'late', remarks: 'Bus transit delay (15 min)', recordedBy: 'tch-1' },
  { id: 'att-4', studentId: 'stu-4', studentName: 'Emma Williams', rollNo: '1004', classId: 'cls-10a', date: '2026-10-15', status: 'present', recordedBy: 'tch-1' },
  { id: 'att-5', studentId: 'stu-5', studentName: 'Chloe Davis', rollNo: '1005', classId: 'cls-10a', date: '2026-10-15', status: 'absent', remarks: 'Unexcused absence', recordedBy: 'tch-1' },
  { id: 'att-6', studentId: 'stu-6', studentName: 'Lucas Rodriguez', rollNo: '1006', classId: 'cls-10a', date: '2026-10-15', status: 'present', recordedBy: 'tch-1' },

  // Yesterday
  { id: 'att-7', studentId: 'stu-1', studentName: 'Liam Foster', rollNo: '1001', classId: 'cls-10a', date: '2026-10-14', status: 'present', recordedBy: 'tch-1' },
  { id: 'att-8', studentId: 'stu-2', studentName: 'Sophia Chen', rollNo: '1002', classId: 'cls-10a', date: '2026-10-14', status: 'present', recordedBy: 'tch-1' },
  { id: 'att-9', studentId: 'stu-3', studentName: 'Noah Patel', rollNo: '1003', classId: 'cls-10a', date: '2026-10-14', status: 'present', recordedBy: 'tch-1' },
  { id: 'att-10', studentId: 'stu-4', studentName: 'Emma Williams', rollNo: '1004', classId: 'cls-10a', date: '2026-10-14', status: 'present', recordedBy: 'tch-1' },
  { id: 'att-11', studentId: 'stu-5', studentName: 'Chloe Davis', rollNo: '1005', classId: 'cls-10a', date: '2026-10-14', status: 'absent', remarks: 'Medical appointment', recordedBy: 'tch-1' },
  { id: 'att-12', studentId: 'stu-6', studentName: 'Lucas Rodriguez', rollNo: '1006', classId: 'cls-10a', date: '2026-10-14', status: 'present', recordedBy: 'tch-1' },

  // Day before yesterday
  { id: 'att-13', studentId: 'stu-1', studentName: 'Liam Foster', rollNo: '1001', classId: 'cls-10a', date: '2026-10-13', status: 'present', recordedBy: 'tch-1' },
  { id: 'att-14', studentId: 'stu-2', studentName: 'Sophia Chen', rollNo: '1002', classId: 'cls-10a', date: '2026-10-13', status: 'present', recordedBy: 'tch-1' },
  { id: 'att-15', studentId: 'stu-3', studentName: 'Noah Patel', rollNo: '1003', classId: 'cls-10a', date: '2026-10-13', status: 'present', recordedBy: 'tch-1' },
  { id: 'att-16', studentId: 'stu-4', studentName: 'Emma Williams', rollNo: '1004', classId: 'cls-10a', date: '2026-10-13', status: 'excused', remarks: 'Family bereavement', recordedBy: 'tch-1' },
  { id: 'att-17', studentId: 'stu-5', studentName: 'Chloe Davis', rollNo: '1005', classId: 'cls-10a', date: '2026-10-13', status: 'absent', remarks: 'Unexcused', recordedBy: 'tch-1' },
  { id: 'att-18', studentId: 'stu-6', studentName: 'Lucas Rodriguez', rollNo: '1006', classId: 'cls-10a', date: '2026-10-13', status: 'present', recordedBy: 'tch-1' }
];

export const INITIAL_TIMETABLE: TimetableSlot[] = [
  // Monday
  { id: 'tt-1', classId: 'cls-10a', className: 'Grade 10 - A', dayOfWeek: 'Monday', period: 1, startTime: '08:30', endTime: '09:20', subjectId: 'sub-math', subjectName: 'Mathematics', teacherId: 'tch-2', teacherName: 'Dr. Sarah Jenkins', roomNo: 'Room 201' },
  { id: 'tt-2', classId: 'cls-10a', className: 'Grade 10 - A', dayOfWeek: 'Monday', period: 2, startTime: '09:25', endTime: '10:15', subjectId: 'sub-phys', subjectName: 'Physics', teacherId: 'tch-1', teacherName: 'Prof. Marcus Bennett', roomNo: 'Physics Lab' },
  { id: 'tt-3', classId: 'cls-10a', className: 'Grade 10 - A', dayOfWeek: 'Monday', period: 3, startTime: '10:30', endTime: '11:20', subjectId: 'sub-eng', subjectName: 'English Literature', teacherId: 'tch-3', teacherName: 'Mr. David Morales', roomNo: 'Room 201' },
  { id: 'tt-4', classId: 'cls-10a', className: 'Grade 10 - A', dayOfWeek: 'Monday', period: 4, startTime: '11:25', endTime: '12:15', subjectId: 'sub-cs', subjectName: 'Computer Science', teacherId: 'tch-4', teacherName: 'Ms. Elena Rostova', roomNo: 'Computer Lab 1' },
  { id: 'tt-5', classId: 'cls-10a', className: 'Grade 10 - A', dayOfWeek: 'Monday', period: 5, startTime: '13:00', endTime: '13:50', subjectId: 'sub-chem', subjectName: 'Chemistry', teacherId: 'tch-1', teacherName: 'Prof. Marcus Bennett', roomNo: 'Room 201' },

  // Tuesday
  { id: 'tt-6', classId: 'cls-10a', className: 'Grade 10 - A', dayOfWeek: 'Tuesday', period: 1, startTime: '08:30', endTime: '09:20', subjectId: 'sub-cs', subjectName: 'Computer Science', teacherId: 'tch-4', teacherName: 'Ms. Elena Rostova', roomNo: 'Computer Lab 1' },
  { id: 'tt-7', classId: 'cls-10a', className: 'Grade 10 - A', dayOfWeek: 'Tuesday', period: 2, startTime: '09:25', endTime: '10:15', subjectId: 'sub-math', subjectName: 'Mathematics', teacherId: 'tch-2', teacherName: 'Dr. Sarah Jenkins', roomNo: 'Room 201' },
  { id: 'tt-8', classId: 'cls-10a', className: 'Grade 10 - A', dayOfWeek: 'Tuesday', period: 3, startTime: '10:30', endTime: '11:20', subjectId: 'sub-phys', subjectName: 'Physics', teacherId: 'tch-1', teacherName: 'Prof. Marcus Bennett', roomNo: 'Physics Lab' },
  { id: 'tt-9', classId: 'cls-10a', className: 'Grade 10 - A', dayOfWeek: 'Tuesday', period: 4, startTime: '11:25', endTime: '12:15', subjectId: 'sub-eng', subjectName: 'English Literature', teacherId: 'tch-3', teacherName: 'Mr. David Morales', roomNo: 'Room 201' },

  // Wednesday
  { id: 'tt-10', classId: 'cls-10a', className: 'Grade 10 - A', dayOfWeek: 'Wednesday', period: 1, startTime: '08:30', endTime: '09:20', subjectId: 'sub-phys', subjectName: 'Physics', teacherId: 'tch-1', teacherName: 'Prof. Marcus Bennett', roomNo: 'Physics Lab' },
  { id: 'tt-11', classId: 'cls-10a', className: 'Grade 10 - A', dayOfWeek: 'Wednesday', period: 2, startTime: '09:25', endTime: '10:15', subjectId: 'sub-chem', subjectName: 'Chemistry', teacherId: 'tch-1', teacherName: 'Prof. Marcus Bennett', roomNo: 'Chemistry Lab' },
  { id: 'tt-12', classId: 'cls-10a', className: 'Grade 10 - A', dayOfWeek: 'Wednesday', period: 3, startTime: '10:30', endTime: '11:20', subjectId: 'sub-math', subjectName: 'Mathematics', teacherId: 'tch-2', teacherName: 'Dr. Sarah Jenkins', roomNo: 'Room 201' },
  { id: 'tt-13', classId: 'cls-10a', className: 'Grade 10 - A', dayOfWeek: 'Wednesday', period: 4, startTime: '11:25', endTime: '12:15', subjectId: 'sub-cs', subjectName: 'Computer Science', teacherId: 'tch-4', teacherName: 'Ms. Elena Rostova', roomNo: 'Computer Lab 1' },

  // Thursday
  { id: 'tt-14', classId: 'cls-10a', className: 'Grade 10 - A', dayOfWeek: 'Thursday', period: 1, startTime: '08:30', endTime: '09:20', subjectId: 'sub-math', subjectName: 'Mathematics', teacherId: 'tch-2', teacherName: 'Dr. Sarah Jenkins', roomNo: 'Room 201' },
  { id: 'tt-15', classId: 'cls-10a', className: 'Grade 10 - A', dayOfWeek: 'Thursday', period: 2, startTime: '09:25', endTime: '10:15', subjectId: 'sub-eng', subjectName: 'English Literature', teacherId: 'tch-3', teacherName: 'Mr. David Morales', roomNo: 'Room 201' },
  { id: 'tt-16', classId: 'cls-10a', className: 'Grade 10 - A', dayOfWeek: 'Thursday', period: 3, startTime: '10:30', endTime: '11:20', subjectId: 'sub-cs', subjectName: 'Computer Science', teacherId: 'tch-4', teacherName: 'Ms. Elena Rostova', roomNo: 'Computer Lab 1' },

  // Friday
  { id: 'tt-17', classId: 'cls-10a', className: 'Grade 10 - A', dayOfWeek: 'Friday', period: 1, startTime: '08:30', endTime: '09:20', subjectId: 'sub-phys', subjectName: 'Physics', teacherId: 'tch-1', teacherName: 'Prof. Marcus Bennett', roomNo: 'Room 201' },
  { id: 'tt-18', classId: 'cls-10a', className: 'Grade 10 - A', dayOfWeek: 'Friday', period: 2, startTime: '09:25', endTime: '10:15', subjectId: 'sub-chem', subjectName: 'Chemistry', teacherId: 'tch-1', teacherName: 'Prof. Marcus Bennett', roomNo: 'Chemistry Lab' },
  { id: 'tt-19', classId: 'cls-10a', className: 'Grade 10 - A', dayOfWeek: 'Friday', period: 3, startTime: '10:30', endTime: '11:20', subjectId: 'sub-math', subjectName: 'Mathematics', teacherId: 'tch-2', teacherName: 'Dr. Sarah Jenkins', roomNo: 'Room 201' }
];

export const INITIAL_FEES: FeeRecord[] = [
  {
    id: 'fee-1',
    studentId: 'stu-1',
    studentName: 'Liam Foster',
    admissionNo: 'ADM-2024-001',
    classId: 'cls-10a',
    className: 'Grade 10 - A',
    title: 'Term 1 Tuition & Tech Fee',
    category: 'Tuition',
    amount: 1450.00,
    paidAmount: 1450.00,
    dueDate: '2026-09-15',
    status: 'paid',
    paymentDate: '2026-09-10',
    paymentMethod: 'Bank Transfer',
    receiptNo: 'REC-2026-9041'
  },
  {
    id: 'fee-2',
    studentId: 'stu-1',
    studentName: 'Liam Foster',
    admissionNo: 'ADM-2024-001',
    classId: 'cls-10a',
    className: 'Grade 10 - A',
    title: 'Annual Science & Robotics Lab Access',
    category: 'Laboratory',
    amount: 280.00,
    paidAmount: 280.00,
    dueDate: '2026-09-30',
    status: 'paid',
    paymentDate: '2026-09-24',
    paymentMethod: 'Card',
    receiptNo: 'REC-2026-9118'
  },
  {
    id: 'fee-3',
    studentId: 'stu-1',
    studentName: 'Liam Foster',
    admissionNo: 'ADM-2024-001',
    classId: 'cls-10a',
    className: 'Grade 10 - A',
    title: 'Term 2 Tuition Installment',
    category: 'Tuition',
    amount: 1450.00,
    paidAmount: 0.00,
    dueDate: '2026-11-01',
    status: 'pending'
  },
  {
    id: 'fee-4',
    studentId: 'stu-5',
    studentName: 'Chloe Davis',
    admissionNo: 'ADM-2024-005',
    classId: 'cls-10a',
    className: 'Grade 10 - A',
    title: 'Term 1 Tuition Fee',
    category: 'Tuition',
    amount: 1450.00,
    paidAmount: 700.00,
    dueDate: '2026-09-15',
    status: 'overdue'
  },
  {
    id: 'fee-5',
    studentId: 'stu-2',
    studentName: 'Sophia Chen',
    admissionNo: 'ADM-2024-002',
    classId: 'cls-10a',
    className: 'Grade 10 - A',
    title: 'Term 1 Tuition & Honors Seminar',
    category: 'Tuition',
    amount: 1600.00,
    paidAmount: 1600.00,
    dueDate: '2026-09-15',
    status: 'paid',
    paymentDate: '2026-09-05',
    paymentMethod: 'Card',
    receiptNo: 'REC-2026-8991'
  },
  {
    id: 'fee-6',
    studentId: 'stu-3',
    studentName: 'Noah Patel',
    admissionNo: 'ADM-2024-003',
    classId: 'cls-10a',
    className: 'Grade 10 - A',
    title: 'School Bus Transportation - Route 4',
    category: 'Transport',
    amount: 420.00,
    paidAmount: 420.00,
    dueDate: '2026-09-20',
    status: 'paid',
    paymentDate: '2026-09-18',
    paymentMethod: 'Card',
    receiptNo: 'REC-2026-9055'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Annual STEM Exhibition & Project Showcase 2026',
    content: 'Students from Grades 9 through 12 are invited to register their research projects for the Inter-School STEM Fair. Registration closes on October 25th in the Main Science Auditorium.',
    targetRole: 'all',
    authorName: 'Dr. Evelyn Vance',
    authorRole: 'Principal / Admin',
    postedDate: '2026-10-14',
    priority: 'high'
  },
  {
    id: 'ann-2',
    title: 'Parent-Teacher Academic Review Conferences (Term 1)',
    content: 'Fall Parent-Teacher conferences are scheduled for Friday, October 24th from 1:00 PM to 6:00 PM. Parents can book 15-minute consultations through the parent portal.',
    targetRole: 'parents',
    authorName: 'Academic Office',
    authorRole: 'Admin',
    postedDate: '2026-10-12',
    priority: 'urgent'
  },
  {
    id: 'ann-3',
    title: 'Faculty Curriculum Development Workshop',
    content: 'All teaching faculty are requested to submit finalized midterm syllabus audits and rubrics before Monday 5:00 PM.',
    targetRole: 'teachers',
    authorName: 'Prof. Marcus Bennett',
    authorRole: 'Dean of Faculty',
    postedDate: '2026-10-10',
    priority: 'normal'
  },
  {
    id: 'ann-4',
    title: 'Fall Athletic Trials & Varsity Basketball Schedule',
    content: 'Trials for Varsity Basketball, Track & Field, and Volleyball will take place after school on Wednesday at the Sports Complex.',
    targetRole: 'students',
    authorName: 'Coach Henderson',
    authorRole: 'Athletic Director',
    postedDate: '2026-10-08',
    priority: 'normal'
  }
];
