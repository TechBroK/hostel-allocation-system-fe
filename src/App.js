import {Routes, Route, BrowserRouter as Router } from "react-router-dom";
import './App.css';
import Header from './component/header';
import Home from "./pages/Home";
import Footer from './component/footer'
import Login from './auth/Login';
import Hostel from "./pages/hostel";
import Allocation from './pages/Allocation';
import Profile from './pages/profile';

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
          <Route path="/login" element={<Header />} />
          <Route path="/forgot-password" element={<Header />} />
          <Route path="/student-login" element={<Login userType="student" />} />
          <Route path="/admin-login" element={<Login userType="admin" />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
