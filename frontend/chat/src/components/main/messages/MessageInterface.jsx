import { Box, Typography, TextField, useTheme } from "@mui/material";
import { useState, useEffect, useCallback, useRef } from "react";
import useWebSocket from "react-use-websocket";
import { useParams } from "react-router-dom";
import useCrud from "../../../hooks/useCrud";
import { MessageInterfaceStyles } from "./MessageInterfaceStyles";
import { useServerByIdContext } from "../../../context/ServerByIdContext";
import MessageInterfaceChannels from "./MessageInterfaceChannels";
import MessageList from "./MessageList";
import SnackbarManager from "../../snackbar/SnackbarManager"
import handleIncomingMessage from "./Incoming Messages";
import useTokenMonitor from "../../../hooks/useTokenMonitor"
import Cookies from "js-cookie"
import { reconnectWebSocket } from "./WS-Reconnect";
/**
 * MessageInterface component that handles WebSocket connection and displays messages.
 */
const MessageInterface = () => {
  const theme = useTheme();
  const classes = MessageInterfaceStyles(theme);
  // State for storing messages and the input message
  const [newMessages, setNewMessages] = useState([]); // the conversation 
  const [message, setMessage] = useState(""); // new messages to be sent
  const snackbarRef = useRef(); // Refrence to trigger the SnackbarManager
  const { serverId, channelId } = useParams();  // Extracting serverId and channelId from URL parameters

  // Monitoring the token expiration and refreshing it automatically
  useTokenMonitor();

  const token = Cookies.get("access_token");
  
  // Constructing the WebSocket URL (ws is unsecured wss is secured: in PRODUCTION IMPLIMENT WSS)
  const socketURL = channelId ? `ws://localhost:8000/${serverId}/${channelId}/?token=${token}` : null;

  // Custom hook for fetching data from the API
  const { fetchData, serverData } = useCrud([], `/messages/?channel_id=${channelId}`);
  const { serverName, serverDescription } = useServerByIdContext();
  

  /**
   * Function to handle incoming Websocket messages.
   * @param {object} message - The incoming Websocket message.
   */
  const handleMessage = useCallback((message) => {
    handleIncomingMessage(message, setNewMessages); // Call the imported utility function to handle incoming messages
  },[]);

  // WebSocket hook to handle connection and messages
  const { sendJsonMessage } = useWebSocket(socketURL, {
    onOpen: async () => {
      console.log("WebSocket Connected");
      try {
        await fetchData(); // Fetches the conversation when WebSocket opens
        setNewMessages(Array.isArray(serverData) ? serverData : []);
        console.log("Fetched initial messages:", serverData); // Debugging line
      } catch (error) {
        console.log(error);
      }
    },
    onClose: (event) => {
      if (event.code === 4001) {
        console.log("Authentication error: WebSocket connection closed due to unauthenticated user.");
        snackbarRef.current.triggerSnackbar("Authentication failed. Please log in again.")
      } else if (event.code === 1006) {
        console.warn("WebSocket closed abnormally. Attempting to reconnect...");
        const attemptReconnect = reconnectWebSocket(sendJsonMessage, 5, 5000, () => {
          if (snackbarRef.current) {
            snackbarRef.current.triggerSnackbar("Connection lost. Please refresh the page or try again later.");
          }
        });
        attemptReconnect();  // Initiate reconnection attempts.
      } else {
        console.log("WebSocket connection closed with code:", event.code)
        }
      },
    onError: (error) => console.error("WebSocket encountered an error:", error),
    onMessage: handleMessage,  // process Websocket messages with handleMessage func.
  });

  // Effect to update messages whenever serverData changes
  useEffect(() => {
    if (Array.isArray(serverData)) {
      setNewMessages(serverData);
      console.log("Updated messages from serverData:", serverData); // Debugging line
      console.log("Fetched data:", serverData);
    }
  }, [serverData]);

  // Effect to log new messages whenever they update
  useEffect(() => {
    console.log("New messages state updated:", newMessages); // Debugging line
  }, [newMessages]);

  /**
   * Handle key down event for the input field.
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
          {/* Render each received message */}
          <Box sx={{overflow: "hidden", p:0, height:`calc(100vh - 100px)`}}>
            <MessageList messages={newMessages} />
          </Box>
          <Box sx={classes.msgFormBox}>
            <form onSubmit={handleSendMessage} style={classes.msgForm}>
              <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ paddingRight: '10px' }}>
                <TextField
                  fullWidth
                  multiline
                  minRows={1}
                  maxRows={4}
                  sx={{ flexGrow: 1, pr:"10px" }}
                  onKeyDown={handleKeyDown}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </Box>
            </form>
          </Box>
        </>
      )}
      <SnackbarManager ref={snackbarRef} />
    </>
  );
};

export default MessageInterface;
