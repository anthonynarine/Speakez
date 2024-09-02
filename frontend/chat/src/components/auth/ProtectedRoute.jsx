import React from 'react';
import { Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { useAuthServices } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isLoading, isLoggedIn } = useAuthServices();

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

