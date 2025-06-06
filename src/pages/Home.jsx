import '../component/styles/home.css';
import hostelImage1 from '../assets/images/hostel1.jpg';
import hostelImage2 from '../assets/images/hostel2.jpg';
import hostelImage3 from '../assets/images/hostel3.jpg';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Our Hostel Allocation System</h1>
          <p>Find and secure your perfect campus accommodation.</p>
          <Link to='/register'>
          <button className="cta-button">Get Started</button>          
          </Link>
        </div>
      </section>

      <section className="features">
        <h2>Our Services</h2>
        <div className="features-grid">
          <div className="feature-card">
            <i className='bx bxs-home-circle'></i>
            <h3>Room Selection</h3>
            <p>Choose from various room types and locations</p>
          </div>
          <div className="feature-card">
            <i className='bx bxs-user-detail'></i>
            <h3>View User Details</h3>
            <p>Know about your roommate before even meeting them</p>
          </div>
          <div className="feature-card">
            <i className='bx bxs-check-shield'></i>
            <h3>Secure Booking</h3>
            <p>Safe and reliable allocation process</p>
          </div>
          <div className="feature-card">
            <i className='bx bxs-user-account'></i>
            <h3>24/7 Support</h3>
            <p>Round-the-clock assistance for all students</p>
          </div>
        </div>
      </section>

      <section className="hostels-preview">
        <h2>Featured Hostels</h2>
        <div className="hostel-cards">
          <div className="hostel-card">
            <img src={hostelImage1} alt="Hostel Block A" />
            <h3>Female Hostel</h3>
            <p>Modern facilities with comfortable rooms</p>
          </div>
          <div className="hostel-card">
            <img src={hostelImage2} alt="Hostel Block B" />
            <h3>Male Hostel</h3>
            <p>Spacious rooms with great amenities</p>
          </div>
          <div className="hostel-card">
            <img src={hostelImage3} alt="Hostel Block C" />
            <h3>Mixed Hostel</h3>
            <p>Premium accommodation with study areas</p>
          </div>
        </div>
      </section>

      <section className="why-choose-us">
        <h2>Why Choose Us</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <i className="fi fi-rr-time-fast"></i>
            <h3>Quick Allocation</h3>
            <p>Get your hostel space allocated within minutes using our automated system</p>
          </div>
          
          <div className="benefit-card">
            <i className="fi fi-rr-shield-check"></i>
            <h3>Secure Process</h3>
            <p>Advanced security measures to protect your personal information</p>
          </div>
          
          <div className="benefit-card">
            <i className="fi fi-rr-headset"></i>
            <h3>24/7 Support</h3>
            <p>Round-the-clock assistance for all your accommodation needs</p>
          </div>
          
          <div className="benefit-card">
            <i className="fi fi-rr-apps"></i>
            <h3>Flexible Options</h3>
            <p>Choose from a variety of room types and locations</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;