import React from "react";

const StatsCard = ({ title, value }) => {
  return (
    <div className="bg-white shadow rounded p-4 text-center w-48">
      <h3 className="text-gray-500">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default StatsCard;
