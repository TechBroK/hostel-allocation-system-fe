import React from "react";
import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/topbar";
import StatsCard from "./components/StatsCard";
import Dashboard from "./Admin-pages/Dashboard";
import ManageStudents from "./Admin-pages/ManageStudents";
import ManageHostels from "./Admin-pages/ManageHostels";
import AllocationControl from "./Admin-pages/AllocationControl";
import Reports from "./Admin-pages/Reports";
import AuthForm from "../../auth/AuthForm";
import "../../styles/admin.css";


const AdminDashboard = () => {
  return (
    <div className="adflex">
      <div className="flex-1 ml-64 admin-main">
        {/* <Topbar adminName="Admin" /> */}
        <div className="p-6">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students" element={<ManageStudents />} />
            <Route path="hostels" element={<ManageHostels />} />
            <Route path="allocation" element={<AllocationControl />} />
            
            <Route path="reports" element={<Reports />} />
            <Route path="login" element={<AuthForm userType="admin" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
