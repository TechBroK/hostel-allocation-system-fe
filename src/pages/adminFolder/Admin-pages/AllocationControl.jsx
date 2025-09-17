
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import AllocationTable from "../components/AllocationTable";
import { adminApi } from "../../../utils/api";
import "../../../styles/admin.css";


const AllocationControl = () => {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllocations = async () => {
      try {
        const response = await adminApi.getAllocations(); // Should call /api/admin/allocations
        const dataArr = Array.isArray(response.data?.data)
          ? response.data.data
          : Array.isArray(response.data)
            ? response.data
            : [];
        setAllocations(dataArr);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load allocations");
        setLoading(false);
      }
    };
    fetchAllocations();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="p-6 admin-section">
          {error && (
            <div className="error-message">{error}</div>
          )}
          {loading ? (
            <div className="loading">Loading allocations...</div>
          ) : (
            <AllocationTable allocations={allocations} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AllocationControl;
