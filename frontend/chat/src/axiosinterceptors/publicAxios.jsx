import axios from "axios";

const DEV_URL = process.env.REACT_APP_DEV_URL;

// Axios instance for public (non-authenticated) requests. Configured with base URL and CSRF token handling.
const publicAxios = axios.create({
  baseURL: DEV_URL, 
  withCredentials: true, // Necessary for cookies, especially if CSRF protection is enabled server-side.
});

publicAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // If the error response status is 401 (Unauthorized) and the request has not been retried yet,
    // set the _retry flag to true to ensure the request is only retried once
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
    }
    return Promise.reject(error); // Ensure the promise is rejected to handle errors properly.
  }
);

export { publicAxios};
