import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthAxios from "./useAuthAxios";
import Cookies from 'js-cookie'; 

export const useAuth = () => {
    const { authAxios } = useAuthAxios();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get('access_token')); // Check if token exists in cookies
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");

    const login = useCallback(async ({ email, password }) => {
        setIsLoading(true);
        try {
            console.log("Logging in with:", { email, password });

            const loginResponse = await authAxios.post("/login/", { email, password });
            console.log(loginResponse);

            const userInfoResponse = await authAxios.get("/validate-session/");
            console.log("User Info Response:", userInfoResponse.data)

            // Update the user state
            setUser(userInfoResponse.data);
            setIsLoggedIn(true)

            // Navigate if needed
            setTimeout(()=> {
                navigate("/");
            }, 100)
        } catch (error) {
            const errorMessage = error.response?.data?.error || "An error occurred during login.";
            setError(errorMessage);
            console.error("Login error:", error);
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    const logout = useCallback(async () => {
        setIsLoading(true);
        try {
            await authAxios.post("/logout/");
            setUser(null);
            navigate("/login");
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);


    const validateSession = useCallback(async () => {
        if (!isLoggedIn) return;  // Only validate session if the user is logged in

        try {
            const userInfoResponse = await authAxios.get("/validate-session/");
            setUser(userInfoResponse.data);
        } catch (error) {
            console.error("Session validation failed:", error);
            // Handle error (e.g., logout user if the session is no longer valid)
        }
    }, [authAxios, isLoggedIn]);

    // // Revalidate session when the user is logged in
    // useEffect(() => {
    //     if (isLoggedIn) {
    //         validateSession();  
    //     }
    // }, [validateSession, isLoggedIn]);



    return {
        isLoading,
        user,
        error,
        login,
        logout,
        isLoggedIn
    };
};
