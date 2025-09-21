import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./NoticeStyles.css";

function Notice() {
    const navigate = useNavigate();
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

        setFormData({
            title: "",
            message: "",
        });

        const token = localStorage.getItem("accessToken");
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/notice/add?classroomId=${classroom.classroomId
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
        setAddNoticeModal(false);

        setTimeout(() => {
            setAlertMessage("");
            setAlertType("");
            handleFetchNotice();
        }, 2000);
    };

    const handleFetchNotice = async () => {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/notice/list?classroomId=${classroom.classroomId
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

    const handleDelete = async (noticeId) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/notice/delete`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        noticeId: noticeId,
                    }),
                }
            );
            const data = await response.json();
            iterable.map((item) => {
                
            })
            if (response.ok) {
                setAlertMessage(data.message);
                setAlertType("success");
                setTimeout(() => {
                    handleFetchNotice();
                    setAlertMessage("");
                    setAlertType("");
                }, 2000);
            } else {
                setAlertMessage(data.error);
                setAlertType("error");
            }
        } catch (error) {
            setAlertMessage("Error delete notice: ", error);
            setAlertType("error");
        }
    };

    useEffect(() => {
        handleFetchNotice();
    }, [classroom.classroomId]);

    return (
        <div className="main-container">
            <div className="notice-container">
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
                                    {user?.role === "teacher" && (
                                        <button
                                            className="delete"
                                            onClick={() => {
                                                handleDelete(notice.id);
                                            }}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                    <button
                        className="dashboard-button"
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
            </div>
            {addNoticeModal && (
                <div className="modal-overlay">
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
                        <button type="submit">Send Notice</button>
                        <button
                            type="button"
                            onClick={() => {
                                setAddNoticeModal(false);
                            }}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Notice;
