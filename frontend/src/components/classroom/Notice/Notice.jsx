import React, { useState } from "react";

function Notice({ classroomId }) {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
  });
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const handleFormChange = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async() => {
    
  }
}

export default Notice;
