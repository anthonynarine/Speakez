/**
 * Handles incoming Websocket message, parses the data, and updates the newMessages state.
 * @param {object} message - The Websocket messsage received.
 * @param {function} setNewMessages - Funtion to update the newMessage state.
 */

const handleIncomingMessage = (message, setNewMessages) => {
    const msgData = JSON.parse(message.data);
    const newMessage = {
        id: msgData.id,
        sender: msgData.sender,
        content: msgData.content,
        timestamp: msgData.timestamp,
    };

    // Update the newMessages state with the newly parsed message
    setNewMessages((preMessages) => [...preMessages, newMessage]);
};

export default handleIncomingMessage;