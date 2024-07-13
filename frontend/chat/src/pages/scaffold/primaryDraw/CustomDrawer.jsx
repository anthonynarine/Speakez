import { styled } from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { openedMixin, closedMixin } from "./DrawerUtils";

/**
 * A custom styled MuiDrawer component that handles the appearance of the drawer
 * based on its open or closed state.
 *
 * @param {object} theme - The Material-UI theme object.
 * @param {boolean} open - Indicates whether the drawer is currently open or closed.
 * @returns {object} The object containing the styles for the Drawer component.
 */
const CustomDrawer = styled(MuiDrawer)(({ theme, open }) => ({
  width: theme.primaryDraw.width,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default CustomDrawer;
