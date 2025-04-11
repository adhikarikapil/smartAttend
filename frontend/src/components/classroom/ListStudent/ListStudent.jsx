import React from "react";

function ListStudent({ existingStudents = [] }) {
  return (
    <div>
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Students</h2>
            <button className="close-button">
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
                    <button>Remove</button>
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
