import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";

/**
 * A reusable secondary drawer component that displays a vertical list of paragraphs.
 * This component is typically used for additional content or navigation in wider views.
 *
 * @param {object} props - The properties of the SecondaryDraw component.
 * @param {React.ReactNode} props.children - Elements to be rendered inside the SecondaryDraw component.
 * @returns {JSX.Element} The JSX representation of the SecondaryDraw component.
 */
const SecondaryDraw = function ({ children }) {
  // Get the current theme using the useTheme() hook from Material-UI.
  const theme = useTheme();

  return (
    <Box
      sx={{
        // Set the minimum width of the drawer to the specified value in the theme.
        minWidth: `${theme.secondaryDraw.width}px`,
        // Set the height of the drawer to occupy the available height minus the primary app bar height.
        height: `calc(100vh - ${theme.primaryAppBar.height}px)`,
        // Set the top margin to be the same height as the primary app bar to avoid overlapping.
        mt: `${theme.primaryAppBar.height}px`,
        // Add a vertical line on the right side of the drawer using the specified divider color from the theme.
        borderRight: `1px solid ${theme.palette.divider}`,
        // Display the drawer only for screen sizes above or equal to the "sm" breakpoint.
        display: { xs: "none", sm: "block" },
        // Enable vertical scrolling within the drawer when content overflows.
        overflow: "auto",
      }}
    >
      {[...Array(40)].map((_, i) => (
        <Typography key={i} paragraph>
          {i + 1}
        </Typography>
      ))}
      {children}
    </Box>
  );
};

export default SecondaryDraw;
