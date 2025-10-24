import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClassroomAndChannelStore } from "../store/ClassroomStore";

const DeleteClassroomModal = ({ value = "classroom", id, onClose }) => {
  const { deleteClassroom, deleteChannel } = useClassroomAndChannelStore();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleDelete = async (e) => {
    e.preventDefault();
    setError("");

    if (!id) {
      setError("Invalid ID provided");
      return;
    }

    try {
      if (value === "channel") {
        await deleteChannel(id);
        onClose();
        navigate(`/home/${id}`); // Using id as classroomId for channels
      } else if (value === "classroom") {
        await deleteClassroom(id);
        onClose();
        navigate("/home");
      }
    } catch (err) {
      console.error("Error deleting:", err);
      setError(err.response?.data?.message || "Failed to delete. Please try again.");
    }
  };

  return (
    <div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-[400px] min-h-[270px] bg-white rounded-lg shadow-2xl border border-white/50 border-r-white/20 border-b-white/20 backdrop-blur-sm flex overflow-hidden">
        <div className="relative w-full p-6 flex flex-col items-center justify-center">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Confirm Deletion
          </h2>

          <p className="text-red-600 font-medium text-base mb-4 text-center">
            {value === "classroom"
              ? "Do you really want to delete this classroom? This action cannot be undone."
              : "Do you really want to delete this channel? This action cannot be undone."}
          </p>

          {error && (
            <div className="text-red-500 font-semibold text-sm mb-4">{error}</div>
          )}

          <form
            className="w-full flex justify-center"
            onSubmit={handleDelete}
          >
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-[#21264d] text-white font-semibold text-lg rounded-full w-[340px] py-3 transition-all duration-300 hover:scale-105 hover:opacity-80"
            >
              Confirm Deletion
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeleteClassroomModal;