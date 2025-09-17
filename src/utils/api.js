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
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data),
};

// Student API endpoints
export const studentApi = {
    // Profile management
    getProfile: (studentId) => api.get(`/students/${studentId}/profile`),
    updateProfile: (studentId, data) => api.put(`/students/${studentId}/profile`, data),
    uploadAvatar: (studentId, formData) => api.post(`/students/${studentId}/profile/avatar`, formData),
    updatePersonality: (studentId, data) => api.put(`/students/${studentId}/personality`, data),

    // Room allocation
    requestAllocation: (data) => api.post('/allocations', data),
    getAllocation: () => api.get('/allocations'),
    cancelAllocation: (id) => api.delete(`/allocations/${id}`),
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
    getHostelDetails: (id) => api.get(`/hostels/${id}`),
    getRoomAvailability: (hostelId) => api.get(`/hostels/${hostelId}/rooms/availability`),
    addHostel: (data) => api.post('/hostels', data),
    getHostelRooms: (hostelId) => api.get(`/hostels/${hostelId}/rooms`),
    ping: () => api.get('/hostels/ping'),
};

// Room API endpoints
export const roomApi = {
    getAllRooms: () => api.get('/rooms'),
    getRoomDetails: (id) => api.get(`/rooms/${id}`),
    checkAvailability: (id) => api.get(`/rooms/${id}/availability`),
    createRoom: (hostelId, data) => api.post(`/rooms/${hostelId}/rooms`, data),
    listRoomsByHostel: (hostelId) => api.get(`/rooms/hostel/${hostelId}`),
    getRoomsByHostelId: (hostelId) => api.get(`/rooms/hostel/${hostelId}`),
};

// Admin API endpoints
export const adminApi = {
    // Dashboard
    getDashboardStats: () => api.get('/admin/dashboard/stats'),

    // Admin management
    createAdmin: (data) => api.post('/admin/admins', data),

    // Student management
    getStudents: () => api.get('/admin/students'),
    getUnallocatedStudents: () => api.get('/admin/students/unallocated'),
    updateStudentStatus: (studentId, data) => api.put(`/admin/students/${studentId}`, data),

    // Hostel management
    getHostels: () => api.get('/admin/hostels'),
    addHostel: (data) => api.post('/admin/hostels', data),
    getHostelRooms: (hostelId) => api.get(`/admin/hostels/${hostelId}/rooms`),
    addRoomToHostel: (hostelId, data) => api.post(`/admin/hostels/${hostelId}/rooms`, data),

    // Allocation management
    createAllocation: (data) => api.post('/admin/allocations', data),
    getAllocations: () => api.get('/admin/allocations'),

    // Reports
    getSummary: () => api.get('/admin/reports/summary'),
    exportReport: (params) => api.get('/admin/reports/export', { params }),
};

// Allocation API endpoints (student/admin shared)
export const allocationApi = {
    getAllocationStatus: (studentId) => api.get(`/allocations/${studentId}/status`),
    getMatchSuggestions: (studentId) => api.get(`/allocations/${studentId}/match-suggestions`),
    getApprovedPairings: () => api.get('/allocations/approved-pairings'),
    approvePairing: (data) => api.post('/allocations/approve-pairing', data),
    adminCreateAllocation: (data) => api.post('/allocations/admin', data),
    autoAllocatePair: (data) => api.post('/allocations/auto-allocate', data),
};

export default api;
