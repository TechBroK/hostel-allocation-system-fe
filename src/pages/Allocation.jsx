import React, { useState } from 'react';
import '../component/styles/allocation.css';
import RoomAvailability from '../component/RoomAvailability';


const Allocation = () => {
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    matricNumber: '',
    department: '',
    level: '',
    gender: '',
    phoneNumber: '',
    emergencyContact: '',
    healthConditions: '',
    specialRequests: '',
    personalityTraits: {
      sleepSchedule: '',
      studyHabits: '',
      cleanlinessLevel: '',
      socialPreference: '',
      noisePreference: '',
      hobbies: [],
      musicPreference: '',
      visitorFrequency: ''
    }
  });

  const personalityOptions = {
    sleepSchedule: ['Early Bird (Before 10PM)', 'Night Owl (After 10PM)', 'Variable'],
    studyHabits: ['In Room', 'Library', 'Study Groups', 'Mixed'],
    cleanlinessLevel: ['Very Organized', 'Moderately Tidy', 'Relaxed'],
    socialPreference: ['Very Social', 'Moderately Social', 'Reserved'],
    noisePreference: ['Prefer Quiet', 'Moderate Noise OK', 'Don\'t Mind Noise'],
    musicPreference: ['While Studying', 'Headphones Only', 'No Music'],
    visitorFrequency: ['Rarely', 'Occasionally', 'Frequently']
  };

  // Add hostels data
  const hostels = [
    {
      id: 1,
      name: 'Block A',
      description: 'Male Hostel',
      rooms: [
        { id: 1, number: 'A101', type: 'Standard', capacity: 4, occupied: 2 },
        { id: 2, number: 'A102', type: 'Premium', capacity: 2, occupied: 0 },
        // Add more rooms as needed
      ]
    },
    // Add more hostels as needed
  ];

  // Get rooms for selected hostel
  const rooms = selectedHostel ? 
    hostels.find(h => h.id === parseInt(selectedHostel))?.rooms || [] 
    : [];

  // Filter available rooms
  const availableRooms = rooms.filter(room => room.occupied < room.capacity);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['fullName', 'matricNumber', 'department', 'level', 'phoneNumber', 'emergencyContact'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Validate matric number format (assuming 8 digits)
    const matricRegex = /^\d{8}$/;
    if (!matricRegex.test(formData.matricNumber)) {
      alert('Please enter a valid 8-digit matric number');
      return;
    }

    // Validate phone numbers
    const phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(formData.phoneNumber) || !phoneRegex.test(formData.emergencyContact)) {
      alert('Please enter valid 11-digit phone numbers');
      return;
    }

    console.log('Application submitted:', { room: selectedRoom, student: formData });
    // Add your submission logic here
  };

  return (
    <div className="allocation-container">
      {!showApplicationForm ? (
        <>
          <h1>Available Rooms for Allocation</h1>
          <div className="hostel-selector">
            <select 
              value={selectedHostel || ''} 
              onChange={(e) => setSelectedHostel(e.target.value)}
            >
              <option value="">Select a Hostel Block</option>
              {hostels.map(hostel => (
                <option key={hostel.id} value={hostel.id}>
                  {hostel.name} - {hostel.description}
                </option>
              ))}
            </select>
          </div>

          {selectedHostel && (
            <div className="available-rooms-grid">
              {availableRooms.map(room => (
                <div key={room.id} className="available-room-card">
                  <h3>Room {room.number}</h3>
                  <p className="room-type">{room.type}</p>
                  <RoomAvailability occupied={room.occupied} capacity={room.capacity} />
                  <div className="room-details">
                    <p>Available Spaces: {room.capacity - room.occupied}</p>
                    <p>Floor: {Math.ceil(parseInt(room.number) / 10)}</p>
                  </div>
                  <button 
                    className="apply-btn"
                    onClick={() => {
                      setSelectedRoom(room);
                      setShowApplicationForm(true);
                    }}
                  >
                    Apply for This Room
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      ) : selectedRoom ? (
        <div className="application-form-container">
          <button 
            className="back-btn"
            onClick={() => setShowApplicationForm(false)}
          >
            <i className="fi fi-rr-arrow-left"></i> Back to Room Selection
          </button>
          
          <h2>Room Application Form</h2>
          <h3>Room {selectedRoom.number} - {selectedRoom.type}</h3>
          
          <form onSubmit={handleSubmit} className="application-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="matricNumber">Matric Number</label>
              <input
                type="text"
                id="matricNumber"
                value={formData.matricNumber}
                onChange={(e) => setFormData({...formData, matricNumber: e.target.value})}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="department">Department</label>
                <input
                  type="text"
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="level">Level</label>
                <select
                  id="level"
                  value={formData.level}
                  onChange={(e) => setFormData({...formData, level: e.target.value})}
                  required
                >
                  <option value="">Select Level</option>
                  <option value="100">100 Level</option>
                  <option value="200">200 Level</option>
                  <option value="300">300 Level</option>
                  <option value="400">400 Level</option>
                  <option value="500">500 Level</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="emergencyContact">Emergency Contact</label>
              <input
                type="tel"
                id="emergencyContact"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="healthConditions">Health Conditions (if any)</label>
              <textarea
                id="healthConditions"
                value={formData.healthConditions}
                onChange={(e) => setFormData({...formData, healthConditions: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label htmlFor="specialRequests">Special Requests</label>
              <textarea
                id="specialRequests"
                value={formData.specialRequests}
                onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
              />
            </div>

            <div className="form-section personality-section">
              <h3>Personality Profile</h3>
              
              <div className="form-group">
                <label htmlFor="sleepSchedule">Sleep Schedule</label>
                <select
                  id="sleepSchedule"
                  value={formData.personalityTraits.sleepSchedule}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalityTraits: {
                      ...formData.personalityTraits,
                      sleepSchedule: e.target.value
                    }
                  })}
                  required
                >
                  <option value="">Select Sleep Schedule</option>
                  {personalityOptions.sleepSchedule.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="studyHabits">Study Habits</label>
                <select
                  id="studyHabits"
                  value={formData.personalityTraits.studyHabits}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalityTraits: {
                      ...formData.personalityTraits,
                      studyHabits: e.target.value
                    }
                  })}
                  required
                >
                  <option value="">Select Study Habit</option>
                  {personalityOptions.studyHabits.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Hobbies & Interests (Select up to 3)</label>
                <div className="hobbies-grid">
                  {['Reading', 'Gaming', 'Sports', 'Music', 'Art', 'Cooking', 'Movies', 'Exercise'].map(hobby => (
                    <label key={hobby} className="hobby-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.personalityTraits.hobbies.includes(hobby)}
                        onChange={(e) => {
                          const updatedHobbies = e.target.checked
                            ? [...formData.personalityTraits.hobbies, hobby].slice(0, 3)
                            : formData.personalityTraits.hobbies.filter(h => h !== hobby);
                          setFormData({
                            ...formData,
                            personalityTraits: {
                              ...formData.personalityTraits,
                              hobbies: updatedHobbies
                            }
                          });
                        }}
                        disabled={!formData.personalityTraits.hobbies.includes(hobby) && 
                                 formData.personalityTraits.hobbies.length >= 3}
                      />
                      {hobby}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cleanlinessLevel">Cleanliness Level</label>
                  <select
                    id="cleanlinessLevel"
                    value={formData.personalityTraits.cleanlinessLevel}
                    onChange={(e) => setFormData({
                      ...formData,
                      personalityTraits: {
                        ...formData.personalityTraits,
                        cleanlinessLevel: e.target.value
                      }
                    })}
                    required
                  >
                    <option value="">Select Cleanliness Level</option>
                    {personalityOptions.cleanlinessLevel.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="noisePreference">Noise Preference</label>
                  <select
                    id="noisePreference"
                    value={formData.personalityTraits.noisePreference}
                    onChange={(e) => setFormData({
                      ...formData,
                      personalityTraits: {
                        ...formData.personalityTraits,
                        noisePreference: e.target.value
                      }
                    })}
                    required
                  >
                    <option value="">Select Noise Preference</option>
                    {personalityOptions.noisePreference.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div className="trait-group">
                  <label htmlFor="musicPreference">Music Preference</label>
                  <select
                    id="musicPreference"
                    value={formData.personalityTraits.musicPreference}
                    onChange={(e) => setFormData({
                      ...formData, 
                      personalityTraits: { 
                        ...formData.personalityTraits, 
                        musicPreference: e.target.value 
                      }
                    })}
                  >
                    <option value="">Select</option>
                    {personalityOptions.musicPreference.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div className="trait-group">
                  <label htmlFor="visitorFrequency">Visitor Frequency</label>
                  <select
                    id="visitorFrequency"
                    value={formData.personalityTraits.visitorFrequency}
                    onChange={(e) => setFormData({
                      ...formData, 
                      personalityTraits: { 
                        ...formData.personalityTraits, 
                        visitorFrequency: e.target.value 
                      }
                    })}
                  >
                    <option value="">Select</option>
                    {personalityOptions.visitorFrequency.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Submit Application
            </button>
          </form>
        </div>
      ) : (
        <div className="error-message">
          No room selected. Please go back and select a room.
          <button 
            className="back-btn"
            onClick={() => setShowApplicationForm(false)}
          >
            Back to Room Selection
          </button>
        </div>
      )}
    </div>
  );
};

export default Allocation;