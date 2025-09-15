
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/topbar";
import HostelTable from "../components/HostelTable";
import { adminApi } from "../../../utils/api";
import "../../../styles/admin.css";

const ManageHostels = () => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddHostelModal, setShowAddHostelModal] = useState(false);
  const [newHostel, setNewHostel] = useState({
    name: '',
    description: '',
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    maintenanceRooms: 0,
  });

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const response = await adminApi.getHostels();
        setHostels(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Error loading hostels");
        setLoading(false);
      }
    };
    fetchHostels();
  }, []);

  const validateHostel = (hostelData) => {
    const errors = {};
    if (!hostelData.name) errors.name = 'Name is required';
    if (!hostelData.totalRooms) errors.totalRooms = 'Total rooms is required';
    if (hostelData.totalRooms < 1) errors.totalRooms = 'Must have at least 1 room';
    return errors;
  };

  const handleAddHostel = async (e) => {
    e.preventDefault();
    try {
      const errors = validateHostel(newHostel);
      if (Object.keys(errors).length > 0) {
        setError('Please fix the form errors');
        return;
      }
      const hostelToAdd = {
        ...newHostel,
        availableRooms: Number(newHostel.totalRooms)
      };
      const response = await adminApi.addHostel(hostelToAdd);
      setHostels(prev => [...prev, response.data]);
      setShowAddHostelModal(false);
      setNewHostel({
        name: '',
        description: '',
        totalRooms: 0,
        occupiedRooms: 0,
        availableRooms: 0,
        maintenanceRooms: 0,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Error adding hostel");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Topbar adminName="Admin" />
        <div className="p-6 admin-section">
          <h2>Manage Hostels</h2>
          {error && (
            <div className="error-message">
              {error}
              <button onClick={() => setError(null)}>Dismiss</button>
            </div>
          )}
          <button className="add-hostel-btn" onClick={() => setShowAddHostelModal(true)}>
            <i className="fi fi-rr-plus"></i> Add Hostel
          </button>
          <HostelTable hostels={hostels} />
          {showAddHostelModal && (
            <div className="modal">
              <div className="modal-content">
                <h2>Add New Hostel</h2>
                <form onSubmit={handleAddHostel}>
                  <div className="form-group">
                    <label>Name:</label>
                    <input
                      type="text"
                      required
                      value={newHostel.name}
                      onChange={(e) => setNewHostel({...newHostel, name: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Description:</label>
                    <input
                      type="text"
                      required
                      value={newHostel.description}
                      onChange={(e) => setNewHostel({...newHostel, description: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Total Rooms:</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newHostel.totalRooms}
                      onChange={(e) => setNewHostel({...newHostel, totalRooms: Number(e.target.value)})}
                    />
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="cancel-btn" onClick={() => setShowAddHostelModal(false)}>
                      <i className="fi fi-rr-cross"></i> Cancel
                    </button>
                    <button type="submit" className="submit-btn">
                      <i className="fi fi-rr-check"></i> Add Hostel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageHostels;

