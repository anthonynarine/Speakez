import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';


/**
 * Custom hook to create an Axios instance with request and response interceptors
 * for handling authentication tokens and CSRF protection in a React app.
 *
 * @returns {AxiosInstance} The Axios instance with configured interceptors.
 */
const useAuthAxios = () => {
    const navigate = useNavigate();
    const isProduction = process.env.NODE_ENV === "production";

    
    // Create an Axios instance configured to interact with the authentication API
    const authAxios = axios.create({
        baseURL: process.env.REACT_APP_AUTH_API_URL,
        withCredentials: true // Ensure cookies are sent with the request
    });
    
    /**
     * Handle authentication errors by clearing tokens and redirecting to the login page.
    */
    const handleAuthError = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    Cookies.remove("csrftoken");
    Cookies.remove("sessionid");
       navigate("/login"); // Redirect to the login page
    };
    
    
    /**
     * Helper function to set a cookie with secure and sameSite options
     * based on the environment.
    *
    * @param {string} name - The name of the cookie.
    * @param {string} value - The value of the cookie.
    * @param {object} options - Optional additional options for setting the cookie.
    */
    const setCookie = (name, value, options = {}) => {

        Cookies.set(name, value, {
            ...options,
            secure: isProduction, // Send cookie over HTTPS only if in production
            sameSite: isProduction ? "None" : "Lax" // Allow third-party cookies in production
        });
    };
    

    /**
     * Request interceptor to attach access token and CSRF token to the request headers.
     *
     * @param {object} config - Axios request configuration object.
     * @returns {object} Modified Axios request configuration object.
     */
    const requestInterceptor = (config) => {
        const accessToken = Cookies.get("access_token");
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        const csrfToken = Cookies.get("csrftoken");
        if (csrfToken) {
            config.headers["X-CSRFToken"] = csrfToken;
        }
        
        return config;
    };

    /**
     * Request error interceptor to handle request errors.
     *
     * @param {object} error - Axios error object.
     * @returns {Promise<Error>} Rejected promise with the error.
     */
    const requestErrorInterceptor = (error) => Promise.reject(error);

    /**
     * Response interceptor to handle token updates and other response modifications.
     *
     * @param {object} response - Axios response object.
     * @returns {object} The response object, potentially modified.
     */
    const responseInterceptor = (response) => {
        // Update CSRF token if a new one is provided in the response
        const newCsrfToken = response.headers["x-csrftoken"];
        if (newCsrfToken) {
            setCookie("csrftoken", newCsrfToken);
        }
        
        // Set access token if present in the response
        const accessToken = response.data.access_token;
        if (accessToken) {
            setCookie("access_token", accessToken, { expires: new Date(Date.now() + 15 * 60 * 1000) }); // 15 minutes expiry
        }

        // Set refresh token if present in the response
        const refreshToken = response.data.refresh_token;
        if (refreshToken) {
            setCookie("refresh_token", refreshToken, { expires: 7 }); // 7 days expiry
        }

        // Clear all authentication-related cookies on logout
        if (response.config.url.includes("/logout/")) {
            Cookies.remove("access_token");
            Cookies.remove("refresh_token");
            Cookies.remove("csrftoken");
            Cookies.remove("sessionid");
        }

        return response;
    };

    /**
     * Response error interceptor to handle token expiration and refresh logic.
     *
     * @param {object} error - Axios error object.
     * @returns {Promise<Error>} Rejected promise with the error or a retry of the original request.
     */
    const responseErrorInterceptor = async (error) => {
        const originalRequest = error.config;

        // Handle expired access tokens and attempt to refresh them ONCE
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const response = await authAxios.post("/token-refresh/", {}, { withCredentials: true });

                if (response.status === 200) {
                    const newAccessToken = response.data.access_token;

                    // Store the new access token in a cookie
                    setCookie("access_token", newAccessToken, { expires: new Date(Date.now() + 15 * 60 * 1000) });

                    // Update the authorization header for the original request
                    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

                    // Retry the original request with the new token
                    return authAxios(originalRequest);
                }
            } catch (refreshError) {
                console.log("Failed to refresh access token", refreshError);
                handleAuthError();
            }
        }

        handleAuthError();
        return Promise.reject(error);
    };

    /**
     * useEffect to set up and clean up the Axios interceptors.
     */
    useEffect(() => {
        const reqInterceptor = authAxios.interceptors.request.use(requestInterceptor, requestErrorInterceptor);
        const resInterceptor = authAxios.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

        return () => {
            // Eject the interceptors when the component unmounts
            authAxios.interceptors.request.eject(reqInterceptor);
            authAxios.interceptors.response.eject(resInterceptor);
        };
    }, [navigate]);

    return { authAxios, setCookie };
};

export default useAuthAxios;
