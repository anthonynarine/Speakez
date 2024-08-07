import React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
} from "@mui/material";
import Scroll from "./Scroll"
import { FormatTimeStamp } from "./FormatTimeStamp";

/**
 * A component that renders a list of messages.
 *
 * @param {Object} props - The properties for the component.
 * @param {Array} props.messages - The list of messages to display.
 * @returns {JSX.Element} The JSX element representing the MessageList.
 */
const MessageList = ({ messages }) => {
  return (
    <Scroll>
      <List>
        {messages.map((msg) => (
          <ListItem key={msg.id} alignItems="flex-start">
            {/* Avatar for the sender */}
            <ListItemAvatar>
              <Avatar alt="user image" />
            </ListItemAvatar>
            <ListItemText
              // Styling for the primary message content (sender)
              primaryTypographyProps={{ fontSize: "12px", variant: "body2" }}
              primary={
                <React.Fragment>
                  {/* Sender Name */}
                  <Typography
                    component="span"
                    variant="body1"
                    color="text.primary"
                    sx={{ display: "inline", fontWeight: 600 }}
                  >
                    {msg.sender}
                  </Typography>
                  {/* Timestamp */}
                  <Typography component="span" variant="caption" color="textSecondary">
                    {" "}
                    {FormatTimeStamp(msg.timestamp)}
                  </Typography>
                </React.Fragment>
              }
              secondary={
                <React.Fragment>
                  {/* Message Content */}
                  <Typography
                    variant="body1"
                    component="span"
                    color="text.primary"
                    style={{
                      overflow: "visible",
                      whiteSpace: "normal",
                      textOverflow: "clip",
                    }}
                    sx={{
                      display: "inline",
                      lineHeight: 1.2,
                      fontWeight: 400,
                      letterSpacing: "-0.2px",
                    }}
                  >
                    {msg.content}
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
        ))}
      </List>
    </Scroll>
  );
};

export default MessageList;
