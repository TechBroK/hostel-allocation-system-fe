import React from "react";
import "../../../styles/admin.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/topbar";

// Dummy data for demonstration
const stats = [
  { label: "Total Rooms", value: 120, icon: "bx bxs-building-house"},
  { label: "Total Students", value: 350, icon: "bx bxs-user" },
  { label: "Total Beds", value: 480, icon: "bx bxs-bed" },
  { label: "Occupancy Rate", value: "72%", icon: "bx bx-trending-up" },
];

const rooms = [
  { number: "A101", floor: 1, type: "Quad", occupied: 3, capacity: 4, status: "Available" },
  { number: "A102", floor: 1, type: "Double", occupied: 2, capacity: 2, status: "Occupied" },
  { number: "B201", floor: 2, type: "Single", occupied: 1, capacity: 1, status: "Reserved" },
  { number: "C301", floor: 3, type: "Quad", occupied: 4, capacity: 4, status: "Occupied" },
  { number: "D401", floor: 4, type: "Double", occupied: 1, capacity: 2, status: "Maintenance" },
  { number: "E501", floor: 5, type: "Quad", occupied: 2, capacity: 4, status: "Available" },
];

const students = [
  { name: "John Doe", major: "Computer Science", year: "400", email: "john@example.com", phone: "08012345678", room: "A101", checkin: "2024-08-01" },
  { name: "Jane Smith", major: "Biochemistry", year: "200", email: "jane@example.com", phone: "08087654321", room: "B201", checkin: "2024-08-03" },
  { name: "Sam Lee", major: "Physics", year: "300", email: "sam@example.com", phone: "08011223344", room: "C301", checkin: "2024-08-05" },
  { name: "Mary Ann", major: "Mathematics", year: "100", email: "mary@example.com", phone: "08099887766", room: null, checkin: null },
];


const statusColors = {
  Available: "#27ae60",
  Occupied: "#e74c3c",
  Reserved: "#8e44ad",
  Maintenance: "#f1c40f",
};

const Dashboard = () => (
  <>
    <div className="flex" >
    <Sidebar />
    <div className="flex-1">
        <Topbar adminName="Admin" />
        <div className="admin-main">
        {/* 1. Stats Grid */}
        <div className="stats-grid">
            {stats.map((stat, i) => (
            <div
                className="stat-card"
                key={i}
                style={{
                color: "#fff",
                boxShadow: "0 4px 16px rgba(52,152,219,0.10)",
                border: "none",
                }}
            >
                <i className={stat.icon} style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}></i>
                <div className="stat-info">
                <p style={{ fontSize: "2rem", fontWeight: 700, margin: 0 }}>{stat.value}</p>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 500, margin: 0 }}>{stat.label}</h3>
                </div>
            </div>
            ))}
        </div>

        {/* 2. Room Overview */}
        <div className="admin-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2>Room Overview</h2>
            <button className="admin-btn">View All</button>
            </div>
            <div className="rooms-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            {rooms.slice(0, 6).map((room, i) => {
                const percent = Math.round((room.occupied / room.capacity) * 100);
                return (
                <div className="room-card" key={i} style={{ boxShadow: "0 2px 8px rgba(52,152,219,0.08)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>Room {room.number}</span>
                    <span style={{
                        background: statusColors[room.status],
                        color: "#fff",
                        borderRadius: 12,
                        fontSize: 12,
                        padding: "2px 10px",
                        fontWeight: 600,
                    }}>{room.status}</span>
                    </div>
                    <div style={{ fontSize: 13, color: "#888", margin: "4px 0 8px" }}>
                    Floor {room.floor} &middot; {room.type}
                    </div>
                    <div style={{ fontWeight: 500, marginBottom: 6 }}>
                    {room.occupied} / {room.capacity} Occupied
                    </div>
                    <div style={{
                    background: "#e9ecef",
                    borderRadius: 8,
                    height: 8,
                    marginBottom: 8,
                    overflow: "hidden",
                    }}>
                    <div style={{
                        width: `${percent}%`,
                        background: statusColors[room.status],
                        height: "100%",
                        transition: "width 0.3s",
                    }}></div>
                    </div>
                </div>
                );
            })}
            </div>
        </div>

        {/* 3. Recent Students */}
        <div className="admin-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2>Recent Students</h2>
            <button className="admin-btn">View All</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {students.slice(0, 4).map((s, i) => (
                <div key={i} className="student-card" style={{
                background: "#fff",
                borderRadius: 10,
                boxShadow: "0 2px 8px rgba(52,152,219,0.08)",
                padding: 18,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: "#3498db22", color: "#3498db",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: 20,
                    }}>
                    {s.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>{s.name}</div>
                    <div style={{ fontSize: 13, color: "#888" }}>{s.major} &middot; {s.year} Level</div>
                    </div>
                </div>
                <div style={{ fontSize: 13, color: "#888" }}>
                    <div><b>Email:</b> {s.email}</div>
                    <div><b>Phone:</b> {s.phone}</div>
                    <div><b>Room:</b> {s.room || <span style={{ color: "#e74c3c" }}>Not assigned</span>}</div>
                    <div><b>Check-in:</b> {s.checkin || <span style={{ color: "#e74c3c" }}>N/A</span>}</div>
                </div>
                <button className="admin-btn" style={{ marginTop: 8 }}>Manage Student</button>
                </div>
            ))}
            </div>
        </div>

        {/* 4. Quick Actions */}
        <div className="admin-section">
            <h2>Quick Actions</h2>
            <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: 20,
            marginTop: 16,
            }}>
            <button className="admin-btn" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 20 }}>
                <i className="bx bx-user-plus" style={{ fontSize: 32, marginBottom: 8 }}></i>
                <span>Add Student</span>
            </button>
            <button className="admin-btn" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 20 }}>
                <i className="bx bx-search" style={{ fontSize: 32, marginBottom: 8 }}></i>
                <span>Search Records</span>
            </button>
            <button className="admin-btn" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 20 }}>
                <i className="bx bx-bed" style={{ fontSize: 32, marginBottom: 8 }}></i>
                <span>Allocate Room</span>
            </button>
            <button className="admin-btn" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 20 }}>
                <i className="bx bx-file" style={{ fontSize: 32, marginBottom: 8 }}></i>
                  <span>Generate Report</span>
            </button>
            </div>
        </div>
        </div>
    </div>
  </div>
  </>
);

export default Dashboard;