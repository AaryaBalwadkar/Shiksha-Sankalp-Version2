// models/Assignment.js
import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Classroom",
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // assuming teacher is a User
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  attachments: [
    {
      fileName: String,
      fileUrl: String,
    }
  ],
  maxMarks: {
    type: Number,
    default: 100,
  },
}, {
  timestamps: true
});

export default mongoose.model("Assignment", assignmentSchema);