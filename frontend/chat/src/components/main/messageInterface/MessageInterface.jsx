import { useState } from "react";
import useWebSocket from "react-use-websocket";
import { useParams } from "react-router";


const MessageInterface = () => {
  const [newMessage, setNewMessage] = useState([]);
  const [message, setMessage] = useState("");
  const { serverId, channelId } = useParams();
  
  const socketURL = channelId ? `ws://localhost:8000/${serverId}/${channelId}`: null

  const { sendJsonMessage } = useWebSocket(socketURL, {
    onOpen: () => {
      console.log("Connected");
    },

    onClose: () => {
      console.log("Closed");
    },

    onError: (error) => {
      console.error("WebSocket error:", error);
    },

    onMessage: (messageEvent) => {
      const data = JSON.parse(messageEvent.data);
      setNewMessage((prevMessages) => [...prevMessages, data.message]);
    },
  });

  return (
    <div>
      {newMessage.map((message, index) => (
        <div key={index}>
          <p>{message}</p>
        </div>
      ))}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendJsonMessage({ type: "message", message });
          setMessage("");
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
