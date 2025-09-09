import React, { useState } from "react";
import "../../../styles/admin.css"; 


const StudentTable = ({ students }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  return (
    <>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Matric</th>
            <th>Level</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, i) => (
            <tr key={i}>
              <td>{s.name}</td>
              <td>{s.matric}</td>
              <td>{s.level}</td>
              <td>{s.status}</td>
              <td>
                <button className="admin-btn" onClick={() => handleEdit(s)}>Edit</button>
                <button className="admin-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Student</h3>
            {/* Add form fields here */}
            <button className="admin-btn" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentTable;