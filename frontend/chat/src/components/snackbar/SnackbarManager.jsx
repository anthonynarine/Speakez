import React, { useImperativeHandle, useState, forwardRef } from "react";
import { Snackbar } from "@mui/material";

/**
 * SnackbarManager component to manage the display of a snackbar notification.
 * The parent component can trigger the snackbar with a custom message using the ref.
 * 
 * @returns {JSX.Element} The Snackbar component.
 */
const SnackbarManager = forwardRef((props, ref) => {
    const [open, setOpen] = useState(false); // State for controlling Snackbar visibility
    const [message, setMessage] = useState(""); // State for the message to display

    // Allow a parent component to trigger the snackbar
    useImperativeHandle(ref, () => ({
        /**
         * Triggers the Snackbar with the provided message.
         * 
         * @param {string} msg - The message to display in the snackbar.
         */
        triggerSnackbar(msg) {
            setMessage(msg); // Set the message in the state
            setOpen(true); // Open the snackbar
        }
    }));

    /**
     * Function to handle closing the Snackbar.
     */
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Snackbar
            open={open} // Controls the Snackbar's open state
            autoHideDuration={6000} // Automatically hide the Snackbar after 6 seconds
            onClose={handleClose} // Function to close the Snackbar
            message={message} // Display the custom message
        />
    );
});

export default SnackbarManager;
