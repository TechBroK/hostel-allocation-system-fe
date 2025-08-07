import React, { useState } from 'react';
import '../styles/hostel.css';
import RoomDetailsModal from '../component/RoomDetailsModal';
import RoomAvailability from '../component/RoomAvailability';

const Hostel = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showAddHostelModal, setShowAddHostelModal] = useState(false);
  const [newHostel, setNewHostel] = useState({
    name: '',
    description: '',
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    maintenanceRooms: 0,
    image: '/assets/images/default-hostel.jpg'
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
  }  
  const handleHostelClick = (hostelId) => {
    setSelectedHostel(hostelId);
  };

  const handleAddRoom = (hostelId) => {
    const hostel = hostels.find(h => h.id === hostelId);
    const newRoomNumber = `${hostelId}${(hostel.totalRooms + 1).toString().padStart(2, '0')}`;
    
    const newRoom = {
      id: hostel.totalRooms + 1,
      number: newRoomNumber,
      capacity: 4,
      occupied: 0,
      type: 'Standard',
      floor: Math.ceil((hostel.totalRooms + 1) / 10)
    };

    setRooms(prevRooms => [...prevRooms, newRoom]);
    
    // Update hostels state
    setHostels(prevHostels => prevHostels.map(h => {
      if (h.id === hostelId) {
        return {
          ...h,
          totalRooms: h.totalRooms + 1,
          availableRooms: h.availableRooms + 1
        };
      }
      return h;
    }));
    
    setShowAddRoomModal(false);
  };

  const handleAddHostel = (e) => {
    e.preventDefault();
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
            <div className="rooms-grid">
              {generateRooms(selectedHostel).map(room => (
                <div 
                  key={room.id} 
                  className={`room-card ${room.occupied === room.capacity ? 'full' : 'available'}`}
                >
                  <h3>Room {room.number}</h3>
                  <p className="room-type">{room.type}</p>
                  <p className="occupancy">
                    {room.occupied}/{room.capacity} Occupied
                  </p>
                  <button className="view-details-btn">
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