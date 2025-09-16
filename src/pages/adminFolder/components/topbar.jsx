import React from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/admin.css"; 

const Topbar = ({ adminName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="topbar">
      <span className="admin-name">Welcome, {adminName}</span>
      <div className="topbar-actions">
        {/* Notification Bell */}
        <button className="notification-btn" title="Notifications">
          <span role="img" aria-label="bell">🔔</span>
        </button>
        {/* Logout Button */}
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          <span role="img" aria-label="logout">🚪</span> Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;
