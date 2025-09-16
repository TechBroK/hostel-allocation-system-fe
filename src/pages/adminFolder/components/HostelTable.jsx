import React from "react";
import "../../../styles/admin.css";


const HostelTable = ({ hostels }) => (
  <div className="bg-white shadow rounded p-4">
    <h2 className="text-xl font-bold mb-4">Hostels</h2>
    <table className="admin-table w-full border-collapse border border-gray-200">
      <thead>
        <tr className="bg-gray-100">
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
          <tr key={h.id || i} className="hover:bg-gray-50">
            <td className="p-2 border">{h.name}</td>
            <td className="p-2 border">{h.type}</td>
            <td className="p-2 border">{h.capacity}</td>
            <td className="p-2 border">{h.available}</td>
            <td className="p-2 border">{h.occupied}</td>
            <td className="p-2 border">{h.maintenance}</td>
            <td className="p-2 border">{Array.isArray(h.rooms) ? h.rooms.length : 0}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default HostelTable;
