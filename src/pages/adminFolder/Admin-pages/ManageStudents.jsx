import React, { useState, useEffect } from "react";
import "../../../styles/admin.css";
import StudentTable from "../components/StudentTable";
import { adminApi } from "../../../utils/api";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  // const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [departments, setDepartments] = useState([]);
  // Removed newStudentId, backend will generate _id

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await adminApi.getStudents({ page: 1, limit: 50 });
        // Support paginated response
        const studentsArr = Array.isArray(response.data?.data)
          ? response.data.data
          : Array.isArray(response.data?.items)
            ? response.data.items
            : Array.isArray(response.data)
              ? response.data
              : [];
        setStudents(studentsArr);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Error loading students");
        setLoading(false);
      }
    };
    const fetchDepartments = async () => {
      try {
        const res = await adminApi.getDepartments();
        const items = Array.isArray(res.data?.items) ? res.data.items : [];
        setDepartments(items);
      } catch (_) { /* no-op */ }
    };

    fetchStudents();
    fetchDepartments();
  }, []);

  // Add Student now uses PUT /api/admin/students/{studentId} (updateStudentStatus)
  const handleAdd = async (newStudent) => {
    try {
      // Remove id/_id, let backend generate ObjectId
      const { id, _id, department, phone, ...rest } = newStudent;
      const studentData = {
        ...rest,
        department: (department || '').trim() || undefined,
        phone: phone || undefined
      };
      console.log('Add Student request payload:', studentData);
      const response = await adminApi.addStudent(studentData);
      const createdStudent = response.data?.item || response.data;
      setStudents(prev => [...prev, createdStudent]);
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
          (student._id === studentId || student.id === studentId) ? response.data : student
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Error updating student");
    }
  };

  const handleDelete = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    
    try {
      await adminApi.deleteStudent(studentId);
      setStudents(prev => prev.filter(student => (student._id || student.id) !== studentId));
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting student");
    }
  };


  return (
    <div className="flex">
      <div className="flex-1">
        {/* Only render Topbar once at the top-level layout, not inside nested components */}
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
              students={students}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {/* Add Student Modal */}
          {showAddModal && (
            <div className="modal">
              <div className="modal-content">
                <h2>Add New Student</h2>
                {error && (
                  <div className="error-message" style={{ marginBottom: '1rem' }}>
                    {error}
                    <button onClick={() => setError(null)} style={{ marginLeft: 8 }}>Dismiss</button>
                  </div>
                )}
                <form onSubmit={e => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleAdd({
                    fullName: formData.get('fullName'),
                    email: formData.get('email'),
                    matricNumber: formData.get('matricNumber'),
                    department: formData.get('department'),
                    level: formData.get('level'),
                    phone: formData.get('phone'),
                    gender: formData.get('gender'),
                    allocationStatus: formData.get('allocationStatus')
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
                    <select name="department" required defaultValue="">
                      <option value="" disabled>Select Department</option>
                      {departments.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
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
                  <div className="form-group">
                    <label>Gender:</label>
                    <select name="gender" required>
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Allocation Status:</label>
                    <select name="allocationStatus" required>
                      <option value="">Select Status</option>
                      <option value="pending">Pending</option>
                      <option value="allocated">Allocated</option>
                      <option value="rejected">Rejected</option>
                    </select>
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