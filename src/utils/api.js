import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for handling token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '';
        }
        return Promise.reject(error);
    }
);

// Auth API endpoints
export const authApi = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    // NOTE: forgot/reset endpoints are not implemented on backend; removing to prevent 404s
    // forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    // resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
    // getProfile/updateProfile are handled via student endpoints
};

// Student API endpoints
export const studentApi = {
    // Profile management
    getProfile: (studentId) => api.get(`/students/${studentId}/profile`),
    updateProfile: (studentId, data) => api.put(`/students/${studentId}/profile`, data),
    uploadAvatar: (studentId, formData) => api.post(`/students/${studentId}/profile/avatar`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    updatePersonality: (studentId, data) => api.put(`/students/${studentId}/personality`, data),

    // Room allocation
    requestAllocation: (data) => {
        // Accept either { roomId } or full payload; normalize to backend schema
        if (data && typeof data === 'object' && data.roomId && !data.roomPreference) {
            return api.post('/allocations', { roomPreference: { roomId: data.roomId } });
        }
        return api.post('/allocations', data || {});
    },
    // getAllocation and cancelAllocation do not exist on backend; removing for now
    // getAllocation: () => api.get('/allocations'),
    // cancelAllocation: (id) => api.delete(`/allocations/${id}`),
    getAllocationStatus: (studentId) => api.get(`/allocations/${studentId}/status`),
    getMatchSuggestions: (studentId) => api.get(`/allocations/${studentId}/match-suggestions`),

    // Complaints
    submitComplaint: (studentId, data) => api.post(`/complaints/${studentId}`, data),
    getComplaints: (studentId) => api.get(`/complaints/${studentId}`),
    updateComplaint: (id, data) => api.put(`/complaints/${id}`, data),

    // Roommate
    getRoommate: (studentId) => api.get(`/students/${studentId}/roommate`),

    // Health check
    ping: () => api.get('/students/ping'),
};

// Hostel API endpoints
export const hostelApi = {
    getAllHostels: () => api.get('/hostels'),
    // getHostelDetails is not implemented; rooms are retrieved via /rooms/hostel/:hostelId
    // getHostelDetails: (id) => api.get(`/hostels/${id}`),
    getRoomAvailability: (hostelId) => api.get(`/hostels/${hostelId}/rooms/availability`),
    addHostel: (data) => api.post('/hostels', data),
    getHostelRooms: (hostelId) => api.get(`/hostels/${hostelId}/rooms`),
    ping: () => api.get('/hostels/ping'),
};

// Room API endpoints
export const roomApi = {
    // getAllRooms endpoint not available; fetch by hostel
    getRoomDetails: (id) => api.get(`/rooms/${id}`),
    checkAvailability: (id) => api.get(`/rooms/${id}/availability`),
    createRoom: (hostelId, data) => api.post(`/rooms/${hostelId}/rooms`, data),
    listRoomsByHostel: (hostelId) => api.get(`/rooms/hostel/${hostelId}`),
    getRoomsByHostelId: (hostelId) => api.get(`/rooms/hostel/${hostelId}`),
};

// Admin API endpoints
export const adminApi = {
    // Dashboard
    // dashboard stats endpoint not implemented; use /admin/reports/summary as alternative
    getDashboardStats: () => api.get('/admin/reports/summary'),

    // Admin management
    createAdmin: (data) => api.post('/admin/admins', data),

    // Student management
    getStudents: (params) => api.get('/admin/students', { params }),
    addStudent: (data) => api.post('/admin/students', data),
    updateStudent: (studentId, data) => api.patch(`/admin/students/${studentId}`, data),
    deleteStudent: (studentId) => api.delete(`/admin/students/${studentId}`),
    getUnallocatedStudents: (params) => api.get('/admin/students/unallocated', { params }),
    getDepartments: () => api.get('/admin/departments'),
    updateStudentStatus: (studentId, data) => api.put(`/admin/students/${studentId}`, data),

    // Hostel management
    getHostels: () => api.get('/admin/hostels'),
    addHostel: (data) => api.post('/admin/hostels', data),
    getHostelRooms: (hostelId) => api.get(`/admin/hostels/${hostelId}/rooms`),
    addRoomToHostel: (hostelId, data) => api.post(`/admin/hostels/${hostelId}/rooms`, data),
    deleteHostel: (hostelId) => api.delete(`/admin/hostels/${hostelId}`),
    deleteRoom: (roomId) => api.delete(`/admin/rooms/${roomId}`),
    updateHostel: (hostelId, data) => api.patch(`/admin/hostels/${hostelId}`, data),
    updateRoom: (roomId, data) => api.patch(`/admin/rooms/${roomId}`, data),

    // Allocation management
    createAllocation: (data) => api.post('/admin/allocations', data),
    getAllocations: (params) => api.get('/admin/allocations', { params }),
    updateAllocationStatus: (id, status) => api.patch(`/admin/allocations/${id}`, { status }),

    // Reports
    getSummary: () => api.get('/admin/reports/summary'),
    exportReport: (params) => api.get('/admin/reports/export', { params }),
    updateComplaint: (id, data) => api.patch(`/complaints/${id}`, data),
};

// Allocation API endpoints (student/admin shared)
export const allocationApi = {
    getAllocationStatus: (studentId) => api.get(`/allocations/${studentId}/status`),
    getMatchSuggestions: (studentId) => api.get(`/allocations/${studentId}/match-suggestions`),
    getApprovedPairings: () => api.get('/allocations/approved-pairings'),
    approvePairing: (data) => api.post('/allocations/approve-pairing', data),
    adminCreateAllocation: (data) => api.post('/allocations/admin', data),
    autoAllocatePair: (data) => api.post('/allocations/auto-allocate', data),
    apply: (payload) => api.post('/allocations/apply', payload),
};

export default api;
