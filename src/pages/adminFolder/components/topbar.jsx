import React from "react";
import "../../../styles/admin.css"; 

const Topbar = ({ adminName }) => (
  <div className="topbar">
    <span className="admin-name">Welcome, {adminName}</span>
    {/* Add logout or notifications if needed */}
  </div>
);

export default Topbar;
