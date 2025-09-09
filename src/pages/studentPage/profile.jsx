import React, { useState } from "react";
import "./../../styles/profile.css";
import Header from "../../component/header";
import Footer from "../../component/footer";

const studentData = {
  name: "Jane Doe",
  regNumber: "U2021/1234567",
  email: "janedoe@email.com",
  phone: "+234 801 234 5678",
  gender: "Female",
  department: "Computer Science",
  level: "300",
  hostel: "Block B - Female Hostel",
  roomNumber: "B12",
  roommate: "Grace Smith",
  personality: {
    type: "INFJ",
    traits: ["Quiet", "Early Riser", "Organized", "Studious"],
    bio: "Loves reading. Prefers quiet evenings for studying.",
    preferences: {
      studyHours: "Morning",
      sleepSchedule: "Early to bed, early to rise",
      noiseLevel: "Minimal"
    }
  },
  roommateMatch: {
    compatibility: 88,
    matchReason: "Similar study habits and sleep schedule",
    matchingTraits: [
      { trait: "Morning Person", student: "Yes", roommate: "Yes" },
      { trait: "Study Hours", student: "Morning", roommate: "Morning" },
      { trait: "Noise Level", student: "Minimal", roommate: "Minimal" }
    ]
  },
  allocationHistory: [
    {
      period: "2024/2025",
      hostel: "Block B - Female Hostel",
      room: "B12"
    }
  ],
  allocationStatus: "Allocated",
  applicationDate: "2025-07-15",
  profilePic: "/assets/images/student-avatar.png",
  complaints: [
    {
      id: 1,
      date: "2025-08-05",
      type: "Maintenance",
      status: "Pending",
      description: "Water heater not working properly",
      response: null
    },
    {
      id: 2,
      date: "2025-08-01",
      type: "Roommate",
      status: "Resolved",
      description: "Noise complaints during study hours",
      response: "Mediation session scheduled for 8/3"
    }
  ]
};

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(studentData);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaintType, setComplaintType] = useState("");
  const [complaintDesc, setComplaintDesc] = useState("");

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(studentData);
  };

  const handleSave = () => {
    // Here you would typically make an API call to update the data
    setIsEditing(false);
    // Update the studentData with editedData
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(studentData);
  };

  const handleChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarChange = (e) => {
    // Handle avatar change logic
  };

  const handleSubmitComplaint = () => {
    if (!complaintType || !complaintDesc) {
      // Add error handling
      return;
    }
    
    const newComplaint = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      type: complaintType,
      status: "Pending",
      description: complaintDesc,
      response: null
    };
    
    // Add to complaints list
    // API call would go here
    
    setShowComplaintForm(false);
    setComplaintType("");
    setComplaintDesc("");
  };

  return (
   <>
   <Header />
    <div className="profile-dashboard">
      <div className="profile-dashboard-header">
        <div className="profile-avatar-wrapper">
          <img
            src={studentData.profilePic}
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
            <h2>{studentData.name}</h2>
            <button 
              className="edit-profile-btn"
              onClick={isEditing ? handleSave : handleEdit}
            >
              <i className={`fi fi-rr-${isEditing ? 'save' : 'edit'}`}></i>
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>
          <p className="profile-dashboard-status">
            {studentData.allocationStatus === "Allocated" ? (
              <span className="allocated">Allocated</span>
            ) : (
              <span className="pending">Pending</span>
            )}
          </p>
          <div className="profile-dashboard-meta">
            <span>{studentData.regNumber}</span> | <span>{studentData.level} Level</span>
          </div>
        </div>
      </div>

      <div className="profile-dashboard-cards">
        <div className="profile-dashboard-card">
          <h4>Hostel</h4>
          <p>{studentData.hostel}</p>
        </div>
        <div className="profile-dashboard-card">
          <h4>Room</h4>
          <p>{studentData.roomNumber}</p>
        </div>
        <div className="profile-dashboard-card">
          <h4>Roommate</h4>
          <p>{studentData.roommate}</p>
        </div>
        <div className="profile-dashboard-card">
          <h4>Personality</h4>
          <p>{studentData.personality.type}</p>
        </div>
      </div>

      <div className="profile-dashboard-sections">
        <div className="profile-dashboard-section">
          <h3>Personal Information</h3>
          <div className="profile-dashboard-info-grid">
            <div>
              <strong>Email:</strong>
              {isEditing ? (
                <input
                  type="email"
                  value={editedData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="edit-input"
                />
              ) : (
                <span>{studentData.email}</span>
              )}
            </div>
            <div>
              <strong>Phone:</strong>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="edit-input"
                />
              ) : (
                <span>{studentData.phone}</span>
              )}
            </div>
            <div>
              <strong>Gender:</strong>
              <span>{studentData.gender}</span>
            </div>
            <div>
              <strong>Department:</strong>
              <span>{studentData.department}</span>
            </div>
          </div>
        </div>
        <div className="profile-dashboard-section">
          <h3>Hostel Allocation</h3>
          <div className="profile-dashboard-info-grid">
            <div>
              <strong>Status:</strong>
              <span className={studentData.allocationStatus === "Allocated" ? "allocated" : "pending"}>
                {studentData.allocationStatus}
              </span>
            </div>
            <div>
              <strong>Hostel:</strong>
              <span>{studentData.hostel}</span>
            </div>
            <div>
              <strong>Room Number:</strong>
              <span>{studentData.roomNumber}</span>
            </div>
            <div>
              <strong>Roommate:</strong>
              <span>{studentData.roommate}</span>
            </div>
            <div>
              <strong>Application Date:</strong>
              <span>{studentData.applicationDate}</span>
            </div>
          </div>
        </div>
        <div className="profile-dashboard-section">
          <h3>Personality & Preferences</h3>
          <div className="personality-content">
            <div className="mbti-badge">{studentData.personality.type}</div>
            <div className="traits-tags">
              {studentData.personality.traits.map(trait => (
                <span key={trait} className="trait-tag">
                  <i className="fi fi-rr-star"></i> {trait}
                </span>
              ))}
            </div>
            <p className="bio-text">
              <i className="fi fi-rr-quote-right"></i> {studentData.personality.bio}
            </p>
          </div>
        </div>
        <div className="profile-dashboard-section">
          <h3>Roommate Match</h3>
          <div className="roommate-match-content">
            <div className="compatibility-score">
              <div className="score-circle">
                <span>{studentData.roommateMatch.compatibility}%</span>
                <small>Match</small>
              </div>
            </div>
            <p className="match-reason">{studentData.roommateMatch.matchReason}</p>
            <table className="matching-traits-table">
              <thead>
                <tr>
                  <th>Trait</th>
                  <th>You</th>
                  <th>Roommate</th>
                </tr>
              </thead>
              <tbody>
                {studentData.roommateMatch.matchingTraits.map(item => (
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
        <div className="profile-dashboard-section complaints-section">
          <div className="section-header">
            <h3>Complaints & Feedback</h3>
            <button className="new-complaint-btn" onClick={() => setShowComplaintForm(true)}>
              <i className="fi fi-rr-plus"></i> New Complaint
            </button>
          </div>

          {showComplaintForm && (
            <div className="complaint-form">
              <select className="complaint-input" value={complaintType} onChange={(e) => setComplaintType(e.target.value)}>
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
            {studentData.complaints.map(complaint => (
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
    </div>
    <Footer />
   </>
  );
};

export default Profile;