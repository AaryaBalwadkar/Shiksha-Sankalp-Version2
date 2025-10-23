// models/Submission.js
import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // assuming student is a User
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  file: {
    fileName: String,
    fileUrl: String,
  },
  grade: {
    type: Number,
    default: null,
  },
  feedback: {
    type: String,
  },
  gradedAt: {
    type: Date,
  },
}, {
  timestamps: true
});

export default mongoose.model("Submission", submissionSchema);
