import axios from "axios";
import Cookies from "js-cookie";


const isProduction = process.env.NODE_ENV === 'production';

const authAxios = axios.create({
    baseURL: process.env.REACT_APP_AUTH_URL,
    withCredentials: true // Ensure cookies are sent with the request
});

authAxios.interceptors.response.use((response) => {
    // Update CSRF token if a new one is provided in the response
    const newCsrfToken = response.headers["x-csrftoken"];
    if (newCsrfToken) {
        Cookies.set("csrftoken", newCsrfToken, {
            secure: isProduction, // Send cookie over HTTPS only if in production
            sameSite: isProduction ? "None" : "Lax" // Allow third-party cookies in production
        });
    }

    // Set access token if present in the response
    const accessToken = response.data.access_token;
    if (accessToken) {
        Cookies.set("access_token", accessToken, {
            expires: 1 / 96, // 15 minutes expiry
            secure: isProduction,
            sameSite: isProduction ? "None" : "Lax"
        });
    }

    // Set refresh token if present in the response
    const refreshToken = response.data.refresh_token;
    if (refreshToken) {
        Cookies.set("refresh_token", refreshToken, {
            expires: 7, // 7 days expiry
            secure: isProduction,
            sameSite: isProduction ? "None" : "Lax"
        });
    }

    return response; // Return the response for further handling
}, (error) => {
    // Handle errors if needed
    console.error("Error in response:", error); // Log the error for debugging
    return Promise.reject(error); // Reject the promise to pass the error down the chain
});

export default authAxios;








/*NODE_ENV is a standard environment variable used by both Node.js and React to determine
the environment in which the application is running. It can be set to values like development,
production, or test.*/