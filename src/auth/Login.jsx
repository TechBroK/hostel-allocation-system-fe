import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Login.css'; 

const Login = ({ userType }) => {
  const [formData, setFormData] = useState({
    matricNumber: '',
    surname: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Add your authentication logic here
      console.log('Login attempt:', formData);
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <i className='bx bxs-user-circle'></i>
          <h2>{userType === 'admin' ? 'Admin Login' : 'Student Login'}</h2>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="matricNumber">
              <i className='bx bx-id-card'></i>
              Matric Number
            </label>
            <input
              type="text"
              id="matricNumber"
              name="matricNumber"
              value={formData.matricNumber}
              onChange={handleChange}
              required
              placeholder="Enter your matric number"
              pattern="[0-9]{8}"
              title="Please enter a valid 8-digit matric number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="surname">
              <i className='bx bx-user'></i>
              Surname
            </label>
            <input
              type="password"
              id="surname"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              required
              placeholder="Enter your surname"
            />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <div className="login-footer">
          <Link to="/change-password">Change Password</Link>
          {userType !== 'admin' && (
            <p>
              New Student? <Link to="/register">Register</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;