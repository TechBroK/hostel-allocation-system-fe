import React from "react";
import "../../../styles/admin.css";

const AllocationTable = ({ allocations }) => (
  <div className="bg-white shadow rounded p-4">
    <h2 className="text-xl font-bold mb-4">Allocations</h2>
    <table className="admin-table w-full border-collapse border border-gray-200">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 border">Student</th>
          <th className="p-2 border">Matric</th>
          <th className="p-2 border">Hostel</th>
          <th className="p-2 border">Room</th>
        </tr>
      </thead>
      <tbody>
        {allocations.map((a, idx) => (
          <tr key={idx} className="hover:bg-gray-50">
            <td className="p-2 border">{a.student}</td>
            <td className="p-2 border">{a.matric}</td>
            <td className="p-2 border">{a.hostel}</td>
            <td className="p-2 border">{a.room}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default AllocationTable;
