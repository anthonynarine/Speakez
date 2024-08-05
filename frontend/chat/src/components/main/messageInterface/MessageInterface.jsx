import { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import { useParams } from "react-router-dom";
import useCrud from "../../../hooks/useCrud";

/**
 * MessageInterface component that handles WebSocket connection and displays messages.
 */
const MessageInterface = () => {
  // State for storing messages and the input message
  const [newMessages, setNewMessages] = useState([]);
  const [message, setMessage] = useState("");

  // Extracting serverId and channelId from URL parameters
  const { serverId, channelId } = useParams();

  // Constructing the WebSocket URL
  const socketURL = channelId ? `ws://localhost:8000/${serverId}/${channelId}/` : null;

  // Custom hook for fetching data from the API
  const { fetchData, serverData } = useCrud([], `/messages/?channel_id=${channelId}`);

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
    onClose: () => {
      console.log("WebSocket Closed");
    },
    onError: (error) => {
      console.error("WebSocket error:", error);
    },
    onMessage: (messageEvent) => {
      const data = JSON.parse(messageEvent.data);
      console.log("Message received:", data);
      setNewMessages((prevMessages) => [...prevMessages, data]);
    },
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
   * Renders the message interface.
   */
  return (
    <div>
      {newMessages.map((message, index) => (
        <div key={index}>
          <p>{message.sender}</p>
          <p>{message.content}</p>
          <p>{message.timestamp}</p>
        </div>
      ))}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendJsonMessage({ type: "message", message }); // Send message via WebSocket
          setMessage(""); // Clear the input field
        }}
      >
        <label>
          Enter Message:
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default MessageInterface;
