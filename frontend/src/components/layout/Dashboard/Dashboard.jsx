import React, { useEffect } from "react";
import "./DashboardStyles.css";
import Navbar from "../Navbar/Navbar";
import { isTokenExpired } from "../../../services/authService";

function Dashboard() {
  useEffect(() => {
    isTokenExpired();
  }, []);

  return (
    <>
      <div className="">
        <header>
          <Navbar />
        </header>
      </div>
    </>
  );
}

export default Dashboard;
