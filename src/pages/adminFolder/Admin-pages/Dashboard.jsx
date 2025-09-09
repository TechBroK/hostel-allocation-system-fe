import React, { useState, useMemo } from "react";
import "../../../styles/admin.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/topbar";
import StatsCard from "../components/StatsCard";

// Example allocation data
const allocationsData = [
  {
    regNo: "CSC/1234",
    student: "John Doe",
    room: "A101",
    capacity: 4,
    duration: "2024/2025",
    status: "Pending",
  },
  {
    regNo: "CSC/5678",
    student: "Jane Smith",
    room: "B202",
    capacity: 2,
    duration: "2024/2025",
    status: "Approved",
  },
  {
    regNo: "CSC/9101",
    student: "Sam Lee",
    room: "C303",
    capacity: 4,
    duration: "2024/2025",
    status: "Pending",
  },
];

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // Filter and search logic
  const filteredAllocations = useMemo(() => {
    return allocationsData.filter(a =>
      (a.student.toLowerCase().includes(search.toLowerCase()) ||
        a.regNo.toLowerCase().includes(search.toLowerCase())) &&
      (filter === "all" || a.status === filter)
    );
  }, [search, filter]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Topbar adminName="admin-main" />
        <div className="p-6">
          {/* Stats Cards */}
          <div className="stats-grid" style={{ marginBottom: "2rem" }}>
            <StatsCard title="Total Students" value={120} icon="fi fi-rr-users" />
            <StatsCard title="Available Rooms" value={45} icon="fi fi-rr-home" />
            <StatsCard title="Occupied Rooms" value={75} icon="fi fi-rr-bed" />
            <StatsCard title="Pending Allocations" value={10} icon="fi fi-rr-clock" />
          </div>

          {/* Allocation Table */}
          <div className="admin-section">
            <h2>Recent Allocations</h2>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <input
                className="search-input"
                placeholder="Search by name or reg. no..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Reg. No</th>
                  <th>Student Name</th>
                  <th>Room No</th>
                  <th>Capacity</th>
                  <th>Stay Duration</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAllocations.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center" }}>No records found.</td>
                  </tr>
                ) : (
                  filteredAllocations.map((a, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{a.regNo}</td>
                      <td>{a.student}</td>
                      <td>{a.room}</td>
                      <td>{a.capacity}</td>
                      <td>{a.duration}</td>
                      <td>
                        {a.status === "Pending" ? (
                          <>
                            <button className="admin-btn" style={{ background: "#27ae60" }}>Approve</button>
                            <button className="admin-btn" style={{ background: "#e74c3c" }}>Reject</button>
                          </>
                        ) : (
                          <span style={{ color: "#27ae60", fontWeight: 600 }}>Approved</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
