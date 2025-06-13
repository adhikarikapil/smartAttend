import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../layout/Navbar/Navbar";
import { useAuth } from "../../../context/AuthContext";
import "./AttendanceReportStyles.css";

function AttendanceReport() {
  const navigate = useNavigate();
  const location = useLocation();
  const { classroom } = location.state || { classroom: [] };

  const { user } = useAuth();
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [groupedAttendance, setGroupedAttendance] = useState({});
  const [remarkModal, setRemarkModal] = useState(false);
  const [formData, setFormData] = useState({
    attendanceId: "",
    remark: "",
  });

  const handleFormChange = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setAlertMessage("");
    setAlertType("");

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/attendance/remark`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            attendanceId: formData.attendanceId,
            remark: formData.remark,
          }),
        }
      );
      if (!response.ok) {
        setAlertMessage("Cannot add remark", response.message);
        setAlertType("error");
      }

      setAlertMessage("Remark added successfully.");
      setAlertType("success");
      fetchAttendance();

      setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
      }, 2000);
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  const fetchAttendance = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/attendance/view?classroomId=${
          classroom.classroomId
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setAlertMessage("Failed to fetch Attendance: " + data.error);
        setAlertType("error");
      }
      setAttendanceRecords(data);
    } catch (err) {
      console.error("Error: ", err.message);
      setAlertMessage("Error fetching attendance data");
      setAlertType("error");
    }
  };
  useEffect(() => {
    fetchAttendance();
  }, [classroom.classroomId]);

  useEffect(() => {
    const groupAndSortAttendance = () => {
      const grouped = attendanceRecords.reduce((acc, record) => {
        const date = record.date ? record.date.split("T")[0] : "Invalid Date";
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(record);
        return acc;
      }, {});

      const sortedDates = Object.keys(grouped).sort(
        (a, b) => new Date(b) - new Date(a)
      );
      const sortedGrouped = {};
      sortedDates.forEach((date) => {
        sortedGrouped[date] = grouped[date];
      });
      setGroupedAttendance(sortedGrouped);
    };

    if (attendanceRecords.length > 0) {
      groupAndSortAttendance();
    }
  }, [attendanceRecords]);

  return (
    <>
      <Navbar />
      <div className="attendance-container">
        {alertMessage && (
          <div className={`attendance-alert-message ${alertType}`}>
            {alertMessage}
          </div>
        )}
        <div className="attendance-header">
          <div className="header-content">
            <h3>{classroom?.name || "Class Attendance"}</h3>
            <div className="header-stats">
              <span className="stat-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  width="16"
                  height="16"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Total Students: {attendanceRecords.length}
              </span>
            </div>
          </div>
        </div>
        <div className="table-container">
          {Object.keys(groupedAttendance).length > 0 ? (
            Object.keys(groupedAttendance).map((date) => {
              const dailyRecords = groupedAttendance[date];
              const presentCount = dailyRecords.filter(
                (r) => r.status && r.status.toLowerCase() === "present"
              ).length;
              const absentCount = dailyRecords.length - presentCount;

              return (
                <div key={date} className="table-section">
                  <h4 className="date-header">
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
                    {date}
                    <span>
                      Present: {presentCount} | Absent: {absentCount}
                    </span>
                  </h4>
                  <table className="table">
                    <thead className="table-head">
                      <tr>
                        <th>Roll No</th>
                        <th>Student Name</th>
                        <th>Status</th>
                        <th>Remark</th>
                        {user?.role === "teacher" ? <th>Actions</th> : ""}
                      </tr>
                    </thead>
                    <tbody>
                      {dailyRecords.map((record, index) => (
                        <tr key={`${record.studentId}-${record.date}-${index}`}>
                          <td>{record.rollNo}</td>
                          <td>{record.studentName}</td>
                          <td>
                            <span
                              className={`status-badge ${
                                record.status ? record.status.toLowerCase() : ""
                              }`}
                            >
                              {record.status &&
                              record.status.toLowerCase() === "present" ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  width="14"
                                  height="14"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  width="14"
                                  height="14"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              )}
                              {record.status}
                            </span>
                          </td>
                          <td>{record.remark ? record.remark : "NA"}</td>
                          {user?.role === "teacher" ? (
                            <td>
                              <button
                                className="remark"
                                onClick={() => {
                                  setRemarkModal(true);
                                  setFormData({
                                    attendanceId: record.attendanceId,
                                    remark: record.remark || "",
                                  });
                                }}
                              >
                                {record.remark ? "Edit Remark" : "Add Remark"}
                              </button>
                            </td>
                          ) : (
                            ""
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })
          ) : (
            <p className="no-records">
              No attendance records found for this classroom.
            </p>
          )}
        </div>
        <button
          className="dashboard-btn"
          onClick={() => {
            navigate("/dashboard");
          }}
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
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Go to Dashboard
        </button>
      </div>
      {remarkModal && (
        <>
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{formData.remark ? "Edit Remark" : "Add Remark"}</h3>
                <textarea
                  name="remark"
                  value={formData.remark}
                  onChange={handleFormChange}
                  rows="4"
                  cols="50"
                />
                <div className="modal-actions">
                  <button
                    onClick={() => {
                      handleSubmit();
                      setRemarkModal(false);
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setRemarkModal(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default AttendanceReport;
