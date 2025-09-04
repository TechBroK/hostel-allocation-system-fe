import React from "react";

const Topbar = ({ adminName }) => {
  return (
    <header className="flex justify-between items-center bg-white shadow-md p-4 ml-64">
      <h1 className="text-xl font-bold">Hostel Allocation System</h1>
      <div className="flex items-center gap-4">
        <span className="font-medium">Welcome, {adminName}</span>
        <button className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
      </div>
    </header>
  );
};

export default Topbar;
