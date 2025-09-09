import {Routes, Route, BrowserRouter as Router } from "react-router-dom";
import './App.css';
import Home from "./pages/sharedPage/Home";
import AuthForm from './auth/AuthForm';
import Hostel from "./pages/sharedPage/hostel";
import Allocation from './pages/studentPage/Allocation';
import Profile from './pages/studentPage/profile';
import AdminDashboard from "./pages/adminFolder/AdminDashboard";

function App() {
  return (
    <div>
      <Router>
       
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hostels" element={<Hostel />} />
          <Route path="/allocations" element={<Allocation />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/student-login" element={<AuthForm userType="student" />} />
           <Route path="/admin-login" element={<AuthForm userType="admin" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
