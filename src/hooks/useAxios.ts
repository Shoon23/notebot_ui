import axios from "axios";

const useAxios = () => {
  // Create an Axios instance specifically for authentication-related API calls
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Auth-related base URL
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request Interceptor: Automatically add the JWT token to Authorization header
  axiosInstance.interceptors.request.use(
    (config) => {
      //   const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
      //   if (token) {
      //     config.headers.Authorization = `Bearer ${token}`;
      //   }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return axiosInstance;
};

export default useAxios;
