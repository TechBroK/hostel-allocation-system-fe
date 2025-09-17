import React, { useState } from "react";
import "../../../styles/admin.css";



const HostelTable = ({ hostels }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-xl font-bold mb-4">Hostels</h2>
      <table className="admin-table w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border"></th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Capacity</th>
            <th className="p-2 border">Available</th>
            <th className="p-2 border">Occupied</th>
            <th className="p-2 border">Maintenance</th>
            <th className="p-2 border">Rooms</th>
          </tr>
        </thead>
        <tbody>
          {hostels.map((h, i) => (
            <React.Fragment key={h.id || i}>
              <tr className="hover:bg-gray-50">
                <td className="p-2 border text-center">
                  <button onClick={() => toggleExpand(h.id || i)} style={{ cursor: 'pointer', background: 'none', border: 'none' }}>
                    {expanded[h.id || i] ? '▼' : '▶'}
                  </button>
                </td>
                <td className="p-2 border">{h.name}</td>
                <td className="p-2 border">{h.type}</td>
                <td className="p-2 border">{
                  Array.isArray(h.rooms) && h.rooms.length > 0
                    ? h.rooms.reduce((sum, room) => sum + (room.capacity || 0), 0)
                    : h.capacity
                }</td>
                <td className="p-2 border">{h.available}</td>
                <td className="p-2 border">{h.occupied}</td>
                <td className="p-2 border">{h.maintenance}</td>
                <td className="p-2 border">{Array.isArray(h.rooms) ? h.rooms.length : 0}</td>
              </tr>
              {expanded[h.id || i] && Array.isArray(h.rooms) && h.rooms.length > 0 && (
                <tr>
                  <td colSpan={8} className="p-2 border bg-gray-50">
                    <div style={{ overflowX: 'auto' }}>
                      <table className="w-full text-sm border">
                        <thead>
                          <tr>
                            <th className="p-1 border">Room #</th>
                            <th className="p-1 border">Type</th>
                            <th className="p-1 border">Capacity</th>
                            <th className="p-1 border">Occupied</th>
                          </tr>
                        </thead>
                        <tbody>
                          {h.rooms.map((room, idx) => (
                            <tr key={room.id || idx}>
                              <td className="p-1 border">{room.roomNumber}</td>
                              <td className="p-1 border">{room.type}</td>
                              <td className="p-1 border">{room.capacity}</td>
                              <td className="p-1 border">{room.occupied}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HostelTable;
