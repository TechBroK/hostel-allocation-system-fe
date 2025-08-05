import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>Hostel Allocation System provides efficient and reliable accommodation services for students.</p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <i className='bx bxl-facebook'></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className='bx bxl-twitter'></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <i className='bx bxl-instagram'></i>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/hostels">Hostels</Link></li>
            <li><Link to="/allocations">Allocations</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Info</h3>
          <ul className="contact-info">
            <li>
              <i className='bx bxs-map'></i>
              123 University Road, Campus Area
            </li>
            <li>
              <i className='bx bxs-phone'></i>
              +234 123 456 7890
            </li>
            <li>
              <i className='bx bxs-envelope'></i>
              info@hostelallocation.com
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Hostel Allocation System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;