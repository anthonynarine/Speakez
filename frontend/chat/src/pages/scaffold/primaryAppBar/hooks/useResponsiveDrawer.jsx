// src/pages/scaffold/primaryAppBar/hooks/useResponsiveDrawer.js

import { useState, useEffect, useCallback } from "react";
import { useTheme, useMediaQuery } from "@mui/material";

/**
 * Custom hook for handling responsive drawer visibility.
 * Automatically closes the drawer on small screens when it's open.
 *
 * Functionality summary:
 * - The hook manages the visibility of a drawer on different screen sizes.
 * - It takes care of automatically closing the drawer when the screen size is small.
 * - The hook returns the `isDrawerOpen` state variable and the `toggleDrawer` function for external use.
 * - `isDrawerOpen` indicates whether the drawer is currently visible or not.
 * - `toggleDrawer` is a function that can be used to toggle the visibility state of the drawer (open or closed).
 *
 * @returns {Object} An object containing `isDrawerOpen` and `toggleDrawer` functions.
 */
export function useResponsiveDrawer() {
  // State to track the drawer visibility
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Get the current theme
  const theme = useTheme();

  /**
   * Check if the screen is small (600px or less)
   * @type {boolean}
   */
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Effect to handle drawer visibility on small screens. CLOSES the drawer on small screens.
  useEffect(() => {
    // If the screen is small and the drawer is open, close the drawer
    if (isSmallScreen && isDrawerOpen) {
      setIsDrawerOpen(false);
    }
  }, [isSmallScreen]);

  // Function to toggle the drawer visibility (open or closed)
  const toggleDrawer = useCallback((visible) => {
    setIsDrawerOpen(visible);
  }, []);

  // Return the state and functions for external use
  return { isDrawerOpen, toggleDrawer };
}
