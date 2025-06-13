import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/auth/Login/Login";
import Navbar from "./components/layout/Navbar/Navbar";
import Register from "./components/auth/Register/Register";
import Dashboard from "./components/layout/Dashboard/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute/ProtectedRoute";
import FaceRegistration from "./components/face/FaceRegistration";
import TakeAttendance from "./components/attendance/TakeAttendance/TakeAttendance";
import AttendanceReport from "./components/attendance/AttendanceReport/AttendanceReport";

function App() {
  return (
    <div className="main-container">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/navbar-where-you-dont-want-to-go"
              element={<Navbar />}
            />
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <>
                  <ProtectedRoute allowedRoles={["teacher", "student"]}>
                    <Dashboard />
                  </ProtectedRoute>
                </>
              }
            />
            <Route
              path="/face-register"
              element={
                <>
                  <ProtectedRoute allowedRoles={["student"]}>
                    <FaceRegistration />
                  </ProtectedRoute>
                </>
              }
            />
            <Route
              path="/take-attendance"
              element={
                <>
                  <ProtectedRoute allowedRoles={["teacher"]}>
                    <TakeAttendance />
                  </ProtectedRoute>
                </>
              }
            />
            <Route 
              path='/attendance'
              element={
                <>
                  <ProtectedRoute allowedRoles={['teacher', 'student']}>
                    <AttendanceReport />
                  </ProtectedRoute>
                </>
              }
             />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
