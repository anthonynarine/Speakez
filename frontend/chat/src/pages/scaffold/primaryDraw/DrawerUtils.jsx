
/**
 * Returns the styles to apply when the drawer is open.
 *
 * @param {object} theme - The Material-UI theme object.
 * @returns {object} The object containing the open styles for the drawer.
 */
export const openedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.easeIn,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflow: "hidden",
  });
  
  /**
   * Returns the styles to apply when the drawer is closed.
   *
   * @param {object} theme - The Material-UI theme object.
   * @returns {object} The object containing the closed styles for the drawer.
   */
  export const closedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.easeIn,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflow: "hidden",
    width: theme.primaryDraw.closed,
  });
  