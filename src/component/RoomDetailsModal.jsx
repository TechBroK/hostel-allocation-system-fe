import '../styles/RoomDetailsModal.css';

const RoomDetailsModal = ({ room, onClose }) => {
  const occupants = [
    {
      id: 1,
      name: "John Doe",
      level: "300",
      department: "Computer Science",
      personalityTraits: ["Night owl", "Quiet", "Organized"]
    },

    {
      id: 2,
      name: "Jane Smith",
      level: "200",
      department: "Engineering",
      personalityTraits: ["Early bird", "Social", "Neat"]
    },

    {
      id: 2,
      name: "Jane Smith",
      level: "200",
      department: "Engineering",
      personalityTraits: ["Early bird", "Social", "Neat"]
    }
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Room {room.number} Details</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fi fi-rr-cross"></i>
          </button>
        </div>
        
        <div className="room-details">
          <div className="room-info">
            <p><strong>Type:</strong> {room.type}</p>
            <p><strong>Capacity:</strong> {room.capacity}</p>
            <p><strong>Currently Occupied:</strong> {room.occupied}</p>
          </div>

          <div className="occupants-section">
            <h3>Occupants</h3>
            <div className="occupants-grid">
              {occupants.map(occupant => (
                <div key={occupant.id} className="occupant-card">
                  <div className="occupant-header">
                    <i className="fi fi-rr-user"></i>
                    <h4>{occupant.name}</h4>
                  </div>
                  <div className="occupant-details">
                    <p><strong>Level:</strong> {occupant.level}</p>
                    <p><strong>Department:</strong> {occupant.department}</p>
                    <div className="personality-traits">
                      <strong>Personality Traits:</strong>
                      <div className="traits-tags">
                        {occupant.personalityTraits.map((trait, index) => (
                          <span key={index} className="trait-tag">{trait}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsModal;