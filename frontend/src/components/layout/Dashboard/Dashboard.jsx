import React from "react";
import "./DashboardStyles.css";
import Navbar from "../Navbar/Navbar";
import { useAuth } from "../../../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  const TeacherDashboard = () => (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1>Teacher Dashboard</h1>
        <p>Welcome back, {user.firstName}!</p>
      </div>
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon students">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div className="stat-info">
            <h3>Total Students</h3>
            <p className="stat-number">150</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon classes">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="stat-info">
            <h3>Active Classes</h3>
            <p className="stat-number">8</p>
          </div>
        </div>
      </div>
      <div className="dashboard-sections">
        <div className="section recent-classes">
          <h2>Recent Classes</h2>
          <div className="class-list">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="class-item">
                <div className="class-info">
                  <h4>Computer Science {index + 1}</h4>
                  <p>Room 101 • 9:00 AM</p>
                </div>
                <button className="class-action">Take Attendance</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div className="stat-info">
            <h3>Attendance Rate</h3>
            <p className="stat-number">92%</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon classes">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="stat-info">
            <h3>Total Classes</h3>
            <p className="stat-number">6</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon status">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-info">
            <h3>Today's Status</h3>
            <p className="stat-number">Present</p>
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
                <span className={`class-status ${index === 0 ? 'completed' : index === 1 ? 'ongoing' : 'upcoming'}`}>
                  {index === 0 ? 'Completed' : index === 1 ? 'Ongoing' : 'Upcoming'}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="section attendance-history">
          <h2>Attendance History</h2>
          <div className="attendance-chart">
            <div className="chart-placeholder">
              <div className="bar" style={{ height: '95%' }}></div>
              <div className="bar" style={{ height: '88%' }}></div>
              <div className="bar" style={{ height: '92%' }}></div>
              <div className="bar" style={{ height: '85%' }}></div>
              <div className="bar" style={{ height: '90%' }}></div>
            </div>
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
