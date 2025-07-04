import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const countryCodes = [
  { code: '+254', name: 'Kenya' },
  { code: '+1', name: 'USA' },
  { code: '+44', name: 'UK' },
  { code: '+91', name: 'India' },
  // Add more as needed
];

const PatientRegistration = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', countryCode: '+254' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);

  const validate = () => {
    const newErrors = {};
    if (!form.name || form.name.length < 2) newErrors.name = 'Name is required (min 2 characters).';
    if (!form.email || !validateEmail(form.email)) newErrors.email = 'Valid email is required.';
    if (!form.phone || form.phone.length < 7) newErrors.phone = 'Valid phone number is required.';
    if (!form.password || !validatePassword(form.password)) newErrors.password = 'Password must be at least 6 characters, include a letter and a number.';
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setLoading(true);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, phone: form.countryCode + form.phone, countryCode: undefined, role: 'patient' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ api: data.message || 'Registration failed.' });
        setLoading(false);
        return;
      }
      setSuccess(data.message || 'Registration successful!');
      setForm({ name: '', email: '', password: '', phone: '', countryCode: '+254' });
      setErrors({});
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setErrors({ api: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#f9f9f9' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 32, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', minWidth: 320 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Patient Registration</h2>
        <div style={{ marginBottom: 16 }}>
          <label>Name:</label><br />
          <input type="text" name="name" value={form.name} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
          {errors.name && <div style={{ color: 'red', fontSize: 13 }}>{errors.name}</div>}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Email:</label><br />
          <input type="email" name="email" value={form.email} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
          {errors.email && <div style={{ color: 'red', fontSize: 13 }}>{errors.email}</div>}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Phone Number:</label><br />
          <select name="countryCode" value={form.countryCode} onChange={handleChange} style={{ width: '30%', padding: 8, borderRadius: 4, border: '1px solid #ccc', marginRight: 8 }}>
            {countryCodes.map((c) => (
              <option key={c.code} value={c.code}>{c.code} ({c.name})</option>
            ))}
          </select>
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} style={{ width: '65%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
          {errors.phone && <div style={{ color: 'red', fontSize: 13 }}>{errors.phone}</div>}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Password:</label><br />
          <input type="password" name="password" value={form.password} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
          {errors.password && <div style={{ color: 'red', fontSize: 13 }}>{errors.password}</div>}
        </div>
        <button type="submit" style={{ width: '100%', padding: 10, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }} disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
        {errors.api && <div style={{ color: 'red', marginTop: 16, textAlign: 'center' }}>{errors.api}</div>}
        {success && <div style={{ color: 'green', marginTop: 16, textAlign: 'center' }}>{success}</div>}
      </form>
    </div>
  );
};

export default PatientRegistration; 