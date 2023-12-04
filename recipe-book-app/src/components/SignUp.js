import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook

    const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    });

    const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      
        const response = await axios.post('http://localhost:5000/api/register', formData);

 
        console.log('Registration successful:', response.data);
      navigate('/login'); 
    } catch (error) {
    
        console.error('Error registering user:', error.response.data.message);
    }
    };

    return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', margin: '0 5px' }}>
        <div style={{ width: '300px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', color: 'white' }}>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
            <label>
            Username:
            <input type="text" name="username" value={formData.username} onChange={handleChange} />
            </label>
            <br />
            <label>
            Email:
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </label>
            <br />
            <label>
            Password:
            <input type="password" name="password" value={formData.password} onChange={handleChange} />
            </label>
            <br />
            <button type="submit">Sign Up</button>
            <p>
            Already have an account? <Link to="/login"style={{ color: 'yellow' }}>Login here</Link>.
            </p>
        </form>
        </div>
    </div>
    );
};

export default SignUp;