// src/pages/scaffold/primaryAppBar/PrimaryAppBar.js

import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { useTheme } from "@emotion/react";
import { Link } from "react-router-dom";

const PrimaryAppBar = () => {
  const theme = useTheme();

  return (
    <AppBar
      sx={{
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
        <Box></Box>

        {/* App Title */}
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
      </Toolbar>
    </AppBar>
  );
};

export default PrimaryAppBar;
