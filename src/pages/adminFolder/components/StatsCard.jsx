import React from "react";
import "../../../styles/admin.css"; 

const StatsCard = ({ title, value, icon }) => (
  <div className="stat-card">
    <i className={icon}></i>
    <div className="stat-info">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  </div>
);

export default StatsCard;
