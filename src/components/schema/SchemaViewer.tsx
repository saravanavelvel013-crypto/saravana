import React, { useState } from 'react';
import {
  Database,
  Layers,
  Code2,
  Server,
  Copy,
  Check,
  Terminal,
  FileCode,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { SCHEMA_TABLES, REST_ENDPOINTS } from '../../db/schema-data';

export const SchemaViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'erDiagram' | 'ddl' | 'restApi' | 'setupGuide'>('erDiagram');
  const [selectedTable, setSelectedTable] = useState<string>(SCHEMA_TABLES[0].name);
  const [copiedCode, setCopiedCode] = useState(false);

  const activeTableObj = SCHEMA_TABLES.find(t => t.name === selectedTable) || SCHEMA_TABLES[0];

  const fullSqlDdl = `-- =====================================================================
-- EduPulse Student Management System: Production Relational Schema
-- Normalized 3NF Architecture (PostgreSQL / MySQL / SQLite)
-- =====================================================================

-- 1. Users Table (Core Auth & Roles)
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(180) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'teacher', 'student', 'parent')),
    phone VARCHAR(30),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Classes Table
CREATE TABLE classes (
    id VARCHAR(36) PRIMARY KEY,
    grade VARCHAR(20) NOT NULL,
    section VARCHAR(10) NOT NULL,
    room_no VARCHAR(20),
    capacity INTEGER NOT NULL DEFAULT 40,
    academic_year VARCHAR(20) NOT NULL,
    class_teacher_id VARCHAR(36),
    CONSTRAINT uq_class UNIQUE (grade, section, academic_year)
);

-- 3. Teachers Table
CREATE TABLE teachers (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    employee_id VARCHAR(30) UNIQUE NOT NULL,
    qualification VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    joining_date DATE NOT NULL
);

-- 4. Subjects Table
CREATE TABLE subjects (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    credits INTEGER NOT NULL DEFAULT 3,
    department VARCHAR(80) NOT NULL
);

-- 5. Students Table
CREATE TABLE students (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    admission_no VARCHAR(30) UNIQUE NOT NULL,
    roll_no VARCHAR(20) NOT NULL,
    class_id VARCHAR(36) NOT NULL REFERENCES classes(id) ON DELETE RESTRICT,
    first_name VARCHAR(60) NOT NULL,
    last_name VARCHAR(60) NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    dob DATE NOT NULL,
    contact_number VARCHAR(30) NOT NULL,
    address TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    guardian_name VARCHAR(120) NOT NULL,
    guardian_relation VARCHAR(30) NOT NULL,
    guardian_phone VARCHAR(30) NOT NULL,
    guardian_email VARCHAR(180) NOT NULL,
    CONSTRAINT uq_class_roll UNIQUE (class_id, roll_no)
);

-- 6. Daily Attendance Table
CREATE TABLE attendances (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    class_id VARCHAR(36) NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(15) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
    remarks VARCHAR(255),
    recorded_by VARCHAR(36) REFERENCES users(id),
    CONSTRAINT uq_student_date UNIQUE (student_id, date)
);

-- 7. Exam Grades & Marks Table
CREATE TABLE grades (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    exam_id VARCHAR(36) NOT NULL,
    subject_id VARCHAR(36) NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    marks_obtained NUMERIC(5,2) NOT NULL,
    max_marks NUMERIC(5,2) NOT NULL DEFAULT 100.00,
    grade VARCHAR(5) NOT NULL,
    comments TEXT,
    recorded_date DATE DEFAULT CURRENT_DATE
);

-- 8. Timetable Slots Table
CREATE TABLE timetables (
    id VARCHAR(36) PRIMARY KEY,
    class_id VARCHAR(36) NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    day_of_week VARCHAR(15) NOT NULL,
    period_number INTEGER NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    subject_id VARCHAR(36) NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id VARCHAR(36) NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    room_no VARCHAR(20) NOT NULL
);

-- 9. Fees & Billing Ledger
CREATE TABLE fees (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    title VARCHAR(120) NOT NULL,
    category VARCHAR(30) NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    paid_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    due_date DATE NOT NULL,
    status VARCHAR(15) NOT NULL CHECK (status IN ('paid', 'pending', 'overdue', 'partial')),
    payment_date DATE,
    receipt_no VARCHAR(50) UNIQUE
);

-- 10. Announcements Table
CREATE TABLE announcements (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    target_role VARCHAR(20) NOT NULL DEFAULT 'all',
    author_id VARCHAR(36) REFERENCES users(id),
    priority VARCHAR(15) DEFAULT 'normal',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX idx_student_class ON students(class_id);
CREATE INDEX idx_att_date_class ON attendances(class_id, date);
CREATE INDEX idx_fees_status ON fees(status);
CREATE INDEX idx_grades_student ON grades(student_id);`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            System Architecture, Database Schema & API
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Normalized 3NF relational data dictionary, interactive ER diagram, and REST endpoints
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md text-xs">
          <button
            onClick={() => setActiveTab('erDiagram')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              activeTab === 'erDiagram'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ER Diagram & Tables
          </button>
          <button
            onClick={() => setActiveTab('ddl')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              activeTab === 'ddl'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            SQL DDL Schema
          </button>
          <button
            onClick={() => setActiveTab('restApi')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              activeTab === 'restApi'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            REST API Routes
          </button>
          <button
            onClick={() => setActiveTab('setupGuide')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              activeTab === 'setupGuide'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Setup & Run
          </button>
        </div>
      </div>

      {/* Tab 1: Interactive ER Diagram & Table Explorer */}
      {activeTab === 'erDiagram' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Table List / Diagram Navigator */}
          <div className="lg:col-span-4 bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              Relational Tables ({SCHEMA_TABLES.length})
            </h2>

            <div className="space-y-1.5">
              {SCHEMA_TABLES.map(table => {
                const isSelected = selectedTable === table.name;
                return (
                  <button
                    key={table.name}
                    onClick={() => setSelectedTable(table.name)}
                    className={`w-full text-left p-2.5 rounded-md text-xs transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-50 border border-indigo-200 text-indigo-900 font-semibold shadow-2xs'
                        : 'bg-slate-50/50 hover:bg-slate-100 border border-slate-100 text-slate-700'
                    }`}
                  >
                    <div>
                      <span className="font-mono">{table.name}</span>
                      <span className="text-[10px] text-slate-500 block truncate max-w-[200px]">
                        {table.description}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {table.columns.length} cols
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Cardinality Map Overview */}
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
              <span className="font-bold text-slate-800 block text-xs mb-1">Entity Relationships:</span>
              <div>• <code>users</code> (1:1) <code>teachers</code> & <code>students</code></div>
              <div>• <code>classes</code> (1:N) <code>students</code> & <code>timetables</code></div>
              <div>• <code>students</code> (1:N) <code>attendances</code>, <code>grades</code>, <code>fees</code></div>
              <div>• <code>subjects</code> (1:N) <code>grades</code> & <code>timetables</code></div>
            </div>
          </div>

          {/* Active Table Details */}
          <div className="lg:col-span-8 bg-white rounded-lg border border-slate-200 p-5 space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  TABLE
                </span>
                <h3 className="text-lg font-bold font-mono text-slate-900">{activeTableObj.name}</h3>
              </div>
              <p className="text-xs text-slate-600 mt-1">{activeTableObj.description}</p>
            </div>

            {/* Columns Table */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-2">Column Definitions & Data Types</h4>
              <div className="border border-slate-200 rounded-md overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                      <th className="py-2.5 px-3">Column</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Constraints</th>
                      <th className="py-2.5 px-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeTableObj.columns.map(col => (
                      <tr key={col.name} className="hover:bg-slate-50/50">
                        <td className="py-2 px-3 font-mono font-semibold text-slate-900">
                          {col.name}
                        </td>
                        <td className="py-2 px-3 font-mono text-indigo-700 text-[11px]">
                          {col.type}
                        </td>
                        <td className="py-2 px-3 font-mono text-slate-500 text-[11px]">
                          {col.constraints || '-'}
                        </td>
                        <td className="py-2 px-3 text-slate-600 text-[11px]">{col.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Foreign Key Relations */}
            {activeTableObj.relationships.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-800 mb-2">Foreign Keys & Cardinality</h4>
                <div className="space-y-1.5">
                  {activeTableObj.relationships.map((rel, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-indigo-700 bg-white border border-indigo-200 px-1.5 py-0.5 rounded text-[10px]">
                          {rel.type}
                        </span>
                        <span className="font-mono text-slate-800">
                          {activeTableObj.name} &rarr; {rel.targetTable}
                        </span>
                      </div>
                      <span className="font-mono text-slate-500 text-[11px]">
                        FK: {rel.foreignKey} {rel.onDelete && `(ON DELETE ${rel.onDelete})`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: SQL DDL Script Viewer */}
      {activeTab === 'ddl' && (
        <div className="bg-slate-900 rounded-lg p-4 text-slate-100 font-mono text-xs space-y-3 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400 text-xs">schema.sql (PostgreSQL / MySQL / SQLite Normalized 3NF)</span>
            <button
              onClick={() => copyToClipboard(fullSqlDdl)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied to Clipboard' : 'Copy SQL Script'}</span>
            </button>
          </div>
          <pre className="overflow-x-auto p-2 text-[11px] leading-relaxed text-slate-300 max-h-[600px]">
            {fullSqlDdl}
          </pre>
        </div>
      )}

      {/* Tab 3: REST API Endpoints Catalog */}
      {activeTab === 'restApi' && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-4 shadow-xs">
          <div>
            <h2 className="text-sm font-bold text-slate-900">RESTful API Endpoints</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Standard HTTP endpoints with route parameterization and payload specifications
            </p>
          </div>

          <div className="border border-slate-200 rounded-md overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                  <th className="py-2.5 px-3 w-20">Method</th>
                  <th className="py-2.5 px-3 w-56">Endpoint Route</th>
                  <th className="py-2.5 px-3">Description & Parameters</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {REST_ENDPOINTS.map((ep, idx) => {
                  const isGet = ep.method === 'GET';
                  const isPost = ep.method === 'POST';
                  const isPut = ep.method === 'PUT';
                  const isDelete = ep.method === 'DELETE';

                  return (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-3 font-mono font-bold">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] ${
                            isGet
                              ? 'bg-blue-50 text-blue-700'
                              : isPost
                              ? 'bg-emerald-50 text-emerald-700'
                              : isPut
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {ep.method}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">
                        {ep.path}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{ep.desc}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Setup and Run Instructions */}
      {activeTab === 'setupGuide' && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-6 text-xs text-slate-700 leading-relaxed">
          <div>
            <h2 className="text-base font-bold text-slate-900">Setup and Run Instructions</h2>
            <p className="text-slate-500 mt-1">
              Complete deployment guidelines for running the backend and frontend locally or in production containers.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-2">
              <h3 className="font-bold text-slate-900 text-xs">1. Prerequisites</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Node.js 20.x or 22.x LTS</li>
                <li>PostgreSQL 14+ or MySQL 8.0+ (or SQLite for single-file local setups)</li>
                <li>npm, pnpm, or yarn package manager</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-2">
              <h3 className="font-bold text-slate-900 text-xs">2. Environment Configuration (.env)</h3>
              <pre className="p-3 bg-slate-900 text-slate-200 rounded font-mono text-[11px] overflow-x-auto">
{`# Database Connection
DATABASE_URL="postgresql://postgres:password@localhost:5432/edupulse_db"

# Server Configuration
PORT=3000
NODE_ENV=production
JWT_SECRET="edupulse-super-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Client Host URL
APP_URL="http://localhost:3000"`}
              </pre>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-2">
              <h3 className="font-bold text-slate-900 text-xs">3. Database Migration & Seeding</h3>
              <div className="p-3 bg-slate-900 text-slate-200 rounded font-mono text-[11px] overflow-x-auto space-y-1">
                <div># Create PostgreSQL database</div>
                <div className="text-emerald-400">createdb -U postgres edupulse_db</div>
                <div className="mt-2"># Run schema DDL script</div>
                <div className="text-emerald-400">psql -U postgres -d edupulse_db -f src/db/schema.sql</div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-2">
              <h3 className="font-bold text-slate-900 text-xs">4. Running the Full Stack Application</h3>
              <div className="p-3 bg-slate-900 text-slate-200 rounded font-mono text-[11px] overflow-x-auto space-y-1">
                <div># Install dependencies</div>
                <div className="text-emerald-400">npm install</div>
                <div className="mt-2"># Start Development Server (Vite + Express API on port 3000)</div>
                <div className="text-emerald-400">npm run dev</div>
                <div className="mt-2"># Production Build</div>
                <div className="text-emerald-400">npm run build</div>
                <div className="text-emerald-400">npm start</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
