import React, { useEffect, useState } from "react";
import API from "../Api";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [reason, setReason] = useState("");
  const [outDate, setOutDate] = useState("");
  const [inDate, setInDate] = useState("");
  const [passes, setPasses] = useState([]);
  const [activeTab, setActiveTab] = useState("apply");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user || user.role !== "student") return navigate("/login");
    fetchMy();
  }, []);

  const fetchMy = async () => {
    const res = await API.get("/student/my");
    setPasses(res.data.passes);
  };

  const apply = async () => {
    try {
      await API.post("/student/apply", {
        reason,
        outDate,
        inDate: inDate || null,
      });
      setReason("");
      setOutDate("");
      setInDate("");
      fetchMy();
      setActiveTab("view"); // switch to view after applying
    } catch (e) {
      alert("Error applying");
    }
  };

  return (
    <div className="student-dashboard">
      <h2>Student Dashboard</h2>

      {/* Tab Buttons */}
      <div className="tab-buttons">
        <button
          className={activeTab === "apply" ? "active" : ""}
          onClick={() => setActiveTab("apply")}
        >
          Apply for Gatepass
        </button>
        <button
          className={activeTab === "view" ? "active" : ""}
          onClick={() => setActiveTab("view")}
        >
          View Gatepass
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "apply" && (
          <div className="form-section">
            <h3>Apply Gatepass</h3>
            <textarea
              placeholder="Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div>
              <label>Out Date & Time</label>
              <input
                type="datetime-local"
                value={outDate}
                onChange={(e) => setOutDate(e.target.value)}
              />
            </div>
            <div>
              <label>Expected In (optional)</label>
              <input
                type="datetime-local"
                value={inDate}
                onChange={(e) => setInDate(e.target.value)}
              />
            </div>
            <button className="primary-btn" onClick={apply}>
              Apply
            </button>
          </div>
        )}

        {activeTab === "view" && (
          <div className="view-section">
            <h3>My Gatepasses</h3>
            {passes.length === 0 && <p>No gatepasses yet</p>}
            {passes.map((p) => (
              <div key={p._id} className="gatepass-card">
                <p>
                  <strong>Reason:</strong> {p.reason}
                </p>
                <p>
                  <strong>Out:</strong>{" "}
                  {new Date(p.outDate).toLocaleString()}
                </p>
                <p>
                  <strong>In:</strong>{" "}
                  {p.inDate ? new Date(p.inDate).toLocaleString() : "—"}
                </p>
                <p>
                  <strong>Status:</strong> {p.status}
                </p>
                {p.adminRemarks && (
                  <p>
                    <strong>Admin:</strong> {p.adminRemarks}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
