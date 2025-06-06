import React from 'react';
import './styles/RoomAvailability.css';

const RoomAvailability = ({ rooms }) => {
  // Filter available rooms (rooms with space)
  const availableRooms = rooms.filter(room => room.occupied < room.capacity) || [];

  return (
    <div className="room-availability-container">
      <h2>Available Rooms</h2>
      <div className="rooms-grid">
        {availableRooms.map(room => (
          <div key={room.id} className="room-card">
            <div className="room-header">
              <h3>Room {room.number}</h3>
              <span className={`room-status ${room.occupied === room.capacity ? 'full' : 'available'}`}>
                {room.occupied === room.capacity ? 'Full' : 'Available'}
              </span>
            </div>
            <div className="room-info">
              <p>Type: {room.type}</p>
              <p>Floor: {Math.ceil(parseInt(room.number.replace(/[^0-9]/g, '')) / 10)}</p>
              <p>Capacity: {room.capacity}</p>
              <p>Available Spaces: {room.capacity - room.occupied}</p>
            </div>
            <div className="occupancy-bar">
              <div 
                className="occupancy-fill"
                // style={{ 
                //   width: `${(room.occupied / room.capacity) * 100}%`,
                //   backgroundColor: room.occupied === room.capacity ? '#e74c3c' : '#2ecc71'
                // }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomAvailability;