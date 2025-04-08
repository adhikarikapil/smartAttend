import React, { useEffect, useState } from "react";
import "./ClassesStyles.css";
import Navbar from "../Navbar/Navbar";
import { useAuth } from "../../../context/AuthContext";
import CreateClassroom from "../../classroom/CreateClassroom/CreateClassroom";

function Classes() {
  const { user } = useAuth();
  // const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  // const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  // const [selectedClass, setSelectedClass] = useState(null);
  // const [joinCode, setJoinCode] = useState("");
  // const [newClass, setNewClass] = useState({
  //   className: "",
  //   classCode: "",
  //   schedule: "",
  //   startTime: "",
  //   endTime: "",
  //   description: "",
  // });

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   if (name === "classCode") {
  //     setNewClass((prev) => ({
  //       ...prev,
  //       [name]: value.toUpperCase(),
  //     }));
  //   } else {
  //     setNewClass((prev) => ({
  //       ...prev,
  //       [name]: value,
  //     }));
  //   }
  // };


  const handleJoinCodeChange = (e) => {
    setJoinCode(e.target.value.toUpperCase());
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to create the class
    console.log("Creating new class:", newClass);
    setIsCreateModalOpen(false);
    setNewClass({
      className: "",
      classCode: "",
      schedule: "",
      startTime: "",
      endTime: "",
      description: "",
    });
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to join the class
    console.log("Joining class with code:", joinCode);
    setIsJoinModalOpen(false);
    setJoinCode("");
  };

  const handleLeaveClass = (classInfo) => {
    setSelectedClass(classInfo);
    setIsLeaveModalOpen(true);
  };

  const confirmLeaveClass = () => {
    // Here you would typically make an API call to leave the class
    console.log("Leaving class:", selectedClass);
    setIsLeaveModalOpen(false);
    setSelectedClass(null);
  };

  const JoinClassModal = () => (
    <div className="modal-overlay" onClick={() => setIsJoinModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Join Class</h2>
          <button
            className="close-button"
            onClick={() => setIsJoinModalOpen(false)}
          >
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
        <form onSubmit={handleJoinSubmit} className="create-class-form">
          <div className="form-group">
            <label htmlFor="joinCode">Class Code</label>
            <input
              type="text"
              id="joinCode"
              value={joinCode}
              onChange={handleJoinCodeChange}
              placeholder="Enter 6-character class code"
              maxLength="6"
              required
              className="code-input"
            />
            <span className="code-hint">
              Enter the 6-character code provided by your teacher
            </span>
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setIsJoinModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Join Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const CreateClassModal = () => (
    <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Class</h2>
          <button
            className="close-button"
            onClick={() => setIsCreateModalOpen(false)}
          >
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
        <form onSubmit={handleCreateSubmit} className="create-class-form">
          <div className="form-group">
            <label htmlFor="className">Class Name</label>
            <input
              type="text"
              id="className"
              name="className"
              value={newClass.className}
              onChange={handleInputChange}
              placeholder="e.g., Advanced Mathematics"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="classCode">Class Code</label>
            <input
              type="text"
              id="classCode"
              name="classCode"
              value={newClass.classCode}
              onChange={handleInputChange}
              placeholder="e.g., ABC123"
              maxLength="6"
              required
              className="code-input"
            />
            <span className="code-hint">
              Enter a 6-character code for students to join the class
            </span>
          </div>
          <div className="form-group">
            <label htmlFor="schedule">Schedule (Days)</label>
            <input
              type="text"
              id="schedule"
              name="schedule"
              value={newClass.schedule}
              onChange={handleInputChange}
              placeholder="e.g., Mon, Wed, Fri"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={newClass.description}
              onChange={handleInputChange}
              placeholder="Enter class description..."
              rows="3"
            />
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Create Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const TeacherClasses = () => (
    <div className="classes-content">
      <div className="classes-header">
        <h1>My Classes</h1>
        <button
          className="create-class-btn"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="add-icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create New Class
        </button>
      </div>

      <div className="classes-grid">
        {[1, 2, 3, 4].map((_, index) => (
          <div key={index} className="class-card">
            <div className="class-card-header">
              <h3>Computer Science {index + 1}</h3>
              <span className="student-count">32 Students</span>
            </div>
            <div className="class-card-body">
              <div className="class-info-item">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>Schedule: Mon, Wed, Fri</span>
              </div>
              <div className="class-info-item class-code-display">
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
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
                <span>Class Code: ABC{index + 123}</span>
              </div>
            </div>
            <div className="class-card-footer">
              <button className="class-action-btn attendance">
                Take Attendance
              </button>
              <button className="class-action-btn manage">Manage Class</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const StudentClasses = () => (
    <div className="classes-content">
      <div className="classes-header">
        <h1>My Classes</h1>
        <div className="student-header-actions">
          <div className="classes-filter">
            <select className="filter-select">
              <option value="all">All Classes</option>
            </select>
          </div>
          <button
            className="join-class-btn"
            onClick={() => setIsJoinModalOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="add-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            Join Class
          </button>
        </div>
      </div>

      <div className="classes-grid">
        {[1, 2, 3, 4].map((_, index) => (
          <div key={index} className="class-card">
            <div className="class-card-header">
              <h3>Mathematics {index + 1}</h3>
            </div>
            <div className="class-card-body">
              <div className="class-info-item">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>Prof. John Smith</span>
              </div>
              <div className="class-info-item class-code-display">
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
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
                <span>Class Code: ABC{index + 123}</span>
              </div>
            </div>
            <div className="class-card-footer">
              <button className="class-action-btn view">View Details</button>
              <button className="class-action-btn materials">
                Class Materials
              </button>
              <button
                className="class-action-btn leave"
                onClick={() =>
                  handleLeaveClass({
                    id: index,
                    name: `Mathematics ${index + 1}`,
                  })
                }
              >
                Leave Class
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const LeaveClassModal = () => (
    <div className="modal-overlay" onClick={() => setIsLeaveModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Leave Class</h2>
          <button
            className="close-button"
            onClick={() => setIsLeaveModalOpen(false)}
          >
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
        <div className="leave-class-content">
          <div className="warning-message">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="warning-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p>
              Are you sure you want to leave{" "}
              <strong>{selectedClass?.name}</strong>?
            </p>
            <p className="warning-details">
              This action cannot be undone. You'll need a new class code to
              rejoin.
            </p>
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setIsLeaveModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="leave-btn"
              onClick={confirmLeaveClass}
            >
              Leave Class
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    // <div className="classes-container">
    //   <header>
    //     <Navbar />
    //   </header>
    //   <main>
    //     {user?.role === "teacher" ? <TeacherClasses /> : <StudentClasses />}
    //   </main>
    //   {isCreateModalOpen && <CreateClassModal />}
    //   {isJoinModalOpen && <JoinClassModal />}
    //   {isLeaveModalOpen && <LeaveClassModal />}
    // </div>
    <>
      <CreateClassroom />
    </>
  );
}

export default Classes;
