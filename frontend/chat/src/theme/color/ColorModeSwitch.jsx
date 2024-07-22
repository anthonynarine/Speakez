// Importing required modules and components
import { useContext } from "react";
import { ColorModeContext } from "./ColorModeContext";

import { useTheme } from "@mui/material/styles";
import { IconButton } from "@mui/material";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";

/**
 * ColorModeSwitch component.
 * This component is used to switch between light and dark mode of the application.
 */
export default function ColorModeSwitch() {
  // `useTheme` hook from Material-UI to access the theme
  const theme = useTheme();

  // useContext hook to access color mode context
  const colorMode = useContext(ColorModeContext);

  // Define the IconButton component to toggle color mode
  return (
    <IconButton
      // Styling the button
      sx={{ m: 0, p: 0, pl: 2 }}
      // OnClick event to toggle color mode
      onClick={colorMode.toggleColorMode}
      // Inheriting color from parent
      color="inherit"
    >
      {/* Conditional rendering based on the current theme mode */}
      {theme.palette.mode === "dark" ? (
        // If mode is dark, render "ToggleOffIcon"
        <ToggleOffIcon sx={{ fontSize: "2.5rem", p: 0 }} />
      ) : (
        // If mode is light, render "ToggleOnIcon"
        <ToggleOnIcon sx={{ fontSize: "2.5rem" }} />
      )}
    </IconButton>
  );
}
