import React, { useState } from "react";
import { useClassroomAndChannelStore } from "../store/ClassroomStore";

const AddClassroomModal = ({ onClose }) => {
  const [classroomName, setClassroomName] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const { addClassroom } = useClassroomAndChannelStore();

  // Handle file change and preview generation
  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (validateFile(selectedFile)) {
      const base64 = await convertToBase64(selectedFile);
      setFile(base64);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // Validate file type
  const validateFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setError(null);
      return true;
    } else {
      setError("Only image files are allowed!");
      return false;
    }
  };

  // Convert file to Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle form submit
  const onSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      await addClassroom(classroomName, file);
      // close modal after successful creation; parent can refresh list if needed
      if (onClose) onClose();
    } catch (error) {
      console.log("Something went wrong: ", error.message || error);
      setError(error.response?.data?.message || "Failed to create classroom");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[80]"
      onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}
    >
      <div className="relative w-[400px] min-h-[500px] bg-white rounded-xl shadow-2xl border border-white/50 border-r-white/20 border-b-white/20 backdrop-blur-sm flex overflow-hidden">
        <div className="relative w-full p-6 flex flex-col items-center justify-center">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">✕</button>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Create Classroom
          </h2>

          <form
            className="flex flex-col items-center w-full space-y-5"
            onSubmit={onSubmit}
          >
            {/* Upload Section */}
            <div className="w-72 text-center">
              <div
                className="border-2 border-dashed border-violet-500 text-violet-500 rounded-lg p-6 mb-3 cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
                onClick={() => document.getElementById("fileInput").click()}
              >
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="fileInput" className="font-semibold cursor-pointer">
                  {file ? "Image Selected" : "Drag & Drop or Click to Upload"}
                </label>
              </div>

              {error && (
                <p className="text-red-500 text-sm font-semibold mt-1">{error}</p>
              )}

              {preview && (
                <div className="flex justify-center mt-3">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-w-[60%] rounded-lg shadow-md"
                  />
                </div>
              )}
            </div>

            {/* Input for Classroom Name */}
            <div className="w-full flex justify-center">
              <input
                type="text"
                className="w-80 h-12 px-5 rounded-full shadow-md text-gray-700 text-base outline-none bg-gray-100 focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
                placeholder="Classroom Name"
                value={classroomName}
                onChange={(e) => setClassroomName(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-80 py-3 bg-[#21264d] text-white font-bold text-lg rounded-full transition-all duration-300 hover:scale-105 hover:opacity-80"
            >
              Create Classroom
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddClassroomModal;
