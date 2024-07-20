import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";

/**
 * A reusable main container component.
 * This component is typically used as the main content area in wider views.
 *
 * @param {object} props - The properties of the Main component.
 * @param {React.ReactNode} props.children - Elements to be rendered inside the Main component.
 * @returns {JSX.Element} The JSX representation of the Main component.
 */
const Main = function ({ children }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        flexGrow: 1,
        mt: `${theme.primaryAppBar.height}px`,
        height: `calc(100vh - ${theme.primaryAppBar.height}px)`,
        overflow: "hidden",
      }}
    >
      {/* {[...Array(40)].map((_, i) => (
        <Typography key={i} paragraph>
          {i + 1}
        </Typography>
      ))} */}
      {children}
    </Box>
  );
};

export default Main;
