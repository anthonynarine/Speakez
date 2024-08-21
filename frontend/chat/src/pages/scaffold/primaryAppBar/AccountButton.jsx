import { AccountCircle, Login, Logout } from "@mui/icons-material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import { IconButton, Box, Menu, MenuItem, ListItemIcon } from "@mui/material";
import ColorModeSwitch from "../../../theme/color/ColorModeSwitch";
import React, { useState } from "react";
import { useAuthServices } from "../../../context/AuthContext";
import { useNavigate } from "react-router";

/**
 * AccountButton component.
 * This component is a button that opens a menu when clicked.
 * The menu is anchored to the button that was clicked.
 */
export default function AccountButton() {
  const { user, isLoggedIn, logout } = useAuthServices();
  const navigate = useNavigate()

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

  // Handle login action
  const handleLogin = () => {
    navigate("/login/"); // Redirect to the login page
    setAnchorElement(null); // Close the menu after navigating
  };
  
  const handleLogout = () => {
    logout();
    setAnchorElement(null); // Close the menu after navigating
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
        {user ? user.first_name : "Profile"}
      </MenuItem>
      <MenuItem onClick={handleToggleMenu}>
        <Brightness4Icon />
        <ColorModeSwitch />
      </MenuItem>
      {isLoggedIn ? (
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          Logout
        </MenuItem>
      ) : (
        <MenuItem onClick={handleLogin}>
          <ListItemIcon>
            <Login />
          </ListItemIcon>
          Login
        </MenuItem>
      )}
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
