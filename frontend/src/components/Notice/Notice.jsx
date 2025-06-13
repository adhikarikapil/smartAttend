import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./NoticeStyles.css";

function Notice() {
  const location = useLocation();
  const { user, classroom } = location.state || { user: [], classroom: [] };

  const [formData, setFormData] = useState({
    title: "",
    message: "",
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [addNoticeModal, setAddNoticeModal] = useState(false);
  const [notices, setNotices] = useState([]);

  const handleFormChange = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddNotice = async (e) => {
    e.preventDefault();
    setAlertMessage("");
    setAlertType("");

    const token = localStorage.getItem("accessToken");
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/notice/add?classroomId=${
        classroom.classroomId
      }`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          message: formData.message,
        }),
      }
    );

    if (!response.ok) {
      setAlertMessage("Error Adding Notice.");
      setAlertType("error");
    }

    setAlertMessage("Notice added successfully.");
    setAlertType("success");

    setTimeout(() => {
      setAlertMessage("");
      setAlertType("");
    }, 2000);
  };

  const handleFetchNotice = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/notice/list?classroomId=${
        classroom.classroomId
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    setNotices(data.notice);
  };

  useEffect(() => {
    handleFetchNotice();
  }, [classroom.classroomId]);

  return (
    <div className="main-container">
      <div className={`notice-container ${addNoticeModal ? "modal-open" : ""}`}>
        {alertMessage && (
          <div className={`notice-alert ${alertType}`}>{alertMessage}</div>
        )}

        {user?.role === "teacher" && (
          <button
            onClick={() => {
              setAddNoticeModal(true);
            }}
          >
            ADD NOTICE
          </button>
        )}
        <div className="notice-list">
          <h2>Notices</h2>
          {notices.length === 0 ? (
            <p>No Notices Yet</p>
          ) : (
            <ul>
              {notices.map((notice) => (
                <li key={notice.id} className="notice-item">
                  <h4>{notice.title}</h4>
                  <p>{notice.message}</p>
                  <span className="timestamp">
                    {new Date(notice.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {addNoticeModal && (
        <div className="modal-overlay" onClick={()=>{setAddNoticeModal(false)}}>
          <form className="notice-form" onSubmit={handleAddNotice}>
            <h2>Add Notice</h2>

            <input
              type="text"
              name="title"
              placeholder="Notice Title"
              value={formData.title}
              onChange={handleFormChange}
              required
            />
            <textarea
              name="message"
              placeholder="Notice Message"
              value={formData.message}
              onChange={handleFormChange}
              rows="4"
              required
            />
            <button
              type="submit"
              onClick={() => {
                setAddNoticeModal(false);
              }}
            >
              Send Notice
            </button>
            <button onClick={()=>{setAddNoticeModal(false)}}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Notice;
