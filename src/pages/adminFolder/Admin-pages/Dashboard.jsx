
import React, { useState, useMemo, useEffect } from "react";
import "../../../styles/admin.css";
import StatsCard from "../components/StatsCard";
import Alert from "../../../component/Alert";
import { adminApi } from "../../../utils/api";
// AllocationTable removed, using inline table for pending allocations only

const Dashboard = () => {
  const [allocationsData, setAllocationsData] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    pendingAllocations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ open: false, type: "info", message: "" });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Only fetch unallocated students now
        const res = await adminApi.getUnallocatedStudents();
        const arr = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setAllocationsData(arr);
        console.log('Fetched unallocated students:', arr);
        setLoading(false);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setAlert({
          open: true,
          type: "error",
          message: err.response?.data?.message || "Error loading dashboard data",
        });
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Filtering allocations
  const filteredAllocations = useMemo(() => {
    const arr = Array.isArray(allocationsData) ? allocationsData : [];
    return arr.filter(
      (a) =>
        (a.fullName?.toLowerCase?.().includes(search.toLowerCase()) ||
          a.matricNumber?.toLowerCase?.().includes(search.toLowerCase()))
    );
  }, [allocationsData, search]);

  // Approve allocation
  const handleApprove = async (id, student) => {
    try {
      await adminApi.approveAllocation(id);
      setAllocationsData((prev) =>
        prev.map((alloc) =>
          alloc._id === id ? { ...alloc, status: "Approved" } : alloc
        )
      );
      setAlert({
        open: true,
        type: "success",
        message: `Approved allocation for ${student}`,
      });
    } catch (err) {
      setAlert({
        open: true,
        type: "error",
        message: err.response?.data?.message || "Error approving allocation",
      });
    }
  };

  // Reject allocation
  const handleReject = async (id, student) => {
    try {
      await adminApi.rejectAllocation(id);
      setAllocationsData((prev) =>
        prev.map((alloc) =>
          alloc._id === id ? { ...alloc, status: "Rejected" } : alloc
        )
      );
      setAlert({
        open: true,
        type: "error",
        message: `Rejected allocation for ${student}`,
      });
    } catch (err) {
      setAlert({
        open: true,
        type: "error",
        message: err.response?.data?.message || "Error rejecting allocation",
      });
    }
  };

  return (
    <div className="p-6">
      <Alert
        open={alert.open}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ ...alert, open: false })}
        duration={2500}
      />

      {/* Stats Section */}
      <div className="stats-grid" style={{ marginBottom: "2rem" }}>
        <StatsCard title="Total Students" value={stats.totalStudents} icon="fi fi-rr-users" loading={loading} />
        <StatsCard title="Available Rooms" value={stats.availableRooms} icon="fi fi-rr-home" loading={loading} />
        <StatsCard title="Occupied Rooms" value={stats.occupiedRooms} icon="fi fi-rr-bed" loading={loading} />
        <StatsCard title="Pending Allocations" value={stats.pendingAllocations} icon="fi fi-rr-clock" loading={loading} />
      </div>

      {/* Allocation Table */}
      <div className="admin-section">
        <h2>Recent Allocations</h2>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <input
            className="search-input"
            placeholder="Search by name or reg. no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
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
              <th>Student</th>
              <th>Room</th>
              <th>Session</th>
              <th>Status</th>
              <th>Allocated At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
             {filteredAllocations.filter(a => a.status === "Pending").length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center" }}>
                  No records found.
                </td>
              </tr>
            ) : (
               filteredAllocations
                 .filter(a => a.status === "Pending")
                .map((a, idx) => (
                  <tr key={a._id}>
                    <td>{idx + 1}</td>
                    <td>{a.student}</td>
                    <td>{a.room}</td>
                    <td>{a.session}</td>
                    <td style
                    ={{ textTransform: 'capitalize' }}>{a.status}</td>
                    <td>{a.appliedAt ? new Date(a.appliedAt).toLocaleString() : '-'}</td>
                    <td>
                      <>
                        <button
                          className="admin-btn"
                          style={{ background: "#27ae60" }}
                          onClick={() => handleApprove(a._id, a.student)}
                        >
                          Approve
                        </button>
                        <button
                          className="admin-btn"
                          style={{ background: "#e74c3c" }}
                          onClick={() => handleReject(a._id, a.student)}
                        >
                          Reject
                        </button>
                      </>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
