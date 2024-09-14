import React from 'react';
import { Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { useAuthServices } from '../../context/AuthContext';
import useTokenMonitor from '../../hooks/useTokenMonitor';

const ProtectedRoute = ({ children }) => {
    const { isLoading, isLoggedIn } = useAuthServices();

    // Start monitoring the token expiration when the user access a protected route
    useTokenMonitor(isLoggedIn);

    if (isLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!isLoggedIn) {
        console.log("User is not logged in. Redirecting to login.");
        return <Navigate to="/login/" />;
    }

    return children;
};

export default ProtectedRoute;

