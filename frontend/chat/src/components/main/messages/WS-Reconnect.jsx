/**
 * Handles WebSocket reconnection attempts when the connection is lost.
 * It tries to reconnect a specified number of times with a delay between attempts.
 * If the maximum number of reconnection attempts is reached without success, 
 * it can trigger a callback function to notify the user of the failure.
 *
 * @param {function} sendJsonMessage - Function to reinitialize or send a WebSocket message.
 * @param {number} [maxAttempts=5] - The maximum number of reconnection attempts. Defaults to 5.
 * @param {number} [delay=5000] - Delay (in milliseconds) between reconnection attempts. Defaults to 5000ms (5 seconds).
 * @param {function} onFailure - Callback function that is called when reconnection fails.
 * 
 * @returns {function} attemptReconnect - Function to initiate reconnection attempts.
 */
const reconnectWebSocket = (sendJsonMessage, maxAttempts = 5, delay = 5000, onFailure) => {
    let attempts = 0; // Counter to track the number of reconnection attempts
  
    /**
     * Initiates a reconnection attempt. It will retry the connection a number of times 
     * defined by the `maxAttempts` parameter. If the maximum attempts are reached, 
     * it will call the onFailure callback.
     */
    const attemptReconnect = () => {
      if (attempts < maxAttempts) {
        // If we haven't reached the max attempts, try reconnecting
        console.log(`Reconnection attempt ${attempts + 1}/${maxAttempts}`);
        attempts += 1;
        setTimeout(() => {
          // Attempt to reinitialize WebSocket connection after the delay
          sendJsonMessage();
        }, delay);
      } else {
        // Max reconnection attempts reached, trigger the failure callback
        console.error("Max reconnection attempts reached. Connection failed.");
        if (onFailure) {
          onFailure(); // Notify the parent component about the failure
        }
      }
    };
  
    return attemptReconnect; // Return the function to control reconnection attempts
  };
  
  export { reconnectWebSocket };
  