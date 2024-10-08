// Style imports
import { Box, CssBaseline } from "@mui/material";

// Structural imports
import React, { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router";

// Component imports
import PrimaryAppBar from "../pages/scaffold/primaryAppBar/PrimaryAppBar";
import PrimaryDraw from "./scaffold/primaryDraw/PrimaryDrawer";
import SecondaryDraw from "./scaffold/secondaryDraw/SecondaryDraw";
import Main from "./scaffold/main/Main";
import MessageInterface from "../components/main/messages/MessageInterface";
import ServerChannels from "../components/secondaryDraw/ServerChannels";
import ServerDetails from "../components/primaryDraw/ServerDetials";

// Hook imports
import useCrud from "../hooks/useCrud";
import useValidateChannel from "../hooks/useValidateChannel";

// Context import 
import ServerByIdContext from "../context/ServerByIdContext";
import { useAuthServices } from "../context/AuthContext";

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
  const navigate = useNavigate();

  // Access authentication status from the context
  const { isLoggedIn } = useAuthServices()
  
  // Redirect to login if not authenticated
  useEffect(() => {
    console.log("ServerPage rendered. Checking isLoggedIn:", isLoggedIn);
    if (!isLoggedIn) {
      console.log("Not logged in. Redirecting to login.");
      navigate("/login/");
    };
  }, [isLoggedIn])

  // bring in state and functions form useCrud hook
  const { serverData, error, isLoading, fetchData } = useCrud(
    [],
    `/server/select/?by_serverid=${serverId}`  // API endpoint to fetch server data by serverId
  );

  // Fetch data once the ServerPage component loads
  useEffect(() => {
    fetchData();
  },[fetchData]);

  // Get the server name.
  const serverName = useMemo(() => serverData?.[0]?.name ?? "Server", [serverData]);
  const serverDescription = useMemo(() => serverData?.[0]?.description ?? "This is our home", [serverData])


  // ** see noteson useMemo hook below
  // Validate the channelID
  useValidateChannel(serverData, serverId, channelId);

  const providerValue = useMemo(() => ({
    serverData,
    error,
    isLoading,
    serverId,
    channelId,
    serverName,
    serverDescription
  }), [serverData, error, isLoading, serverId, channelId, serverName, serverDescription]);

  
  return (
    <ServerByIdContext.Provider value={providerValue}>
      <Box sx={{ display: "flex", width: "100%" }}>
        <CssBaseline />
        <PrimaryAppBar/>
        <PrimaryDraw>
          <ServerDetails open={false} />
        </PrimaryDraw>
        <SecondaryDraw>
          <ServerChannels/>
        </SecondaryDraw>
        <Main>
          <MessageInterface />
        </Main>
    </Box>
  </ServerByIdContext.Provider>
  );
};

export default ServerPage;


// Explanation:
// useMemo: This hook is used to memoize values, ensuring they only
// recalculate when their dependencies change. This can help optimize 
// performance by preventing unnecessary recalculations and re-renders.
// Provider Value Memoization: Memoizing the context provider value
// helps prevent re-renders of all context consumers when the
//  provider's value changes unnecessarily.