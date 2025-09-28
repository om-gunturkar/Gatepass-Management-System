import React, { useState } from "react";
import API from "../Api";
import { useNavigate } from "react-router-dom";
import "./StudentLogin.css"; // Import custom CSS

export default function StudentLogin() { // Changed function name to StudentLogin
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { username, password });
      const { token, user } = res.data;
      
      // OPTIONAL: You might add a check here (e.g., if (user.role !== "student") throw new Error("Access Denied"))

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      // Redirect directly to student dashboard
      navigate("/student"); 
      
    } catch (e) {
      setErr(e.response?.data?.message || "Student Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">🎓 Student Gatepass Login</h2> {/* Updated Title */}

        {err && <div className="error-message">{err}</div>}

        <div className="form-group">
          <label>Student ID</label> {/* Updated Label */}
          <input
            type="text"
            placeholder="Enter Student ID"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button onClick={handleLogin} className="login-btn">
          Login as Student
        </button>

        {/* Removed admin-info block as it's not relevant for student login page */}
        <hr className="divider" />
        <div className="admin-info">
          <p>Please use your assigned Student ID and password.</p>
        </div>
      </div>
    </div>
  );
}