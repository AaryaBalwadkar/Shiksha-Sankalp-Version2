import React, { useState, useEffect } from "react";
import AssignmentCard from "./AssignmentCard";
import AssignmentFormModal from "../../modals/AssignmentModal";
import { useParams } from "react-router-dom";

const AssignmentChannel = () => {
  const [assignments, setAssignments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { id: classroomId } = useParams();

  const fetchAssignments = async () => {
    try {
      const res = await fetch(`/api/assignments?classroomId=${classroomId}`);
      const data = await res.json();
      setAssignments(data);
    } catch (err) {
      console.error("Failed to fetch assignments", err);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [classroomId]);

  const handleNewAssignment = (newAssignment) => {
    setAssignments((prev) => [newAssignment, ...prev]);
  };

  return (
    <div className="flex flex-col gap-4 p-4 w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + New Assignment
        </button>
      </div>

      {assignments.length === 0 ? (
        <p className="text-gray-500">No assignments yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {assignments.map((assignment) => (
            <AssignmentCard key={assignment._id} assignment={assignment} />
          ))}
        </div>
      )}

      {showModal && (
        <AssignmentFormModal
          onClose={() => setShowModal(false)}
          onCreated={handleNewAssignment}
        />
      )}
    </div>
  );
};

export default AssignmentChannel;


