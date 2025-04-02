import React, { useState } from "react";
import Navbar from "../../layout/Navbar/Navbar";
import "./RegisterSyles.css";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleFormChange = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <div className="register-container">
        <header>
          <Navbar />
        </header>
        <div className="register-input">
          <div className="register-title">
            <h1>Register</h1>
          </div>
          <div className="register-form-container">
            <form action="submit" className="register-form">
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
