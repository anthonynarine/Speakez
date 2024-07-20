import { Box, CssBaseline } from "@mui/material";
import PrimaryAppBar from "./scaffold/primaryAppBar/PrimaryAppBar";
import PrimaryDraw from "./scaffold/primaryDraw/PrimaryDrawer";
import SecondaryDraw from "./scaffold/secondaryDraw/SecondaryDraw";
import Main from "./scaffold/main/Main";
import ExploreServers from "../components/main/ExploreServers";


function ExplorePage() {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <PrimaryAppBar />
      <PrimaryDraw>

      </PrimaryDraw>
      <SecondaryDraw>

      </SecondaryDraw>
      <Main><ExploreServers /></Main>
    </Box>
  );
}

export default ExplorePage;