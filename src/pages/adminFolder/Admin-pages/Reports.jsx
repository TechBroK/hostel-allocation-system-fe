
import React, { useState } from "react";
import { adminApi } from "../../../utils/api";
import "../../../styles/admin.css";

const Reports = () => {


  const [exportType, setExportType] = useState('allocations');
  const [exportHistory, setExportHistory] = useState([]);

  const handleExport = async () => {
    try {
      // You can expand this to call different endpoints based on exportType
  const response = await adminApi.exportReport({ type: exportType }); // Pass as query param object
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const filename = `${exportType}_report_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.csv`;
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      setExportHistory(prev => [
        {
          type: exportType,
          filename,
          date: new Date().toLocaleString(),
          status: 'Success'
        },
        ...prev
      ]);
    } catch (err) {
      setExportHistory(prev => [
        {
          type: exportType,
          filename: '-',
          date: new Date().toLocaleString(),
          status: 'Failed'
        },
        ...prev
      ]);
      alert('Failed to export report.');
    }
  };


  return (
    <div className="flex">
      <div className="flex-1">
        <div className="admin-section p-6">
          <h2 className="text-2xl font-bold mb-4">Reports</h2>
          <p>Download and view allocation and hostel reports here.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <label htmlFor="exportType" style={{ fontWeight: 500 }}>Export Type:</label>
            <select
              id="exportType"
              value={exportType}
              onChange={e => setExportType(e.target.value)}
              className="admin-input"
              style={{ minWidth: 180 }}
            >
              <option value="allocations">Allocations</option>
              <option value="hostels">Hostels</option>
              <option value="rooms">Rooms</option>
              <option value="students">Students</option>
            </select>
            <button className="admin-btn" onClick={handleExport}>Export CSV</button>
          </div>

          {/* Export History Table */}
          <div className="bg-white shadow rounded p-4 mt-6" style={{ maxWidth: 700 }}>
            <h3 className="text-lg font-semibold mb-2">Export History</h3>
            <table className="admin-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Filename</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {exportHistory.length === 0 ? (
                  <tr><td colSpan={4} className="text-center">No exports yet.</td></tr>
                ) : (
                  exportHistory.map((exp, idx) => (
                    <tr key={idx}>
                      <td>{exp.type}</td>
                      <td>{exp.filename}</td>
                      <td>{exp.date}</td>
                      <td>
                        <span className={
                          exp.status === 'Success' ? 'status-approved' : 'status-rejected'
                        }>{exp.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
      {/* ...other report content... */}
          {/* Add report download/export features */}
        </div>
      </div>
    </div>
  );
};

export default Reports;
