import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import './TakeAttendanceStyles.css'

function TakeAttendance() {
  const token = localStorage.getItem("accessToken");
  const location = useLocation();
  const { classroom } = location.state || { classroom: [] };
  const socketRef = useRef(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [status, setStatus] = useState("Initializing...");
  const [markedStudents, setMarkedStudents] = useState([]);
  const [latestStudent, setLatestStudent] = useState(null);

  const classroomId = classroom.classroomId;

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_WS_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });

    const socket = socketRef.current;

    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });

    const interval = setInterval(sendFrame, 2000);

    socket.on("connect", () => {
      console.log("Socket Connected", {
        id: socket.id,
        connected: socket.connected,
        transport: socket.io.engine.transport.name,
      });
      setStatus("Connected, scanning...");
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error details:", {
        message: err.message,
        description: err.description,
        type: err.type,
        context: err,
      });
      setStatus("Connection error: " + err.message);
    });

    socket.on("attendance_response", (data) => {
      if (data.message) {
        setStatus(data.message);
        if (data.message.includes("Attendance Marked")) {
          const newStudent = { name: data.name, rollNo: data.rollNo };
          setMarkedStudents((prev) => [...prev, newStudent]);
          setLatestStudent(newStudent);
        }
      } else if (data.error) {
        console.error("Attendance error:", data.error);
        setStatus(data.error);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket Disconnected:", {
        reason,
        wasConnected: socket.connected,
        id: socket.id,
      });
      setStatus("Disconnected: " + reason);
    });

    return () => {
      clearInterval(interval);
      if (socketRef.current) {
        console.log("Cleaning up socket connection");
        socketRef.current.disconnect();
        socketRef.current.off();
      }
    };
  }, []);

  const sendFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const socket = socketRef.current;

    if (!video || !canvas || !socket || !socket.connected) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const image = canvas.toDataURL("image/jpeg");
    socket.emit("mark_attendance", {
      image,
      classroomId,
      token,
    });
  };

  const handleEndAttendance = async () => {
    if (!socketRef.current) return;
    setStatus("Ending Attendance and marking Absentees...");

    try {
      if (socketRef.current) {
        console.log("Cleaning up socket connection before ending attendance");
        socketRef.current.disconnect();
        socketRef.current.off();
      }

      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/attendance/mark-absent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ classroomId })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.statusText}`);
      }

      const data = await response.json();
      setStatus("Attendance Ended. " + (data.message || "Absent students marked."));

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    } catch (err) {
      console.error("Error ending attendance:", err);
      setStatus("Error ending attendance: " + err.message);
      
      if (socketRef.current) {
        socketRef.current.connect();
      }
    }
  };

  return (
    <>
      <div className="attendance-container">
        <div className="video-section">
          <h2>Attendance</h2>
          <video ref={videoRef} autoPlay muted className="video-feed" />
          <canvas ref={canvasRef} style={{display: 'none'}} />
          <p className="status">{status}</p>
          <button className="end-btn" onClick={handleEndAttendance}>
            End Attendance
          </button>
        </div>
        <div className="attendance-info">
          <h3>Marked Student</h3>
          {latestStudent ? (
            <div className="latest-student">
              <strong>{latestStudent.name}</strong> - {latestStudent.rollNo}
            </div>
          ) : (
            <p>No student marked yet.</p>
          )}
          <h3>All marked Student</h3>
          <ul className="marked-list">
            {markedStudents.map((s, idx) => (
              <li key={idx}>
                <strong>{s.name}</strong> - {s.rollNo}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default TakeAttendance;
