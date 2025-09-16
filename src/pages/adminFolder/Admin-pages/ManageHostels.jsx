
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
    type: '',
    capacity: 1,
    description: '',
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
    if (!hostelData.type) errors.type = 'Type is required';
    if (!hostelData.capacity || hostelData.capacity < 1) errors.capacity = 'Capacity must be at least 1';
    if (!hostelData.description) errors.description = 'Description is required';
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
        name: newHostel.name,
        type: newHostel.type,
        capacity: Number(newHostel.capacity),
        description: newHostel.description
      };
      const response = await adminApi.addHostel(hostelToAdd);
      setHostels(prev => [...prev, response.data]);
      setShowAddHostelModal(false);
      setNewHostel({
        name: '',
        type: '',
        capacity: 1,
        description: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || "Error adding hostel");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">

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
                    <label>Type:</label>
                    <select
                      required
                      value={newHostel.type}
                      onChange={e => setNewHostel({...newHostel, type: e.target.value})}
                    >
                      <option value="">Select Type</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="mixed">Mixed</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Capacity:</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newHostel.capacity}
                      onChange={e => setNewHostel({...newHostel, capacity: Number(e.target.value)})}
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

