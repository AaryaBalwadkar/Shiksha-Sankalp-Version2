import Assignment from '../model/Assignment.js';
import Submission from '../model/Submission.js';

export const createAssignment = async (req, res) => {
    const { classId, createdBy, title, description, dueDate, attachments, maxMarks } = req.body;
    if (!classId || !createdBy || !title || !dueDate) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    try {
        const newAssignment = new Assignment({
            classId,
            createdBy,
            title,
            description,
            dueDate,
            attachments,
            maxMarks
        });

        await newAssignment.save();
        res.status(201).json(newAssignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAssignments = async (req, res) => {
    const { classroomId, channelId } = req.query;
    if (!classroomId || !channelId) {
        return res.status(400).json({ message: "Missing required parameters" });
    }
    try {
        const assignments = await Assignment.find({ classroomId, channelId }).populate('createdBy', 'name email');
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAssignmentById = async (req, res) => {}

export const submitAssignment = async (req, res) => {}

export const getSubmissions = async (req, res) => {}

export const getSubmissionById = async (req, res) => {}

export const gradeSubmission = async (req, res) => {}

export const getGradedSubmissions = async (req, res) => {}

export const deleteAssignment = async (req, res) => {}

export const deleteSubmission = async (req, res) => {}

export const updateAssignment = async (req, res) => {}

export const updateSubmission = async (req, res) => {}

export const getAssignmentsByClassId = async (req, res) => {}

export const getSubmissionsByAssignmentId = async (req, res) => {}

export const getSubmissionsByStudentId = async (req, res) => {}

export const getAssignmentSubmissions = async (req, res) => {}