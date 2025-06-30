import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Registration from './pages/Registration';
import Login from './pages/Login';
import AppointmentBooking from './pages/AppointmentBooking';
import Reminders from './pages/Reminders';
import Reporting from './pages/Reporting';
import './App.css';

function App() {
  return (
    <Router>
      <nav style={{ padding: '1rem', background: '#f0f0f0' }}>
        <Link to="/register" style={{ marginRight: '1rem' }}>Register</Link>
        <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
        <Link to="/book" style={{ marginRight: '1rem' }}>Book Appointment</Link>
        <Link to="/reminders" style={{ marginRight: '1rem' }}>Reminders</Link>
        <Link to="/reporting">Reporting</Link>
      </nav>
      <Routes>
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/book" element={<AppointmentBooking />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/reporting" element={<Reporting />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
