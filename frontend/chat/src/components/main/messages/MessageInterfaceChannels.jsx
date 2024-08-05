import {
  AppBar,
  Toolbar,
  Box,
  ListItemAvatar,
  Avatar,
  Typography,
  IconButton,
  Drawer,
  useTheme,
} from "@mui/material";
import { useParams } from "react-router-dom";
import ServerChannels from "../../secondaryDraw/ServerChannels";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { MessageInterfaceStyles } from "./MessageInterfaceStyles";
import getChannelNameFromData from "./GetChannelNameFromData";
import { useResponsiveDrawer } from "../../../hooks/useResponsiveDrawer";
import { useServerByIdContext } from "../../../context/ServerByIdContext";

const MEDIA_URL = process.env.REACT_APP_MEDIA_URL;

/**
 * MessageInterfaceChannels component
 *
 * This component displays the channels of a server in the message interface.
 * It uses the context to fetch server data and displays the channels in a drawer.
 *
 * @component
 * @returns {JSX.Element} The MessageInterfaceChannels component
 */
const MessageInterfaceChannels = () => {
  const { isDrawerVisible, toggleDrawer } = useResponsiveDrawer();
  const theme = useTheme();
  const classes = MessageInterfaceStyles(theme);
  const { serverId, channelId } = useParams();
  const { serverData } = useServerByIdContext();

  // Get the channel name from the server data
  const channelName = getChannelNameFromData(serverData, serverId, channelId);

  // Function to render the channel list in the drawer
  const list = () => (
    <Box
      sx={{ paddingTop: `${theme.primaryAppBar.height}px`, minWidth: 200 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <ServerChannels />
    </Box>
  );

  return (
    <>
      <AppBar
        sx={classes.channelInterfaceAppBar}
        color="default"
        position="sticky"
        elevation={0}
      >
        <Toolbar variant="dense" sx={classes.channelInterfaceToolBar}>
          {/* Server Icon */}
          <Box sx={classes.listItemAvatarBox}>
            <ListItemAvatar sx={{ minWidth: "40px" }}>
              <Avatar
                alt="Server Icon"
                src={`${MEDIA_URL}${serverData?.[0]?.icon}`} 
                sx={{ width: 30, height: 30 }}
              />
            </ListItemAvatar>
          </Box>
          {/* Channel Name */}
          <Typography noWrap component="div">
            {channelName}
          </Typography>
          <Box sx={{ flexGrow: 1 }}></Box>
          {/* Drawer Toggle Button for Small Screens */}
          <Box sx={{ display: { xs: "block", sm: "none" } }}>
            <IconButton onClick={toggleDrawer(true)} color="inherit" edge="end">
              <MoreVertIcon />
            </IconButton>
          </Box>
          {/* Drawer Component */}
          <Drawer anchor="left" open={isDrawerVisible} onClose={toggleDrawer(false)}>
            {list()}
          </Drawer>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default MessageInterfaceChannels;
