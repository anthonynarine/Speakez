import React, { createContext, useContext, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import useTokenMonitor from "../hooks/useTokenMonitor";

// Create a context for authentication
const AuthContext = createContext(undefined);

// Custom hook to access auth services within components
export function useAuthServices() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("userAuthServices must be used within an AuthProvider");
    }
    return context
}

// Provider component for authentication
export function AuthProvider({ children }) {
    console.log("AuthProvider rendered"); // REMOVE FOR PRODUCTION

    // Access the auth services using the custom hook
    const authServices = useAuth(); 

    // Call the token monitor once when the AuthProvider is mounted
    useTokenMonitor();

    return(
        <AuthContext.Provider value={authServices}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;