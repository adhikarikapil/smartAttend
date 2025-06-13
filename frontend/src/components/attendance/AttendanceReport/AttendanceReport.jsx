import React from "react";
import { useLocation } from "react-router-dom";

function AttendanceReport() {
  const location = useLocation();
  const { classroomId } = location.state || { classroomid: "" };
  return (
    <div>
      <strong>{classroomId}</strong>
      This is Attendance Report which will show the report of the attendance
      through classroom ID.
    </div>
  );
}

export default AttendanceReport;
