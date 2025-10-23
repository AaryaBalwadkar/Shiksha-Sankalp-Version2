import express from 'express';
import protectRoute from '../middleware/ProtectRoute.js';
import {
  createAssignment,
  getAssignments,
  getAssignmentById,
  submitAssignment,
  getSubmissions,
  getSubmissionById,
  gradeSubmission,
  getGradedSubmissions,
  deleteAssignment,
  deleteSubmission,
  updateAssignment,
  updateSubmission,
  getAssignmentsByClassId,
  getSubmissionsByAssignmentId,
  getSubmissionsByStudentId,
  getAssignmentSubmissions
} from '../controller/AssignmentsController.js';

const router = express.Router();
router.post('/create', protectRoute, createAssignment);

export default router;