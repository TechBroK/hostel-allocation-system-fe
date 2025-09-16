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
    
    // Room allocation
    requestAllocation: (data) => api.post('/allocations', data),
    getAllocation: () => api.get('/allocations'),
    cancelAllocation: (id) => api.delete(`/allocations/${id}`),
    
    // Complaints
    submitComplaint: (data) => api.post('/complaints', data),
    getComplaints: () => api.get('/complaints'),
    updateComplaint: (id, data) => api.put(`/complaints/${id}`, data),
    
    // Roommate
    getRoommate: (studentId) => api.get(`/students/${studentId}/roommate`),
};

// Hostel API endpoints
export const hostelApi = {
    getAllHostels: () => api.get('/hostels'),
    getHostelDetails: (id) => api.get(`/hostels/${id}`),
    getRoomAvailability: (hostelId) => api.get(`/hostels/${hostelId}/rooms/availability`),
    addHostel: (data) => api.post('/hostels', data),
};

// Room API endpoints
export const roomApi = {
    getAllRooms: () => api.get('/rooms'),
    getRoomDetails: (id) => api.get(`/rooms/${id}`),
    checkAvailability: (id) => api.get(`/rooms/${id}/availability`),
};

// Admin API endpoints
export const adminApi = {
    // Dashboard
    getDashboardStats: () => api.get('/admin/dashboard/stats'),
    
    // Student management
    getStudents: () => api.get('/students'),
    addStudent: (data) => api.post('/admin/students', data),
    updateStudent: (id, data) => api.put(`/admin/students/${id}`, data),
    deleteStudent: (id) => api.delete(`/admin/students/${id}`),
    
    // Hostel management
    getHostels: () => api.get('/admin/hostels'),
    addHostel: (data) => api.post('/admin/hostels', data),
    updateHostel: (id, data) => api.put(`/admin/hostels/${id}`, data),
    deleteHostel: (id) => api.delete(`/admin/hostels/${id}`),
    
    // Room management
    getRooms: () => api.get('/admin/rooms'),
    addRoom: (data) => api.post('/admin/rooms', data),
    updateRoom: (id, data) => api.put(`/admin/rooms/${id}`, data),
    deleteRoom: (id) => api.delete(`/admin/rooms/${id}`),
    
    // Allocation management
    getAllocations: () => api.get('/admin/allocations'),
    approveAllocation: (id) => api.put(`/admin/allocations/${id}/approve`),
    rejectAllocation: (id) => api.put(`/admin/allocations/${id}/reject`),
    
    // Complaint management
    getComplaints: () => api.get('/admin/complaints'),
    resolveComplaint: (id) => api.put(`/admin/complaints/${id}/resolve`),
    
    // Reports
    generateReport: (type, params) => api.get(`/admin/reports/${type}`, { params }),
};

export default api;
