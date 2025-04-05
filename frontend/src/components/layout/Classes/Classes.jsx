import React, { useState } from "react";
import "./ClassesStyles.css";
import Navbar from "../Navbar/Navbar";
import { useAuth } from "../../../context/AuthContext";

function Classes() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClass, setNewClass] = useState({
    className: "",
    classCode: "",
    schedule: "",
    startTime: "",
    endTime: "",
    description: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'classCode') {
      setNewClass(prev => ({
        ...prev,
        [name]: value.toUpperCase()
      }));
    } else {
      setNewClass(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to create the class
    console.log("Creating new class:", newClass);
    setIsModalOpen(false);
    setNewClass({
      className: "",
      classCode: "",
      schedule: "",
      startTime: "",
      endTime: "",
      description: ""
    });
  };

  const TeacherClasses = () => (
    <div className="classes-content">
      <div className="classes-header">
        <h1>My Classes</h1>
        <button className="create-class-btn" onClick={() => setIsModalOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="add-icon">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Mon, Wed, Fri</span>
              </div>
              <div className="class-info-item">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>9:00 AM - 10:30 AM</span>
              </div>
            </div>
            <div className="class-card-footer">
              <button className="class-action-btn attendance">Take Attendance</button>
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
        <div className="classes-filter">
          <select className="filter-select">
            <option value="all">All Classes</option>
            <option value="active">Active Classes</option>
            <option value="completed">Completed Classes</option>
          </select>
        </div>
      </div>

      <div className="classes-grid">
        {[1, 2, 3, 4].map((_, index) => (
          <div key={index} className="class-card">
            <div className="class-card-header">
              <h3>Mathematics {index + 1}</h3>
              <span className={`class-badge ${index % 2 === 0 ? 'active' : 'completed'}`}>
                {index % 2 === 0 ? 'Active' : 'Completed'}
              </span>
            </div>
            <div className="class-card-body">
              <div className="class-info-item">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Prof. John Smith</span>
              </div>
              <div className="class-info-item">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Tue, Thu</span>
              </div>
              <div className="class-info-item">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>11:00 AM - 12:30 PM</span>
              </div>
              <div className="class-info-item">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <span>Attendance: 95%</span>
              </div>
            </div>
            <div className="class-card-footer">
              <button className="class-action-btn view">View Details</button>
              <button className="class-action-btn materials">Class Materials</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="classes-container">
      <header>
        <Navbar />
      </header>
      <main>
        {user?.role === "teacher" ? <TeacherClasses /> : <StudentClasses />}
      </main>
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Class</h2>
              <button className="close-button" onClick={() => setIsModalOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="create-class-form">
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
                <span className="code-hint">Enter a 6-character code for students to join the class</span>
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
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="startTime">Start Time</label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={newClass.startTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="endTime">End Time</label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={newClass.endTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
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
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Classes;