import React, { useState } from "react";
import { useClassroomAndChannelStore } from "../store/ClassroomStore";
import { useNavigate } from "react-router-dom";

const AddClassroomModal = ({ onClose }) => {
  const [classroomName, setClassroomName] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const { addClassroom } = useClassroomAndChannelStore();
  const navigate = useNavigate();

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (validateFile(selectedFile)) {
      const base64 = await convertToBase64(selectedFile);
      setFile(base64);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const validateFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setError(null);
      return true;
    } else {
      setError("Only image files are allowed!");
      return false;
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await addClassroom(classroomName, file);
      onClose(); // Close the modal after success
      navigate("/home");
    } catch (err) {
      console.log("Something went wrong: ", err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 relative">
        <h2 className="text-2xl font-semibold mb-4 text-center">Create Classroom</h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="text-center">
            <label
              htmlFor="fileInput"
              className="block w-full border-2 border-dashed border-purple-500 text-purple-600 rounded-lg p-4 cursor-pointer hover:bg-purple-50 transition"
            >
              {file ? "Image Selected" : "Click to Upload or Drag an Image"}
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {preview && (
              <div className="mt-4 flex justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-[150px] rounded-md"
                />
              </div>
            )}
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </div>

          <input
            type="text"
            placeholder="Classroom Name"
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={classroomName}
            onChange={(e) => setClassroomName(e.target.value)}
          />

          <div className="flex justify-between gap-2">
            <button
              type="button"
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-full transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-full transition"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClassroomModal;
