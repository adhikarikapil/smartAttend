import React, { useEffect, useState } from "react";
import "./DashboardStyles.css";
import Navbar from "../Navbar/Navbar";
import { useAuth } from "../../../context/AuthContext";
import CreateClassroom from "../../classroom/CreateClassroom/CreateClassroom";
import JoinClassroom from "../../classroom/JoinClassroom/JoinClassroom";
import { listClassroom } from "../../../services/classroomService";

function Dashboard() {
  const { user } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [currentClassroom, setCurrentClassroom] = useState([]);

  const listClassroomGrid = async () => {
    const response = await listClassroom();
    if (response && response.classroom) {
      setCurrentClassroom(response.classroom);
    }
    console.log(response.classroom);
  };

  useEffect(() => {
    listClassroomGrid();
  }, []);

  const TeacherDashboard = () => (
    <>
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
          {currentClassroom.map((classroom) => (
            <div key={classroom.classroomId} className="class-card">
              <div className="class-card-header">
                <h3>{classroom.name}</h3>
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
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                  <span>
                    {classroom.code}
                  </span>
                </div>
                <div className="class-info-item description">
                  <h2>Description:</h2>
                  <span>{classroom.description}</span>
                </div>
              </div>
              <div className="class-card-footer">
                <button className="class-action-btn attendance">
                  Manage Class
                </button>
                <button className="class-action-btn view">
                  Upload Material
                </button>
                <button className="class-action-btn leave">
                  Dismiss Class
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const StudentDashboard = () => (
    <>
      <div className="classes-content">
        <div className="classes-header">
          <h1>My Classes</h1>
          <div className="student-header-actions">
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
          {currentClassroom.map((classroom) => (
            <div key={classroom.classroomId} className="class-card">
              <div className="class-card-header">
                <h3>{classroom.name}</h3>
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
                  <span>
                    {classroom.creatorFirstName} {classroom.creatorSecondName}
                  </span>
                </div>
                <div className="class-info-item description">
                  <h2>Description:</h2>
                  <span>{classroom.description}</span>
                </div>
              </div>
              <div className="class-card-footer">
                <button className="class-action-btn attendance">
                  Take Attendance
                </button>
                <button className="class-action-btn view">View Material</button>
                <button className="class-action-btn leave">Leave</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="dashboard-container">
      <header>
        <Navbar />
      </header>
      <main>
        {user?.role === "teacher" ? <TeacherDashboard /> : <StudentDashboard />}
        {isCreateModalOpen && (
          <CreateClassroom closeModal={() => setIsCreateModalOpen(false)} />
        )}
        {isJoinModalOpen && (
          <JoinClassroom closeModal={() => setIsJoinModalOpen(false)} />
        )}
      </main>
    </div>
  );
}

export default Dashboard;
