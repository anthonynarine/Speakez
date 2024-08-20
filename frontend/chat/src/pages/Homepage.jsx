import { Box, CssBaseline } from "@mui/material";
import PrimaryAppBar from "../pages/scaffold/primaryAppBar/PrimaryAppBar";
import PrimaryDraw from "./scaffold/primaryDraw/PrimaryDrawer";
import SecondaryDraw from "./scaffold/secondaryDraw/SecondaryDraw";
import Main from "./scaffold/main/Main";
import PopularChannels from "../components/primaryDraw/PopularChannels";
import ExploreCategories from "../components/secondaryDraw/ExploreCategories";
import ExploreServers from "../components/main/ExploreServers";

import { useAuthServices } from "../context/AuthContext";
import { useEffect } from "react";

const Homepage = () => {
  const { user, isLoggedIn } = useAuthServices()
  useEffect(()=> {
    console.log("User state after login", user)
    console.log("User status", isLoggedIn)
  },[user])

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
      <Main>
        <ExploreServers />
      </Main>
    </Box>
  );
};

export default Homepage;
