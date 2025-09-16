import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8080/api/admin" });

export const fetchStudents = async () => {
  const { data } = await API.get("/students");
  // Support paginated response: students in data.items
  return Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []);
};
// Deprecated: Use adminApi from ../utils/api.js for all admin API calls
// All admin API calls should be made via the centralized adminApi object in ../utils/api.js
// This file is now redundant and can be removed in the future.
