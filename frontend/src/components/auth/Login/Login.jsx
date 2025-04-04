import React, { useState } from "react";
import Navbar from "../../layout/Navbar/Navbar";
import "./LoginStyles.css";
import { loginUser } from "../../../services/authService";

function Login() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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

    const response = await loginUser(formData.email, formData.password);

    console.log("Response: ", response);

    const user = response.user;
    localStorage.setItem("userData", JSON.stringify(user));

    if (response.message) {
      setAlertType("success");
      setAlertMessage(response.message);
    } else {
      setAlertType("error");
      setAlertMessage(response.error);
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
