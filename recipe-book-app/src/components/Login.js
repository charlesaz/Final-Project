
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ setAuthenticated }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      
      const response = await axios.post('http://localhost:5000/api/login', formData);
  
      if (response && response.data) {
      
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('token', response.data.token);
  
 
        setAuthenticated(true);
        
        
        navigate('/');
      } else {
        console.error('Unexpected response structure:', response);
      }
    } catch (error) {
      console.error('Error logging in:', error);
  
      if (error.response && error.response.status === 401) {
        setError('Invalid credentials. User does not exist.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div style={{ width: '300px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' , color: 'white'}}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Username:
            <input type="text" name="username" value={formData.username} onChange={handleChange} />
          </label>
          <br />
          <label>
            Password:
            <input type="password" name="password" value={formData.password} onChange={handleChange} />
          </label>
          <br />
          <button type="submit">Login</button>
          {error && <p style={{ color: 'yellow' }}>{error}</p>}
          <p>
            Don't have an account? <Link to="/signup"style={{ color: 'yellow' }}>Sign Up here</Link>.
          </p>
        </form>
      </div>
    </div>
  );
};


export default Login;