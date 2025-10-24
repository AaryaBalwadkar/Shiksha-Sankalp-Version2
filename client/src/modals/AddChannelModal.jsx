import React, { useState } from "react";
import { useClassroomAndChannelStore } from "@/store/ClassroomStore";

const AddChannelModal = ({ classroomId, onClose }) => {
  const [channelName, setChannelName] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");

  const { addChannel } = useClassroomAndChannelStore();

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!classroomId) {
      setError("Invalid classroom ID");
      return;
    }
    try {
      await addChannel(classroomId, channelName, isChecked);
      // Close modal - parent will remain on the same classroom page
      onClose();
    } catch (err) {
      console.log("Something went wrong: ", err.message || err);
      setError(err.response?.data?.message || "Failed to create channel");
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[80]"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-[400px] min-h-[300px] bg-white rounded-xl shadow-xl flex items-center justify-center border border-gray-200 backdrop-blur-sm">
        <div className="w-full p-6">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">✕</button>
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            Create Channel
          </h2>

          {error && <div className="text-red-600 text-sm mb-4 text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-5">
            {/* Channel Name */}
            <input
              type="text"
              placeholder="Channel Name"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className="w-full h-12 px-5 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder-gray-400"
            />

            {/* Lock Channel Checkbox */}
            <label className="flex items-center text-gray-700 text-base font-medium">
              <span>Do you want to lock this channel?</span>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="ml-3 h-5 w-5 accent-indigo-600 cursor-pointer"
              />
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-[340px] h-12 bg-[#21264d] text-white font-bold text-lg rounded-full flex items-center justify-center gap-2 transition-transform duration-200 hover:scale-105 hover:opacity-80"
            >
              Create Channel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddChannelModal;
