import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PatientProfile = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Get logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || user.role !== 'patient') {
      navigate('/login');
      return;
    }
    fetchAppointments();
    // eslint-disable-next-line
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/appointments?patient=${user._id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch appointments');
      setAppointments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (apptId, checked) => {
    try {
      const res = await fetch(`${API_URL}/appointments/${apptId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: checked ? 'done' : 'booked' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update appointment');
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === apptId ? { ...appt, status: checked ? 'done' : 'booked' } : appt
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', background: '#fff', padding: 32, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>My Appointments</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>
      ) : appointments.length === 0 ? (
        <div style={{ textAlign: 'center' }}>No appointments found.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Date</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Staff</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Status</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Done?</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt._id}>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>{new Date(appt.date).toLocaleString()}</td>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>{appt.staff?.name || 'N/A'}</td>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>{appt.status}</td>
                <td style={{ padding: 8, border: '1px solid #ddd', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={appt.status === 'done'}
                    disabled={appt.status === 'done'}
                    onChange={(e) => handleStatusChange(appt._id, e.target.checked)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PatientProfile; 