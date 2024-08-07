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
import { useServerByIdContext } from "../../context/ServerByIdContext";

/**
 * ServerChannels component
 *
 * This component displays a list of channels for the current server.
 * It fetches the server data from context and displays the channels.
 *
 * @component
 * @returns {JSX.Element} The ServerChannels component
 */
function ServerChannels() {
  const theme = useTheme();
  const { serverId } = useParams();
  const { serverData, isLoading, error } = useServerByIdContext();

  // Get the server name, default to "Server" if not available
  const serverName = serverData?.[0]?.name ?? "Server";

  // Log server data for testing purposes
  useEffect(() => {
    console.log("Channel_server", serverData);
  },[serverData] );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      {/* Server Name Header */}
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

      {/* List of Channels */}
      <List sx={{ py: 0 }}>
        {serverData.map((server) =>
          server.channel_server.map((channel) => (
            <ListItem
              key={channel.id}
              disablePadding
              sx={{ display: "block", maxHeight: "40px" }}
              dense={true}
            >
              {/* Link to Channel */}
              <Link
                to={`/server/${serverId}/${channel.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {/* Channel Button */}
                <ListItemButton sx={{ minHeight: 48 }}>
                  {/* Channel Name */}
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
