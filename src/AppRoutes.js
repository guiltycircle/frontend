import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Registration from './pages/Registration';
import Login from './pages/Login';
import AppointmentBooking from './pages/AppointmentBooking';
import Reminders from './pages/Reminders';
import Reporting from './pages/Reporting';
import PatientRegistration from './pages/PatientRegistration';
import StaffRegistration from './pages/StaffRegistration';

function AppRoutes() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      <nav style={{ padding: '1rem', background: '#f0f0f0' }}>
        <Link to="/register/patient" style={{ marginRight: '1rem' }}>Register as Patient</Link>
        <Link to="/register/staff" style={{ marginRight: '1rem' }}>Register as Staff</Link>
        <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
        <Link to="/book" style={{ marginRight: '1rem' }}>Book Appointment</Link>
        <Link to="/reminders" style={{ marginRight: '1rem' }}>Reminders</Link>
        <Link to="/reporting" style={{ marginRight: '1rem' }}>Reporting</Link>
        <button onClick={handleLogout} style={{ marginLeft: '1rem', padding: '0.5rem 1rem', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          Logout
        </button>
      </nav>
      <Routes>
        <Route path="/register/patient" element={<PatientRegistration />} />
        <Route path="/register/staff" element={<StaffRegistration />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/book" element={<AppointmentBooking />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/reporting" element={<Reporting />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </>
  );
}

export default AppRoutes; 