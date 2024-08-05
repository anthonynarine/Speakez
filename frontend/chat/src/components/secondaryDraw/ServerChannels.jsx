// Material-UI imports
import {
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
  ListItemButton,
} from "@mui/material";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

/**
 * ServerChannels component
 *
 * This component displays a list of channels for the current server.
 * It fetches the server data from the provided props and displays the channels.
 *
 * @component
 * @param {Array} serverData - Array containing server data. Each server object should have a "channel_server" property which is an array of channels.
 * @param {Boolean} isLoading - Boolean indicating whether the data is still loading.
 * @param {Object} error - Object containing error information if there was an error fetching the data.
 * @returns {JSX.Element} The ServerChannels component
 */
function ServerChannels({ serverData, isLoading, error }) {
  const theme = useTheme();
  const { serverId } = useParams();

  // Get the server name, default to "Server" if not available
  const serverName = serverData?.[0]?.name ?? "Server";

  // Log server data for testing purposes
  useEffect(() => {
    console.log("Channel_server", serverData);
  }, [serverData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <Box
        sx={{
          height: "50px",
          display: "flex",
          alignItems: "center",
          px: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          position: "sticky",
          top: 0,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Typography
          variant="body1"
          sx={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
        >
          {serverName}
        </Typography>
      </Box>
      <List sx={{ py: 0 }}>
        {serverData.map((server) =>
          server.channel_server.map((channel) => (
            <ListItem
              key={channel.id}
              disablePadding
              sx={{ display: "block", maxHeight: "40px" }}
              dense={true}
            >
              <Link
                to={`/server/${serverId}/${channel.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItemButton sx={{ minHeight: 48 }}>
                  <ListItemText
                    primary={
                      <Typography variant="body2" textAlign="start" paddingLeft={1}>
                        {channel.name}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          ))
        )}
      </List>
    </>
  );
}

export default ServerChannels;
