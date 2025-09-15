import React, { useState } from "react";
import "../../../styles/admin.css"; 

const StudentTable = ({ students, onEdit, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setEditFormData({
      fullName: student.fullName,
      email: student.email,
      matricNumber: student.matricNumber,
      department: student.department,
      level: student.level,
      phone: student.phone
    });
    setShowModal(true);
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    onEdit(selectedStudent._id, editFormData);
    setShowModal(false);
  };

  return (
    <>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Matric</th>
            <th>Email</th>
            <th>Department</th>
            <th>Level</th>
            <th>Phone</th>
            <th>Room</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>No students found</td>
            </tr>
          ) : (
            students.map((student) => (
              <tr key={student._id}>
                <td>{student.fullName}</td>
                <td>{student.matricNumber}</td>
                <td>{student.email}</td>
                <td>{student.department}</td>
                <td>{student.level}</td>
                <td>{student.phone}</td>
                <td>{student.room?.number || "Not Assigned"}</td>
                <td>
                  <button 
                    className="admin-btn" 
                    onClick={() => handleEdit(student)}
                  >
                    <i className="bx bx-edit"></i>
                  </button>
                  <button 
                    className="admin-btn delete-btn" 
                    onClick={() => onDelete(student._id)}
                  >
                    <i className="bx bx-trash"></i>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Student</h3>
            <form onSubmit={handleSubmitEdit}>
              <div className="form-group">
                <label>Full Name:</label>
                <input
                  type="text"
                  value={editFormData.fullName}
                  onChange={(e) => setEditFormData({
                    ...editFormData,
                    fullName: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({
                    ...editFormData,
                    email: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Matric Number:</label>
                <input
                  type="text"
                  value={editFormData.matricNumber}
                  onChange={(e) => setEditFormData({
                    ...editFormData,
                    matricNumber: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Department:</label>
                <input
                  type="text"
                  value={editFormData.department}
                  onChange={(e) => setEditFormData({
                    ...editFormData,
                    department: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Level:</label>
                <select
                  value={editFormData.level}
                  onChange={(e) => setEditFormData({
                    ...editFormData,
                    level: e.target.value
                  })}
                  required
                >
                  <option value="">Select Level</option>
                  <option value="100">100</option>
                  <option value="200">200</option>
                  <option value="300">300</option>
                  <option value="400">400</option>
                  <option value="500">500</option>
                </select>
              </div>
              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="tel"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({
                    ...editFormData,
                    phone: e.target.value
                  })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentTable;