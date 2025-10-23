// components/AssignmentCard.jsx
import React from "react";
import { format } from "date-fns";

const AssignmentCard = ({ assignment }) => {
  return (
    <div className="bg-white p-4 border rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">{assignment.title}</h3>
        <span className="text-sm text-gray-500">
          Due: {format(new Date(assignment.dueDate), "dd MMM yyyy")}
        </span>
      </div>

      <p className="text-gray-700 mt-2">{assignment.description}</p>

      {assignment.attachments && assignment.attachments.length > 0 && (
        <div className="mt-3">
          <h4 className="text-sm font-medium">Attachments:</h4>
          <ul className="list-disc list-inside text-sm text-blue-600">
            {assignment.attachments.map((file, idx) => (
              <li key={idx}>
                <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                  {file.fileName}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-3 text-sm text-gray-600">Max Marks: {assignment.maxMarks}</p>
    </div>
  );
};

export default AssignmentCard;

