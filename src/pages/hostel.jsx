import React, { useState, useMemo } from 'react';
import '../component/styles/hostel.css';
import RoomDetailsModal from '../component/RoomDetailsModal';
import RoomAvailability from '../component/RoomAvailability';

const Hostel = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);

  const hostels = [
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
  ];

  const generateRooms = (hostelId) => {
    try {
      const hostel = hostels.find(h => h.id === hostelId);
      if (!hostel) throw new Error('Hostel not found');

      const rooms = [];
      const totalRooms = hostel.totalRooms;
      
      for (let i = 1; i <= totalRooms; i++) {
        rooms.push({
          id: i,
          number: `${hostelId}${i.toString().padStart(2, '0')}`,
          capacity: i % 3 === 0 ? 2 : 4,
          occupied: Math.floor(Math.random() * (i % 3 === 0 ? 3 : 5)),
          type: i % 5 === 0 ? 'Premium' : 'Standard',
          floor: Math.ceil(i / 10)
        });
      }
      return rooms;
    } catch (error) {
      console.error('Error generating rooms:', error);
      return [];
    }
  };

  const handleHostelClick = (hostelId) => {
    setSelectedHostel(hostelId);
    setRooms(generateRooms(hostelId));
  };

  const handleAddRoom = (hostelId) => {
    try {
      const currentRooms = [...rooms];
      const maxId = Math.max(...currentRooms.map(room => room.id), 0);
      const newRoom = {
        id: maxId + 1,
        number: `${hostelId}${(currentRooms.length + 1).toString().padStart(2, '0')}`,
        capacity: 4,
        occupied: 0,
        type: 'Standard',
        floor: Math.ceil((currentRooms.length + 1) / 10)
      };
      setRooms( [...currentRooms, newRoom]);
    } catch (error) {
      console.error('Error adding room:', error);
    }
  };

  const handleDeleteRoom = (roomId) => {
    setRooms(rooms.filter(room => room.id !== roomId));
  };

  const filteredHostels = useMemo(() => {
    return hostels.filter(hostel => {
      const matchesSearch = hostel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          hostel.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filter === 'available') return matchesSearch && hostel.availableRooms > 0;
      if (filter === 'full') return matchesSearch && hostel.availableRooms === 0;
      return matchesSearch;
    });
  }, [hostels, searchTerm, filter]);

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
          <div className="search-filter-container">
            <div className="search-box">
              <i className="fi fi-rr-search"></i>
              <input 
                type="text"
                placeholder="Search hostels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-options">
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All Hostels</option>
                <option value="available">Available Rooms</option>
                <option value="full">Full Hostels</option>
              </select>
            </div>
          </div>
          <div className="hostels-grid">
            {filteredHostels.map(hostel => (
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
        </>
      ) : 
      
      (
        <div className="dashboard">
          <div className="dashboard-header">
            <button className="back-btn" onClick={() => setSelectedHostel(null)}>
              <i className="fi fi-rr-arrow-left"></i> Back to Hostels
            </button>
            <h1>{hostels.find(h => h.id === selectedHostel).name}</h1>
            <button className="add-room-btn" onClick={() => handleAddRoom(selectedHostel)}>
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
            <div className="rooms-grid">
              {rooms.map(room => (
                <div 
                  key={room.id} 
                  className={`room-card ${room.occupied === room.capacity ? 'full' : 'available'}`}
                >
                  <div className="room-header">
                    <h3>Room {room.number}</h3>
                    <button 
                      className="delete-room-btn"
                      onClick={() => handleDeleteRoom(room.id)}
                    >
                      <i className="fi fi-rr-trash"></i>
                    </button>
                  </div>
                  <p className="room-type">{room.type}</p>
                  <RoomAvailability 
                    occupied={room.occupied} 
                    capacity={room.capacity}
                    roomNumber={room.number}
                    type={room.type}
                  />
                  <button className="view-details-btn" onClick={() => setSelectedRoom(room)}>
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
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