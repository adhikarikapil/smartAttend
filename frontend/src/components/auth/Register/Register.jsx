import React, { useState, useEffect } from "react";
import Navbar from "../../layout/Navbar/Navbar";
import "./RegisterSyles.css";

function Register() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const handleFormChange = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertMessage("");
    setAlertType("");

    if (formData.password !== formData.confirmPassword) {
      setAlertMessage("Passwords do not match");
      setAlertType("error");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          secondName: formData.secondName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAlertMessage("Registration successful!");
        setAlertType("success");
        setFormData({
          firstName: "",
          secondName: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "student",
        });

        setTimeout(() => {
          window.location.href = "/login";
        }, 2500);
      } else {
        setAlertMessage(data.error || "Registration failed");
        setAlertType("error");
      }
    } catch (error) {
      setAlertMessage(`An error occurred: ${error.message}`);
      setAlertType("error");
    }
  };

  return (
    <>
      <div className="register-container">
        <header>
          <Navbar />
        </header>
        {alertMessage && (
          <div className={`register-alert-message ${alertType}`}>
            {alertMessage}
          </div>
        )}
        <div className="register-input">
          <div className="register-title">
            <h1>Register</h1>
          </div>
          <div className="register-form-container">
            <form onSubmit={handleSubmit} className="register-form">
              <div className="register-form-contents">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleFormChange}
                  required
                />
                <label htmlFor="secondName">Second Name</label>
                <input
                  type="text"
                  name="secondName"
                  placeholder="Second Name"
                  value={formData.secondName}
                  onChange={handleFormChange}
                  required
                />
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                />
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleFormChange}
                  required
                />
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleFormChange}
                  required
                />
                <label htmlFor="role">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  className="register-form input"
                  required
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>
              <button type="submit">Register</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
