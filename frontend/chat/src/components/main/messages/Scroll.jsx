import { Box } from "@mui/system";
import { styled } from "@mui/material/styles";
import { useRef, useEffect } from "react";

// Style the ScrollContainer using MUI's styled API. This container has customized styles for the scrollbar.
const ScrollContainer = styled(Box)(({ theme }) => ({
  height: `calc(100vh - 190px)`,          // Set the height minus a fixed pixel value
  overflowY: "scroll",                   // Enable vertical scrolling
  
  // Styling for the scrollbar
  "&::-webkit-scrollbar": {
    width: "12px",                      // Increase the width for better visual balance
    height: "12px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.mode === 'dark' ? "#121212" : "#121212", // Conditional color based on theme mode
    borderRadius: "6px",                // Rounded corners for thumb
    border: `3px solid ${theme.palette.background.default}`, // Adds padding around the thumb
    backgroundClip: "content-box",      // Ensure the border does not overlap the thumb
    boxShadow: "inset 0 0 4px rgba(0, 0, 0, 0.5)", // Add subtle shadow for depth
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: theme.palette.mode === 'dark' ? "#888" : "#555", // Conditional color based on theme mode
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: theme.palette.background.paper, // Complementary background color for track
    borderRadius: "6px",                // Rounded corners for track
  },
  "&::-webkit-scrollbar-corner": {
    backgroundColor: "transparent",      // Transparent corner
  },
}));

/**
 * Scroll Component.
 * This component renders a scrollable container and ensures that the content is scrolled to the bottom
 * whenever the children inside the container change.
 *
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The content to be displayed inside the scrollable container.
 * @returns {JSX.Element} The Scroll component.
 */
const Scroll = ({ children }) => {
  const containerRef = useRef(null); // Create a ref to store the scroll container

  useEffect(() => {
    // Check if the ref is currently pointing to a DOM element
    if (containerRef.current) {
      // Scroll to the bottom of the container when the children change
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [children]); // Run the effect whenever the children prop changes

  // Render the scrollable container with the provided children
  return <ScrollContainer ref={containerRef}>{children}</ScrollContainer>;
};

// Export the Scroll component for use in other parts of the application
export default Scroll;
