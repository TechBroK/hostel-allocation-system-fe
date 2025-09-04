import {Routes, Route, BrowserRouter as Router } from "react-router-dom";
import './App.css';
import Header from './component/header';
import Home from "./pages/sharedPage/Home";
import Footer from './component/footer'
import AuthForm from './auth/AuthForm';
import Hostel from "./pages/sharedPage/hostel";
import Allocation from './pages/studentPage/Allocation';
import Profile from './pages/studentPage/profile';
import AdminDashbord from "./pages/adminFolder/adminPage";

function App() {
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hostels" element={<Hostel />} />
          <Route path="/allocations" element={<Allocation />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/AuthForm" element={<AdminDashbord/>} />
          <Route path="/forgot-password" element={<Header />} />
          <Route path="/student-login" element={<AuthForm userType="student" />} />
          <Route path="/admin-login" element={<AuthForm userType="admin" />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
