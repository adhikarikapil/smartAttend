import React, { useState } from "react";
import "./DashboardStyles.css";
import Navbar from "../Navbar/Navbar";
import { useAuth } from "../../../context/AuthContext";
import CreateClassroom from "../../classroom/CreateClassroom/CreateClassroom";
import JoinClassroom from "../../classroom/JoinClassroom/JoinClassroom";

function Dashboard() {
  const { user } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

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
        <div className="classes-grid">{/* From backend you make a list */}</div>
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
        <div className="classes-gird">
          {/* from backend you make a list of the classroom  */}
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
