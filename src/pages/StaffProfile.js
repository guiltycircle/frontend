import React, { useEffect, useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const StaffProfile = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState('');
  const staff = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!staff || !staff._id) {
        setError('Staff info not found.');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/appointments?staff=${staff._id}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Failed to load appointments.');
        } else {
          setAppointments(data);
        }
      } catch (err) {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [staff, updating]);

  const handleCheck = async (apptId) => {
    setUpdating(apptId);
    try {
      const res = await fetch(`${API_URL}/appointments/${apptId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'done' }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Failed to update appointment.');
      } else {
        setError('');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setUpdating('');
    }
  };

  if (!staff || staff.role !== 'staff') {
    return <div style={{ padding: 32 }}>You must be logged in as staff to view this page.</div>;
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', background: '#fff', padding: 32, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <h2>Staff Profile</h2>
      <div style={{ marginBottom: 24 }}>
        <strong>Name:</strong> {staff.name}<br />
        <strong>Email:</strong> {staff.email}<br />
        <strong>Role:</strong> {staff.role}
      </div>
      <h3>Appointments Booked for You</h3>
      {loading ? (
        <div>Loading appointments...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : appointments.length === 0 ? (
        <div>No appointments found.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 8 }}>Patient</th>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 8 }}>Date</th>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 8 }}>Status</th>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 8 }}>Done?</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt._id}>
                <td style={{ padding: 8 }}>{appt.patient?.name || 'Unknown'}</td>
                <td style={{ padding: 8 }}>{new Date(appt.date).toLocaleString()}</td>
                <td style={{ padding: 8 }}>{appt.status}</td>
                <td style={{ padding: 8 }}>
                  <input
                    type="checkbox"
                    checked={appt.status === 'done'}
                    disabled={appt.status === 'done' || updating === appt._id}
                    onChange={() => handleCheck(appt._id)}
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

export default StaffProfile; 