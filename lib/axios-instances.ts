import axios from "axios";
const LOCAL_URL = "http://localhost:3001/api";
const axiosInstance = axios.create({
  baseURL: LOCAL_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;