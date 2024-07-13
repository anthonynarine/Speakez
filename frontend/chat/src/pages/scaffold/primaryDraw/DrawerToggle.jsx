import { IconButton, Box } from "@mui/material";
import { ChevronRight, ChevronLeft } from "@mui/icons-material";

/**
 * A reusable DrawerToggle component that displays a chevron left or right icon inside an IconButton.
 * This component is typically used to toggle the visibility of a drawer or perform other actions.
 *
 * @param {Object} props - The props object containing the following properties:
 *   - open (boolean): Indicates whether the drawer is currently open or closed.
 *   - openDrawer (function): Callback function to open the drawer.
 *   - closeDrawer (function): Callback function to close the drawer.
 *
 * @returns {JSX.Element} The JSX representation of the DrawerToggle component.
 */
const DrawerToggle = (props) => {
  // The IconButton's onClick event is wired to the appropriate drawer action based on the "open" prop.
  // When the IconButton is clicked, it will call either "closeDrawer" or "openDrawer" function,
  // depending on the value of the "open" prop.

  return (
    <Box
      sx={{
        height: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Display the ChevronLeft icon if the drawer is open; otherwise, display ChevronRight icon. */}
      <IconButton onClick={props.open ? props.closeDrawer : props.openDrawer}>
        {props.open ? <ChevronLeft /> : <ChevronRight />}
      </IconButton>
    </Box>
  );
};

export default DrawerToggle;
