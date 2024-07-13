import { Box, CssBaseline } from "@mui/material";
import  PrimaryAppBar  from "../pages/scaffold/primaryAppBar/PrimaryAppBar"
import PrimaryDraw from "./scaffold/primaryDraw/PrimaryDrawer";
import SecondaryDraw from "./scaffold/secondaryDraw/SecondaryDraw"
import Main from "./scaffold/main/Main"


const Homepage = () => {

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline>
        <PrimaryAppBar />
        <PrimaryDraw></PrimaryDraw>
        <SecondaryDraw />
        <Main />
      </CssBaseline>
    </Box>
  );
};

export default Homepage;
