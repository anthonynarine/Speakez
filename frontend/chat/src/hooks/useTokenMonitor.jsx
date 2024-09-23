import { useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; 
import useAuthAxios from "./useAuthAxios";
import { useAuthServices } from "../context/AuthContext";

/**
 * Custom hook to monitor JWT token expiration and refresh the token before it expires.
 * This hook will decode the access token, check the expiration time, and set a timeout to refresh the token
 * two minutes before it expires. It handles the refresh process automatically in the background.
 * 
 * It handles the refresh process automatically in the background when the user is logged in.
 *
 * @param {isLoggedIn} isLoggedIn - A flag to determine if the user is logged in. 
 * @example
 * // Use inside a component to automatically monitor and refresh JWT tokens
 * useTokenMonitor("/auth/refresh/");
 */
const useTokenMonitor = (isLoggedIn) => {
    const { authAxios, setCookie } = useAuthAxios();
    const { validateSession } = useAuthServices();

    // Use the base URL from the environment variable and append the refresh token path
    const refreshUrl = `${process.env.REACT_APP_AUTH_API_URL}/token-refresh/`;
    
    /**
     * Decode the JWT token and return its expiration time (in seconds since epoch).
     *
     * @param {string} token - The JWT access token to decode.
     * @returns {number} The expiration time of the token in seconds since epoch.
     */
    const getTokenExpirationTime = (token) => {
        try {
            const decodedToken = jwtDecode(token);
            return decodedToken.exp;
        } catch (error) {
            console.error("Failed to decode token:", error);
            return null;
        }
    };

    /**
     * Send a request to refresh the access token using the refresh token stored in cookies.
     * The new access token is saved in cookies and returned.
     *
     * @returns {string|null} The new access token if the refresh is successful, or null if it fails.
     */
    const refreshToken = async () => {
        try {
            const refreshCookie = Cookies.get("refresh_token"); // Retrieve the refresh token

            if (!refreshCookie) {
                console.error("No refresh token found in cookies.");
                return null;
            }

            console.log("Attempting to refresh token...");
            const response = await authAxios.post(refreshUrl);
            
            const newAccessToken = response.data.access_token;

            if (newAccessToken) {
                // Store the new access token in cookies with a 15-minute expiry.
                setCookie("access_token", newAccessToken, { expires: new Date(Date.now() + 15 * 60 * 1000) });
                console.log("Token refreshed successfully at", new Date().toLocaleTimeString());
                
                // Validate session and fetch user info after refreshing
                await validateSession();
                return newAccessToken;
            } else {
                console.error("No access token found in the refresh response.");
                return null;
            }
        } catch (error) {
            console.error("Failed to refresh access token:", error);
            return null;
        }
    };

    /**
     * Monitor the access token's expiration time and set a timeout to refresh it two minutes before expiration.
     * If the token is not present, or if it fails to refresh, appropriate actions are logged.
     */
    const monitorTokenExpiration = () => {
        const accessToken = Cookies.get("access_token");

        if (!accessToken) {
            console.warn("No access token found in cookies.");
            return null;
        }

        const expirationTime = getTokenExpirationTime(accessToken);
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

        if (!expirationTime) {
            console.warn("Failed to get expiration time from access token.");
            return null;
        }

        const timeUntilRefresh = Math.max(0, (expirationTime - currentTime - 120) * 1000);  // Refresh 2 minutes before expiration

        const timeoutId = setTimeout(async () => {
            const newToken = await refreshToken(); // Attempt to refresh the token before it expires
            if (!newToken) {
                console.error("Token refresh failed, user may need to re-login.");
                // Handle refresh failure (e.g., log the user out or notify them)
            }
        }, timeUntilRefresh);

        // Return the timeout ID to allow cleanup in useEffect
        return timeoutId;
    };

    /**
     * useEffect hook to start monitoring the token expiration when the component mounts.
     */
    useEffect(() => {
        let timeoutId; // Declare timeout ID

        const refreshCookie = Cookies.get("refresh_token");

        if (isLoggedIn || refreshCookie) {
            timeoutId = monitorTokenExpiration(); // Start monitoring token expiration
        }

        // Cleanup on unmount
        return () => {
            if (timeoutId) clearTimeout(timeoutId); // Clear timeout to avoid memory leaks
        };
    }, [isLoggedIn]); // Re-run if isLoggedIn changes

    // Return the refreshToken function so it can be used outside the hook.
    return { refreshToken };
};

export default useTokenMonitor;
