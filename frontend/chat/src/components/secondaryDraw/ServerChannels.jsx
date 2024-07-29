import {
    List,
    ListItem,
    ListItemText,
    Box,
    Typography,
    ListItemButton,
  } from "@mui/material";
  
  import { useEffect } from "react";
  import { Link } from "react-router-dom";
  import { useTheme } from "@mui/material/styles";
  import { useServerByIdContext } from "../../pages/ServerPage";

  /**
 * ServerChannels component
 *
 * This component displays a list of channels for the current server.
 * It fetches the server data from the context and displays the channels.
 *
 * @component
 * @returns {JSX.Element} The ServerChannels component
 */
  
  function ServerChannels() {
    const theme = useTheme();
    
    // Access serverData form context
    const { serverData } = useServerByIdContext();

    // Get the server name, default to "Server" if not available
    const server_name = serverData?.[0]?.name ?? "Server";
    // const server_name = serverData && serverData.length > 0 && serverData[0].name ? serverData[0].name : "Server";
  
    //....FOR TESTING
    useEffect(() => {
      console.log("Channel_server", serverData);
    }, [serverData]);
  
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
            {server_name}
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
                  to={`/server/${server.id}/${channel.id}`}
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
  