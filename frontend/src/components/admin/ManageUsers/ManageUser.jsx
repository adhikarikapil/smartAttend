import React, { useEffect, useState } from "react";
import './ManageUserStyles.css';

function ManageUser() {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [currentStudent, setCurrentStudent] = useState([]);
  const [currentTeacher, setCurrentTeacher] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const listUser = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/fetch-user`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        setAlertMessage("Failed to fetch users");
        setAlertType("error");
        setTimeout(() => {
          setAlertMessage("");
          setAlertType("");
        }, 2000);
      } else {
        setAlertMessage("Users fetched successfully");
        setAlertType("success");
        if (data.studentInfo) {
          setCurrentStudent(data.studentInfo);
        }
        if (data.teacherInfo) {
          setCurrentTeacher(data.teacherInfo);
        }
        setTimeout(() => {
          setAlertMessage("");
          setAlertType("");
        }, 2000);
      }
    } catch (error) {
      setAlertMessage(`Failed to fetch users: ${error.message}`);
      setAlertType("error");
      setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    listUser();
  }, []);

  const filteredStudents = currentStudent.filter(student => {
    const searchLower = searchTerm.toLowerCase();
    const id = String(student.studentId || '').toLowerCase();
    const name = String(student.studentName || '').toLowerCase();
    const email = String(student.studentEmail || '').toLowerCase();
    const rollNo = String(student.studentRollNo || '').toLowerCase();
    
    return id.includes(searchLower) || 
           name.includes(searchLower) || 
           email.includes(searchLower) || 
           rollNo.includes(searchLower);
  });

  const filteredTeachers = currentTeacher.filter(teacher => {
    const searchLower = searchTerm.toLowerCase();
    const id = String(teacher.teacherId || '').toLowerCase();
    const name = String(teacher.teacherName || '').toLowerCase();
    const email = String(teacher.teacherEmail || '').toLowerCase();
    
    return id.includes(searchLower) || 
           name.includes(searchLower) || 
           email.includes(searchLower);
  });

  return (
    <div className="user-container">
      {alertMessage && (
        <div className={`alert-message ${alertType}`}>
          {alertMessage}
        </div>
      )}

      <div className="search-container">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <svg
          className="search-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      ) : (
        <>
          <div className="student-container">
            <h2 className="section-title">Students</h2>
            <div className="table-wrapper">
              <table className="student-table">
                <thead className="student-table-head">
                  <tr>
                    <th>Student ID</th>
                    <th>Student Roll</th>
                    <th>Student Name</th>
                    <th>Student Email</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.studentId}>
                      <td>{student.studentId}</td>
                      <td>{student.studentRollNo}</td>
                      <td>{student.studentName}</td>
                      <td>{student.studentEmail}</td>
                      <td>{new Date(student.studentCreatedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="teacher-container">
            <h2 className="section-title">Teachers</h2>
            <div className="table-wrapper">
              <table className="teacher-table">
                <thead className="teacher-table-head">
                  <tr>
                    <th>Teacher ID</th>
                    <th>Teacher Name</th>
                    <th>Teacher Email</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers.map((teacher) => (
                    <tr key={teacher.teacherId}>
                      <td>{teacher.teacherId}</td>
                      <td>{teacher.teacherName}</td>
                      <td>{teacher.teacherEmail}</td>
                      <td>{new Date(teacher.teacherCreatedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ManageUser;
