import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom"
import { useEffect } from "react";


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

    if (response.config.url.includes("/logout/")) {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        Cookies.remove("csrftoken");
        Cookies.remove("sessionid");
    }

    return response; // Return the response for further handling
}, (error) => {
    // Handle errors if needed
    console.error("Error in response:", error); // Log the error for debugging
    return Promise.reject(error); // Reject the promise to pass the error down the chain
});

function handleAuthError (error) {

    console.error("Authentication error", error);
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    Cookies.remove("csrftoken");
    Cookies.remove("sessionid");
}



////// Error handling block for handling automatic token refresh on authentication failures /////
authAxios.interceptors.response.use(null, async (error) => {
    const originalRequest = error.config;

    // Handle expired access tokens and attempt to refresh them once
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const response = await authAxios.post("/token-refresh/", {}, { withCredentials: true });

            if (response.status === 200) {
                const newAccessToken = response.data.access_token; // Ensure consistent variable naming

                // Store the new access token in a cookie
                Cookies.set("access_token", newAccessToken, {
                    expires: 1 / 96, // 15 min expiry
                    secure: isProduction, 
                    sameSite: isProduction ? "None" : "Lax"
                });
                
                // Update the authorization header for the original request
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`; // Corrected typo

                // Update Axios default header for subsequent requests
                authAxios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

                // Retry the original request with the new token
                return authAxios(originalRequest);
            }
        } catch (refreshError) {

        }
    }

    // If the error isn't a 401 or the token refresh fails, reject the promise
    return Promise.reject(error);
});


/////////////   Requst configurations ///////////////////
// Request interceptor for attatching access token and CSRF token
authAxios.interceptors.request.use((config) => {
    // Get the access token from cookies
    const accessToken = Cookies.get("access_token");
    if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`; 
    }

    // Get the CSRF token from cookies
    const csrfToken = Cookies.get("csrftoken"); 
    if (csrfToken) {
        config.headers["X-CSRFToken"] = csrfToken;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});



export default authAxios;








/*NODE_ENV is a standard environment variable used by both Node.js and React to determine
the environment in which the application is running. It can be set to values like development,
production, or test.*/