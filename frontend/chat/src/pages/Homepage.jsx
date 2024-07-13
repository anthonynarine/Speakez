import { Box, CssBaseline } from "@mui/material";
import  PrimaryAppBar  from "../pages/scaffold/primaryAppBar/PrimaryAppBar"
import PrimaryDraw from "./scaffold/primaryDraw/PrimaryDrawer";


const Homepage = () => {

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline>
        <PrimaryAppBar />
        <PrimaryDraw></PrimaryDraw>
      </CssBaseline>
    </Box>
  );
};

export default Homepage;
