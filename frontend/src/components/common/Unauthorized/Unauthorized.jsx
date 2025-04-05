import React from "react";
import { useNavigate } from "react-router-dom";
import "./UnauthorizedStyles.css";

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <div className="unauthorized-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line xl="12" yl="12" x2="12" y2="12" />
            <line xl="12" yl="12" x2="12.01" y2="16" />
          </svg>
        </div>
        <h1 className="unauthorized-title">Access Deined</h1>
        <p className="unauthorized-message">
          You don't have permission to access this page.
        </p>
        <div className="unauthorized-actions">
          <button
            className="unauthorized-button primary"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </button>
          <button
            className="unauthorized-button secondary"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized