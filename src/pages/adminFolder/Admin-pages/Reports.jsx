import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/topbar";
import "../../../styles/admin.css";

const Reports = () => {

  const handleExport = () => {
    // Implement export logic here
    alert("Exported!");
  };


  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="admin-section p-6">
          <h2 className="text-2xl font-bold mb-4">Reports</h2>
          <p>Download and view allocation and hostel reports here.</p>
          <button className="admin-btn" onClick={handleExport}>Export CSV</button>
      {/* ...other report content... */}
          {/* Add report download/export features */}
        </div>
      </div>
    </div>
  );
};

export default Reports;
