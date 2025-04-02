import React, { useState } from "react";
import "./NavbarStyles.css";
import Profile from "../../../assets/profile.jpeg";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="navbar-container">
      <div className="navbar-titles" onClick={()=>{
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
        <img
          src={Profile}
          alt=""
          id="pic"
          className="size-11 rounded-full"
          onClick={() => setIsOpen(!isOpen)}
        />

        {isOpen && (
          <div className="navbar-dropdown absolute right-0 mt-13 ">
            <button className="w-40">Re-register Face</button>
            <button>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
