
import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/topbar";
import Dashboard from "./Admin-pages/Dashboard";
import ManageStudents from "./Admin-pages/ManageStudents";
import ManageHostels from "./Admin-pages/ManageHostels";
import Reports from "./Admin-pages/Reports";
import Complaints from "./Admin-pages/Complaints.jsx";
import AuthForm from "../../auth/AuthForm";
import Alert from "../../component/Alert";
import "../../styles/admin.css";



// AdminLayout: Sidebar, Topbar, Alert, and main content
const AdminLayout = ({ children }) => {
  // In a real app, use context for alert state
  const [alert, setAlert] = React.useState({ open: false, type: "info", message: "" });
  return (
    <div className="adflex">
      <Sidebar />
      <div className="flex-1 admin-main">
        <Topbar adminName="Admin" />
        <Alert
          open={alert.open}
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ ...alert, open: false })}
          duration={3000}
        />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<ManageStudents />} />
    <Route path="hostels" element={<ManageHostels />} />
  <Route path="complaints" element={<Complaints />} />
        <Route path="reports" element={<Reports />} />
        <Route path="login" element={<AuthForm userType="admin" />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;
