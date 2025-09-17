import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/header.css';
import 'boxicons/css/boxicons.min.css';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false); // Close menu after navigation
  };

  // Close dropdown and menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      
      // Check if click is outside menu and not on menu button
      if (menuRef.current && 
          !menuRef.current.contains(event.target) && 
          !event.target.closest('.mobile-menu-btn')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auth state: check if user is logged in
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Listen for login/logout changes
  useEffect(() => {
    const onStorage = () => {
      const raw = localStorage.getItem('user');
      setUser(raw ? JSON.parse(raw) : null);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            <i className="bx bxs-building-house"></i>
            <h1>Hostel Allocation System</h1>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn" 
          onClick={toggleMenu} 
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <i className={`bx ${isMenuOpen ? 'bx-x' : 'bx-menu'}`}></i>
        </button>

        {/* Nav Links */}
        <nav 
          className={`nav-menu ${isMenuOpen ? 'active' : ''}`}
          ref={menuRef}
        >
          <ul>
            {!user ? (
              <>
                <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
                <li className="dropdown" ref={dropdownRef}>
                  <button 
                    className="dropdown-btn" 
                    onClick={toggleDropdown}
                    aria-expanded={showDropdown}
                  >
                    Login <span className="arrow">{showDropdown ? '▲' : '▼'}</span>
                  </button>
                  {showDropdown && (
                    <div className="dropdown-content">
                      <Link 
                        to="/student-login" 
                        onClick={() => {
                          setShowDropdown(false);
                          setIsMenuOpen(false);
                        }}
                      >
                        Student Login
                      </Link>
                      <Link 
                        to="/admin-login"
                        onClick={() => {
                          setShowDropdown(false);
                          setIsMenuOpen(false);
                        }}
                      >
                        Admin Login
                      </Link>
                    </div>
                  )}
                </li>
              </>
            ) : (
              <>
                <li><Link to="/hostels" onClick={() => setIsMenuOpen(false)}>Hostels</Link></li>
                <li><Link to="/allocations" onClick={() => setIsMenuOpen(false)}>Allocations</Link></li>
                <li><Link to="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link></li>
                {user && user.role === 'admin' ? (
                  <li>
                    <button className="logout-btn" onClick={handleLogout}>
                      <i className="bx bx-log-out"></i> Logout
                    </button>
                  </li>
                ) : (
                  <li className="dropdown" ref={dropdownRef}>
                    <button 
                      className="dropdown-btn" 
                      onClick={toggleDropdown}
                      aria-expanded={showDropdown}
                    >
                      <i className="bx bx-user-circle"></i> Account <span className="arrow">{showDropdown ? '▲' : '▼'}</span>
                    </button>
                    {showDropdown && (
                      <div className="dropdown-content">
                        <button className="logout-btn" onClick={handleLogout} style={{width: '100%', textAlign: 'left', background: 'none', color: '#333', padding: '12px 16px', border: 'none'}}>
                          <i className="bx bx-log-out"></i> Logout
                        </button>
                      </div>
                    )}
                  </li>
                )}
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
