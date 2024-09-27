import axios from "axios";

const authAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Auth-related base URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default authAxiosInstance;
