
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/allocation.css';
import RoomAvailability from '../../component/RoomAvailability';
import Header from '../../component/header';
import Footer from '../../component/footer';
import { studentApi, hostelApi, roomApi } from '../../utils/api';



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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const personalityOptions = {
    sleepSchedule: ['Early Bird (Before 10PM)', 'Night Owl (After 10PM)', 'Variable'],
    studyHabits: ['In Room', 'Library', 'Study Groups', 'Mixed'],
    cleanlinessLevel: ['Very Organized', 'Moderately Tidy', 'Relaxed'],
    socialPreference: ['Very Social', 'Moderately Social', 'Reserved'],
    noisePreference: ['Prefer Quiet', 'Moderate Noise OK', 'Don\'t Mind Noise'],
    musicPreference: ['While Studying', 'Headphones Only', 'No Music'],
    visitorFrequency: ['Rarely', 'Occasionally', 'Frequently']
  };

  
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);

  // Fetch hostels and user profile on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hostelsRes, profileRes] = await Promise.all([
          hostelApi.getAllHostels(),
          studentApi.getProfile()
        ]);
        // Defensive: support both { data: [...] } and [...]
        const hostelList = Array.isArray(hostelsRes.data)
          ? hostelsRes.data
          : Array.isArray(hostelsRes.data.data)
            ? hostelsRes.data.data
            : [];
        setHostels(hostelList);

        // Pre-fill form with user profile data
        setFormData(prevData => ({
          ...prevData,
          fullName: profileRes.data.fullName,
          matricNumber: profileRes.data.matricNumber,
          department: profileRes.data.department,
          level: profileRes.data.level,
          gender: profileRes.data.gender,
          phoneNumber: profileRes.data.phone,
          email: profileRes.data.email
        }));

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Error loading data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch rooms when a hostel is selected
  useEffect(() => {
    const fetchRooms = async () => {
      if (!selectedHostel) return;
      try {
        // Find the selected hostel object
        const hostelObj = hostels.find(h => h.id === selectedHostel || h._id === selectedHostel);
        // If backend already provides rooms nested, use them directly
        if (hostelObj && Array.isArray(hostelObj.rooms)) {
          setRooms(hostelObj.rooms);
        } else {
          // Fallback: fetch from API
          const response = await roomApi.getRoomAvailability(selectedHostel);
          setRooms(Array.isArray(response.data) ? response.data : (response.data.data || []));
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error loading rooms");
      }
    };
    fetchRooms();
  }, [selectedHostel, hostels]);

  // Filter available rooms
  const availableRooms = Array.isArray(rooms)
    ? rooms.filter(room => Number(room.occupied) < Number(room.capacity))
    : [];

  const validateForm = () => {
    const errors = {};
    
    // Basic field validation
    if (!formData.fullName) errors.fullName = 'Name is required';
    if (!formData.matricNumber) errors.matricNumber = 'Matric number is required';
    if (!/^\d{8}$/.test(formData.matricNumber)) {
      errors.matricNumber = 'Must be 8 digits';
    }
    
    if (!/^\d{11}$/.test(formData.emergencyContact)) {
  errors.emergencyContact = 'Must be 11 digits';
}
if (!formData.level) errors.level = 'Level is required';
if (!formData.gender) errors.gender = 'Gender is required';
if (formData.personalityTraits.hobbies.length < 1) {
  errors.hobbies = 'Select at least one hobby';
}


    // Phone validation
    if (!/^\d{11}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Must be 11 digits';
    }
    
    // Personality traits validation
    if (!formData.personalityTraits.sleepSchedule) {
      errors.sleepSchedule = 'Required';
    }
    if (!formData.personalityTraits.studyHabits) {
      errors.studyHabits = 'Required';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Submit allocation request
      await studentApi.requestAllocation({
        roomId: selectedRoom.id,
        hostelId: selectedHostel,
        studentDetails: {
          fullName: formData.fullName,
          matricNumber: formData.matricNumber,
          department: formData.department,
          level: formData.level,
          gender: formData.gender,
          phoneNumber: formData.phoneNumber,
          emergencyContact: formData.emergencyContact,
          email: formData.email
        },
        healthInformation: {
          conditions: formData.healthConditions,
          specialRequests: formData.specialRequests
        },
        personalityProfile: formData.personalityTraits
      });

      // On success, navigate to profile page
      navigate('/profile');
    } catch (error) {
      console.error('Submission error:', error);
      setFormErrors({ 
        submit: error.response?.data?.message || 'Failed to submit application' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
   <>
   <Header />
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
                <option key={hostel.id || hostel._id} value={hostel.id || hostel._id}>
                  {hostel.name} - {hostel.description}
                </option>
              ))}
            </select>
          </div>

          {selectedHostel && (
            <div className="available-rooms-grid">
              {availableRooms.length === 0 ? (
                <div className="no-rooms-message">No available rooms in this hostel.</div>
              ) : (
                availableRooms.map(room => (
                  <div key={room.id || room._id} className="available-room-card">
                    <h3>Room {room.number || room.roomNumber}</h3>
                    <p className="room-type">{room.type}</p>
                    <RoomAvailability occupied={room.occupied} capacity={room.capacity} />
                    <div className="room-details">
                      <p>Available Spaces: {Number(room.capacity) - Number(room.occupied)}</p>
                      <p>Floor: {room.floor || Math.ceil(Number(room.number || room.roomNumber) / 10)}</p>
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
                ))
              )}
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
                onChange={(e) => {
                  setFormData({...formData, fullName: e.target.value});
                  setFormErrors({...formErrors, fullName: ''});
                }}
                className={formErrors.fullName ? 'error' : ''}
                required
              />
              {formErrors.fullName && (
                <span className="error-message">{formErrors.fullName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setFormErrors({ ...formErrors, email: '' });
                }}
                className={formErrors.email ? 'error' : ''}
                required
              />
              {formErrors.email && (
                <span className="error-message">{formErrors.email}</span>
              )}
            </div>


            <div className="form-group">
              <label htmlFor="matricNumber">Matric Number</label>
              <input
                type="text"
                id="matricNumber"
                value={formData.matricNumber}
                onChange={(e) => {
                  setFormData({...formData, matricNumber: e.target.value});
                  setFormErrors({...formErrors, matricNumber: ''});
                }}
                className={formErrors.matricNumber ? 'error' : ''}
                required
              />
              {formErrors.matricNumber && (
                <span className="error-message">{formErrors.matricNumber}</span>
              )}
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
                onChange={(e) => {
                  setFormData({...formData, phoneNumber: e.target.value});
                  setFormErrors({...formErrors, phoneNumber: ''});
                }}
                className={formErrors.phoneNumber ? 'error' : ''}
                required
              />
              {formErrors.phoneNumber && (
                <span className="error-message">{formErrors.phoneNumber}</span>
              )}
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
                  className={formErrors.sleepSchedule ? 'error' : ''}
                  required
                >
                  <option value="">Select Sleep Schedule</option>
                  {personalityOptions.sleepSchedule.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {formErrors.sleepSchedule && (
                  <span className="error-message">{formErrors.sleepSchedule}</span>
                )}
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
                  className={formErrors.studyHabits ? 'error' : ''}
                  required
                >
                  <option value="">Select Study Habit</option>
                  {personalityOptions.studyHabits.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {formErrors.studyHabits && (
                  <span className="error-message">{formErrors.studyHabits}</span>
                )}
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

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>

            {formErrors.submit && (
              <div className="error-message submit-error">{formErrors.submit}</div>
            )}
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
    <Footer />
   </>
  );
};

export default Allocation;