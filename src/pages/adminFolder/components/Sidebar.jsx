import React, { useEffect, useState } from "react";
import "../../../styles/admin.css";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Always start closed; don't auto-open on resize
    setIsOpen(false);
    const onResize = () => {};
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleNavClick = () => {
    if (window.innerWidth <= 700) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Hamburger button (visible on mobile when sidebar is closed) */}
      <button
        className={`hamburger-btn ${!isOpen ? 'show' : ''}`}
        aria-label="Open menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Overlay for mobile when open */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
          role="button"
          aria-label="Close menu overlay"
        />
      )}

      <aside className={`sidebar ${isOpen ? '' : 'hidden'}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <button
            className="sidebar-close"
            aria-label="Close menu"
            onClick={() => setIsOpen(false)}
          >
            ×
          </button>
        </div>
        <nav>
          <Link
            to="/admin/dashboard"
            onClick={handleNavClick}
            className={location.pathname === "/admin/dashboard" ? "active" : ""}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/students"
            onClick={handleNavClick}
            className={location.pathname === "/admin/students" ? "active" : ""}
          >
            Manage Students
          </Link>
          <Link
            to="/admin/hostels"
            onClick={handleNavClick}
            className={location.pathname === "/admin/hostels" ? "active" : ""}
          >
            Manage Hostels
          </Link>
          <Link
            to="/admin/complaints"
            onClick={handleNavClick}
            className={location.pathname === "/admin/complaints" ? "active" : ""}
          >
            Complaints
          </Link>
          <Link
            to="/admin/reports"
            onClick={handleNavClick}
            className={location.pathname === "/admin/reports" ? "active" : ""}
          >
            Reports
          </Link>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
