import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../component/styles/header.css';
import 'boxicons/css/boxicons.min.css';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <i className='bx bxs-building-house'></i>
            <h1>Hostel Allocation System</h1>
          </Link>
        </div>
        <nav className="nav-menu">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/hostels">Hostels</Link></li>
            <li><Link to="/allocations">Allocations</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li className="dropdown">
              <button onClick={toggleDropdown} className="dropdown-btn">
                Login ▼
              </button>
              {showDropdown && (
                <div className="dropdown-content">
                  <Link to="/student-login">Student Login</Link>
                  <Link to="/admin-login">Admin Login</Link>
                </div>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;