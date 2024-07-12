// src/pages/scaffold/primaryAppBar/PrimaryAppBar.js

import { AppBar, Toolbar, Typography, Box, IconButton, Drawer } from "@mui/material";
import { useTheme } from "@emotion/react";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { useResponsiveDrawer } from "./hooks/useResponsiveDrawer";

/**
 * PrimaryAppBar component renders the main application navbar with a responsive drawer functionality.
 * It includes an AppBar, Toolbar, Drawer, and the application title.
 *
 * The useResponsiveDrawer hook is used to manage the state of the drawer's visibility.
 * The theme is utilized for consistent styling across the component.
 *
 * @returns {JSX.Element} The rendered PrimaryAppBar component.
 */
const PrimaryAppBar = () => {
  
  const { isDrawerOpen, toggleDrawer } = useResponsiveDrawer();
  const theme = useTheme();

  return (
    <AppBar
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1, // Ensure the AppBar is always on top
        background: theme.palette.background.default,
        borderBottom: `2px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar
        variant="dense"
        sx={{
          height: theme.primaryAppBar.height,
          minHeight: theme.primaryAppBar.height,
        }}
      >
        {/* ============================ Menu Icon for Small Screens ============================ */}
        <Box sx={{ display: { xs: "block", sm: "none" } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => toggleDrawer(true)}
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        {/* ============================ End of Menu Icon for Small Screens ============================ */}

        {/* ============================ Drawer ============================ */}
        <Drawer anchor="left" open={isDrawerOpen} onClose={() => toggleDrawer(false)}>
          {/* Drawer Content */}
          {[...Array(100)].map((_, i) => (
            <Typography key={i} paragraph>
              {i + 1}
            </Typography>
          ))}
        </Drawer>
        {/* ============================ End of Drawer ============================ */}

        {/* ============================ App Title ============================ */}
        <Link to={"/"} style={{ textDecoration: "none", color: "inherit" }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { fontWeight: 700, letterSpacing: "4px" } }}
          >
            SpeakEz
          </Typography>
        </Link>
        {/* ============================ End of App Title ============================ */}
      </Toolbar>
    </AppBar>
  );
};

export default PrimaryAppBar;
