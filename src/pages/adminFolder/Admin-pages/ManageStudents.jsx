import React, { useState, useEffect } from "react";
import "../../../styles/admin.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/topbar";
import StudentTable from "../components/StudentTable";
import { adminApi } from "../../../utils/api";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await adminApi.getStudents();
        setStudents(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Error loading students");
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleAdd = async (newStudent) => {
    try {
      const response = await adminApi.addStudent(newStudent);
      setStudents(prev => [...prev, response.data]);
      setShowAddModal(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error adding student");
    }
  };

  const handleEdit = async (studentId, updatedData) => {
    try {
      const response = await adminApi.updateStudent(studentId, updatedData);
      setStudents(prev =>
        prev.map(student =>
          student._id === studentId ? response.data : student
        )
      );
      setSelectedStudent(null);
    } catch (err) {
      setError(err.response?.data?.message || "Error updating student");
    }
  };

  const handleDelete = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    
    try {
      await adminApi.deleteStudent(studentId);
      setStudents(prev => prev.filter(student => student._id !== studentId));
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting student");
    }
  };


  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Topbar adminName="Admin" />
        <div className="admin-main">
          {/* Header */}
          <div className="admin-section-header">
            <h1>Manage Students</h1>
            <div className="action-buttons">
              <button 
                className="admin-btn"
                onClick={() => setShowAddModal(true)}
              >
                <i className="bx bx-plus"></i> Add Student
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
              <button onClick={() => setError(null)}>Dismiss</button>
            </div>
          )}

          {loading ? (
            <div className="loading">Loading students...</div>
          ) : (
            <StudentTable 
              students={students.filter(student => 
                student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.matricNumber.toLowerCase().includes(searchTerm.toLowerCase())
              )}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {/* Add Student Modal */}
          {showAddModal && (
            <div className="modal">
              <div className="modal-content">
                <h2>Add New Student</h2>
                <form onSubmit={e => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleAdd({
                    fullName: formData.get('fullName'),
                    email: formData.get('email'),
                    matricNumber: formData.get('matricNumber'),
                    department: formData.get('department'),
                    level: formData.get('level'),
                    phone: formData.get('phone')
                  });
                }}>
                  <div className="form-group">
                    <label>Full Name:</label>
                    <input type="text" name="fullName" required />
                  </div>
                  <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" required />
                  </div>
                  <div className="form-group">
                    <label>Matric Number:</label>
                    <input type="text" name="matricNumber" required />
                  </div>
                  <div className="form-group">
                    <label>Department:</label>
                    <input type="text" name="department" required />
                  </div>
                  <div className="form-group">
                    <label>Level:</label>
                    <select name="level" required>
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
                    <input type="tel" name="phone" required />
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="submit-btn">
                      Add Student
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageStudents;