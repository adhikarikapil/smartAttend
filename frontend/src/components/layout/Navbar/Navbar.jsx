import React, { useState, useEffect } from "react";
import "./NavbarStyles.css";
import Profile from "../../../assets/profile.jpeg";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  // Navigation handlers
  const handleRegisterClick = () => {
    window.location.href = "/register";
  };

  const handleLoginClick = () => {
    window.location.href = "/";
  };

  const showLoginLink = currentPath === "/register";
  const showRegisterLink = currentPath === "/" || currentPath === "/login";

  return (
    <div className="navbar-container">
      <div className="navbar-titles" onClick={() => {
        window.location.href = '/'
      }}>
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
          <button 
            className="auth-link login-link" 
            onClick={handleLoginClick}
          >
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

        <img
          src={Profile}
          alt=""
          id="pic"
          className="size-11 rounded-full"
          onClick={() => setIsOpen(!isOpen)}
        />

        {isOpen && (
          <div className="navbar-dropdown">
            <button className="w-40">Re-register Face</button>
            <button>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
