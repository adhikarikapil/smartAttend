import React, { useState } from "react";
import "./JoinClassroomStyles.css";
import { joinClassroom } from "../../../services/classroomService";

function JoinClassroom({ closeModal, onClassroomJoined, onJoined }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
    code: "",
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const handleChange = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const closeJoinModal = () => {
    setTimeout(() => {
      closeModal();
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertMessage("");
    setAlertType("");

    const response = await joinClassroom(formData.code);

    if (response.message) {
      onJoined();
      setFormData({
        code: "",
      });
      setAlertMessage("Classroom Joined Successfully!!!");
      setAlertType("success");
      setTimeout(() => {
        onClassroomJoined();
      }, 1000);
    } else {
      setAlertMessage(response.error || "Cannot Join Classroom!!!");
      setAlertType("error");
    }
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          {alertMessage && (
            <div className={`modal-alert-message ${alertType}`}>
              {alertMessage}
            </div>
          )}
          <div className="modal-header">
            <h2>Join Class</h2>
            <button className="close-button" onClick={() => closeModal()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <form className="join-classroom-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="code">Class Code</label>
              <input
                type="text"
                id="code"
                name="code"
                placeholder="Enter 6-character class code"
                maxLength="6"
                value={formData.code}
                onChange={handleChange}
                required
                className="code-input"
              />
              <span className="code-hint">
                Enter the 6-character code provided by your teacher
              </span>
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => closeModal()}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  onClick={() => closeJoinModal()}
                >
                  Join Class
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default JoinClassroom;
