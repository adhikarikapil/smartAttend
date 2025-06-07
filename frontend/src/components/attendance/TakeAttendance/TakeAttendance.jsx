import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

function TakeAttendance() {
  const location = useLocation();
  const { classroom } = location.state || {classroom: []}

  useEffect(()=>{
    console.log(classroom)
  })

  return (
    <div>This is where you take attendance.</div>
  )

}

export default TakeAttendance;
