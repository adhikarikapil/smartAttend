import React, { useState, useEffect } from "react";
import "./NavbarStyles.css";
import Profile from "../../../assets/profile.jpeg";
import { useAuth } from "../../../context/AuthContext";

function Navbar({ hasExistingRegistration }) {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.navbar-tags') && !event.target.closest('.navbar-menu-button')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Navigation handlers
  const handleRegisterClick = () => {
    window.location.href = "/register";
    setIsMobileMenuOpen(false);
  };

  const handleLoginClick = () => {
    window.location.href = "/login";
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path) => {
    window.location.href = path;
    setIsMobileMenuOpen(false);
  };

  const showLoginLink = currentPath === "/register";
  const showRegisterLink = currentPath === "/" || currentPath === "/login";
  const isDashboard = currentPath === "/dashboard";

  const isLoggingOut = async () => {
    const data = await logout();
    if (data.message) {
      setAlertMessage(data.message);
      setAlertType("success");
    } else {
      setAlertMessage(data.error);
      setAlertType("error");
    }
    setIsMobileMenuOpen(false);
  };

  const isLogin = () => {
    window.location.href = "/login";
    setIsMobileMenuOpen(false);
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
        onClick={() => handleNavigation("/")}
      >
        <h2>SmartAttend</h2>
      </div>

      {/* Mobile menu button */}
      <button 
        className="navbar-menu-button"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Navigation menu */}
      <div className={`navbar-tags ${isMobileMenuOpen ? 'mobile-menu' : ''}`}>
        <div
          className="navbar-menu"
          onClick={() => handleNavigation("/dashboard")}
        >
          Dashboard
        </div>
        <div
          className="navbar-menu"
          onClick={() => handleNavigation("/attendance")}
        >
          View Attendance
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

        {isDashboard && user && (
          <>
            <h3 className="hello-message">
              Hello, {user.firstName} {user.secondName}
            </h3>
          </>
        )}

        <img
          src={Profile}
          alt="Profile"
          className="size-11 rounded-full"
          onClick={() => setIsOpen(!isOpen)}
        />
        {isDashboard && isOpen && (
          <div className={`navbar-dropdown ${isOpen ? "active" : ""}`}>
            {isAuthenticated ? (
              <>
                {user?.role === "student" ? (
                  hasExistingRegistration === "false" ? (
                    <button
                      onClick={() => handleNavigation("/face-register")}
                    >
                      Register Face
                    </button>
                  ) : (
                    <button
                      onClick={() => handleNavigation("/face-register")}
                    >
                      Re-register Face
                    </button>
                  )
                ) : (
                  ""
                )}
                <button onClick={isLoggingOut}>Logout</button>
              </>
            ) : (
              <>
                <p>You are not logged in. Login yourself!!</p>
                <button onClick={isLogin}>Login In</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
