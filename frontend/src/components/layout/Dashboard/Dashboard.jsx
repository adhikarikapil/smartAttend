import React, { useEffect, useState } from "react";
import "./DashboardStyles.css";
import Navbar from "../Navbar/Navbar";
import { isTokenExpired } from "../../../services/authService";

function Dashboard() {
  const [currentUser, setCurrentUser] = useState({
    userId: "",
    firstName: "",
    secondName: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    isTokenExpired();
  }, []);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setCurrentUser(JSON.parse(storedUserData));
    }
  }, []);

  return (
    <>
      <div className="">
        <header>
          <Navbar existingUser={currentUser}/>
        </header>
      </div>
    </>
  );
}

export default Dashboard;
