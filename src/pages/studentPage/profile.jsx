import React, { useEffect, useState } from "react";
import "./../../styles/profile.css";
import Alert from "../../component/Alert";
import "../../styles/alert.css";
import Header from "../../component/header";
import Footer from "../../component/footer";
import { studentApi } from "../../utils/api";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState([]);

  // State for editing and complaint management
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaintType, setComplaintType] = useState("");
  const [complaintDesc, setComplaintDesc] = useState("");
  const [alert, setAlert] = useState({ open: false, type: "info", message: "" });

  // Load profile and complaints for current user
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const studentId = user?._id || user?.id;
    if (!studentId) { setLoading(false); return; }
    const load = async () => {
      try {
        const [prof, comps] = await Promise.all([
          studentApi.getProfile(studentId),
          studentApi.getComplaints(studentId)
        ]);
  const p = prof?.data || {};
  const personal = p.personal || {};
        const alloc = p.allocation || null;
        setProfileData({
          _id: personal._id || personal.id,
          name: personal.fullName || personal.name || '-',
          regNumber: personal.matricNumber || '-',
          email: personal.email || '-',
          phone: personal.phone || '-',
          gender: personal.gender || '-',
          level: personal.level || '-',
          department: personal.department || '-',
          profilePic: personal.profilePic || personal.avatarUrl || '',
          allocationStatus: alloc?.status ? (alloc.status === 'approved' ? 'Allocated' : alloc.status) : 'Pending',
          hostel: alloc?.hostel || '',
          hostelId: alloc?.hostelId || '',
          roomNumber: alloc?.roomNumber || '',
          applicationDate: alloc?.allocatedAt ? String(alloc.allocatedAt).slice(0,10) : '',
          personality: {
            type: 'Custom',
            traits: Array.isArray(personal.personalityTraits?.hobbies) ? personal.personalityTraits.hobbies : [],
            bio: ''
          },
          roommate: '-',
          roommateMatch: null
        });
        // Preload saved personality traits into the form if available
        const traitsServer = personal.personalityTraits || {};
        setTraitsDraft({
          sleepSchedule: traitsServer.sleepSchedule || '',
          studyHabits: traitsServer.studyHabits || '',
          cleanlinessLevel: Number(traitsServer.cleanlinessLevel ?? 3),
          socialPreference: traitsServer.socialPreference || '',
          noisePreference: traitsServer.noisePreference || '',
          hobbies: Array.isArray(traitsServer.hobbies)
            ? traitsServer.hobbies
            : (typeof traitsServer.hobbies === 'string'
              ? traitsServer.hobbies.split(',').map(s => s.trim()).filter(Boolean)
              : []),
          musicPreference: traitsServer.musicPreference || '',
          visitorFrequency: traitsServer.visitorFrequency || ''
        });
        const arr = Array.isArray(comps?.data?.data) ? comps.data.data : Array.isArray(comps?.data) ? comps.data : [];
        setComplaints(arr.map(c => ({ id: c._id || c.id, type: c.type || 'Other', description: c.description || c.message, status: c.status || 'Open', date: c.createdAt ? new Date(c.createdAt).toISOString().slice(0,10) : '' })));
        // Decide whether to auto-open the preferences editor only on the first load for this student
        try {
          const shown = localStorage.getItem(`prefEditorShown:${personal._id || personal.id}`);
          setShowPrefEditor(!shown);
        } catch (e) {
          setShowPrefEditor(false);
        }
      } catch (err) {
        setAlert({ open: true, type: 'error', message: err.response?.data?.message || 'Failed to load profile' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    // Deep clone to avoid accidental mutation of profileData
    try {
      setEditedData(JSON.parse(JSON.stringify(profileData)));
    } catch (e) {
      setEditedData(Object.assign({}, profileData));
    }
    // Open preference editor if it hasn't been auto-shown for this user yet
    setShowPrefEditor(prev => prev || true);
  };

  const handleSave = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const studentId = user?._id || user?.id;
      if (!studentId) throw new Error('No user');
      await studentApi.updateProfile(studentId, {
        fullName: editedData?.name,
        phone: editedData?.phone,
        level: editedData?.level
      });
      setProfileData(editedData);
      setIsEditing(false);
      // Close personality editor when profile editing ends
      setShowPrefEditor(false);
      setAlert({ open: true, type: 'success', message: 'Profile updated successfully!' });
    } catch (err) {
      setAlert({ open: true, type: 'error', message: err.response?.data?.message || 'Failed to update profile' });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(profileData);
    // Close personality editor on cancel
    setShowPrefEditor(false);
  };

  const handleChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const studentId = user?._id || user?.id;
      const formData = new FormData();
      formData.append('avatar', file);
      await studentApi.uploadAvatar(studentId, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      // Optimistically update preview
      const url = URL.createObjectURL(file);
      setProfileData(prev => ({ ...prev, profilePic: url }));
      setAlert({ open: true, type: 'success', message: 'Avatar uploaded' });
    } catch (err) {
      setAlert({ open: true, type: 'error', message: err.response?.data?.message || 'Failed to upload avatar' });
    }
  };

  const [traitsDraft, setTraitsDraft] = useState({
    sleepSchedule: '',
    studyHabits: '',
    cleanlinessLevel: 3,
    socialPreference: '',
     noisePreference: '',
    hobbies: [],
    musicPreference: '',
    visitorFrequency: ''
  });
  // Show the personality editor only on first load; hide after save/cancel
  const [showPrefEditor, setShowPrefEditor] = useState(false);

  const savePersonality = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const studentId = user?._id || user?.id;
      await studentApi.updatePersonality(studentId, { personalityTraits: traitsDraft });
      // Reflect saved traits immediately i
      setProfileData(prev => ({
        ...prev,
        personality: {
          ...(prev?.personality || { type: 'Custom', bio: '' }),
          traits: Array.isArray(traitsDraft.hobbies) ? traitsDraft.hobbies : []
        }
      }));
      setAlert({ open: true, type: 'success', message: 'Personality saved' });
      // Auto-close editor after saving
      setShowPrefEditor(false);
      // Mark that the pref editor has been shown for this user so it only auto-opens once
      try {
        if (studentId) {
          localStorage.setItem(`prefEditorShown:${studentId}`, '1');
        }
      } catch (e) {
        // ignore localStorage errors
      }
    } catch (err) {
      setAlert({ open: true, type: 'error', message: err.response?.data?.message || 'Failed to save personality' });
    }
  };

  const handleSubmitComplaint = async () => {
    if (!complaintType || !complaintDesc) {
      setAlert({ open: true, type: 'error', message: 'Please select a type and enter a description.' });
      return;
    }
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const studentId = user?._id || user?.id;
      if (!studentId) throw new Error('No user');
      // Backend expects { type, description }
      await studentApi.submitComplaint(studentId, { type: complaintType, description: complaintDesc });
      const comps = await studentApi.getComplaints(studentId);
      const arr = Array.isArray(comps?.data?.data) ? comps.data.data : Array.isArray(comps?.data) ? comps.data : [];
      setComplaints(arr.map(c => ({ id: c._id || c.id, type: c.type || 'Other', description: c.description || c.message, status: c.status || 'Open', date: c.createdAt ? new Date(c.createdAt).toISOString().slice(0,10) : '' })));
      setShowComplaintForm(false);
      setComplaintType('');
      setComplaintDesc('');
      setAlert({ open: true, type: 'success', message: 'Complaint submitted successfully!' });
    } catch (err) {
      setAlert({ open: true, type: 'error', message: err.response?.data?.message || 'Failed to submit complaint' });
    }
  };

  return (
    <>
      <Header />
      <Alert
        open={alert.open}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ ...alert, open: false })}
        duration={3000}
      />
      <div className="profile-dashboard">
        {loading ? (
          <div className="loading">Loading profile data...</div>
        ) : !profileData ? (
          <div className="error-message">Failed to load profile data</div>
        ) : (
          <>
            <div className="profile-dashboard-header">
              <div className="profile-avatar-wrapper">
                <img
                  src={profileData.profilePic}
                  alt="Profile"
                  className="profile-dashboard-avatar"
                />
                <span className="profile-avatar-icon">
                  <i className="fi fi-rr-user"></i>
                </span>
                <label className="profile-avatar-plus">
                  <i className="fi fi-rr-plus"></i>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
              <div>
                <div className="profile-header-top">
                  <h2>{profileData.name}</h2>
                  <button 
                    className="edit-profile-btn"
                    onClick={isEditing ? handleSave : handleEdit}
                  >
                    <i className={`fi fi-rr-${isEditing ? 'save' : 'edit'}`}></i>
                    {isEditing ? 'Save' : 'Edit'}
                  </button>
                </div>
                <p className="profile-dashboard-status">
                  {profileData.allocationStatus === "Allocated" ? (
                    <span className="allocated">Allocated</span>
                  ) : (
                    <span className="pending">Pending</span>
                  )}
                </p>
                <div className="profile-dashboard-meta">
                  <span>{profileData.regNumber}</span> | <span>{profileData.level} Level</span>
                </div>
              </div>
            </div>

            <div className="profile-dashboard-cards">
              <div className="profile-dashboard-card">
                <h4>Hostel</h4>
                <p>{profileData.hostel || 'Not Allocated'}</p>
              </div>
              <div className="profile-dashboard-card">
                <h4>Room</h4>
                <p>{profileData.roomNumber || 'Not Assigned'}</p>
              </div>
              <div className="profile-dashboard-card">
                <h4>Roommate</h4>
                <p>{profileData.roommate || 'Not Assigned'}</p>
              </div>
              <div className="profile-dashboard-card">
                <h4>Personality</h4>
                <p>{profileData.personality?.type || 'Not Set'}</p>
              </div>
            </div>

            <div className="profile-dashboard-sections">
              <div className="profile-dashboard-section">
                <h3>Personal Information</h3>
                <div className="profile-dashboard-info-grid">
                  <div>
                    <strong>Email:</strong>
                    <span>{profileData.email}</span>
                  </div>
                  <div>
                    <strong>Phone:</strong>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedData?.phone || ''}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="edit-input"
                      />
                    ) : (
                      <span>{profileData.phone}</span>
                    )}
                  </div>
                  <div>
                    <strong>Gender:</strong>
                    <span>{profileData.gender}</span>
                  </div>
                  <div>
                    <strong>Department:</strong>
                    <span>{profileData.department}</span>
                  </div>
                </div>
              </div>

              <div className="profile-dashboard-section">
                <h3>Hostel Allocation</h3>
                <div className="profile-dashboard-info-grid">
                  <div>
                    <strong>Status:</strong>
                    <span className={profileData.allocationStatus === "Allocated" ? "allocated" : "pending"}>
                      {profileData.allocationStatus || 'Not Applied'}
                    </span>
                  </div>
                  <div>
                    <strong>Hostel:</strong>
                    <span>{profileData.hostel || 'Not Allocated'}</span>
                  </div>
                  <div>
                    <strong>Room Number:</strong>
                    <span>{profileData.roomNumber || 'Not Assigned'}</span>
                  </div>
                  <div>
                    <strong>Roommate:</strong>
                    <span>{profileData.roommate || 'Not Assigned'}</span>
                  </div>
                  <div>
                    <strong>Application Date:</strong>
                    <span>{profileData.applicationDate || 'Not Applied'}</span>
                  </div>
                </div>
              </div>

              {profileData.personality && (
                <div className="profile-dashboard-section">
                  <div className="section-header">
                    <h3>Personality & Preferences</h3>
                  </div>
                  <div className="personality-content">
                    {/* Summary snapshot */}
                    <div className="personality-summary">
                      <div className="personality-grid">
                        {/* Sleep schedule */}
                        <span className={`trait-pill ${traitsDraft.sleepSchedule || ''}`}>
                          <i className="fi fi-rr-moon-stars"></i>
                          Sleep: {traitsDraft.sleepSchedule || '—'}
                        </span>
                        {/* Study habits */}
                        <span className={`trait-pill ${traitsDraft.studyHabits || ''}`}>
                          <i className="fi fi-rr-book-alt"></i>
                          Study: {traitsDraft.studyHabits || '—'}
                        </span>
                        {/* Social preference */}
                        <span className={`trait-pill ${traitsDraft.socialPreference || ''}`}>
                          <i className="fi fi-rr-users-alt"></i>
                          Social: {traitsDraft.socialPreference || '—'}
                        </span>
                        {/* Noise preference */}
                        <span className={`trait-pill ${traitsDraft.noisePreference || ''}`}>
                          <i className="fi fi-rr-volume"></i>
                          Noise: {traitsDraft.noisePreference || '—'}
                        </span>
                        {/* Visitors */}
                        <span className={`trait-pill ${traitsDraft.visitorFrequency || ''}`}>
                          <i className="fi fi-rr-calendar"></i>
                          Visitors: {traitsDraft.visitorFrequency || '—'}
                        </span>
                        {/* Hobbies (first 3 as tags) */}
                        {(traitsDraft.hobbies || []).slice(0,3).map(h => (
                          <span key={h} className="trait-pill">
                            <i className="fi fi-rr-star"></i> {h}
                          </span>
                        ))}
                      </div>
                      <div className="cleanliness-card">
                        <div className="cleanliness-title">
                          <i className="fi fi-rr-broom"></i>
                          Cleanliness Level
                        </div>
                        <div className="cleanliness-meter">
                          <div className="cleanliness-fill" style={{ width: `${Math.min(100, Math.max(0, (Number(traitsDraft.cleanlinessLevel)||0) * 20))}%` }}></div>
                        </div>
                        <div className="cleanliness-scale">
                          <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                        </div>
                      </div>
                    </div>

                    {(showPrefEditor || isEditing) && (
                      <>
                        <div className="personality-divider"></div>
                        <div className="personality-edit-title">Update your preferences</div>
                        <div className="personality-form-grid">
                      <label>Sleep Schedule
                        <select value={traitsDraft.sleepSchedule} onChange={(e)=>setTraitsDraft({...traitsDraft, sleepSchedule: e.target.value})}>
                          <option value="">Select</option>
                          <option value="early">Early</option>
                          <option value="flexible">Flexible</option>
                          <option value="late">Late</option>
                        </select>
                      </label>
                      <label>Study Habits
                        <select value={traitsDraft.studyHabits} onChange={(e)=>setTraitsDraft({...traitsDraft, studyHabits: e.target.value})}>
                          <option value="">Select</option>
                          <option value="quiet">Quiet</option>
                          <option value="mixed">Mixed</option>
                          <option value="group">Group</option>
                        </select>
                      </label>
                      <label>Cleanliness (1-5)
                        <input type="number" min="1" max="5" value={traitsDraft.cleanlinessLevel} onChange={(e)=>setTraitsDraft({...traitsDraft, cleanlinessLevel: Number(e.target.value)})} />
                      </label>
                      <label>Social Preference
                        <select value={traitsDraft.socialPreference} onChange={(e)=>setTraitsDraft({...traitsDraft, socialPreference: e.target.value})}>
                          <option value="">Select</option>
                          <option value="introvert">Introvert</option>
                          <option value="balanced">Balanced</option>
                          <option value="extrovert">Extrovert</option>
                        </select>
                      </label>
                      <label>Noise Preference
                        <select value={traitsDraft.noisePreference} onChange={(e)=>setTraitsDraft({...traitsDraft, noisePreference: e.target.value})}>
                          <option value="">Select</option>
                          <option value="quiet">Quiet</option>
                          <option value="tolerant">Tolerant</option>
                          <option value="noisy">Noisy</option>
                        </select>
                      </label>
                      <label>Hobbies (comma separated)
                        <input type="text" value={traitsDraft.hobbies.join(', ')} onChange={(e)=>setTraitsDraft({...traitsDraft, hobbies: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} />
                      </label>
                      <label>Music Preference
                        <input type="text" value={traitsDraft.musicPreference} onChange={(e)=>setTraitsDraft({...traitsDraft, musicPreference: e.target.value})} />
                      </label>
                      <label>Visitor Frequency
                        <select value={traitsDraft.visitorFrequency} onChange={(e)=>setTraitsDraft({...traitsDraft, visitorFrequency: e.target.value})}>
                          <option value="">Select</option>
                          <option value="rarely">Rarely</option>
                          <option value="sometimes">Sometimes</option>
                          <option value="often">Often</option>
                        </select>
                      </label>
                        </div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                          <button className="save-btn" onClick={savePersonality}>
                            <i className="fi fi-rr-check"></i> Save Personality
                          </button>
                          <button className="cancel-btn" onClick={() => setShowPrefEditor(false)}>
                            <i className="fi fi-rr-cross"></i> Cancel
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {profileData.roommateMatch && (
                <div className="profile-dashboard-section">
                  <h3>Roommate Match</h3>
                  <div className="roommate-match-content">
                    <div className="compatibility-score">
                      <div className="score-circle">
                        <span>{profileData.roommateMatch.compatibility}%</span>
                        <small>Match</small>
                      </div>
                    </div>
                    <p className="match-reason">{profileData.roommateMatch.matchReason}</p>
                    <table className="matching-traits-table">
                      <thead>
                        <tr>
                          <th>Trait</th>
                          <th>You</th>
                          <th>Roommate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profileData.roommateMatch.matchingTraits?.map(item => (
                          <tr key={item.trait}>
                            <td>{item.trait}</td>
                            <td>{item.student}</td>
                            <td>{item.roommate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button className="view-roommate-btn">
                      <i className="fi fi-rr-user"></i> View Roommate Profile
                    </button>
                  </div>
                </div>
              )}

              <div className="profile-dashboard-section complaints-section">
                <div className="section-header">
                  <h3>Complaints & Feedback</h3>
                  <button className="new-complaint-btn" onClick={() => setShowComplaintForm(true)}>
                    <i className="fi fi-rr-plus"></i> New Complaint
                  </button>
                </div>

                {showComplaintForm && (
                  <div className="complaint-form">
                    <select 
                      className="complaint-input" 
                      value={complaintType} 
                      onChange={(e) => setComplaintType(e.target.value)}
                    >
                      <option value="">Select Type</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Roommate">Roommate</option>
                      <option value="Facilities">Facilities</option>
                      <option value="Other">Other</option>
                    </select>
                    <textarea 
                      className="complaint-input" 
                      placeholder="Describe your complaint..."
                      value={complaintDesc}
                      onChange={(e) => setComplaintDesc(e.target.value)}
                    ></textarea>
                    <div className="complaint-form-actions">
                      <button className="cancel-btn" onClick={() => setShowComplaintForm(false)}>
                        <i className="fi fi-rr-cross"></i> Cancel
                      </button>
                      <button className="submit-btn" onClick={handleSubmitComplaint}>
                        <i className="fi fi-rr-check"></i> Submit
                      </button>
                    </div>
                  </div>
                )}

                <div className="complaints-list">
                  {complaints.map(complaint => (
                    <div key={complaint.id} className={`complaint-card ${complaint.status.toLowerCase()}`}>
                      <div className="complaint-header">
                        <span className="complaint-type">
                          <i className="fi fi-rr-tools"></i> {complaint.type}
                        </span>
                        <span className={`complaint-status ${complaint.status.toLowerCase()}`}>
                          {complaint.status}
                        </span>
                      </div>
                      <p className="complaint-desc">{complaint.description}</p>
                      {complaint.response && (
                        <div className="complaint-response">
                          <strong>Response:</strong> {complaint.response}
                        </div>
                      )}
                      <div className="complaint-footer">
                        <span className="complaint-date">
                          <i className="fi fi-rr-calendar"></i> {complaint.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="edit-actions">
                <button className="cancel-btn" onClick={handleCancel}>
                  <i className="fi fi-rr-cross"></i> Cancel
                </button>
                <button className="save-btn" onClick={handleSave}>
                  <i className="fi fi-rr-check"></i> Save Changes
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Profile;
