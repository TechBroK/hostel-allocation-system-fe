import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/admin.css";

const Sidebar = () => {
  const location = useLocation();
  return (
    <aside className="sidebar">
      <h2>Admin Panel</h2>
      <nav>
        <Link to="/admin/dashboard" className={location.pathname === "/admin/dashboard" ? "active" : ""}>Dashboard</Link>
        <Link to="/admin/students" className={location.pathname === "/admin/students" ? "active" : ""}>Manage Students</Link>
        <Link to="/admin/hostels" className={location.pathname === "/admin/hostels" ? "active" : ""}>Manage Hostels</Link>
        <Link to="/admin/allocation" className={location.pathname === "/admin/allocation" ? "active" : ""}>Allocation</Link>
        <Link to="/admin/reports" className={location.pathname === "/admin/reports" ? "active" : ""}>Reports</Link>
      </nav>
    </aside>
  );
};

const HomePage = () => (
  <div className="page-container">
    <div className="page-header">Welcome to Hostel Allocation System</div>
    <div className="page-section">
      <h2>Latest Updates</h2>
      {/* ...content... */}
    </div>
    <div className="page-section">
      <h2>How It Works</h2>
      {/* ...content... */}
    </div>
  </div>
);

export default function AdminDashboard() {
