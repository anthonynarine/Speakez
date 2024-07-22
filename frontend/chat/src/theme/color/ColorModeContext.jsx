import { createContext } from "react";

/**
 * ColorModeContext provides a context for managing and toggling the color mode (light or dark)
 * across the entire application.
 *
 * This context includes:
 * - toggleColorMode: A function to toggle the color mode between light and dark.
 *
 * Usage:
 * - Wrap your application with ColorModeContext.Provider to provide the context.
 * - Use useContext(ColorModeContext) to access and use the context in any component.
 *
 * Example:
 * const { toggleColorMode } = useContext(ColorModeContext);
 * <Button onClick={toggleColorMode}>Toggle Theme</Button>
 *
 * @type {React.Context<{toggleColorMode: function}>}
 */
export const ColorModeContext = createContext({
  // Function to toggle the color mode. This is a placeholder and will be provided by the ToggleColorMode component.
  toggleColorMode: () => {},
});
