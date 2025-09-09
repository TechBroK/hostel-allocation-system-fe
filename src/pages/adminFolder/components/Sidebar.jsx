import React from "react";
import "../../../styles/admin.css";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <h2>Admin Panel</h2>
      <nav>
        <Link
          to="/admin/dashboard"
          className={location.pathname === "/admin/dashboard" ? "active" : ""}
        >
          Dashboard
        </Link>
        <Link
          to="/admin/students"
          className={location.pathname === "/admin/students" ? "active" : ""}
        >
          Manage Students
        </Link>
        <Link
          to="/admin/hostels"
          className={location.pathname === "/admin/hostels" ? "active" : ""}
        >
          Manage Hostels
        </Link>
        <Link
          to="/admin/allocation"
          className={location.pathname === "/admin/allocation" ? "active" : ""}
        >
          Allocation
        </Link>
        <Link
          to="/admin/reports"
          className={location.pathname === "/admin/reports" ? "active" : ""}
        >
          Reports
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
