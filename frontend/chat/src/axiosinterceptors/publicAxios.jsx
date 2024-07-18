import axios from "axios";

const baseURL = process.env.REACT_APP_DEV_URL;

// Log the environment variables to verify them
console.log('Use Production API:', process.env.REACT_APP_USE_PRODUCTION_API);
console.log('Base URL:', baseURL);

// Axios instance for public (non-authenticated) requests. Configured with base URL and CSRF token handling.
const publicAxios = axios.create({
  baseURL: baseURL, 
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
