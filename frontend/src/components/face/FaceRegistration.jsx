import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import "./FaceRegistration.css";

function FaceRegistration() {
  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  const webcamRef = useRef(null);
  const [textData, setTextData] = useState({ rollNo: "" });
  const [capturedImage, setCapturedImage] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState({
    isReady: false,
    message: "Waiting for input...",
    type: "waiting"
  });

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!textData.rollNo && !capturedImage) {
      setRegistrationStatus({
        isReady: false,
        message: "Enter roll number and capture image",
        type: "waiting"
      });
    } else if (!textData.rollNo) {
      setRegistrationStatus({
        isReady: false,
        message: "Enter roll number",
        type: "warning"
      });
    } else if (!capturedImage) {
      setRegistrationStatus({
        isReady: false,
        message: "Capture your image",
        type: "warning"
      });
    } else {
      setRegistrationStatus({
        isReady: true,
        message: "Ready to Register",
        type: "success"
      });
    }
  }, [textData.rollNo, capturedImage]);

  const handleFormChange = (e) => {
    e.preventDefault();
    setTextData({
      ...textData,
      [e.target.name]: e.target.value,
    });
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!registrationStatus.isReady) {
      setAlertType("error");
      setAlertMessage(registrationStatus.message);
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    const image = await fetch(capturedImage).then((res) => res.blob());
    const formData = new FormData();
    formData.append("rollNo", JSON.stringify(textData));
    formData.append("image", image, "face.jpg");

    try {
      const response = await fetch(`${API_URL}/face/register`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setAlertMessage("Face Registered Successfully!!!");
        setAlertType("success");
        setTextData({ rollNo: "" });
        setCapturedImage(null);
        setRegistrationStatus({
          isReady: false,
          message: "Waiting for input...",
          type: "waiting"
        });

        setTimeout(() => {
          window.location.href = "/face-register";
        }, 5000);
      } else {
        setAlertMessage(data.error || "Registration failed");
        setAlertType("error");
      }
    } catch (err) {
      setAlertMessage(`An error occurred: ${err.message}`);
      setAlertType("error");
    }
  };

  return (
    <div className="face-registration-container">
      {alertMessage && (
        <div className={`face-alert-message ${alertType}`}>
          {alertMessage}
        </div>
      )}
      <div className="face-registration-input">
        <div className="face-registration-title">
          <h1>Face Registration</h1>
        </div>
        <div className="face-registration-form-container">
          <form onSubmit={handleSubmit} className="face-registration-form">
            <input
              type="text"
              name="rollNo"
              placeholder="Enter your Roll No"
              onChange={handleFormChange}
              value={textData.rollNo}
              required
            />

            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="rounded mb-4"
            />

            <button type="button" className="capture-button" onClick={captureImage}>
              Capture Image
            </button>

            <button 
              type="submit" 
              disabled={!registrationStatus.isReady}
              className={!registrationStatus.isReady ? "disabled" : ""}
            >
              Register
            </button>
          </form>

          <div className="face-preview-section">
            <h3>Preview</h3>
            {capturedImage ? (
              <img 
                src={capturedImage} 
                alt="Captured face" 
                className="face-preview-image"
              />
            ) : (
              <div className="face-preview-placeholder">
                No image captured yet
              </div>
            )}
            <div className="face-preview-details">
              <p>
                Roll No: <span>{textData.rollNo || "Not entered"}</span>
              </p>
              <p className={`status-${registrationStatus.type}`}>
                Status: <span>{registrationStatus.message}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FaceRegistration;
