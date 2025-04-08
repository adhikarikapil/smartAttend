import React from "react";
import "./DashboardStyles.css";
import Navbar from "../Navbar/Navbar";
import { useAuth } from "../../../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  const TeacherDashboard = () => (
    <>
      <div className="classes-content">
        <div className="classes-header">
          <h1>My Classes</h1>
          <button className="create-class-btn">
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
          {/* From backend you make a list */}
        </div>
      </div>
    </>
  );

  const StudentDashboard = () => (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        <p>Welcome back, {user.firstName}!</p>
      </div>
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon attendance">
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <div className="stat-info">
            <h3>Attendance Rate</h3>
            <p className="stat-number">92%</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon classes">
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div className="stat-info">
            <h3>Total Classes</h3>
            <p className="stat-number">6</p>
          </div>
        </div>
      </div>
      <div className="dashboard-sections">
        <div className="section upcoming-classes">
          <h2>Today's Schedule</h2>
          <div className="class-list">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="class-item">
                <div className="class-info">
                  <h4>Mathematics {index + 1}</h4>
                  <p>Room 203 • {9 + index}:00 AM</p>
                </div>
                <span
                  className={`class-status ${
                    index === 0
                      ? "completed"
                      : index === 1
                      ? "ongoing"
                      : "upcoming"
                  }`}
                >
                  {index === 0
                    ? "Completed"
                    : index === 1
                    ? "Ongoing"
                    : "Upcoming"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <header>
        <Navbar />
      </header>
      <main>
        {user?.role === "teacher" ? <TeacherDashboard /> : <StudentDashboard />}
      </main>
    </div>
  );
}

export default Dashboard;
