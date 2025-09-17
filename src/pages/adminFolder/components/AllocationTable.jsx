import React from "react";
import "../../../styles/admin.css";

const AllocationTable = ({ allocations }) => {
  return (
    <div className="bg-white shadow rounded p-4" style={{ overflowX: 'auto' }}>
      <h2 className="text-xl font-bold mb-4">Student Allocations</h2>
      <table className="admin-table" style={{ minWidth: '1200px', width: '100%' }}>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Matric Number</th>
            <th>Email</th>
            <th>Session</th>
            <th>Status</th>
            <th>Compatibility</th>
            <th>Allocated At</th>
            <th>Hostel</th>
            <th>Room</th>
          </tr>
        </thead>
        <tbody>
          {allocations && allocations.length > 0 ? (
            allocations.map((a, idx) => (
              <tr key={a._id} className={idx % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td>{a.student?.fullName || '-'}</td>
                <td>{a.student?.matricNumber || '-'}</td>
                <td>{a.student?.email || '-'}</td>
                <td>{a.session || '-'}</td>
                <td>
                  <span className={
                    a.status === 'approved' ? 'status-approved' :
                    a.status === 'pending' ? 'status-pending' :
                    a.status === 'rejected' ? 'status-rejected' : ''
                  }>
                    {a.status || '-'}
                  </span>
                </td>
                <td>
                  {a.compatibilityScore ? (
                    <span className="compatibility-badge">
                      {a.compatibilityScore} ({a.compatibilityRange})
                    </span>
                  ) : '-'}
                </td>
                <td>{a.allocatedAt ? new Date(a.allocatedAt).toLocaleString() : '-'}</td>
                <td>
                  <span className="font-semibold">{a.room?.hostel?.name || '-'}</span><br/>
                 
                </td>
                <td>
                  <span className="font-semibold">{a.room?.roomNumber || '-'}</span><br/>
                  <span className="desc-text">{a.room?.type || ''} | {a.room?.capacity || ''} beds</span>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={9} className="text-center">No allocations found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AllocationTable;
