import React, { useEffect, useState } from "react";
import "../../../styles/admin.css";
import { adminApi } from "../../../utils/api";



const HostelTable = ({ hostels }) => {
  const [expanded, setExpanded] = useState({});
  const [rows, setRows] = useState(hostels || []);
  const [newRoom, setNewRoom] = useState({});
  const [error, setError] = useState(null);
  const [editingHostelId, setEditingHostelId] = useState(null);
  const [editingHostelDraft, setEditingHostelDraft] = useState({});
  const [editingRoomKey, setEditingRoomKey] = useState(null); // `${hostelKey}:${roomKey}`
  const [editingRoomDraft, setEditingRoomDraft] = useState({});

  useEffect(() => { setRows(hostels || []); }, [hostels]);

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-xl font-bold mb-4">Hostels</h2>
      {error && (<div className="error-message" style={{ marginBottom: 8 }}>{error}</div>)}
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
            <th className="p-2 border">Actions:</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((h, i) => (
            <React.Fragment key={h.id || i}>
              <tr className="hover:bg-gray-50">
                <td className="p-2 border text-center">
                  <button onClick={() => toggleExpand(h.id || i)} style={{ cursor: 'pointer', background: 'none', border: 'none' }}>
                    {expanded[h.id || i] ? '▼' : '▶'}
                  </button>
                </td>
                <td className="p-2 border">{
                  editingHostelId === (h.id || i)
                    ? (<input value={editingHostelDraft.name || ''} onChange={e=>setEditingHostelDraft(prev=>({...prev, name:e.target.value}))} style={{ width: 140 }} />)
                    : h.name
                }</td>
                <td className="p-2 border">{
                  editingHostelId === (h.id || i)
                    ? (
                      <select value={editingHostelDraft.type || ''} onChange={e=>setEditingHostelDraft(prev=>({...prev, type:e.target.value}))} style={{ width: 110 }}>
                        <option value="">Type</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    )
                    : h.type
                }</td>
                <td className="p-2 border">{
                  Array.isArray(h.rooms) && h.rooms.length > 0
                    ? h.rooms.reduce((sum, room) => sum + (room.capacity || 0), 0)
                    : h.capacity
                }</td>
                <td className="p-2 border">{h.available}</td>
                <td className="p-2 border">{h.occupied}</td>
                <td className="p-2 border">{h.maintenance}</td>
                <td className="p-2 border">{Array.isArray(h.rooms) ? h.rooms.length : 0}</td>
                <td className="p-2 border">
                  {editingHostelId === (h.id || i) ? (
                    <>
                      <button
                        className="admin-btn"
                        onClick={async ()=>{
                          try {
                            const hostelId = h.id || h._id || (h.id === 0 ? i : h.id);
                            const payload = {};
                            if (editingHostelDraft.name !== undefined) payload.name = editingHostelDraft.name;
                            if (editingHostelDraft.type !== undefined) payload.type = editingHostelDraft.type;
                            // capacity handled by rooms sum for now; optional to edit description
                            if (editingHostelDraft.description !== undefined) payload.description = editingHostelDraft.description;
                            const res = await adminApi.updateHostel(hostelId, payload);
                            const updated = res.data?.data || res.data;
                            setRows(prev => prev.map((row, idx) => ((row.id || idx) === (h.id || i) ? { ...row, ...updated } : row)));
                            setEditingHostelId(null);
                            setEditingHostelDraft({});
                            setError(null);
                          } catch (err) {
                            setError(err.response?.data?.message || 'Failed to update hostel');
                          }
                        }}
                      >Save</button>
                      <button className="admin-btn" onClick={()=>{ setEditingHostelId(null); setEditingHostelDraft({}); }}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="admin-btn" onClick={()=>{ setEditingHostelId(h.id || i); setEditingHostelDraft({ name: h.name, type: h.type, description: h.description || '' }); }}>Edit</button>
                      <button
                        className="admin-btn danger"
                        onClick={async () => {
                          try {
                            if (!window.confirm(`Delete hostel "${h.name}"? This will remove all rooms if no allocations exist.`)) return;
                            const hostelId = h.id || h._id;
                            await adminApi.deleteHostel(hostelId);
                            setRows(prev => prev.filter((row, idx) => (row.id || idx) !== (h.id || i)));
                            setError(null);
                          } catch (err) {
                            setError(err.response?.data?.message || 'Failed to delete hostel');
                          }
                        }}
                      >Delete</button>
                    </>
                  )}
                </td>
              </tr>
              {expanded[h.id || i] && (
                <tr>
                  <td colSpan={9} className="p-2 border bg-gray-50">
                    <div style={{ overflowX: 'auto' }}>
                      <table className="w-full text-sm border">
                        <thead>
                          <tr>
                            <th className="p-1 border">Room #</th>
                            <th className="p-1 border">Type</th>
                            <th className="p-1 border">Capacity</th>
                            <th className="p-1 border">Occupied</th>
                            <th className="p-1 border">Actions:</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.isArray(h.rooms) && h.rooms.length > 0 && h.rooms.map((room, idx) => (
                            <tr key={room.id || idx}>
                              <td className="p-1 border">{
                                editingRoomKey === `${h.id || i}:${room.id || idx}`
                                  ? (<input value={editingRoomDraft.roomNumber || ''} onChange={e=>setEditingRoomDraft(prev=>({...prev, roomNumber:e.target.value}))} style={{ width: 90 }} />)
                                  : room.roomNumber
                              }</td>
                              <td className="p-1 border">{
                                editingRoomKey === `${h.id || i}:${room.id || idx}`
                                  ? (
                                    <select value={editingRoomDraft.type || ''} onChange={e=>setEditingRoomDraft(prev=>({...prev, type:e.target.value}))} style={{ width: 100 }}>
                                      <option value="">Type</option>
                                      <option value="Standard">Standard</option>
                                      <option value="Premium">Premium</option>
                                    </select>
                                  )
                                  : room.type
                              }</td>
                              <td className="p-1 border">{
                                editingRoomKey === `${h.id || i}:${room.id || idx}`
                                  ? (<input type="number" min="1" value={editingRoomDraft.capacity ?? room.capacity} onChange={e=>setEditingRoomDraft(prev=>({...prev, capacity:Number(e.target.value)}))} style={{ width: 80 }} />)
                                  : room.capacity
                              }</td>
                              <td className="p-1 border">{room.occupied}</td>
                              <td className="p-1 border">
                                {editingRoomKey === `${h.id || i}:${room.id || idx}` ? (
                                  <>
                                    <button className="admin-btn" onClick={async()=>{
                                      try {
                                        const res = await adminApi.updateRoom(room.id || room._id, {
                                          roomNumber: editingRoomDraft.roomNumber ?? room.roomNumber,
                                          type: editingRoomDraft.type ?? room.type,
                                          capacity: editingRoomDraft.capacity ?? room.capacity,
                                        });
                                        const updated = res.data?.data || res.data;
                                        setRows(prev => prev.map((row, idxRow) => {
                                          if ((row.id || idxRow) === (h.id || i)) {
                                            return { ...row, rooms: (row.rooms || []).map((r, rIdx) => ( (r.id || rIdx) === (room.id || idx) ? { ...r, ...updated } : r)) };
                                          }
                                          return row;
                                        }));
                                        setEditingRoomKey(null);
                                        setEditingRoomDraft({});
                                        setError(null);
                                      } catch (err) {
                                        setError(err.response?.data?.message || 'Failed to update room');
                                      }
                                    }}>Save</button>
                                    <button className="admin-btn" onClick={()=>{ setEditingRoomKey(null); setEditingRoomDraft({}); }}>Cancel</button>
                                  </>
                                ) : (
                                  <>
                                    <button className="admin-btn" onClick={()=>{ setEditingRoomKey(`${h.id || i}:${room.id || idx}`); setEditingRoomDraft({ roomNumber: room.roomNumber, type: room.type, capacity: room.capacity }); }}>Edit</button>
                                    <button
                                      className="admin-btn danger"
                                      onClick={async () => {
                                        try {
                                          if (!window.confirm(`Delete room ${room.roomNumber}?`)) return;
                                          await adminApi.deleteRoom(room.id || room._id);
                                          setRows(prev => prev.map((row, idxRow) => {
                                            if ((row.id || idxRow) === (h.id || i)) {
                                              return { ...row, rooms: (row.rooms || []).filter((r, rIdx) => (r.id || rIdx) !== (room.id || idx)) };
                                            }
                                            return row;
                                          }));
                                          setError(null);
                                        } catch (err) {
                                          setError(err.response?.data?.message || 'Failed to delete room');
                                        }
                                      }}
                                    >Delete</button>
                                  </>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <strong>Add Room:</strong>
                      <input
                        placeholder="Room #"
                        style={{ width: 90 }}
                        value={(newRoom[h.id || i]?.roomNumber) || ''}
                        onChange={(e)=>setNewRoom(prev=>({ ...prev, [h.id || i]: { ...(prev[h.id || i]||{}), roomNumber: e.target.value } }))}
                      />
                      <select
                        style={{ width: 100 }}
                        value={(newRoom[h.id || i]?.type) || ''}
                        onChange={(e)=>setNewRoom(prev=>({ ...prev, [h.id || i]: { ...(prev[h.id || i]||{}), type: e.target.value } }))}
                      >
                        <option value="">Type</option>
                        <option value="Standard">Standard</option>
                        <option value="Premium">Premium</option>
                      </select>
                      <input
                        type="number"
                        min="1"
                        placeholder="Capacity"
                        style={{ width: 90 }}
                        value={(newRoom[h.id || i]?.capacity) || 1}
                        onChange={(e)=>setNewRoom(prev=>({ ...prev, [h.id || i]: { ...(prev[h.id || i]||{}), capacity: Number(e.target.value) } }))}
                      />
                      <button
                        className="admin-btn"
                        onClick={async ()=>{
                          try {
                            const hostelId = h.id || h._id;
                            const payload = newRoom[h.id || i] || {};
                            if (!hostelId || !payload.roomNumber || !payload.type || !payload.capacity) { setError('Fill room fields'); return; }
                            const res = await adminApi.addRoomToHostel(hostelId, { roomNumber: payload.roomNumber, type: payload.type, capacity: Number(payload.capacity) });
                            const created = res.data?.data || res.data;
                            setRows(prev => prev.map((row, idx) => {
                              if ((row.id || idx) === (h.id || i)) {
                                const next = { ...row, rooms: [ ...(row.rooms || []), { id: created.id || created._id, roomNumber: created.roomNumber, type: created.type, capacity: created.capacity, occupied: created.occupied || 0 } ] };
                                return next;
                              }
                              return row;
                            }));
                            setNewRoom(prev=>({ ...prev, [h.id || i]: {} }));
                            setError(null);
                          } catch (err) {
                            setError(err.response?.data?.message || 'Failed to add room');
                          }
                        }}
                      >
                        Add Room
                      </button>
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
