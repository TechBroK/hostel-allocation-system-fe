
import React, { useState, useEffect } from "react";
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
    maintenance: 0,
    rooms: []
  });

  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    type: '',
    capacity: 1,
    occupied: 0
  });

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const response = await adminApi.getHostels();
        // The API returns { data: [ ...hostels... ], meta: {...} }
        const hostelsArr = Array.isArray(response.data?.data)
          ? response.data.data
          : Array.isArray(response.data)
            ? response.data
            : [];
        setHostels(hostelsArr);
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
    if (hostelData.maintenance < 0) errors.maintenance = 'Maintenance cannot be negative';
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
        description: newHostel.description,
        maintenance: Number(newHostel.maintenance) || 0,
        rooms: newHostel.rooms
      };
  const response = await adminApi.addHostel(hostelToAdd);
  const created = response.data?.data || response.data;
  setHostels(prev => [...prev, created]);
      setShowAddHostelModal(false);
      setNewHostel({
        name: '',
        type: '',
        capacity: 1,
        description: '',
        maintenance: 0,
        rooms: []
      });
      setNewRoom({ roomNumber: '', type: '', capacity: 1, occupied: 0 });
    } catch (err) {
      setError(err.response?.data?.message || "Error adding hostel");
    }
  };

  const handleAddRoom = (e) => {
    e.preventDefault();
    if (!newRoom.roomNumber || !newRoom.type || !newRoom.capacity) return;
    setNewHostel(prev => ({
      ...prev,
      rooms: [...(prev.rooms || []), { ...newRoom, capacity: Number(newRoom.capacity), occupied: Number(newRoom.occupied) }]
    }));
    setNewRoom({ roomNumber: '', type: '', capacity: 1, occupied: 0 });
  };

  return (
    <div className="flex">
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
          {loading ? (
            <div className="loading">Loading hostels...</div>
          ) : (
            <HostelTable hostels={hostels} />
          )}
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
                      {/* Backend supports only male/female */}
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
                  <div className="form-group">
                    <label>Maintenance:</label>
                    <input
                      type="number"
                      min="0"
                      value={newHostel.maintenance}
                      onChange={e => setNewHostel({...newHostel, maintenance: Number(e.target.value)})}
                    />
                  </div>
                  {/* Add Room Section */}
                  <div className="form-group" style={{ border: '1px solid #eee', padding: 10, marginBottom: 10 }}>
                    <label style={{ fontWeight: 'bold' }}>Add Room(s):</label>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="Room Number"
                        value={newRoom.roomNumber}
                        onChange={e => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                        required
                        style={{ width: 90 }}
                      />
                      <select
                        value={newRoom.type}
                        onChange={e => setNewRoom({ ...newRoom, type: e.target.value })}
                        required
                        style={{ width: 90 }}
                      >
                        <option value="">Type</option>
                        <option value="Standard">Standard</option>
                        <option value="Premium">Premium</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Capacity"
                        min="1"
                        value={newRoom.capacity}
                        onChange={e => setNewRoom({ ...newRoom, capacity: Number(e.target.value) })}
                        required
                        style={{ width: 70 }}
                      />
                      <input
                        type="number"
                        placeholder="Occupied"
                        min="0"
                        value={newRoom.occupied}
                        onChange={e => setNewRoom({ ...newRoom, occupied: Number(e.target.value) })}
                        required
                        style={{ width: 70 }}
                      />
                      <button onClick={handleAddRoom} type="button" style={{ padding: '2px 8px' }}>Add Room</button>
                    </div>
                    {/* List of added rooms */}
                    {Array.isArray(newHostel.rooms) && newHostel.rooms.length > 0 && (
                      <div style={{ marginTop: 8 }}>
                        <strong>Rooms Added:</strong>
                        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                          {newHostel.rooms.map((room, idx) => (
                            <li key={idx} style={{ fontSize: 13, marginBottom: 2 }}>
                              Room {room.roomNumber} ({room.type}) - Capacity: {room.capacity}, Occupied: {room.occupied}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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

