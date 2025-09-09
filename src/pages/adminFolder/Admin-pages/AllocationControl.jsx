import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/topbar";
import AllocationTable from "../components/AllocationTable";
import "../../../styles/admin.css"; 

const allocations = [
  { student: "John Doe", matric: "CSC/1234", hostel: "Hostel A", room: "A101" },
  { student: "Jane Smith", matric: "CSC/5678", hostel: "Hostel B", room: "B202" },
];

const AllocationControl = () => (
  <div className="flex">
    <Sidebar />
    <div className="flex-1 ml-64">
      <Topbar adminName="Admin" />
      <div className="p-6 admin-section">
        <h2>Allocation Control</h2>
        <AllocationTable allocations={allocations} />
      </div>
    </div>
  </div>
);

export default AllocationControl;
