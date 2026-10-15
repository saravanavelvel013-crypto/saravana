import { Router } from 'express';
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent
} from '../controllers/studentController';

export const apiRouter = Router();

// Health check
apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'EduPulse Core API',
    version: '1.0.0'
  });
});

// Student Endpoints
apiRouter.get('/students', getStudents);
apiRouter.post('/students', createStudent);
apiRouter.put('/students/:id', updateStudent);
apiRouter.delete('/students/:id', deleteStudent);

// Attendance Endpoints
apiRouter.get('/attendance', (_req, res) => {
  res.json({ success: true, message: 'Attendance records' });
});

apiRouter.post('/attendance/bulk', (req, res) => {
  const { classId, date, records } = req.body;
  if (!classId || !date || !Array.isArray(records)) {
    res.status(400).json({ success: false, message: 'classId, date and records array required' });
    return;
  }
  res.status(201).json({ success: true, count: records.length });
});

// Grades Endpoints
apiRouter.get('/grades', (_req, res) => {
  res.json({ success: true, data: [] });
});

apiRouter.post('/grades/batch', (req, res) => {
  const { records } = req.body;
  if (!Array.isArray(records)) {
    res.status(400).json({ success: false, message: 'records array required' });
    return;
  }
  res.status(200).json({ success: true, saved: records.length });
});

// Fees Endpoints
apiRouter.get('/fees', (_req, res) => {
  res.json({ success: true, data: [] });
});

apiRouter.post('/fees/:id/pay', (req, res) => {
  const { id } = req.params;
  const { amount, paymentMethod } = req.body;
  res.status(200).json({
    success: true,
    receiptNo: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    id,
    amount,
    paymentMethod
  });
});
