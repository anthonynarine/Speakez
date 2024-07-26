import { Box, CssBaseline } from "@mui/material";
// Structural
import PrimaryAppBar from "../pages/scaffold/primaryAppBar/PrimaryAppBar";
import PrimaryDraw from "./scaffold/primaryDraw/PrimaryDrawer";
import SecondaryDraw from "./scaffold/secondaryDraw/SecondaryDraw";
import Main from "./scaffold/main/Main";
import MessageInterface from "../components/main/messageInterface/MessageInterface";
import ServerChannels from "./scaffold/secondaryDraw/ServerChannels";

const ServerPage = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <PrimaryAppBar />
      <PrimaryDraw></PrimaryDraw>
      <SecondaryDraw>
        <ServerChannels />
      </SecondaryDraw>
      <Main>
        <MessageInterface />
      </Main>
    </Box>
  );
};

export default ServerPage;
