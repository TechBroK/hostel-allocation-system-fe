import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8080/api/admin" });

export const fetchStudents = async () => {
  const { data } = await API.get("/students");
  return data;
};
