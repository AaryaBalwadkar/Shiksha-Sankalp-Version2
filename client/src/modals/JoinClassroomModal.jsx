import React, { useState } from "react";
import { useClassroomAndChannelStore } from "@/store/ClassroomStore";
import { useNavigate } from "react-router-dom";

const JoinClassroomModal = ({ onClose }) => {
  const [code, setCode] = useState("");
  const { joinClassroom } = useClassroomAndChannelStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await joinClassroom(code);
      onClose(); // Close modal
      navigate("/home"); // Redirect after join
    } catch (error) {
      console.error("Error joining classroom:", error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl relative">
        <h2 className="text-2xl font-semibold mb-4 text-center">🔐 Join Classroom</h2>
        <p className="text-gray-600 text-center mb-6">Enter your 6-digit classroom code</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Join
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinClassroomModal;
