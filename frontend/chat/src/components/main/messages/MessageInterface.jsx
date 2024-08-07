import { Box, Typography, TextField, Button, useTheme } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import useWebSocket from "react-use-websocket";
import { useParams } from "react-router-dom";
import useCrud from "../../../hooks/useCrud";
import { MessageInterfaceStyles } from "./MessageInterfaceStyles";
import { useServerByIdContext } from "../../../context/ServerByIdContext";
import MessageInterfaceChannels from "./MessageInterfaceChannels";
import MessageList from "./MessageList";
/**
 * MessageInterface component that handles WebSocket connection and displays messages.
 */
const MessageInterface = () => {
  const theme = useTheme();
  const classes = MessageInterfaceStyles(theme);
  // State for storing messages and the input message
  const [newMessages, setNewMessages] = useState([]);
  const [message, setMessage] = useState("");

  // Extracting serverId and channelId from URL parameters
  const { serverId, channelId } = useParams();
  
  // Constructing the WebSocket URL
  const socketURL = channelId ? `ws://localhost:8000/${serverId}/${channelId}/` : null;

  // Custom hook for fetching data from the API
  const { fetchData, serverData } = useCrud([], `/messages/?channel_id=${channelId}`);

  const { serverName, serverDescription } = useServerByIdContext();
  
  // Function to handle incoming WebSocket messages
  const handleIncomingMessage = useCallback((message) => {
    const msgData = JSON.parse(message.data); // Corrected from message.msgData
    // Create a structured object for the new message
    const newMessage = {
      id: msgData.id,
      sender: msgData.sender,
      content: msgData.new_message,
      timestamp: msgData.timestamp,
    };
    // Updating the newMessages state with the new message
    setNewMessages((prevMessages) => [...prevMessages, newMessage]);
  }, []);

  // WebSocket hook to handle connection and messages
  const { sendJsonMessage } = useWebSocket(socketURL, {
    onOpen: async () => {
      console.log("WebSocket Connected");
      try {
        await fetchData(); // Fetch messages when WebSocket opens
        setNewMessages(Array.isArray(serverData) ? serverData : []);
      } catch (error) {
        console.log(error);
      }
    },
    onClose: () => console.log("WebSocket connection closed."),
    onError: () => console.log("An error occurred with the WebSocket connection."),
    onMessage: handleIncomingMessage,
  });

  // Effect to update messages whenever serverData changes
  useEffect(() => {
    if (Array.isArray(serverData)) {
      setNewMessages(serverData);
      console.log("Fetched data:", serverData);
    }
  }, [serverData]);

  // Effect to log new messages whenever they update
  useEffect(() => {
    console.log("newMessages updated:", newMessages);
  }, [newMessages]);

  /**
   * Handle key down event for the input field.
   *
   * @param {React.KeyboardEvent<HTMLInputElement>} e - The keyboard event.
   */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendJsonMessage({ type: "message", message });
      setMessage(""); // Clear the input after sending the message
    }
  };

  /**
   * Handle form submission for sending a message.
   *
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
      sendJsonMessage({ type: "message", message });
      setMessage("");
    }
  };

  /**
   * Renders the message interface.
   */
  return (
    <>
      <MessageInterfaceChannels />
      {channelId === undefined ? (
        <Box sx={classes.messageInterfaceNoChannelSelectedBox}>
          <Box sx={{textAlign:"center", justifyContent: "center"}}>
          <Typography
              variant="h4"
              fontWeight={700}
              letterSpacing={"-0.5px"}
              sx={{ px: 5, maxWidth: "600px" }}
            >
              Welcome to {serverName} Server
            </Typography>
            <Typography>{serverDescription}</Typography>
          </Box>
        </Box>
      ) : (
        <>
          <Box>
            {newMessages.map((message, index) => (
              <Box key={index} mb={2}>
                <Typography variant="subtitle1">{message.sender}</Typography>
                <Typography variant="body1">{message.content}</Typography>
                <Typography variant="caption">{message.timestamp}</Typography>
              </Box>
            ))}
          </Box>
          <form onSubmit={handleSendMessage}>
            <TextField
              label="Enter Message"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              variant="outlined"
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary">
              Send Message
            </Button>
          </form>
        </>
      )}
    </>
  );
};

export default MessageInterface;
