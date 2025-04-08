import React, { useState } from "react";
import "./CreateClassroomStyles.css";

function CreateClassroom() {
  const [formData, setFormData] = useState({
    className: "",
    code: "",
    description: "",
  });

  const handleChange = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generateRandomCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomCode = "";
    for (let i = 0; i < 6; i++) {
      randomCode += characters.charAt(Math.floor(Math.random() * 6));
    }

    setFormData((prevData) => ({
      ...prevData,
      code: randomCode,
    }));
  };

  return (
    <div>
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Create New Class</h2>
            <button className="close-button">
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
          <form action="submit" className="create-class-form">
            <div className="form-group">
              <label htmlFor="className">Class Name</label>
              <input
                type="text"
                id="className"
                name="className"
                value={formData.className}
                placeholder="e.g., COMP"
                required
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="code">Class Code</label>
              <div className="form-group-code">
                <input
                  className="code-input"
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  placeholder="e.g., ABC123"
                  maxLength="6"
                  required
                  onChange={handleChange}
                />
                <button onClick={generateRandomCode}>Generate Code</button>
              </div>
              <span className="code-hint">
                Enter a 6-character code for students to join the class
              </span>
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                id="description"
                value={formData.description}
                placeholder="Enter class description.."
                rows="5"
                onChange={handleChange}
              />
            </div>
            <div className="form-actions">
              <button type="button" className="cancel-btn">
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                Create Class
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateClassroom;
