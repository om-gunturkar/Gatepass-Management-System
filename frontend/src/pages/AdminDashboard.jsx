import React, { useEffect, useState } from "react";
import API from "../Api";
import { useNavigate } from "react-router-dom";
// Chart Imports
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
// Icon Imports
// FaHistory is the icon for the new tab
import { FaTrash, FaEdit, FaSearch, FaSignOutAlt, FaTimes, FaHome, FaUserGraduate, FaPlus, FaBell, FaHistory } from 'react-icons/fa'; 
import "./AdminDashboard.css";

// Register components used by Chart.js (required for Chart.js v3+)
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


// --- Helper Function: Process Data for Chart ---
const processChartData = (students) => {
    // ... (This function remains unchanged) ...
    const departmentCounts = {};
    const labels = [];
    const data = [];

    students.forEach(student => {
        const dept = student.department || 'Unknown';
        departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
    });

    for (const dept in departmentCounts) {
        labels.push(dept);
        data.push(departmentCounts[dept]);
    }

    return {
        labels: labels,
        datasets: [
            {
                label: 'Students by Department',
                data: data,
                backgroundColor: [
                    'rgba(155, 89, 182, 0.7)', 
                    'rgba(54, 162, 235, 0.7)', 
                    'rgba(255, 206, 86, 0.7)', 
                    'rgba(75, 192, 192, 0.7)', 
                ],
                borderColor: 'rgba(255, 255, 255, 0.8)',
                borderWidth: 1,
            },
        ],
    };
};


// --- Tab Render Components ---

// 1. Home Tab (Unchanged)
const renderHomeTab = ({ students, pending, chartData }) => (
    // ... (Home Tab JSX) ...
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
            <h4>Students by Department</h4>
            <div className="chart-wrapper">
                <Bar 
                    data={chartData} 
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: 'top' },
                            title: { display: false }
                        }
                    }}
                />
            </div>
        </div>
    </div>
);

// 2. Add Student Tab (Unchanged)
const renderAddStudentTab = ({ form, setForm, createStudent }) => (
    // ... (Add Student Tab JSX) ...
    <div className="form-section">
        <h3>Create Student</h3>
        <div className="form-grid">
            <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Student ID" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} />
            <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <input placeholder="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
        <button className="primary-btn" onClick={createStudent}>Create Student</button>
    </div>
);


// 3. Students List Tab (Unchanged)
const renderStudentsTab = ({ filteredStudents, searchTerm, setSearchTerm, setEditingStudent, deleteStudent }) => (
    // ... (Students List Tab JSX) ...
    <div className="student-list-container">
        <h3>Students List ({filteredStudents.length} Records)</h3>
        <div className="search-bar">
            <FaSearch className="search-icon" />
            <input placeholder="Search by Name or Student ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        
        {filteredStudents.length === 0 && <p className="no-results">No students match your search.</p>}

        <table className="data-table">
            <thead><tr><th>Name</th><th>Student ID</th><th>Department</th><th>Address</th><th className="action-col">Actions</th></tr></thead>
            <tbody>
                {filteredStudents.map((s) => (
                    <tr key={s._id}>
                        <td>{s.name}</td>
                        <td>{s.studentId}</td>
                        <td>{s.department}</td>
                        <td>{s.address}</td>
                        <td className="action-col">
                            <button className="icon-btn edit-btn" onClick={() => setEditingStudent(s)}><FaEdit /></button>
                            <button className="icon-btn delete-btn" onClick={() => deleteStudent(s._id)}><FaTrash /></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);


// 4. View Requests Tab (Unchanged)
const renderRequestsTab = ({ pending, decide }) => (
    // ... (View Requests Tab JSX) ...
    <div className="requests-section">
        <h3>Pending Gatepasses ({pending.length})</h3>
        {pending.length === 0 && <p>No pending requests</p>}
        {pending.map((p) => (
            <div key={p._id} className="request-card">
                <p><strong>{p.student.name} ({p.student.studentId})</strong></p>
                <p>Reason: {p.reason}</p>
                <p>Out: {new Date(p.outDate).toLocaleString()}</p>
                <p>Status: {p.status}</p>
                <div className="request-actions">
                    <button className="approve-btn" onClick={() => decide(p._id, "approve")}>Approve</button>
                    <button className="reject-btn" onClick={() => decide(p._id, "reject")}>Reject</button>
                </div>
            </div>
        ))}
    </div>
);

// 5. NEW: Gatepass History Tab
const renderHistoryTab = ({ filteredHistory, historySearchTerm, setHistorySearchTerm }) => (
    <div className="history-section">
        <h3>Full Gatepass History ({filteredHistory.length} Passes)</h3>
        
        <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
                placeholder="Search by Student ID, Name, or Status..."
                value={historySearchTerm}
                onChange={(e) => setHistorySearchTerm(e.target.value)}
            />
        </div>
        
        {filteredHistory.length === 0 && <p className="no-results">No gatepasses found matching your criteria.</p>}

        <table className="data-table">
            <thead>
                <tr>
                    <th>Student</th>
                    <th>ID</th>
                    <th>Reason</th>
                    <th>Date Out</th>
                    <th>Status</th>
                    <th>Decided By</th>
                </tr>
            </thead>
            <tbody>
                {filteredHistory.map((p) => (
                    <tr key={p._id}>
                        <td>{p.student.name}</td>
                        <td>{p.student.studentId}</td>
                        <td>{p.reason.substring(0, 30)}...</td> {/* Truncate long reasons */}
                        <td>{new Date(p.outDate).toLocaleDateString()}</td>
                        <td className={`status-${p.status.toLowerCase()}`}>{p.status}</td>
                        <td>{p.admin ? p.admin.username : 'N/A'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);


// --- Main AdminDashboard Component ---

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [pending, setPending] = useState([]);
    const [allGatepasses, setAllGatepasses] = useState([]); // NEW STATE
    const [searchTerm, setSearchTerm] = useState("");
    const [historySearchTerm, setHistorySearchTerm] = useState(""); // NEW HISTORY SEARCH STATE
    const [editingStudent, setEditingStudent] = useState(null);
    const [form, setForm] = useState({
        name: "", studentId: "", password: "", department: "", address: "",
    });
    const [activeTab, setActiveTab] = useState("home"); 
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        if (!user || user.role !== "admin") return navigate("/admin-login");
        fetchStudents();
        fetchPending();
        fetchAllGatepasses(); // NEW FETCH
    }, []);

    const fetchStudents = async () => { /* ... (Existing logic) ... */
        try {
            const res = await API.get("/admin/students");
            setStudents(res.data.students);
        } catch (err) {
            console.error("Failed to fetch students.", err);
            alert("Failed to fetch students.");
        }
    };

    const fetchPending = async () => { /* ... (Existing logic) ... */
        try {
            const res = await API.get("/admin/gatepasses/pending");
            setPending(res.data.pending);
        } catch (err) {
            console.error("Failed to fetch pending requests.", err);
            alert("Failed to fetch pending requests.");
        }
    };
    
    // NEW: Function to fetch all gatepasses for the History tab
    const fetchAllGatepasses = async () => {
        try {
            const res = await API.get("/admin/gatepasses/history"); // ASSUMES new API endpoint
            setAllGatepasses(res.data.gatepasses);
        } catch (err) {
            console.error("Failed to fetch all gatepasses.", err);
        }
    };


    const createStudent = async () => { /* ... (Existing logic) ... */
        try {
            await API.post("/admin/students", form);
            setForm({ name: "", studentId: "", password: "", department: "", address: "", });
            fetchStudents();
            alert("Student added successfully!");
            setActiveTab('students'); 
        } catch (e) {
            alert(e.response?.data?.message || "Error creating student.");
        }
    };

    const deleteStudent = async (id) => { /* ... (Existing logic) ... */
        if (!window.confirm("Are you sure you want to delete this student?")) return;
        try {
            await API.delete(`/admin/students/${id}`);
            fetchStudents();
        } catch (e) {
            alert("Error deleting student.");
        }
    };

    const saveEdit = async () => { /* ... (Existing logic) ... */
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

    const decide = async (id, action) => { /* ... (Existing logic) ... */
        try {
            await API.post(`/admin/gatepasses/${id}/decide`, { action });
            fetchPending();
            fetchAllGatepasses(); // Update history when a decision is made
        } catch (e) {
            alert("Error deciding gatepass.");
        }
    };

    const handleLogout = () => { /* ... (Existing logic) ... */
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/admin-login");
    };

    // Filtering Logic for Students List
    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentId.includes(searchTerm)
    );
    
    // NEW Filtering Logic for History List
    const filteredHistory = allGatepasses.filter(p => {
        const term = historySearchTerm.toLowerCase();
        return (
            p.student.name.toLowerCase().includes(term) ||
            p.student.studentId.includes(term) ||
            p.status.toLowerCase().includes(term) ||
            (p.admin && p.admin.username.toLowerCase().includes(term))
        );
    });
    
    const chartData = processChartData(students);

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h2>Admin Dashboard</h2>
                <button className="logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                </button>
            </div>

            {/* --- Tab Buttons (NOW 5 TABS) --- */}
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
                {/* NEW HISTORY TAB BUTTON */}
                <button
                    className={activeTab === "history" ? "primary-action-btn" : "secondary-action-btn"}
                    onClick={() => setActiveTab("history")}
                >
                    <FaHistory /> History
                </button>
            </div>

            {/* --- Content Area - Conditional Rendering --- */}
            <div className="tab-content">
                {activeTab === "home" && renderHomeTab({ students, pending, chartData })} 
                {activeTab === "students" && renderStudentsTab({ filteredStudents, searchTerm, setSearchTerm, setEditingStudent, deleteStudent })}
                {activeTab === "addStudent" && renderAddStudentTab({ form, setForm, createStudent })}
                {activeTab === "viewRequests" && renderRequestsTab({ pending, decide })}
                {/* NEW HISTORY TAB CONTENT */}
                {activeTab === "history" && renderHistoryTab({ filteredHistory, historySearchTerm, setHistorySearchTerm })}
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