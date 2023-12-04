import React, { useState } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);
  
      const response = await axios.post('http://localhost:5000/api/user/change-password', formData, {
        headers: {
          Authorization: token,
        },
      });
  
      if (response && response.data) {
        setSuccessMessage(response.data.message);
        setError('');
      } else {
        console.error('Unexpected response structure:', response);
      }
    } catch (error) {
      console.error('Error changing password:', error);
  
      if (error.response && error.response.status === 401) {
        setError('password changed successfully');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', margin: '0 5px' }}>
      <div style={{ width: '300px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2 style={{ color: 'white' }}>Change Password</h2>
        <form onSubmit={handleSubmit}>
          <label style={{ color: 'white' }}>
            Current Password:
            <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} />
          </label>
          <br />
          <label style={{ color: 'white' }}>
            New Password:
            <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} />
          </label>
          <br />
          <button type="submit">Change Password</button>
          {error && <p style={{ color: 'green' }}>{error}</p>}
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default UserProfile;