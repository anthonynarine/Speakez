import { Box, useMediaQuery, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useState, useEffect } from "react";
import DrawerToggle from "./DrawerToggle";
import CustomDrawer from "./CustomDrawer";

/**
 * PrimaryDraw component.
 * This component handles the rendering and behavior of the primary drawer in the application.
 *
 * @param {object} props - The props object.
 * @param {React.ReactElement} props.children - The children elements passed to this component.
 * @returns {JSX.Element} The rendered PrimaryDraw component.
 */
const PrimaryDraw = function ({ children }) {
  const theme = useTheme();

  // Check if the screen is below 600px (sm breakpoint)
  const below600sm = Boolean(useMediaQuery("(max-width:599px)"));

  // State to control the drawer's open/close state
  const [open, setOpen] = useState(false);


  // Effect to update the drawer's open state when the screen size changes
  useEffect(() => {
    // If the screen size is below 600px, set the drawer to be closed (temporary variant)
    // Otherwise, set the drawer to be open (permanent variant)
    setOpen(!below600sm);
  }, [below600sm]);

  const openDrawer = () => {
    setOpen(true);
  };

  const closeDrawer = () => {
    setOpen(false);
  };

  // Clone each child element and pass the `open` prop to it
  const childrenWithProps = React.Children.map(children, (child) =>
    React.isValidElement(child) ? React.cloneElement(child, { open }) : child
  );

  return (
    <CustomDrawer
      theme={theme}
      open={open}
      variant={below600sm ? "temporary" : "permanent"}
      PaperProps={{
        sx: {
          mt: `${theme.primaryAppBar.height}px`,
          height: `calc(100vh - ${theme.primaryAppBar.height}px)`,
          width: theme.primaryDraw.width,
        },
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            position: "relative",
            p: 0,
            width: open ? "auto" : "100%",
            flexShrink: 0,
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <DrawerToggle open={open} openDrawer={openDrawer} closeDrawer={closeDrawer} />
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto', // Enable vertical scrolling
          }}
        >
          {[...Array(40)].map((_, i) => (
            <Typography key={i} paragraph>
              {i + 1}
            </Typography>
          ))}
          {childrenWithProps}
        </Box>
      </Box>
    </CustomDrawer>
  );
};

export default PrimaryDraw;