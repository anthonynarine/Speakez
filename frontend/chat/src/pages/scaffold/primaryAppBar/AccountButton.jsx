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

  // handleProfileMenuOpen is a function that's called when the user
  // clicks the button to open the menu. The click event is passed as
  // an argument to this function.
  const handleProfileMenuOpen = (event) => {
    // The clicked element is set as the anchorElement.
    setAnchorElement(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorElement(null);
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
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <AccountCircle />
        Profile
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
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
        onClick={handleProfileMenuOpen}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      {renderMenu}
    </Box>
  );
}
