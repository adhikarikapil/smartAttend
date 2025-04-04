import React from "react";
import "./DashboardStyles.css";
import Navbar from "../Navbar/Navbar";
import { logoutUser, checkToken} from "../../../services/authService";

function Dashboard() {
  return (
    <>
      <div className="">
        <header>
          <Navbar />
        </header>
        <button style={{color: 'white'}} onClick={logoutUser}>logout</button>
        <button style={{color: 'white'}} onClick={checkToken}>Check</button>
      </div>
    </>
  );
}

export default Dashboard;
