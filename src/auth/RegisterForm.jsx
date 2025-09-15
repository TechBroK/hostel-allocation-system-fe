
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../utils/api";
import Alert from "../component/Alert";
import "../styles/alert.css";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    matricNumber: "",
    level: "",
    phone: ""
  });
  const [alert, setAlert] = useState({ open: false, type: "info", message: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authApi.register(formData);
      setAlert({ 
        open: true, 
        type: "success", 
        message: "Registration successful! Redirecting to login..." 
      });
      
      setFormData({
        fullName: "",
        email: "",
        matricNumber: "",
        password: "",
        level: "",
        phone: ""
      });
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setAlert({
        open: true,
        type: "error",
        message: err.response?.data?.message || "Registration failed. Please try again."
      });
    }
  };

  return (
    <div className="form-box register">
      <form onSubmit={handleSubmit}>
        <h1>Registration</h1>

        <div className="input-box">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <i className="bx bxs-user"></i>
        </div>

        <div className="input-box">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <i className="bx bxs-envelope"></i>
        </div>

        <div className="input-box">
          <input
            type="text"
            name="matricNumber"
            placeholder="Matric Number"
            value={formData.matricNumber}
            onChange={handleChange}
          />
          <i className="bx bxs-id-card"></i>
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

        <button type="submit" className="btn">Register</button>
        <Alert
          open={alert.open}
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ ...alert, open: false })}
          duration={3000}
        />
      </form>
    </div>
  );
};

export default RegisterForm;
