import React, { useEffect, useMemo, useState } from 'react';
import { adminApi, studentApi } from '../../../utils/api';
import '../../../styles/admin.css';

const Complaints = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [studentId, setStudentId] = useState('');
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([]);
  const [responseDraft, setResponseDraft] = useState({}); // complaintId -> response text

  const fetchComplaints = async (sid) => {
    if (!sid) return;
    try {
      setLoading(true);
      setError(null);
      const res = await studentApi.getComplaints(sid);
      const data = Array.isArray(res.data?.items)
        ? res.data.items
        : Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
            ? res.data
            : [];
      setItems(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading complaints');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) { fetchComplaints(studentId); }
  }, [studentId]);

  useEffect(() => {
    let cancelled = false;
    const search = async () => {
      try {
        if (!query || query.length < 2) { setOptions([]); return; }
        const res = await adminApi.getStudents({ page: 1, limit: 10, q: query });
        const arr = Array.isArray(res.data?.items) ? res.data.items : (Array.isArray(res.data?.data) ? res.data.data : []);
        if (!cancelled) setOptions(arr.map(s => ({ id: s.id || s._id, label: `${s.fullName} (${s.matricNumber || s.email})` })));
      } catch (_) { /* ignore */ }
    };
    const t = setTimeout(search, 250);
    return () => { cancelled = true; clearTimeout(t); };
  }, [query]);

  const handleResolve = async (complaintId) => {
    try {
      await adminApi.updateComplaint(complaintId, { status: 'Resolved' });
      setItems(prev => prev.filter(c => (c._id || c.id) !== complaintId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resolve complaint');
    }
  };

  const handleRespond = async (complaintId) => {
    const text = responseDraft[complaintId];
    if (!text || !text.trim()) { setError('Please enter a response'); return; }
    try {
      await adminApi.updateComplaint(complaintId, { response: text });
      setResponseDraft(prev => ({ ...prev, [complaintId]: '' }));
      // Refresh current student complaints so student page reflects latest
      if (studentId) fetchComplaints(studentId);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add response');
    }
  };

  return (
    <div className="flex">
      <div className="flex-1 admin-main">
        <div className="admin-section-header">
          <h1>Complaints</h1>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <input
                className="search-input"
                placeholder="Search student by name, email, or matric no."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ width: 360 }}
              />
              {options.length > 0 && (
                <div className="dropdown" style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #ddd', zIndex: 20 }}>
                  {options.map(opt => (
                    <div
                      key={opt.id}
                      onClick={() => { setStudentId(opt.id); setQuery(opt.label); setOptions([]); }}
                      style={{ padding: 8, cursor: 'pointer' }}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button className="admin-btn" onClick={() => studentId && fetchComplaints(studentId)}>Load</button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Description</th>
                <th>Status</th>
                <th>Response</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={6} className="text-center">No complaints to show</td></tr>
              ) : items.map((c) => {
                const id = c._id || c.id;
                return (
                  <tr key={id}>
                    <td>{c.date ? new Date(c.date).toLocaleString() : ''}</td>
                    <td>{c.type || '-'}</td>
                    <td>{c.description || c.message}</td>
                    <td>{c.status}</td>
                    <td style={{ minWidth: 220 }}>
                      <input
                        type="text"
                        placeholder="Add response..."
                        value={responseDraft[id] || ''}
                        onChange={(e) => setResponseDraft(prev => ({ ...prev, [id]: e.target.value }))}
                        disabled={c.status === 'Resolved'}
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <button className="admin-btn" onClick={() => handleRespond(id)} disabled={c.status === 'Resolved'}>Respond</button>
                      <button className="admin-btn" style={{ background: '#27ae60' }} onClick={() => handleResolve(id)}>Mark Resolved</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Complaints;
