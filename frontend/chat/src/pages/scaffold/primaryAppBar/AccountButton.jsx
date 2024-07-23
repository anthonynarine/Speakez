import { AccountCircle } from "@mui/icons-material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import { IconButton, Box, Menu, MenuItem } from "@mui/material";
import ColorModeSwitch from "../../../theme/color/ColorModeSwitch";
import React, { useState } from "react";

/**
 * AccountButton component.
 * This component is a button that opens a menu when clicked.
 * The menu is anchored to the button that was clicked.
 */
export default function AccountButton() {
  // anchorElement is used to anchor the menu to the element
  // that was clicked to open the menu.
  // Initially, anchorElement is null.
  const [anchorElement, setAnchorElement] = useState(null);

  // isMenuOpen is a boolean that indicates whether the menu is open.
  // It's true if anchorElement is not null, and false otherwise.
  const isMenuOpen = Boolean(anchorElement);

  // handleToggleMenu is a function that's called when the user
  // clicks the button to toggle the menu. The click event is passed as
  // an argument to this function.
  const handleToggleMenu = (event) => {
    // If the menu is already open, close it by setting anchorElement to null.
    // If the menu is closed, open it by setting the clicked element as the anchorElement.
    setAnchorElement(isMenuOpen ? null : event.currentTarget);
  };

  // Menu to be rendered when the button is clicked.
  // It is anchored to the button that was clicked.
  const renderMenu = (
    <Menu
      anchorEl={anchorElement}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: 6, horizontal: "right" }}
      keepMounted
      open={isMenuOpen}
      onClose={handleToggleMenu}
    >
      <MenuItem onClick={handleToggleMenu}>
        <AccountCircle />
        Profile
      </MenuItem>
      <MenuItem onClick={handleToggleMenu}>
        <Brightness4Icon />
        <ColorModeSwitch />
      </MenuItem>
    </Menu>
  );

  return (
    <Box>
      <IconButton
        edge="end"
        aria-label="account of current user"
        aria-controls="primary-search-account-menu"
        aria-haspopup="true"
        onClick={handleToggleMenu}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      {renderMenu}
    </Box>
  );
}
