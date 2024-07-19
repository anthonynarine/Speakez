import { Box, CssBaseline } from "@mui/material";
import  PrimaryAppBar  from "../pages/scaffold/primaryAppBar/PrimaryAppBar"
import PrimaryDraw from "./scaffold/primaryDraw/PrimaryDrawer";
import SecondaryDraw from "./scaffold/secondaryDraw/SecondaryDraw"
import Main from "./scaffold/main/Main"
import PopularChannels from "../components/primaryDraw/PopularChannels";
import ExploreCategories from "../components/secondaryDraw/ExploreCategories";


const Homepage = () => {

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
        <PrimaryAppBar />
        <PrimaryDraw>
          <PopularChannels open={false}/>
        </PrimaryDraw>
        <SecondaryDraw>
          <ExploreCategories /> 
        </SecondaryDraw>
        <Main />
    </Box>
  );
};

export default Homepage;
