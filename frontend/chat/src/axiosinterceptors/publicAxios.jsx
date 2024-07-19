import axios from "axios";

// Ensure environment variables are correctly set
const baseURL = process.env.REACT_APP_DEV_URL || "http://localhost:8000/api";

// Log environment variables to verify them
console.log('Use Production API:', process.env.REACT_APP_USE_PRODUCTION_API);
console.log('Base URL:', baseURL);

// Create Axios instance for public (non-authenticated) requests
const publicAxios = axios.create({
  baseURL: baseURL,
  withCredentials: true, // Necessary for cookies, especially if CSRF protection is enabled server-side
});

// Response interceptor to handle responses and errors
publicAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Handle token refresh logic if necessary
    }
    return Promise.reject(error); // Ensure the promise is rejected to handle errors properly
  }
);

export { publicAxios };
