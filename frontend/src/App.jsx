import React from 'react';
import axios from 'axios';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import StudentLogin from './pages/StudentLogin';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import LandingPage from './pages/LandingPage';
const API = axios.create({ baseURL: 'http://localhost:5000/api' });

function App(){
  return (
    <Routes>
        <Route path="/" element={<LandingPage />} />
      <Route path="/admin-login" element={<AdminLogin />} /> 
      <Route path="/student-login" element={<StudentLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
export { API };
export default App;
