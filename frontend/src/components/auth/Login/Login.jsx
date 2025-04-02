import React, { useState, useEffect } from 'react';
import Navbar from "../../layout/Navbar/Navbar";
import "./LoginStyles.css";

function Login() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAlertMessage("Login successful!");
        setAlertType("success");
        // Store the token
        localStorage.setItem('token', data.token);
        // Redirect based on role or to dashboard
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        setAlertMessage(data.error || "Login failed");
        setAlertType("error");
      }
    } catch (error) {
      setAlertMessage(`An error occurred: ${error.message}`);
      setAlertType("error");
    }
  };

  return (
    <>
      <div className="login-container">
        <header>
          <Navbar />
        </header>
        {alertMessage && (
          <div className={`login-alert-message ${alertType}`}>
            {alertMessage}
          </div>
        )}
        <div className="login-input">
          <div className="login-title">
            <h1>Login</h1>
          </div>
          <div className="login-form-container">
            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-form-contents">
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
                <div className="forgot-password">
                  <a href="/forgot-password">Forgot password?</a>
                </div>
              </div>
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
