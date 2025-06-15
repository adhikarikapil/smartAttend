import React, { useState } from "react";
import Navbar from "../../layout/Navbar/Navbar";
import "./LoginStyles.css";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
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

    const response = await login(formData.email, formData.password);

    if (response.success) {
      if (response.response.isFirstLogin) {
        const isFirstLogin = response.response.isFirstLogin;
        setAlertType("success");
        setAlertMessage("Login successful!");
        if (response.response.user.role == "admin") {
          navigate("/admin-dashboard", { state: { isFirstLogin } });
        } else {
          navigate("/dashboard", { state: { isFirstLogin } });
        }
      }else{
        if(response.response.user.role == 'admin') {
          navigate('/admin-dashboard')
        }else{
          navigate('/dashboard')
        }
      }
    } else {
      setAlertType("error");
      setAlertMessage(response.error || "Login failed");
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
                {/* <div className="forgot-password">
                  <a href="/forgot-password">Forgot password?</a>
                </div> */}
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
