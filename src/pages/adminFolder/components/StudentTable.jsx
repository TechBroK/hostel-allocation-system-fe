import React, { useState, useEffect } from "react";
import { adminApi } from "../../../utils/api";
import "../../../styles/admin.css";

const StudentTable = ({ students: externalStudents = [], onEdit, onDelete }) => {
  const [students, setStudents] = useState(externalStudents);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    if (externalStudents && externalStudents.length) {
      setStudents(externalStudents);
      setLoading(false);
      return;
    }
    const fetchStudents = async () => {
      try {
        const response = await adminApi.getStudents({ page: 1, limit: 50 });
        // Support paginated response: students in response.data.data or response.data.items
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
    fetchStudents();
  }, [externalStudents]);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await adminApi.getDepartments();
        const items = Array.isArray(res.data?.items) ? res.data.items : [];
        setDepartments(items);
      } catch (_) {
        // ignore; keep input usable if dropdown fails
      }
    };
    loadDepartments();
  }, []);

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setEditFormData({
      fullName: student.fullName || "",
      email: student.email || "",
      matricNumber: student.matricNumber || "",
      department: student.department || "",
      level: student.level || "",
      phone: student.phone || ""
    });
    setShowModal(true);
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return;
    try {
      const id = selectedStudent._id || selectedStudent.id;
      const payload = { ...editFormData };
      const res = await adminApi.updateStudent(id, payload);
      const updated = res.data;
      setStudents(prev => prev.map(s => (s._id === id || s.id === id) ? updated : s));
      setShowModal(false);
      setSelectedStudent(null);
    } catch (err) {
      setError(err.response?.data?.message || "Error updating student");
    }
  };

  return (
    <>
      {error && (
        <div className="error-message">{error}</div>
      )}
      {loading ? (
        <div className="loading">Loading students...</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Matric</th>
              <th>Email</th>
              <th>Department</th>
              <th>Level</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Role</th>
              <th>Allocation Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: "center" }}>No students found</td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student._id || student.id}>
                  <td>{student.fullName}</td>
                  <td>{student.matricNumber}</td>
                  <td>{student.email}</td>
                  <td>{student.department}</td>
                  <td>{student.level}</td>
                  <td>{student.phone}</td>
                  <td>{student.gender}</td>
                  <td>{student.role}</td>
                  <td>{student.allocationStatus || student.status}</td>
                  <td>
                    <button 
                      className="admin-btn" 
                      onClick={() => handleEdit(student)}
                    >
                      <i className="bx bx-edit"></i>
                    </button>
                    {onDelete && (
                      <button className="admin-btn danger" onClick={() => onDelete(student._id || student.id)}>
                        <i className="bx bx-trash"></i>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

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
                {departments.length > 0 ? (
                  <select
                    value={editFormData.department || ''}
                    onChange={(e) => setEditFormData({
                      ...editFormData,
                      department: e.target.value
                    })}
                  >
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={editFormData.department}
                    onChange={(e) => setEditFormData({
                      ...editFormData,
                      department: e.target.value
                    })}
                  />
                )}
              </div>
              <div className="form-group">
                <label>Level:</label>
                <select
                  value={editFormData.level}
                  onChange={(e) => setEditFormData({
                    ...editFormData,
                    level: e.target.value
                  })}
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