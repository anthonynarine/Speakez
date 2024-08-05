// Style imports
import { Box, CssBaseline } from "@mui/material";

// Structural imports
import React, { useEffect } from "react";
import { useParams } from "react-router";

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

/**
 * ServerPage component
 * 
 * This component represents a page displaying server data and channels. It fetches the server data based on the serverId,
 * validates the channelId, and provides the server data to its child components.
 * 
 * @component
 * @returns {JSX.Element} The ServerPage component
 */

const ServerPage = () => {
  // Extract the serverId and channelId parameters from the URL 
  const { serverId, channelId } = useParams();
  
  // bring in state and functions form useCrud hook
  const { serverData, error, isLoading, fetchData } = useCrud(
    [],
    `/server/select/?by_serverid=${serverId}`  // API endpoint to fetch server data by serverId
  );

  // Fetch data once the ServerPage component loads
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Validate the channelID
  useValidateChannel(serverData, serverId, channelId);

  
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <PrimaryAppBar />
      <PrimaryDraw>
        <ServerDetails serverData={serverData} isLoading={isLoading} error={error} />
      </PrimaryDraw>
      <SecondaryDraw>
        <ServerChannels serverData={serverData} isLoading={isLoading} error={error} />
      </SecondaryDraw>
      <Main>
        <MessageInterface />
      </Main>
    </Box>
  );
};

export default ServerPage;
