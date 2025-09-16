import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import AllocationTable from "../components/AllocationTable";
import { fetchStudents } from "../../../services/adminApi"
import "../../../styles/admin.css";

const AllocationControl = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const loadStudents = async () => {
      try {
  const studentsArr = await fetchStudents();
  setStudents(studentsArr);
      } catch (err) {
        console.error("Failed to load students", err);
      }
    };
    loadStudents();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="p-6 admin-section">
          {/* <h2>Allocation Control</h2> */}
          <AllocationTable allocations={students} />
        </div>
      </div>
    </div>
  );
};

export default AllocationControl;
