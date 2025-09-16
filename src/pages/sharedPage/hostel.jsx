
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/hostel.css';
import Alert from '../../component/Alert';
import Header from '../../component/header';
import RoomDetailsModal from '../../component/RoomDetailsModal';
import Footer from '../../component/footer';
import { hostelApi, studentApi, roomApi } from '../../utils/api';

const Hostel = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showAddHostelModal, setShowAddHostelModal] = useState(false);
  const [showRoomDetailsModal, setShowRoomDetailsModal] = useState(false);
  const [newHostel, setNewHostel] = useState({
    name: '',
    description: '',
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    maintenanceRooms: 0,
  });
  const [newRoom, setNewRoom] = useState({
    number: '',
    capacity: 4,
    type: 'Standard',
    occupied: 0,
    occupants: []
  });
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [setAlert] = useState({ open: false, type: "info", message: "" });

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const response = await hostelApi.getAllHostels();
        // Support paginated or array response
        const hostelsData = Array.isArray(response.data?.data)
          ? response.data.data
          : Array.isArray(response.data)
            ? response.data
            : [];
        setHostels(hostelsData);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Error loading hostels");
        setLoading(false);
      }
    };
    fetchHostels();
  }, []);
  const [selectedForAllocation, setSelectedForAllocation] = useState(null);
  const navigate = useNavigate();

  // Use rooms from the selected hostel object (no extra API call needed)
  const fetchRooms = async (hostelId) => {
    try {
      const hostel = hostels.find(h => h._id === hostelId || h.id === hostelId);
      if (!hostel) throw new Error('Hostel not found');
      // If backend provides rooms array, use it; else fallback to []
      return Array.isArray(hostel.rooms) ? hostel.rooms : [];
    } catch (error) {
      setError(error.message || 'Error loading rooms');
      return [];
    }
  }

  const handleHostelClick = async (hostelId) => {
    try {
      setSelectedHostel(hostelId);
      const fetchedRooms = await fetchRooms(hostelId);
      setRooms(Array.isArray(fetchedRooms) ? fetchedRooms : []);
    } catch (err) {
      setError(err.response?.data?.message || "Error loading hostel details");
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      const hostel = hostels.find(h => (h._id || h.id) === selectedHostel);
      if (!hostel) throw new Error('Hostel not found');
      // Generate a room number based on timestamp for uniqueness
      const roomNumber = `R${Date.now().toString().slice(-5)}`;
      const roomToAdd = {
        hostelId: hostel._id || hostel.id,
        number: roomNumber,
        capacity: Number(newRoom.capacity) || 0,
        type: newRoom.type
      };
      // Add room through API
      await roomApi.addRoom(roomToAdd);
      // Fetch updated hostel data to reflect new room counts and rooms
      const updatedHostel = await hostelApi.getHostelDetails(hostel._id || hostel.id);
      setHostels(prevHostels =>
        prevHostels.map(h => (h._id || h.id) === (hostel._id || hostel.id) ? updatedHostel.data : h)
      );
      // Update rooms state from updatedHostel if available
      setRooms(Array.isArray(updatedHostel.data.rooms) ? updatedHostel.data.rooms : []);
      setShowAddRoomModal(false);
      setNewRoom({
        number: '',
        capacity: 4,
        type: 'Standard',
        occupied: 0,
        occupants: []
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error adding room");
    }
  };

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

      // Add hostel through API
      const response = await hostelApi.addHostel(hostelToAdd);
      
      // Update local state
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

  const handleRoomSelection = async (room) => {
    if (!window.confirm(`Are you sure you want to select Room ${room.number}?`)) {
      return;
    }

    try {
      // Create allocation request through API
      await studentApi.requestAllocation({ roomId: room.id });
      
      setSelectedForAllocation(room);
      setAlert({
        open: true,
        type: "success",
        message: "Room allocation request submitted successfully!"
      });
      
      // Navigate to allocations page after short delay
      setTimeout(() => {
        navigate('/allocations');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Error requesting room allocation");
    }
  };

  const filteredRooms = React.useMemo(() => {
    return rooms
      .filter(room => {
        if (filter === 'available') return room.occupied < room.capacity;
        if (filter === 'full') return room.occupied === room.capacity;
        return true;
      })
      .filter(room => {
        const roomNumber = room.roomNumber || room.number || '';
        const roomType = room.type || '';
        return (
          roomNumber.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
          roomType.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
  }, [rooms, filter, searchTerm]);

  return (
    <>
     <Header />
    <div className="hostel-container">

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}className="add-hostel-btn">Dismiss</button>
        </div>
      )}
      {!selectedHostel ? (
        <>
          <div className="hostels-header">
            <h1>Available Hostels</h1>
            <button 
              className="add-hostel-btn"
              onClick={() => setShowAddHostelModal(true)}
            >
              <i className="fi fi-rr-plus"></i> Add Hostel
            </button>
          </div>
          
          <div className="hostels-grid">
            {(Array.isArray(hostels) ? hostels : []).map(hostel => (
              <div key={hostel._id || hostel.id} className="hostel-card" onClick={() => handleHostelClick(hostel._id || hostel.id)}>
                <div className="hostel-info">
                  <h2>{hostel.name}</h2>
                  <p>Type: {hostel.type}</p>
                  <div className="hostel-stats">
                    <span><i className="fi fi-rr-building"></i> {hostel.capacity} Capacity</span>
                    <span><i className="fi fi-rr-door-open"></i> {hostel.occupancy?.availableBeds ?? hostel.available ?? 0} Available</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

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
        </>
      ) : (
        <div className="dashboard">
          <div className="dashboard-header">
            <button className="back-btn" onClick={() => setSelectedHostel(null)}>
              <i className="fi fi-rr-arrow-left"></i> Back to Hostels
            </button>
            <h1>{(Array.isArray(hostels) ? hostels : []).find(h => (h._id || h.id) === selectedHostel)?.name || ''}</h1>
            <button className="add-room-btn" onClick={() => setShowAddRoomModal(true)}>
              <i className="fi fi-rr-plus"></i> Add Room
            </button>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <i className="fi fi-rr-building"></i>
              <div className="stat-info">
                <h3>Capacity</h3>
                <p>{(Array.isArray(hostels) ? hostels : []).find(h => (h._id || h.id) === selectedHostel)?.capacity || 0}</p>
              </div>
            </div>

            <div className="stat-card">
              <i className="fi fi-rr-key"></i>
              <div className="stat-info">
                <h3>Occupied Beds</h3>
                <p>{(Array.isArray(hostels) ? hostels : []).find(h => (h._id || h.id) === selectedHostel)?.occupancy?.occupiedBeds ?? 0}</p>
              </div>
            </div>

            <div className="stat-card">
              <i className="fi fi-rr-door-open"></i>
              <div className="stat-info">
                <h3>Available Beds</h3>
                <p>{(Array.isArray(hostels) ? hostels : []).find(h => (h._id || h.id) === selectedHostel)?.occupancy?.availableBeds ?? 0}</p>
              </div>
            </div>

            <div className="stat-card">
              <i className="fi fi-rr-wrench"></i>
              <div className="stat-info">
                <h3>Total Rooms</h3>
                <p>{(Array.isArray(hostels) ? hostels : []).find(h => (h._id || h.id) === selectedHostel)?.occupancy?.totalRooms ?? 0}</p>
              </div>
            </div>
          </div>

          <div className="rooms-section">
            <h2>Room Status</h2>
            <div className="rooms-controls">
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Rooms</option>
                <option value="available">Available</option>
                <option value="full">Full</option>
              </select>
            </div>
            <div className="rooms-grid">
              {filteredRooms.map(room => (
                <div 
                  key={room.id} 
                  className={`room-card ${room.occupied === room.capacity ? 'full' : 'available'}`}
                >
                  <h3>Room {room.number}</h3>
                  <p className="room-type">{room.type}</p>
                  <div className="occupancy-indicator">
                    <i className="fi fi-rr-users"></i>
                    <span>{room.occupied}/{room.capacity} Occupied</span>
                  </div>
                  <div className="room-card-actions">
                    <button 
                      className="view-details-btn"
                      onClick={() => {
                        setSelectedRoom(room);
                        setShowRoomDetailsModal(true);
                      }}
                    >
                      <i className="fi fi-rr-eye"></i>
                    </button>
                    {room.occupied < room.capacity && (
                      <button 
                        className="select-room-btn"
                        onClick={() => handleRoomSelection(room)}
                        disabled={selectedForAllocation?.id === room.id}
                      >
                        {selectedForAllocation?.id === room.id ? (
                          <i className="fi fi-rr-check"></i>
                        ) : (
                          <i className="fi fi-rr-plus"></i>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {showAddRoomModal && (
            <div className="modal">
              <div className="modal-content">
                <h2>Add New Room</h2>
                <form onSubmit={handleAddRoom}>
                  <div className="form-group">
                    <label>Capacity:</label>
                    <select
                      value={newRoom.capacity}
                      onChange={(e) => setNewRoom({...newRoom, capacity: e.target.value})}
                      required
                    >
                      <option value="2">2 Students</option>
                      <option value="4">4 Students</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Type:</label>
                    <select
                      value={newRoom.type}
                      onChange={(e) => setNewRoom({...newRoom, type: e.target.value})}
                      required
                    >
                      <option value="Standard">Standard</option>
                      <option value="Premium">Premium</option>
                    </select>
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="cancel-btn" onClick={() => setShowAddRoomModal(false)}>
                      <i className="fi fi-rr-cross"></i> Cancel
                    </button>
                    <button type="submit" className="submit-btn">
                      <i className="fi fi-rr-check"></i> Add Room
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
      {selectedRoom && (
        <RoomDetailsModal 
          room={selectedRoom} 
          onClose={() => setSelectedRoom(null)} 
        />
      )}
    </div>
    <Footer />
  </>
  );
};

export default Hostel;