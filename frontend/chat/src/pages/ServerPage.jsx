// Style imports
import { Box, CssBaseline } from "@mui/material";

// Structural imports
import React, { createContext, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

// Component imports
import PrimaryAppBar from "../pages/scaffold/primaryAppBar/PrimaryAppBar";
import PrimaryDraw from "./scaffold/primaryDraw/PrimaryDrawer";
import SecondaryDraw from "./scaffold/secondaryDraw/SecondaryDraw";
import Main from "./scaffold/main/Main";
import MessageInterface from "../components/main/messageInterface/MessageInterface";
import ServerChannels from "../components/secondaryDraw/ServerChannels";
import ServerDetails from "../components/primaryDraw/ServerDetials";

// Hook imports
import useCrud from "../hooks/useCrud";
import useValidateChannel from "../hooks/useValidateChannel";

// Create the context
const ServerByIdContext = createContext();

// Custom hook to use context 
const useServerByIdContext = () => {
  const context = useContext(ServerByIdContext)
  if (context === undefined) {
    throw new Error ("Component must be wrapped with ServerByIdProvider to access its state and functions")
  }
  return context;
};

/**
 * ServerPage component
 * 
 * This component represents a page displaying server data and channels. It fetches the server data based on the serverId,
 * validates the channelId, and provides the server data to its child components via context.
 * 
 * @component
 * @returns {JSX.Element} The ServerPage component
 */


const ServerPage = () => {
  const navigate = useNavigate();

  // Extract the serverId and channelId parameters from the URL 
  const { serverId, channelId } = useParams();
  // bring in state and functions form useCrud hook
  const { serverData, error, isLoading, fetchData} = useCrud(
    [],
    `/server/select/?by_serverid=${serverId}`  // API endpoint to fetch server data by serverId
  );

  // Fetch data once the ServerPage component loads
  useEffect(() => {
    fetchData();

  }, [fetchData])


  // Validate the channelID
  useValidateChannel(serverData, serverId, channelId)


  return (
    <ServerByIdContext.Provider value={{ serverData, error, isLoading }}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <PrimaryAppBar />
        <PrimaryDraw>
          <ServerDetails />
        </PrimaryDraw>
        <SecondaryDraw>
          <ServerChannels />
        </SecondaryDraw>
        <Main>
          <MessageInterface />
        </Main>
      </Box>
    </ServerByIdContext.Provider>
  );
};

export { ServerByIdContext, useServerByIdContext}
export default ServerPage;
