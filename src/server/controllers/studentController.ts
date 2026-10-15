import { Request, Response } from 'express';

/**
 * Controller for Student CRUD and search operations
 * Follows RESTful standards with input validation and error handling
 */

export const getStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { classId, search, page = '1', limit = '10', sortBy = 'name', order = 'asc' } = req.query;

    // Validation
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 10));

    res.status(200).json({
      success: true,
      data: [],
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: 0,
        totalPages: 1
      },
      meta: { classId, search, sortBy, order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve students',
      error: (error as Error).message
    });
  }
};

export const createStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, rollNo, classId, contactNumber, guardian } = req.body;

    // Strict input validation
    if (!firstName || !lastName || !rollNo || !classId) {
      res.status(400).json({
        success: false,
        message: 'Validation Error: firstName, lastName, rollNo, and classId are required fields.'
      });
      return;
    }

    if (guardian && (!guardian.name || !guardian.contact)) {
      res.status(400).json({
        success: false,
        message: 'Validation Error: Guardian name and contact are mandatory.'
      });
      return;
    }

    const newStudent = {
      id: `stu-${Date.now()}`,
      admissionNo: `ADM-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      ...req.body,
      createdAt: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: newStudent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create student',
      error: (error as Error).message
    });
  }
};

export const updateStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ success: false, message: 'Student ID is required in URL parameter' });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Student ${id} updated successfully`,
      data: { id, ...req.body, updatedAt: new Date().toISOString() }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update student',
      error: (error as Error).message
    });
  }
};

export const deleteStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ success: false, message: 'Student ID is required' });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Student ${id} removed from system`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete student',
      error: (error as Error).message
    });
  }
};
