import React from "react";
import Sidebar from "../adminFolder/components/Sidebar";
import Topbar from "../adminFolder/components/topbar";
import StatsCard from "../adminFolder/components/StatsCard";

const AdminDashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar adminName="Admin" />
        <div className="p-6 grid grid-cols-4 gap-4">
          <StatsCard title="Total Students" value={120} />
          <StatsCard title="Available Rooms" value={45} />
          <StatsCard title="Occupied Rooms" value={75} />
          <StatsCard title="Pending Allocations" value={10} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
