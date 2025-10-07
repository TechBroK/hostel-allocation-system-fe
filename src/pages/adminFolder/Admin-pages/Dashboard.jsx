
import React, { useEffect, useMemo, useState } from "react";
import "../../../styles/admin.css";
import StatsCard from "../components/StatsCard";
import Alert from "../../../component/Alert";
import { adminApi, studentApi } from "../../../utils/api";
// AllocationTable removed, using inline table for pending allocations only

const Dashboard = () => {
  const [allocationsData, setAllocationsData] = useState([]);
  const [allocationsMeta, setAllocationsMeta] = useState({ page: 1, limit: 0, total: 0, pageCount: 0 });
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ open: false, type: "info", message: "" });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Pending");
  const [unallocated, setUnallocated] = useState([]);
  const [approveModal, setApproveModal] = useState({ open: false, allocationId: null, studentId: null, studentName: "", hostelId: "", roomId: "", rooms: [], hostels: [], loading: false });

  // Fetch dashboard summary and allocations based on filter (except Unallocated)
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const statusParam = (() => {
          const f = String(filter).toLowerCase();
          if (f === 'approved') return 'approved';
          if (f === 'rejected') return 'rejected';
          if (f === 'pending') return 'pending';
          return undefined;
        })();
        const [sumRes, allocRes] = await Promise.all([
          adminApi.getDashboardStats(),
          // For Unallocated, we don't load allocations here; handled in separate effect
          String(filter).toLowerCase() === 'unallocated'
            ? Promise.resolve({ data: { data: [], meta: { page: 1, limit: 0, total: 0, pageCount: 0 } } })
            : adminApi.getAllocations({ limit: 100, page: 1, ...(statusParam ? { status: statusParam } : {}) }),
        ]);
        if (!mounted) return;
        const summaryData = sumRes?.data?.data ?? sumRes?.data ?? null;
        setSummary(summaryData);
  const list = Array.isArray(allocRes?.data?.data) ? allocRes.data.data : [];
        setAllocationsData(list.map(a => ({
          _id: a.id || a._id,
          studentId: a.student?._id || a.student?.id || a.studentId || null,
          student: a.student?.fullName || a.student?.matricNumber || a.student?.email || 'Student',
          roomId: (a.roomDetails?._id || a.room?._id || a.room) || null,
          room: a.roomDetails?.roomNumber || a.room?.roomNumber || a.room || '-',
          session: a.session || '-',
          status: (a.status || '').toString(),
          // prefer application submission time
          appliedAt: a.appliedAt || a.submittedAt || a.createdAt || a.allocatedAt || null,
        })));
  const meta = allocRes?.data?.meta || { page: 1, limit: list.length, total: list.length, pageCount: 1 };
  setAllocationsMeta(meta);
      } catch (err) {
        if (!mounted) return;
        setAlert({ open: true, type: 'error', message: err?.response?.data?.message || 'Failed to load dashboard data' });
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [filter]);

  // Load unallocated students when Unallocated filter is active; otherwise clear
  useEffect(() => {
    let mounted = true;
    const loadUnallocated = async () => {
      if (String(filter).toLowerCase() !== 'unallocated') { setUnallocated([]); return; }
      try {
        const res = await adminApi.getUnallocatedStudents({ page: 1, limit: 100 });
        const list = Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data?.items)
            ? res.data.items
            : Array.isArray(res?.data)
              ? res.data
              : [];
        if (mounted) setUnallocated(list);
      } catch (e) {
        if (mounted) setAlert({ open: true, type: 'error', message: e?.response?.data?.message || 'Failed to load unallocated students' });
      }
    };
    loadUnallocated();
    return () => { mounted = false; };
  }, [filter]);

  // Open Approve modal: load hostels then rooms when hostel chosen
  const openApproveModal = async (allocation) => {
    try {
      const res = await adminApi.getHostels();
      const items = Array.isArray(res?.data?.data) ? res.data.data : (Array.isArray(res?.data) ? res.data : []);
      setApproveModal({
        open: true,
        allocationId: allocation._id,
        studentId: allocation.studentId,
        studentName: allocation.student,
        hostelId: "",
        roomId: "",
        rooms: [],
        hostels: items,
        loading: false,
      });
    } catch (e) {
      setAlert({ open: true, type: 'error', message: e?.response?.data?.message || 'Failed to load hostels' });
    }
  };

  const onHostelChange = async (hostelId) => {
    setApproveModal((prev) => ({ ...prev, hostelId, roomId: "", rooms: [], loading: true }));
    try {
      const res = await adminApi.getHostelRooms(hostelId);
      const list = Array.isArray(res?.data?.data) ? res.data.data : (Array.isArray(res?.data) ? res.data : []);
      setApproveModal((prev) => ({ ...prev, rooms: list, loading: false }));
    } catch (e) {
      setApproveModal((prev) => ({ ...prev, loading: false }));
      setAlert({ open: true, type: 'error', message: e?.response?.data?.message || 'Failed to load rooms' });
    }
  };

  const submitApproval = async () => {
    const { allocationId, studentId, roomId } = approveModal;
    if (!studentId || !roomId) {
      setAlert({ open: true, type: 'error', message: 'Select a hostel and room to approve' });
      return;
    }
    setApproveModal((prev) => ({ ...prev, loading: true }));
    try {
      // Create an approved allocation for the student with selected room
      await adminApi.createAllocation({ studentId, roomId });
      // Optimistically remove pending allocation row (if any)
      setAllocationsData(prev => prev.filter(a => a._id !== allocationId));
      // If approving from Pending (unallocated view), remove the student row
      if (!allocationId && studentId) {
        setUnallocated(prev => prev.filter(s => (s._id || s.id) !== studentId));
      }
      setApproveModal({ open: false, allocationId: null, studentId: null, studentName: "", hostelId: "", roomId: "", rooms: [], hostels: [], loading: false });
      setAlert({ open: true, type: 'success', message: 'Allocation approved' });
      // Refresh summary counts
      try { const s = await adminApi.getDashboardStats(); setSummary(s?.data?.data ?? s?.data ?? null); } catch {}
    } catch (e) {
      setApproveModal((prev) => ({ ...prev, loading: false }));
      setAlert({ open: true, type: 'error', message: e?.response?.data?.message || 'Failed to approve allocation' });
    }
  };

  // Helper to safely extract summary values from varied response shapes
  const pickSummary = (obj, keys) => {
    for (const k of keys) {
      const parts = k.split('.')
      let cur = obj;
      for (const p of parts) {
        if (cur && Object.prototype.hasOwnProperty.call(cur, p)) {
          cur = cur[p];
        } else {
          cur = undefined;
          break;
        }
      }
      if (typeof cur === 'number') return cur;
    }
    return 0;
  };

  // Filtering allocations
  const filteredAllocations = useMemo(() => {
    const arr = Array.isArray(allocationsData) ? allocationsData : [];
    const q = (search || '').trim().toLowerCase();
    if (!q) return arr;
    return arr.filter((a) => {
      const student = a.student?.toString?.().toLowerCase?.() || '';
      const room = a.room?.toString?.().toLowerCase?.() || '';
      const session = a.session?.toString?.().toLowerCase?.() || '';
      return student.includes(q) || room.includes(q) || session.includes(q);
    });
  }, [allocationsData, search]);

  // Filter unallocated list for Pending tab with search
  const filteredUnallocated = useMemo(() => {
    const arr = Array.isArray(unallocated) ? unallocated : [];
    // Include students with no allocation or pending (treat blank as none)
    const base = arr.filter((s) => {
      const st = (s.allocationStatus || s.status || '').toString().toLowerCase();
      return st === 'pending' || st === 'none' || st === '';
    });
    const q = (search || '').trim().toLowerCase();
    if (!q) return base;
    return base.filter((s) => {
      const name = (s.fullName || '').toLowerCase();
      const matric = (s.matricNumber || '').toLowerCase();
      const email = (s.email || '').toLowerCase();
      return name.includes(q) || matric.includes(q) || email.includes(q);
    });
  }, [unallocated, search]);

  // Approve/Reject allocation: Placeholder since backend lacks specific endpoint
  // In a future update, call a dedicated PATCH /admin/allocations/:id { status }
  const handleApprove = async (id, student) => {
    try {
      const target = allocationsData.find(a => a._id === id);
      if (target?.roomId) {
        // If room already present, we can directly approve
        await adminApi.updateAllocationStatus(id, 'approved');
        setAllocationsData(prev => {
          const updated = prev.map(a => a._id === id ? { ...a, status: 'approved' } : a);
          if (filter.toLowerCase() === 'pending') return updated.filter(a => a._id !== id);
          return updated;
        });
        setAlert({ open: true, type: 'success', message: `Approved allocation for ${student}` });
        try { const s = await adminApi.getDashboardStats(); setSummary(s?.data?.data ?? s?.data ?? null); } catch {}
      } else {
        // Require room assignment
        openApproveModal(target);
      }
    } catch (e) {
      setAlert({ open: true, type: 'error', message: e?.response?.data?.message || 'Failed to approve' });
    }
  };

  const handleApproveUnallocated = (row) => {
    // row: from unallocated list -> lacks allocationId
    openApproveModal({ _id: null, studentId: row._id || row.id, student: row.fullName });
  };

  const handleRejectUnallocated = async (row) => {
    try {
      const sid = row._id || row.id;
      // Try to fetch latest allocation id to reject
      const res = await studentApi.getAllocationStatus(sid);
      const aid = res?.data?.id || res?.data?._id || null;
      if (!aid) {
        setAlert({ open: true, type: 'error', message: 'No pending allocation found to reject for this student' });
        return;
      }
      await adminApi.updateAllocationStatus(aid, 'rejected');
      setUnallocated(prev => prev.filter(s => (s._id || s.id) !== sid));
      setAlert({ open: true, type: 'success', message: `Rejected allocation for ${row.fullName}` });
      try { const s = await adminApi.getDashboardStats(); setSummary(s?.data?.data ?? s?.data ?? null); } catch {}
    } catch (e) {
      setAlert({ open: true, type: 'error', message: e?.response?.data?.message || 'Failed to reject allocation' });
    }
  };

  const handleReject = async (id, student) => {
    try {
      await adminApi.updateAllocationStatus(id, 'rejected');
      setAllocationsData(prev => {
        const updated = prev.map(a => a._id === id ? { ...a, status: 'rejected' } : a);
        if (filter.toLowerCase() === 'pending') return updated.filter(a => a._id !== id);
        return updated;
      });
      setAlert({ open: true, type: 'error', message: `Rejected allocation for ${student}` });
      try { const s = await adminApi.getDashboardStats(); setSummary(s?.data?.data ?? s?.data ?? null); } catch {}
    } catch (e) {
      setAlert({ open: true, type: 'error', message: e?.response?.data?.message || 'Failed to reject' });
    }
  };

  return (
    <div className="p-6">
      <Alert
        open={alert.open}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ ...alert, open: false })}
        duration={2500}
      />

      {/* Stats Section */}
      <div className="stats-grid" style={{ marginBottom: "2rem" }}>
        <StatsCard title="Total Students" value={pickSummary(summary || {}, [
          'totals.students','counts.students','stats.students','students','studentsCount','totalStudents'
        ])} icon="fi fi-rr-users" loading={loading} />
        <StatsCard title="Hostels" value={pickSummary(summary || {}, [
          'totals.hostels','counts.hostels','stats.hostels','hostels','hostelsCount','totalHostels'
        ])} icon="fi fi-rr-building" loading={loading} />
        <StatsCard title="Rooms" value={pickSummary(summary || {}, [
          'totals.rooms','counts.rooms','stats.rooms','rooms','roomsCount','totalRooms'
        ])} icon="fi fi-rr-bed" loading={loading} />
        <StatsCard title="Pending Allocations" value={pickSummary(summary || {}, [
          'allocations.pending','counts.pending','stats.pending','pending','allocationsPending','pendingAllocations'
        ])} icon="fi fi-rr-clock" loading={loading} />
      </div>

      {/* Allocation Table */}
      <div className="admin-section">
        <h2>Allocations</h2>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <input
            className="search-input"
            placeholder="Search by name or reg. no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
            <option value="Unallocated">Unallocated</option>
          </select>
        </div>
  {String(filter).toLowerCase() !== 'unallocated' ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: '0.5rem 0' }}>Allocations</h3>
            <small style={{ color: '#666' }}>
              Showing {filteredAllocations.length} of {allocationsMeta.total} {String(filter).toLowerCase() === 'pending' ? 'pending' : (String(filter).toLowerCase() === 'approved' ? 'approved' : String(filter).toLowerCase() === 'rejected' ? 'rejected' : 'records')}
            </small>
          </div>
          <table className="admin-table">
          <thead>
            <tr>
              <th>S/N</th>
              <th>Student</th>
              <th>Room</th>
              <th>Session</th>
              <th>Status</th>
              <th>Applied At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
             {filteredAllocations.filter(a => (filter === 'all' ? true : a.status?.toLowerCase() === filter.toLowerCase())).length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center" }}>
                  No records found.
                </td>
              </tr>
            ) : (
               filteredAllocations
                 .filter(a => (filter === 'all' ? true : a.status?.toLowerCase() === filter.toLowerCase()))
                .map((a, idx) => (
                  <tr key={a._id}>
                    <td>{idx + 1}</td>
                    <td>{a.student}</td>
                    <td>{a.room}</td>
                    <td>{a.session}</td>
                    <td style
                    ={{ textTransform: 'capitalize' }}>{a.status}</td>
                    <td>{a.appliedAt ? new Date(a.appliedAt).toLocaleString() : '-'}</td>
                    <td>
                      <>
                        <button
                          className="admin-btn"
                          style={{ background: "#27ae60" }}
                          onClick={() => handleApprove(a._id, a.student)}
                        >
                          Approve
                        </button>
                        <button
                          className="admin-btn"
                          style={{ background: "#e74c3c" }}
                          onClick={() => handleReject(a._id, a.student)}
                        >
                          Reject
                        </button>
                      </>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
          </table>
        </>
        ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>S/N</th>
              <th>Student</th>
              <th>Room</th>
              <th>Session</th>
              <th>Status</th>
              <th>Applied At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {(!filteredUnallocated || filteredUnallocated.length === 0) ? (
              <tr><td colSpan={7} style={{ textAlign: 'center' }}>No unallocated students</td></tr>
            ) : filteredUnallocated
                .map((s, idx) => (
              <tr key={s._id || s.id}>
                <td>{idx + 1}</td>
                <td>{s.fullName}</td>
                <td>-</td>
                <td>-</td>
                <td>{(s.allocationStatus || s.status || 'pending')}</td>
                <td>{s.updatedAt ? new Date(s.updatedAt).toLocaleString() : (s.createdAt ? new Date(s.createdAt).toLocaleString() : '-')}</td>
                <td>
                  <>
                    <button
                      className="admin-btn"
                      style={{ background: "#27ae60" }}
                      onClick={() => handleApproveUnallocated(s)}
                    >
                      Approve
                    </button>
                    <button
                      className="admin-btn"
                      style={{ background: "#e74c3c" }}
                      onClick={() => handleRejectUnallocated(s)}
                    >
                      Reject
                    </button>
                  </>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
      {approveModal.open && (
        <div className="modal">
          <div className="modal-content">
            <h3>Approve Allocation</h3>
            <p style={{ marginTop: 0, color: '#555' }}>
              Assign a room to approve {approveModal.studentName}
            </p>
            <div className="form-group">
              <label>Hostel</label>
              <select
                value={approveModal.hostelId}
                onChange={(e) => onHostelChange(e.target.value)}
              >
                <option value="">Select Hostel</option>
                {approveModal.hostels.map(h => (
                  <option key={h._id || h.id} value={h._id || h.id}>
                    {h.name || h.title || 'Hostel'}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Room</label>
              <select
                value={approveModal.roomId}
                onChange={(e) => setApproveModal(prev => ({ ...prev, roomId: e.target.value }))}
                disabled={!approveModal.hostelId || approveModal.loading}
              >
                <option value="">Select Room</option>
                {approveModal.rooms.map(r => (
                  <option key={r._id || r.id} value={r._id || r.id}>
                    {(r.roomNumber || r.number || 'Room')} {(typeof r.occupied !== 'undefined' && typeof r.capacity !== 'undefined') ? `(${Math.max(0,(r.capacity||0)-(r.occupied||0))} left)` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setApproveModal({ open: false, allocationId: null, studentId: null, studentName: "", hostelId: "", roomId: "", rooms: [], hostels: [], loading: false })}>
                Cancel
              </button>
              <button className="submit-btn" onClick={submitApproval} disabled={approveModal.loading}>
                {approveModal.loading ? 'Approving...' : 'Approve'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
