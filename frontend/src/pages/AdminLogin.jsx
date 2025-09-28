import React, { useEffect, useState } from "react";
import API from "../Api";
import { useNavigate } from "react-router-dom";
// NOTE: You'll need to install a chart library like 'react-chartjs-2' 
// for real charts. This example uses placeholders.
import { FaTrash, FaEdit, FaSearch, FaSignOutAlt, FaTimes, FaHome, FaUserGraduate, FaPlus, FaBell } from 'react-icons/fa';
import "./AdminDashboard.css";

// --- Tab Render Components (Defined outside the main component for best practice) ---

// 1. Home Tab (Charts/Overview)
const renderHomeTab = ({ students, pending }) => (
    <div className="home-section">
        <h3>Dashboard Overview</h3>
        <div className="stats-grid">
            <div className="stat-card total-students">
                <h4>Total Students</h4>
                <p className="stat-value">{students.length}</p>
            </div>
            <div className="stat-card pending-requests">
                <h4>Pending Requests</h4>
                <p className="stat-value">{pending.length}</p>
            </div>
            <div className="stat-card departments">
                <h4>Departments</h4>
                <p className="stat-value">{new Set(students.map(s => s.department)).size}</p>
            </div>
        </div>

        <div className="chart-area">
            <h4>Gatepass Trends (Placeholder)</h4>
            {/* // 🔑 INTEGRATE CHART LIBRARY HERE (e.g., react-chartjs-2) */}
            <div className="chart-placeholder">
                <p>Chart: Gatepass Requests by Day/Week</p>
            </div>
        </div>
    </div>
);

// 2. Add Student Tab (Form Only)
const renderAddStudentTab = ({ form, setForm, createStudent }) => (
    <div className="form-section">
        <h3>Create Student</h3>
        <div className="form-grid">
            <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
                placeholder="Student ID"
                value={form.studentId}
                onChange={(e) => setForm({ ...form, studentId: e.target.value })}
            />
            <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <input
                placeholder="Department"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
            />
            <input
                placeholder="Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
        </div>
        <button className="primary-btn" onClick={createStudent}>
            Create Student
        </button>
    </div>
);


// 3. Students List Tab (Search, Table, and Actions)
const renderStudentsTab = ({ filteredStudents, searchTerm, setSearchTerm, setEditingStudent, deleteStudent }) => (
    <div className="student-list-container">
        <h3>Students List ({filteredStudents.length} Records)</h3>
        <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
                placeholder="Search by Name or Student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        
        {filteredStudents.length === 0 && <p className="no-results">No students match your search.</p>}

        <table className="data-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Student ID</th>
                    <th>Department</th>
                    <th>Address</th>
                    <th className="action-col">Actions</th> 
                </tr>
            </thead>
            <tbody>
                {filteredStudents.map((s) => (
                    <tr key={s._id}>
                        <td>{s.name}</td>
                        <td>{s.studentId}</td>
                        <td>{s.department}</td>
                        <td>{s.address}</td>
                        <td className="action-col">
                            <button className="icon-btn edit-btn" onClick={() => setEditingStudent(s)}>
                                <FaEdit />
                            </button>
                            <button className="icon-btn delete-btn" onClick={() => deleteStudent(s._id)}>
                                <FaTrash />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);


// 4. View Requests Tab (Decide logic remains the same)
const renderRequestsTab = ({ pending, decide }) => (
    <div className="requests-section">
        <h3>Pending Gatepasses ({pending.length})</h3>
        {pending.length === 0 && <p>No pending requests</p>}
        {pending.map((p) => (
            <div key={p._id} className="request-card">
                <p>
                    <strong>
                        {p.student.name} ({p.student.studentId})
                    </strong>
                </p>
                <p>Reason: {p.reason}</p>
                <p>Out: {new Date(p.outDate).toLocaleString()}</p>
                <p>Status: {p.status}</p>
                <div className="request-actions">
                    <button
                        className="approve-btn"
                        onClick={() => decide(p._id, "approve")}
                    >
                        Approve
                    </button>
                    <button
                        className="reject-btn"
                        onClick={() => decide(p._id, "reject")}
                    >
                        Reject
                    </button>
                </div>
            </div>
        ))}
    </div>
);


// --- Main AdminDashboard Component ---

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [pending, setPending] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingStudent, setEditingStudent] = useState(null);
    const [form, setForm] = useState({
        name: "",
        studentId: "",
        password: "",
        department: "",
        address: "",
    });
    // Set default active tab to "home"
    const [activeTab, setActiveTab] = useState("home"); 
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        if (!user || user.role !== "admin") return navigate("/admin-login");
        fetchStudents();
        fetchPending();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await API.get("/admin/students");
            setStudents(res.data.students);
        } catch (err) {
            console.error("Failed to fetch students.", err);
            alert("Failed to fetch students.");
        }
    };

    const fetchPending = async () => {
        try {
            const res = await API.get("/admin/gatepasses/pending");
            setPending(res.data.pending);
        } catch (err) {
            console.error("Failed to fetch pending requests.", err);
            alert("Failed to fetch pending requests.");
        }
    };

    const createStudent = async () => {
        try {
            await API.post("/admin/students", form);
            setForm({
                name: "",
                studentId: "",
                password: "",
                department: "",
                address: "",
            });
            fetchStudents();
            alert("Student added successfully!");
        } catch (e) {
            alert(e.response?.data?.message || "Error creating student.");
        }
    };

    const deleteStudent = async (id) => {
        if (!window.confirm("Are you sure you want to delete this student?")) return;
        try {
            await API.delete(`/admin/students/${id}`);
            fetchStudents();
        } catch (e) {
            alert("Error deleting student.");
        }
    };

    const saveEdit = async () => {
        if (!editingStudent) return;
        try {
            await API.put(`/admin/students/${editingStudent._id}`, editingStudent); 
            setEditingStudent(null);
            fetchStudents();
            alert("Student updated successfully!");
        } catch (e) {
            alert("Error updating student.");
        }
    };

    const decide = async (id, action) => {
        try {
            await API.post(`/admin/gatepasses/${id}/decide`, { action });
            fetchPending();
        } catch (e) {
            alert("Error deciding gatepass.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/admin-login");
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentId.includes(searchTerm)
    );

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h2>Admin Dashboard</h2>
                <button className="logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                </button>
            </div>

            {/* --- Tab Buttons (4 Tabs) --- */}
            <div className="tab-buttons">
                <button
                    className={activeTab === "home" ? "primary-action-btn" : "secondary-action-btn"}
                    onClick={() => setActiveTab("home")}
                >
                    <FaHome /> Home
                </button>
                <button
                    className={activeTab === "students" ? "primary-action-btn" : "secondary-action-btn"}
                    onClick={() => setActiveTab("students")}
                >
                    <FaUserGraduate /> Students List
                </button>
                <button
                    className={activeTab === "addStudent" ? "primary-action-btn" : "secondary-action-btn"}
                    onClick={() => setActiveTab("addStudent")}
                >
                    <FaPlus /> Add Student
                </button>
                <button
                    className={activeTab === "viewRequests" ? "primary-action-btn" : "secondary-action-btn"}
                    onClick={() => setActiveTab("viewRequests")}
                >
                    <FaBell /> View Requests ({pending.length})
                </button>
            </div>

            {/* --- Content Area - Conditional Rendering --- */}
            <div className="tab-content">
                {activeTab === "home" && renderHomeTab({ students, pending })}
                {activeTab === "students" && renderStudentsTab({ filteredStudents, searchTerm, setSearchTerm, setEditingStudent, deleteStudent })}
                {activeTab === "addStudent" && renderAddStudentTab({ form, setForm, createStudent })}
                {activeTab === "viewRequests" && renderRequestsTab({ pending, decide })}
            </div>
            
            {/* Edit Student Modal/Form */}
            {editingStudent && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4>Edit Student: {editingStudent.name}</h4>
                            <button className="close-btn" onClick={() => setEditingStudent(null)}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className="form-grid modal-form-grid">
                            <input
                                placeholder="Name"
                                value={editingStudent.name}
                                onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                            />
                            <input
                                placeholder="Student ID"
                                value={editingStudent.studentId}
                                onChange={(e) => setEditingStudent({ ...editingStudent, studentId: e.target.value })}
                            />
                            <input
                                placeholder="Department"
                                value={editingStudent.department}
                                onChange={(e) => setEditingStudent({ ...editingStudent, department: e.target.value })}
                            />
                            <input
                                placeholder="Address"
                                value={editingStudent.address}
                                onChange={(e) => setEditingStudent({ ...editingStudent, address: e.target.value })}
                            />
                        </div>
                        <div className="modal-footer">
                            <button className="secondary-action-btn" onClick={() => setEditingStudent(null)}>Cancel</button>
                            <button className="primary-btn" onClick={saveEdit}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}