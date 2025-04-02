import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from './components/auth/Login/Login'
import Register from "./components/auth/Register/Register";
import Navbar from "./components/layout/Navbar/Navbar";
import Dashboard from "./components/layout/Dashboard/Dashboard";

function App() {
  return (
    <div className="main-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
