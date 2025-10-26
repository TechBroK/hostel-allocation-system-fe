
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/allocation.css';
import RoomAvailability from '../../component/RoomAvailability';
import Header from '../../component/header';
import Footer from '../../component/footer';
import { hostelApi, roomApi, studentApi, adminApi, allocationApi } from '../../utils/api';



const Allocation = () => {
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
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
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const loadHostels = async () => {
      try {
        const res = await hostelApi.getAllHostels();
        const data = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
        setHostels(data.map(h => ({ id: h._id || h.id, name: h.name, type: h.type, capacity: h.capacity, available: h.available ?? 0 })));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load hostels');
      } finally {
        setLoading(false);
      }
    };
    loadHostels();
  }, []);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await adminApi.getDepartments();
        const list = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : [];
        const names = list.map(d => (d.name || d.title || d)).filter(Boolean);
        if (names.length) setDepartments(names);
      } catch (_) {
        // Fallback to a static list if endpoint is not accessible to students
        setDepartments([
          'Computer Science',
          'Information Technology',
          'Software Engineering',
          'Electrical Engineering',
          'Mechanical Engineering',
          'Civil Engineering',
          'Business Administration',
          'Accounting',
          'Economics',
          'Biochemistry',
          'Microbiology',
          'Mass Communication'
        ]);
      }
    };
    loadDepartments();
  }, []);

  useEffect(() => {
    const loadRooms = async () => {
      if (!selectedHostel) { setRooms([]); return; }
      try {
        const res = await roomApi.getRoomsByHostelId(selectedHostel);
        const data = Array.isArray(res.data?.data) ? res.data.data : [];
        setRooms(data.map(r => ({ id: r._id || r.id, number: r.roomNumber || r.number, type: r.type, capacity: r.capacity, occupied: r.occupied || 0 })));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load rooms');
        setRooms([]);
      }
    };
    loadRooms();
  }, [selectedHostel]);

  // Remove backend profile fetch, use static profile
  // Pre-fill form with mock profile data (already set in initial formData state)

  // Fetch rooms for selected hostel only
  // Remove backend room fetch, use static rooms (could filter by hostel if desired)

  // Filter available rooms (not fully occupied)
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
    if (!selectedRoom?.id) {
      setFormErrors({ submit: 'No room selected' });
      return;
    }
    try {
      setIsSubmitting(true);
      const profilePayload = {
        fullName: formData.fullName,
        email: formData.email,
        matricNumber: formData.matricNumber,
        department: formData.department,
        level: formData.level,
        gender: formData.gender,
        phone: formData.phoneNumber,
        emergencyContact: formData.emergencyContact,
        healthConditions: formData.healthConditions,
        specialRequests: formData.specialRequests,
      };
      const traitsPayload = {
        sleepSchedule: mapSleepSchedule(formData.personalityTraits.sleepSchedule),
        studyHabits: mapStudyHabits(formData.personalityTraits.studyHabits),
        cleanlinessLevel: mapCleanliness(formData.personalityTraits.cleanlinessLevel),
        socialPreference: mapSocialPreference(formData.personalityTraits.socialPreference),
        noisePreference: mapNoise(formData.personalityTraits.noisePreference),
        hobbies: formData.personalityTraits.hobbies || [],
        musicPreference: formData.personalityTraits.musicPreference || '',
        visitorFrequency: mapVisitor(formData.personalityTraits.visitorFrequency)
      };
      const compactTraits = Object.fromEntries(Object.entries(traitsPayload).filter(([_,v]) => v !== '' && v !== undefined && !(Array.isArray(v) && v.length === 0)));
    // Include preferred roomId so the student's requested room is recorded.
    // The backend will keep the allocation 'pending' (no auto-approval).
  await allocationApi.apply({ profile: profilePayload, personalityTraits: compactTraits, roomId: selectedRoom.id });
      navigate('/profile');
    } catch (err) {
      setFormErrors({ submit: err.response?.data?.message || 'Failed to submit allocation' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Map UI labels to backend enums
  const mapSleepSchedule = (v) => v === 'Early Bird (Before 10PM)' ? 'early' : v === 'Night Owl (After 10PM)' ? 'late' : v ? 'flexible' : '';
  const mapStudyHabits = (v) => v === 'In Room' ? 'quiet' : v === 'Study Groups' ? 'group' : v ? 'mixed' : '';
  const mapCleanliness = (v) => {
    if (!v) return 3;
    if (v === 'Very Organized') return 5;
    if (v === 'Moderately Tidy') return 3;
    return 2;
  };
  const mapSocialPreference = (v) => v === 'Very Social' ? 'extrovert' : v === 'Moderately Social' ? 'balanced' : v ? 'introvert' : '';
  const mapNoise = (v) => v === 'Prefer Quiet' ? 'quiet' : v === 'Moderate Noise OK' ? 'tolerant' : v ? 'noisy' : '';
  const mapVisitor = (v) => v === 'Rarely' ? 'rarely' : v === 'Occasionally' ? 'sometimes' : v ? 'often' : '';

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
                <option key={hostel.id || hostel._id}
                        value={hostel.id || hostel._id}>
                  {hostel.name} | Type: {hostel.type} | Capacity: {hostel.capacity} | Available: {hostel.available}
                </option>
              ))}
            </select>
          </div>

          <div className="available-rooms-grid">
            {selectedHostel && availableRooms.length === 0 ? (
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
                <select
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dep => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
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
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className={formErrors.gender ? 'error' : ''}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {formErrors.gender && (
                <span className="error-message">{formErrors.gender}</span>
              )}
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
              {formErrors.emergencyContact && (
                <span className="error-message">{formErrors.emergencyContact}</span>
              )}
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