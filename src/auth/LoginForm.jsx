
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../utils/api";
import Alert from "../component/Alert";
import "../styles/alert.css";


const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [alert, setAlert] = useState({ open: false, type: "info", message: "" });
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotAlert, setForgotAlert] = useState({ open: false, type: "info", message: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authApi.login(formData);
      // Store token and user data
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      setAlert({ 
        open: true, 
        type: "success", 
        message: "Login successful! Redirecting..." 
      });
      
      // Redirect based on user role
      setTimeout(() => {
        const user = res.data.user;
        if (user.role === 'admin') {
          navigate("/admin/dashboard");
        } else {
          navigate("/hostels");
        }
      }, 1500);
    } catch (err) {
      setAlert({ 
        open: true, 
        type: "error", 
        message: err.response?.data?.message || "Invalid credentials" 
      });
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    try {
      await authApi.forgotPassword(forgotEmail);
      setForgotAlert({ 
        open: true, 
        type: "success", 
        message: "Password reset link sent! Check your email." 
      });
      // Reset form and show login after 3 seconds
      setForgotEmail("");
      setTimeout(() => {
        setShowForgot(false);
      }, 3000);
    } catch (err) {
      setForgotAlert({ 
        open: true, 
        type: "error", 
        message: err.response?.data?.message || "Error sending reset link." 
      });
    }
  };

  return (
    <div className="form-box login">
      {!showForgot ? (
        <form onSubmit={handleSubmit}>
          <h1>LogIn</h1>
          <div className="input-box">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <i className="bx bxs-user"></i>
          </div>
          <div className="input-box">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <i className="bx bxs-lock-alt"></i>
          </div>
          <div className="forgot-link">
            <a type="button" className="link-btn" onClick={() => setShowForgot(true)}>
              Forgot Password?
            </a>
          </div>
          <button type="submit" className="btn">LogIn</button>
          <Alert
            open={alert.open}
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ ...alert, open: false })}
            duration={3000}
          />
          <p>or login with social platforms.</p>
          <div className="social-icons">
            <a href="#"><i className="bx bxl-google"></i></a>
            <a href="#"><i className="bx bxl-facebook"></i></a>
            <a href="#"><i className="bx bxl-github"></i></a>
            <a href="#"><i className="bx bxl-linkedin"></i></a>
          </div>
        </form>
      ) : (
        <form onSubmit={handleForgot}>
          <h1>Forgot Password</h1>
          <div className="input-box">
            <input
              type="email"
              name="forgotEmail"
              placeholder="Enter your email address"
              value={forgotEmail}
              onChange={e => setForgotEmail(e.target.value)}
              required
            />
            <i className="bx bxs-envelope"></i>
          </div>
          <button type="submit" className="btn">Send Reset Link</button>
          <button type="button" className="link-btn" onClick={() => setShowForgot(false)}>
            Back to Login
          </button>
          <Alert
            open={forgotAlert.open}
            type={forgotAlert.type}
            message={forgotAlert.message}
            onClose={() => setForgotAlert({ ...forgotAlert, open: false })}
            duration={3000}
          />
        </form>
      )}
    </div>
  );
};

export default LoginForm;
