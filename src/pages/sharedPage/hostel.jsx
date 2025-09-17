
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
  // Only fetch rooms using the API; if API fails, return empty array
  const fetchRooms = async (hostelId) => {
    try {
      const response = await roomApi.getRoomsByHostelId(hostelId);
      return Array.isArray(response.data?.data) ? response.data.data : [];
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Error loading rooms');
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
        hostelId: selectedHostel,
        number: roomNumber,
        capacity: parseInt(newRoom.capacity),
        type: newRoom.type,
        floor: Math.ceil((hostel.totalRooms + 1) / 10)
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
    if (!window.confirm(`Are you sure you want to select Room ${room.number || room.roomNumber}?`)) {
      return;
    }

    try {
      // Fetch full room details from API
      const response = await roomApi.getRoomDetails(room.id);
      const fullRoom = response.data;
      // Create allocation request through API using the full room id
      await studentApi.requestAllocation({ roomId: fullRoom.id });
      setSelectedForAllocation(fullRoom);
      setAlert({
        open: true,
        type: "success",
        message: "Room allocation request submitted successfully!"
      });
      // Immediately redirect to Allocation.jsx (allocations page)
      navigate('/allocations');
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
    return(
    <>
      <Header />
      <div className="hostel-container">
        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)} className="add-hostel-btn">Dismiss</button>
          </div>
        )}
        {!selectedHostel ? (
          <React.Fragment>
            <div className="hostels-header">
              <h1>Available Hostels</h1>
            </div>
            <div className="hostels-grid">
              {(Array.isArray(hostels) ? hostels : []).map(hostel => (
                <div key={hostel._id || hostel.id || hostel.id} className="hostel-card" onClick={() => handleHostelClick(hostel._id || hostel.id || hostel.id)}>
                  <div className="hostel-info">
                    <h2>{hostel.name}</h2>
                    <p>Type: {hostel.type}</p>
                    <div className="hostel-stats">
                      <span><i className="fi fi-rr-building"></i> {hostel.capacity} Capacity</span>
                      <span><i className="fi fi-rr-door-open"></i> {hostel.available ?? 0} Available</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="dashboard">
              <div className="dashboard-header">
                <button className="back-btn" onClick={() => setSelectedHostel(null)}>
                  <i className="fi fi-rr-arrow-left"></i> Back to Hostels
                </button>
                <h1>{(Array.isArray(hostels) ? hostels : []).find(h => (h._id || h.id) === selectedHostel)?.name || ''}</h1>
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
                    <p>{(Array.isArray(hostels) ? hostels : []).find(h => (h._id || h.id) === selectedHostel)?.occupied ?? 0}</p>
                  </div>
                </div>

                <div className="stat-card">
                  <i className="fi fi-rr-door-open"></i>
                  <div className="stat-info">
                    <h3>Available Beds</h3>
                    <p>{(Array.isArray(hostels) ? hostels : []).find(h => (h._id || h.id) === selectedHostel)?.available ?? 0}</p>
                  </div>
                </div>

                <div className="stat-card">
                  <i className="fi fi-rr-tools"></i>
                  <div className="stat-info">
                    <h3>Maintenance</h3>
                    <p>{(Array.isArray(hostels) ? hostels : []).find(h => (h._id || h.id) === selectedHostel)?.maintenance ?? 0}</p>
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
                      <h3>Room {room.roomNumber || room.number}</h3>
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

              {/* Removed Add Room Modal as per requirements */}
            </div>
            {selectedRoom && (
              <RoomDetailsModal 
                room={selectedRoom} 
                onClose={() => setSelectedRoom(null)} 
              />
            )}
          </React.Fragment>
        )}
      </div>
      <Footer />
    </>
    );
}
export default Hostel;