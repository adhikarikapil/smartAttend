import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./DashboardStyles.css";
import Navbar from "../Navbar/Navbar";
import { useAuth } from "../../../context/AuthContext";
import CreateClassroom from "../../classroom/CreateClassroom/CreateClassroom";
import JoinClassroom from "../../classroom/JoinClassroom/JoinClassroom";
import ListStudent from "../../classroom/ListStudent/ListStudent";
import {
  classroomList,
  dismissClassroom,
  leaveClassroom,
  listStudent,
} from "../../../services/classroomService";

function Dashboard() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [currentClassroom, setCurrentClassroom] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [currentStudent, setCurrentStudent] = useState([]);
  const [isStudentsModalOpen, setIsStudentModalOpen] = useState(false);
  const [currentClassroomId, setCurrentClassroomId] = useState();
  const [studentRemoved, setStudentRemoved] = useState(false);
  const [studentJoined, setStudentJoined] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [unseenCount, setunseenCount] = useState({});

  const [isOpen, setIsOpen] = useState(false);

  const { isFirstLogin } = location.state || { isFirstLogin: "" };
  useEffect(() => {
    if (isFirstLogin) {
      setShowWelcome(true);
    }
  }, []);

  const listClassroomGrid = async () => {
    const response = await classroomList();
    if (response && Array.isArray(response.classroom)) {
      setCurrentClassroom(response.classroom);
    } else {
      setCurrentClassroom(response.classroom ?? []);
    }
  };
  useEffect(() => {
    listClassroomGrid();
  }, [studentJoined, studentRemoved]);

  const leaveClass = async (classroomId) => {
    setAlertMessage("");
    setAlertType("");

    const response = await leaveClassroom(classroomId);

    if (response.message) {
      listClassroomGrid();
      setAlertMessage("Classroom Left Successfully!!");
      setAlertType("success");
    } else {
      setAlertMessage(response.error || "Cannot leave Classroom!!");
      setAlertType("error");
    }

    setTimeout(() => {
      setAlertMessage("");
    }, 1000);
  };
  const dismissClass = async (classroomId) => {
    setAlertMessage("");
    setAlertType("");

    const response = await dismissClassroom(classroomId);

    if (response.message) {
      setAlertMessage("Classroom Dissmissed Successfully!!");
      setAlertType("success");
      setTimeout(() => {
        listClassroomGrid();
      }, 1000);
    } else {
      setAlertMessage(response.error || "Cannot Dismiss Classroom!!");
      setAlertType("error");
    }

    setTimeout(() => {
      setAlertMessage("");
    }, 1500);
  };

  const students = async (classroomId) => {
    const response = await listStudent(classroomId);

    if (response && Array.isArray(response.user)) {
      setCurrentStudent(response.user);
    }
  };

  const fetchUnseenCounts = async () => {
    const count = {};
    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`${API_URL}/notice/unseen`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      data.forEach(({ classroomId, unseenCount }) => {
        count[classroomId] = unseenCount;
      });
      setunseenCount(count);
    } catch (error) {
      setAlertMessage("Error fetching unseen notice count: ", error);
      setAlertType("error");
    }
  };

  useEffect(() => {
    if (user?.role === "student" && currentClassroom.length > 0) {
      fetchUnseenCounts();
    }
  }, [currentClassroom, user?.role]);

  useEffect(() => {
    if (user?.role === "student") {
      const interval = setInterval(() => {
        fetchUnseenCounts();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user?.role]);

  const handleNoticeClick = async (classroom) => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(`${API_URL}/notice/seen`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          classroomId: classroom.classroomId,
        }),
      });
      if (response.ok) {
        setunseenCount((prev) => ({ ...prev, [classroom.classroomId]: 0 }));

        navigate("/notice", { state: { user, classroom } });
      }
    } catch (err) {
      setAlertMessage("Failed to mark notices as seen: ", err);
      setAlertType("error");
    }
  };

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
          {alertMessage && (
            <div className={`leave-alert-message ${alertType}`}>
              {alertMessage}
            </div>
          )}
        </div>
        <div className="classes-grid">
          {currentClassroom.map((classroom) => (
            <div
              key={classroom.classroomId}
              className="class-card"
              onClick={() => {
                navigate("/take-attendance", { state: { classroom } });
              }}
            >
              <div className="class-card-header">
                <h3>{classroom.name}</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/notice", { state: { user, classroom } });
                  }}
                >
                  Notice
                </button>
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
                  <span>{classroom.code}</span>
                </div>
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
                  No. of Students:
                  <span>{classroom.members}</span>
                </div>
                <div className="class-info-item description">
                  <h2>Description:</h2>
                  <span>{classroom.description}</span>
                </div>
              </div>
              <div className="class-card-footer">
                <button
                  className="class-action-btn attendance"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentClassroomId(Number(classroom.classroomId));
                    students(classroom.classroomId);
                    setTimeout(() => {
                      setIsStudentModalOpen(true);
                    }, 500);
                  }}
                >
                  Manage Class
                </button>
                <button
                  className="class-action-btn view"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/attendance", { state: { classroom } });
                  }}
                >
                  View Attendance
                </button>
                <button
                  className="class-action-btn leave"
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissClass(classroom.classroomId);
                  }}
                >
                  Dismiss Class
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const StudentDashboard = () => {
    return (
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
              {alertMessage && (
                <div className={`leave-alert-message ${alertType}`}>
                  {alertMessage}
                </div>
              )}
            </div>
          </div>
          <div className="classes-grid">
            {isFirstLogin && (
              <div>As you are First Here Register your face</div>
            )}
            {currentClassroom.map((classroom) => (
              <div key={classroom.classroomId} className="class-card">
                <div className="class-card-header">
                  <h3>{classroom.name}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNoticeClick(classroom);
                    }}
                  >
                    Notice
                    {unseenCount[classroom.classroomId] > 0 && (
                      <span className="unseen-badge">
                        {unseenCount[classroom.classroomId]}
                      </span>
                    )}
                  </button>
                </div>
                <div className="class-card-body">
                  <div className="class-info-item">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {" "}
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
                  <button
                    className="class-action-btn attendance"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/attendance", { state: { classroom } });
                    }}
                  >
                    View Attendance
                  </button>
                  <button className="class-action-btn view">
                    View Material
                  </button>
                  <button
                    className="class-action-btn leave"
                    onClick={() => leaveClass(classroom.classroomId)}
                  >
                    Leave
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  return (
    <div
      className="dashboard-container"
      onClick={() => {
        setIsOpen(false);
        setShowWelcome(false);
      }}
    >
      {showWelcome && (
        <div className="welcome-overlay">
          <div className="welcome-modal">
            <div className="webcome-header">
              <h2>Welcome to SmartAttend! 👋</h2>
            </div>
            <div className="welcom-content">
              <div className="paragraph">
                We're excited to have you on board! To get started with
                SmartAttend, you'll need to register your face for attendace
                tracking.
                <div className="welcome-steps">
                  <h3>Next Steps:</h3>
                  <ol>
                    <li>Click on your profile picture in the top right.</li>
                    <li>Select "Register" from your the menu.</li>
                    <li>Follow the instructions to register your face.</li>
                  </ol>
                </div>
              </div>
            </div>
            <button
              className="welcome-button"
              onClick={() => {
                setShowWelcome(false);
              }}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
      <header
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      </header>
      <main>
        {user?.role === "teacher" ? <TeacherDashboard /> : <StudentDashboard />}
        {isCreateModalOpen && (
          <CreateClassroom
            closeModal={() => setIsCreateModalOpen(false)}
            onClassroomCreated={listClassroomGrid}
          />
        )}
        {isJoinModalOpen && (
          <JoinClassroom
            closeModal={() => setIsJoinModalOpen(false)}
            onClassroomJoined={listClassroomGrid}
            onJoined={() => setStudentJoined((prev) => !prev)}
          />
        )}
        {isStudentsModalOpen && (
          <ListStudent
            existingClassroomId={currentClassroomId}
            existingStudents={currentStudent}
            closeModal={() => setIsStudentModalOpen(false)}
            listStudentTable={students}
            onStudentRemoved={() => setStudentRemoved((prev) => !prev)}
          />
        )}
      </main>
    </div>
  );
}

export default Dashboard;
