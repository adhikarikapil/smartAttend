import React, { useState, useEffect } from "react";
import "./NavbarStyles.css";
import Profile from "../../../assets/profile.jpeg";
import { logoutUser } from "../../../services/authService";

function Navbar({ existingUser = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  // Navigation handlers
  const handleRegisterClick = () => {
    window.location.href = "/register";
  };

  const handleLoginClick = () => {
    window.location.href = "/login";
  };

  const showLoginLink = currentPath === "/register";
  const showRegisterLink = currentPath === "/" || currentPath === "/login";
  const isDashboard = currentPath === "/dashboard";

  const isLoggingOut = async () => {
    const data = await logoutUser();
    if (data.message) {
      setAlertMessage(data.message);
      setAlertType("success");
    } else {
      setAlertMessage(data.error);
      setAlertType("error");
    }
  };


  return (
    <div className="navbar-container">
      {alertMessage && (
        <div className={`logout-alert-message ${alertType}`}>
          {alertMessage}
        </div>
      )}
      <div
        className="navbar-titles"
        onClick={() => {
          window.location.href = "/";
        }}
      >
        <h2>SmartAttend</h2>
      </div>
      <div className="navbar-tags">
        <div
          className="navbar-menu"
          onClick={() => {
            window.location.href = "/dashboard";
          }}
        >
          Dashboard
        </div>
        <div
          className="navbar-menu"
          onClick={() => {
            window.location.href = "/classes";
          }}
        >
          Classes
        </div>
        <div
          className="navbar-menu"
          onClick={() => {
            window.location.href = "/attendance";
          }}
        >
          Attendance
        </div>
      </div>
      <div className="navbar-profile">
        {/* Conditionally render auth links */}
        {showLoginLink && (
          <button className="auth-link login-link" onClick={handleLoginClick}>
            Login
          </button>
        )}

        {showRegisterLink && (
          <button
            className="auth-link register-link"
            onClick={handleRegisterClick}
          >
            Register
          </button>
        )}

        {isDashboard && (
          <>
            <h3 className="hello-message">
              Hello, {existingUser.firstName} {existingUser.secondName}
            </h3>
          </>
        )}

        <img
          src={Profile}
          alt=""
          id="pic"
          className="size-11 rounded-full"
          onClick={() => setIsOpen(!isOpen)}
        />
        {isDashboard && isOpen && (
          <div className={`navbar-dropdown ${isOpen ? "active" : ""}`}>
            <button className="w-40">Re-register Face</button>
            <button onClick={isLoggingOut}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
