import React, { useState } from 'react';
import '../../styles/hostel.css';
import RoomDetailsModal from '../../component/RoomDetailsModal';
import RoomAvailability from '../../component/RoomAvailability';

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
    image: '/assets/images/default-hostel.jpg'
  });
  const [newRoom, setNewRoom] = useState({
    number: '',
    capacity: 4,
    type: 'Standard',
    occupied: 0,
    occupants: []
  });
  const [hostels, setHostels] = useState([
    {
      id: 1,
      name: 'Block A',
      description: 'Male Hostel',
      totalRooms: 50,
      occupiedRooms: 35,
      availableRooms: 15,
      maintenanceRooms: 3,
      image: '/assets/images/hostel1.jpg'
    },
    {
      id: 2,
      name: 'Block B',
      description: 'Female Hostel',
      totalRooms: 45,
      occupiedRooms: 30,
      availableRooms: 15,
      maintenanceRooms: 2,
      image: '/assets/images/hostel2.jpg'
    },
    {
      id: 3,
      name: 'Block C',
      description: 'Postgraduate Block',
      totalRooms: 30,
      occupiedRooms: 20,
      availableRooms: 10,
      maintenanceRooms: 1,
      image: '/assets/images/hostel3.jpg'
    },
    {
      id: 4,
      name: 'Block D',
      description: 'International Students',
      totalRooms: 25,
      occupiedRooms: 15,
      availableRooms: 10,
      maintenanceRooms: 1,
      image: '/assets/images/hostel4.jpg'
    }
  ]);
  const [selectedForAllocation, setSelectedForAllocation] = useState(null);

  const generateRooms = (hostelId) => {
    try {
      const hostel = hostels.find(h => h.id === hostelId);
      if (!hostel) throw new Error('Hostel not found');

      const rooms = [];
      const totalRooms = hostel.totalRooms;
      
      for (let i = 1; i <= totalRooms; i++) {
        const occupied = Math.floor(Math.random() * (i % 3 === 0 ? 3 : 5));
        const occupants = Array(occupied).fill(null).map((_, index) => ({
          id: index + 1,
          name: `Student ${index + 1}`,
          matricNumber: `MAT${Math.random().toString(36).substr(2, 6)}`,
          level: ['100', '200', '300', '400'][Math.floor(Math.random() * 4)]
        }));

        rooms.push({
          id: i,
          number: `${hostelId}${i.toString().padStart(2, '0')}`,
          capacity: i % 3 === 0 ? 2 : 4,
          occupied,
          type: i % 5 === 0 ? 'Premium' : 'Standard',
          floor: Math.ceil(i / 10),
          occupants
        });
      }
      return rooms;
    } catch (error) {
      console.error('Error generating rooms:', error);
      return [];
    }
  }

  const handleHostelClick = (hostelId) => {
    setSelectedHostel(hostelId);
  };

  const handleAddRoom = (e) => {
    e.preventDefault();
    const hostel = hostels.find(h => h.id === selectedHostel);
    const roomNumber = `${selectedHostel}${(hostel.totalRooms + 1).toString().padStart(2, '0')}`;
    
    const roomToAdd = {
      id: hostel.totalRooms + 1,
      number: roomNumber,
      capacity: parseInt(newRoom.capacity),
      occupied: 0,
      type: newRoom.type,
      floor: Math.ceil((hostel.totalRooms + 1) / 10),
      occupants: []
    };

    setRooms(prevRooms => [...prevRooms, roomToAdd]);
    
    // Update hostel stats
    setHostels(prevHostels => prevHostels.map(h => {
      if (h.id === selectedHostel) {
        return {
          ...h,
          totalRooms: h.totalRooms + 1,
          availableRooms: h.availableRooms + 1
        };
      }
      return h;
    }));
    
    setShowAddRoomModal(false);
    setNewRoom({
      number: '',
      capacity: 4,
      type: 'Standard',
      occupied: 0,
      occupants: []
    });
  };

  const validateHostel = (hostelData) => {
    const errors = {};
    if (!hostelData.name) errors.name = 'Name is required';
    if (!hostelData.totalRooms) errors.totalRooms = 'Total rooms is required';
    if (hostelData.totalRooms < 1) errors.totalRooms = 'Must have at least 1 room';
    return errors;
  };

  const handleAddHostel = (e) => {
    e.preventDefault();
    const errors = validateHostel(newHostel);
    if (Object.keys(errors).length > 0) {
      setError('Please fix the form errors');
      return;
    }
    const newId = Math.max(...hostels.map(h => h.id)) + 1;
    
    const hostelToAdd = {
      ...newHostel,
      id: newId,
      availableRooms: Number(newHostel.totalRooms)
    };

    setHostels(prev => [...prev, hostelToAdd]);
    setShowAddHostelModal(false);
    setNewHostel({
      name: '',
      description: '',
      totalRooms: 0,
      occupiedRooms: 0,
      availableRooms: 0,
      maintenanceRooms: 0,
      image: '/assets/images/default-hostel.jpg'
    });
  };

  const handleRoomSelection = async (room) => {
    if (!window.confirm(`Are you sure you want to select Room ${room.number}?`)) {
      return;
    }
    setSelectedForAllocation(room);
    // Here you would typically make an API call to update the student's allocation status
    // For now, we'll just console.log
    console.log(`Room ${room.number} selected for allocation`);
  };

  const filteredRooms = React.useMemo(() => {
    return generateRooms(selectedHostel)
      .filter(room => {
        if (filter === 'available') return room.occupied < room.capacity;
        if (filter === 'full') return room.occupied === room.capacity;
        return true;
      })
      .filter(room => 
        room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [selectedHostel, filter, searchTerm]);

  return (
    <div className="hostel-container">
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>Dismiss</button>
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
            {hostels.map(hostel => (
              <div key={hostel.id} className="hostel-card" onClick={() => handleHostelClick(hostel.id)}>
                <div className="hostel-image">
                  <img src={hostel.image} alt={hostel.name} />
                </div>
                <div className="hostel-info">
                  <h2>{hostel.name}</h2>
                  <p>{hostel.description}</p>
                  <div className="hostel-stats">
                    <span><i className="fi fi-rr-building"></i> {hostel.totalRooms} Rooms</span>
                    <span><i className="fi fi-rr-door-open"></i> {hostel.availableRooms} Available</span>
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
            <h1>{hostels.find(h => h.id === selectedHostel).name}</h1>
            <button className="add-room-btn" onClick={() => setShowAddRoomModal(true)}>
              <i className="fi fi-rr-plus"></i> Add Room
            </button>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <i className="fi fi-rr-building"></i>
              <div className="stat-info">
                <h3>Total Rooms</h3>
                <p>{hostels.find(h => h.id === selectedHostel).totalRooms}</p>
              </div>
            </div>

            <div className="stat-card">
              <i className="fi fi-rr-key"></i>
              <div className="stat-info">
                <h3>Occupied</h3>
                <p>{hostels.find(h => h.id === selectedHostel).occupiedRooms}</p>
              </div>
            </div>

            <div className="stat-card">
              <i className="fi fi-rr-door-open"></i>
              <div className="stat-info">
                <h3>Available</h3>
                <p>{hostels.find(h => h.id === selectedHostel).availableRooms}</p>
              </div>
            </div>

            <div className="stat-card">
              <i className="fi fi-rr-wrench"></i>
              <div className="stat-info">
                <h3>Maintenance</h3>
                <p>{hostels.find(h => h.id === selectedHostel).maintenanceRooms}</p>
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

          {showRoomDetailsModal && selectedRoom && (
            <div className="modal">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Room {selectedRoom.number} Details</h2>
                  <button className="close-btn" onClick={() => setShowRoomDetailsModal(false)}>
                    <i className="fi fi-rr-cross"></i>
                  </button>
                </div>
                <div className="room-details">
                  <p><strong>Type:</strong> {selectedRoom.type}</p>
                  <p><strong>Floor:</strong> {selectedRoom.floor}</p>
                  <p><strong>Capacity:</strong> {selectedRoom.capacity}</p>
                  <p><strong>Occupied:</strong> {selectedRoom.occupied}</p>
                  
                  <h3>Current Occupants</h3>
                  {selectedRoom.occupants.length > 0 ? (
                    <div className="occupants-list">
                      {selectedRoom.occupants.map(student => (
                        <div key={student.id} className="occupant-card">
                          <h4>{student.name}</h4>
                          <p>Matric: {student.matricNumber}</p>
                          <p>Level: {student.level}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No current occupants</p>
                  )}
                </div>
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
  );
};

export default Hostel;