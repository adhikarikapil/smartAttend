import React, { useState } from "react";
import "./ListStudentStyles.css";
import { removeStudent } from "../../../services/classroomService";

function ListStudent({
  existingStudents = [],
  closeModal,
  existingClassroomId,
  listStudentTable,
  onStudentRemoved,
}) {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const studentRemove = async (userId) => {
    setAlertMessage("");
    setAlertType("");

    const response = await removeStudent(existingClassroomId, userId);

    if (response.message) {
      setAlertMessage("Student Removed!!");
      setAlertType("success");
      listStudentTable(existingClassroomId);
      onStudentRemoved();
    } else {
      setAlertMessage(response.error || "Student not removed!!");
      setAlertType("error");
    }
    setTimeout(() => {
      setAlertMessage("");
    }, 1000);
  };

  return (
    <div>
      <div className="modal-overlay">
        <div className="modal-content">
          {alertMessage && (
            <div className={`modal-alert-message ${alertType}`}>
              {alertMessage}
            </div>
          )}
          <div className="modal-header">
            <h2>Students</h2>
            <button className="close-button" onClick={closeModal}>
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
          <table className="table">
            <thead className="table-head">
              <tr>
                <th>First Name</th>
                <th>Second Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {existingStudents.map((student) => (
                <tr key={student.userId}>
                  <td>{student.firstName}</td>
                  <td>{student.secondName}</td>
                  <td>{student.email}</td>
                  <td>
                    <button
                      onClick={() => {
                        studentRemove(student.userId);
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ListStudent;
