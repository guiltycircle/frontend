import React, { useEffect, useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AppointmentBooking = () => {
  const [staffList, setStaffList] = useState([]);
  const [form, setForm] = useState({ staff: '', date: '', time: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Fetch staff users
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch(`${API_URL}/users?role=staff`);
        const data = await res.json();
        setStaffList(data);
      } catch (err) {
        setError('Failed to load staff list.');
      }
    };
    fetchStaff();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    // Get patient ID from localStorage (after login)
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.email) {
      setError('You must be logged in as a patient to book.');
      setLoading(false);
      return;
    }
    if (!form.staff || !form.date || !form.time) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }
    try {
      // Combine date and time into ISO string
      const dateTime = new Date(`${form.date}T${form.time}`);
      const res = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient: user._id, // You may need to adjust this if your user object is different
          staff: form.staff,
          date: dateTime,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Booking failed.');
        setLoading(false);
        return;
      }
      setSuccess('Appointment booked successfully!');
      setForm({ staff: '', date: '', time: '' });
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#f9f9f9' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 32, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', minWidth: 320 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Book Appointment</h2>
        <div style={{ marginBottom: 16 }}>
          <label>Staff:</label><br />
          <select name="staff" value={form.staff} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}>
            <option value="">Select staff</option>
            {staffList.map((staff) => (
              <option key={staff._id} value={staff._id}>{staff.name} ({staff.email})</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Date:</label><br />
          <input type="date" name="date" value={form.date} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Time:</label><br />
          <input type="time" name="time" value={form.time} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: 10, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }} disabled={loading}>{loading ? 'Booking...' : 'Book Appointment'}</button>
        {error && <div style={{ color: 'red', marginTop: 16, textAlign: 'center' }}>{error}</div>}
        {success && <div style={{ color: 'green', marginTop: 16, textAlign: 'center' }}>{success}</div>}
      </form>
    </div>
  );
};

export default AppointmentBooking; 