import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import Navbar from "../layout/Navbar/Navbar";
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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [existingRegistration, setExistingRegistration] = useState(null);
  const [hasExistingRegistration, setHasExistingRegistration] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState({
    isReady: false,
    message: "Waiting for input...",
    type: "waiting",
    suggestions: [],
  });

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!textData.rollNo && !capturedImage) {
      setRegistrationStatus({
        isReady: false,
        message: "Enter roll number and capture image",
        type: "waiting",
        suggestions: [],
      });
    } else if (!textData.rollNo) {
      setRegistrationStatus({
        isReady: false,
        message: "Enter roll number",
        type: "warning",
        suggestions: [],
      });
    } else if (!capturedImage) {
      setRegistrationStatus({
        isReady: false,
        message: "Capture your image",
        type: "warning",
        suggestions: [],
      });
    } else {
      setRegistrationStatus({
        isReady: true,
        message: "Ready to Register",
        type: "success",
        suggestions: [],
      });
    }
  }, [textData.rollNo, capturedImage]);

  useEffect(() => {
    checkExistingRegistration();
  }, []);

  const checkExistingRegistration = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await fetch(`${API_URL}/face/status`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("You have face data", data);
        setHasExistingRegistration(data.hasRegistration);
        if (data.hasRegistration) {
          setExistingRegistration(data.registration);
        }
      }
    } catch (error) {
      setAlertMessage(error);
      setAlertType("error");
    }
  };

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

  const submitRegistration = async (replaceExisting = false) => {
    setIsLoading(false);
    
    if (!registrationStatus.isReady) {
        setAlertType("error");
        setAlertMessage(registrationStatus.message);
        return;
    }

    setIsLoading(true);

    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            throw new Error("No access token found");
        }

        const image = await fetch(capturedImage).then((res) => res.blob());
        const formData = new FormData();
        formData.append("rollNo", JSON.stringify(textData));
        formData.append("image", image, "face.jpg");

        if (replaceExisting) {
            formData.append("repalceExisting", "true");
        }

        const response = await fetch(`${API_URL}/face/register`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
        });

        const data = await response.json();

        if (response.ok) {
            if (data.action === "replaced") {
                setAlertMessage("Face Registration updated successfully");
                setAlertType("success");
            } else {
                setAlertMessage("Face Registered Successfully!!!");
                setAlertType("success");
            }
            setTextData({ rollNo: "" });
            setCapturedImage(null);
            setRegistrationStatus({
                isReady: false,
                message: "Waiting for input...",
                type: "waiting",
                suggestions: [],
            });
            setShowConfirmDialog(false);
            await checkExistingRegistration();

            setIsLoading(false);
            setTimeout(() => {
                window.location.href = "/face-register";
            }, 2000);
        } else if (response.status === 409 && data.requiresConfirmation) {
            setExistingRegistration(data.existingRegistration);
            setShowConfirmDialog(true);
            setAlertMessage(data.message);
            setAlertType("error");
            setIsLoading(false);
        } else {
            setAlertMessage(data.error || "Registration failed");
            setAlertType("error");
            setIsLoading(false);
            
            setRegistrationStatus(prevStatus => ({
                ...prevStatus,
                isReady: false,
                message: data.error || "Registration failed",
                type: "error",
                suggestions: data.suggestion ? [data.suggestion] : prevStatus.suggestions
            }));
        }
    } catch (err) {
        console.error("Registration error:", err);
        setAlertMessage(`An error occurred: ${err.message}`);
        setAlertType("error");
        setIsLoading(false);
        
        setRegistrationStatus(prevStatus => ({
            ...prevStatus,
            isReady: false,
            message: `An error occurred: ${err.message}`,
            type: "error",
            suggestions: []
        }));
    }
};

  const handleSubmit = () => {
    if (!isLoading) {
        submitRegistration(false);
    }
  };

  const handleReplaceConfirm = () => {
    if (!isLoading) {
        submitRegistration(true);
    }
  };

  const handleReplaceCancel = () => {
    setShowConfirmDialog(false);
    setAlertMessage("");
    setAlertType("");
    setIsLoading(false);
  };

  const handleTryAgain = () => {
    setCapturedImage(null);
    setShowConfirmDialog(false);
    setAlertMessage("");
    setAlertType("");
    setIsLoading(false);
    setRegistrationStatus(prevStatus => ({
        ...prevStatus,
        isReady: false,
        message: "Capture your image again",
        type: "warning",
        suggestions: []
    }));
  };

  return (
    <div className="face-registration-container">
      <div className="headers">
        <Navbar hasExistingRegistration={hasExistingRegistration} />
      </div>
      {alertMessage && (
        <div className={`face-alert-message ${alertType}`}>{alertMessage}</div>
      )}
      {showConfirmDialog && (
        <div className="confirmation-overlay" onClick={(e) => {
            if (e.target === e.currentTarget) {
                handleReplaceCancel();
            }
        }}>
            <div className="confirmation-dialog">
                <div className="confirmation-header">
                    <h3>Replace Existing Registration?</h3>
                </div>
                <div className="confirmation-content">
                    <p>You have already registered your face:</p>
                    <div className="existing-info">
                        <p>
                            <strong>Roll No:</strong>{" "}
                            {existingRegistration?.rollNo}
                        </p>
                    </div>
                    <p>
                        Do you want to replace your existing face registration with the
                        new image?
                    </p>
                    {(registrationStatus.type === "error" || registrationStatus.suggestions?.length > 0) && (
                        <div className="suggestion-box">
                            {registrationStatus.type === "error" && (
                                <p className="error-message">{registrationStatus.message}</p>
                            )}
                            {registrationStatus.suggestions?.length > 0 && (
                                <>
                                    <p>Suggestions:</p>
                                    <ul>
                                        {registrationStatus.suggestions.map((suggestion, i) => (
                                            <li key={i}>{suggestion}</li>
                                        ))}
                                    </ul>
                                </>
                            )}
                            <button
                                className="btn-try-again"
                                onClick={handleTryAgain}
                                disabled={isLoading}
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
                <div className="confirmation-actions">
                    <button
                        className="btn-cancel"
                        onClick={handleReplaceCancel}
                        disabled={isLoading}
                    >
                        {isLoading ? "Processing..." : "Keep Existing"}
                    </button>
                    <button
                        className="btn-confirm"
                        onClick={handleReplaceConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? "Processing..." : "Replace"}
                    </button>
                </div>
            </div>
        </div>
      )}
      <div className="face-registration-input">
        <div className="face-registration-title">
          <h1>Face Registration</h1>
          {hasExistingRegistration && (
            <span className="status-badge"> Already Registered</span>
          )}
        </div>
        <div className="face-registration-form-container">
          <div  className="face-registration-form">
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

            <button
              type="button"
              className="capture-button"
              onClick={captureImage}
            >
              Capture Image
            </button>

            <button
              type="submit"
              disabled={!registrationStatus.isReady}
              className={!registrationStatus.isReady ? "disabled" : ""}
              onClick={handleSubmit}
            >
              {isLoading ? 'Processing' : hasExistingRegistration ? 'Update Registration': 'Register Face'}
            </button>
          </div>

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
              {registrationStatus.suggestions?.length > 0 && (
                <div className="suggestion-box">
                  <p>Suggestions:</p>
                  <ul>
                    {registrationStatus.suggestions.map((suggestion, i) => (
                      <li key={i}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FaceRegistration;
