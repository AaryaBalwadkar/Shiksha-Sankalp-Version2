import React, { useState } from "react";
import './DeleteClassroomAndChannelModal.css'
import { useClassroomAndChannelStore } from "../../store/ClassroomStore.js";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

const DeleteClassroomModal = () => {
  const location = useLocation()
  const id = location.state?.id;
  const value = location.state?.value;
  const [code, setCode] = useState("");

  const { deleteClassroom, deleteChannel } = useClassroomAndChannelStore();
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.preventDefault()
    try {
      if (value === "channel") {
        await deleteChannel(id);
        navigate(`/home/${location.state?.classroomId}`);
        return;
      } else if (value === "classroom") {
        if (!code) {
          alert("Please enter the classroom code to confirm deletion.");
          return;
        }
        await deleteClassroom(id, code);
        navigate("/classroom");
      }
    } catch (error) {
      console.log("Error in handling delete classroom")
    }
  }

  return (
    <div className="main">
      <div className="addClassroom">
        <div className="container">
          <div className="title">Confirm Deletion</div>
          <div className="error-message">Do you really want to delete?</div>
          <form className="form-box login-form" onClick={handleDelete}>
            <button type="submit" className="inputs submit-btn">
              Confirm Deletion
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeleteClassroomModal;