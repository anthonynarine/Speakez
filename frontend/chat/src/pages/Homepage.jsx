import { Box, CssBaseline } from "@mui/material";
import  PrimaryAppBar  from "../pages/scaffold/primaryAppBar/PrimaryAppBar"
import PrimaryDraw from "./scaffold/primaryDraw/PrimaryDrawer";
import SecondaryDraw from "./scaffold/secondaryDraw/SecondaryDraw"


const Homepage = () => {

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline>
        <PrimaryAppBar />
        <PrimaryDraw></PrimaryDraw>
        <SecondaryDraw />
      </CssBaseline>
    </Box>
  );
};

export default Homepage;
