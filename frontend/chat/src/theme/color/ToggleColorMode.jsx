import { CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import createMuiTheme from "../theme";
import { ColorModeContext } from "./ColorModeContext";
import Cookies from "js-cookie";

/**
 * ToggleColorMode component provides the ability to toggle between light and dark themes
 * based on user preference or system settings. It uses Material-UI's ThemeProvider to
 * apply the theme and provides a context to toggle the theme mode.
 *
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - The child components that will have access to the theme
 * @returns {JSX.Element} The provider components with the current theme and color mode context
 */
const ToggleColorMode = ({ children }) => {
  // Checks if the user prefers a dark color scheme based on their OS or browser settings
  const prefersDarkMode = useMediaQuery("([prefers-color-scheme: dark])");

  /**
   * Declares a state variable 'mode' with setter function 'setMode'.
   * The initial value of 'mode' is determined by a function that reads from Cookies.
   * The function first tries to get the value of 'colorMode' from Cookies.
   * If that value is present, it is used as the initial value for 'mode'.
   * If there's no 'colorMode' value in Cookies (i.e., the user has not previously
   * selected a color mode), the function checks the user's OS-level preference using the
   * 'prefersDarkMode' variable. If 'prefersDarkMode' is true, 'dark' is returned, otherwise 'light'.
   * As a result, 'mode' will be initialized to the value from Cookies if it's present,
   * or to the user's OS-level preference if it's not.
   */
  const [mode, setMode] = useState(() => {
    const colorMode = Cookies.get("colorMode");
    return colorMode || (prefersDarkMode ? "dark" : "light");
  });

  /**
   * Toggles color mode between light and dark
   * This function updates the 'mode' state by switching between 'light' and 'dark'
   */
  const toggleColorMode = useCallback(() => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  }, []);

  /**
   * useEffect hook to store the current mode in Cookies whenever it changes.
   * This ensures the user's preference is persisted across sessions.
   */
  useEffect(() => {
    Cookies.set("colorMode", mode);
  }, [mode]);

  /**
   * useMemo returns a memoized version of the object { toggleColorMode }.
   * This object will only be recalculated if toggleColorMode changes, which
   * helps avoid unnecessary re-renders of child components.
   */
  const colorMode = useMemo(() => ({ toggleColorMode }), [toggleColorMode]);

  /**
   * useMemo is used here to create a memoized version of the theme. This theme is
   * only recalculated if 'mode' changes. If 'mode' does not change between renders,
   * the same object will be returned, helping to avoid unnecessary re-renders.
   */
  const theme = useMemo(() => createMuiTheme(mode || "light"), [mode]);

  /**
   * The component renders a ColorModeContext.Provider and a ThemeProvider.
   * ColorModeContext.Provider makes the 'colorMode' object available to all child
   * components. This object contains the function to toggle the color mode.
   * ThemeProvider makes the 'theme' available to all child components. The theme is
   * constructed based on the current 'mode'.
   * CssBaseline is a component provided by Material UI that helps normalize CSS across browsers.
   * The children are rendered within the providers, which means that they have access to the
   * 'colorMode' context and the 'theme'.
   */
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default ToggleColorMode;
