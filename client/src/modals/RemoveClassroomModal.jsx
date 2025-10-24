import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useClassroomAndChannelStore } from "../store/ClassroomStore";

const RemoveClassroomModal = () => {
  const location = useLocation();
  const classroomId = location.state?.classroomId;
  const { removeClassroom } = useClassroomAndChannelStore();
  const navigate = useNavigate();

  const handleRemove = async (e) => {
    e.preventDefault();
    try {
      await removeClassroom(classroomId);
      navigate("/home");
    } catch (error) {
      console.error("Error in handling delete classroom");
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center text-center bg-transparent">
      <div className="relative w-[400px] min-h-[270px] rounded-lg bg-white shadow-xl border border-white/50 border-r-white/20 border-b-white/20 backdrop-blur-sm flex overflow-hidden">
        <div className="relative w-full p-6 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Unsubscribe</h2>
          <p className="text-red-600 font-medium text-base mb-6">
            Do you really want to unsubscribe from this classroom?
          </p>
          <form
            className="w-full flex justify-center"
            onSubmit={handleRemove}
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

export default RemoveClassroomModal;
