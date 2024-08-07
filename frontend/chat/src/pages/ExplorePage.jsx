import { Box, CssBaseline } from "@mui/material";
import PrimaryAppBar from "./scaffold/primaryAppBar/PrimaryAppBar";
import PrimaryDraw from "./scaffold/primaryDraw/PrimaryDrawer";
import SecondaryDraw from "./scaffold/secondaryDraw/SecondaryDraw";
import Main from "./scaffold/main/Main";
import ExploreServers from "../components/main/ExploreServers";
import PopularChannels from "../components/primaryDraw/PopularChannels";
import ExploreCategories from "../components/secondaryDraw/ExploreCategories";


function ExplorePage() {
  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <CssBaseline />
      <PrimaryAppBar />
      <PrimaryDraw>
        <PopularChannels open={false} />
      </PrimaryDraw>
      <SecondaryDraw>
        <ExploreCategories />
      </SecondaryDraw>
      <Main><ExploreServers /></Main>
    </Box>
  );
}

export default ExplorePage;