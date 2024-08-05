/**
 * Retrieves the channel name from the provided serverData object based on server and channel IDs.
 * If no matching channel is found, "home" is returned as the default.
 *
 * @param {Array} serverData - The data object containing server and channel information.
 * @param {string} serverId - The ID of the server.
 * @param {string} channelId - The ID of the channel.
 * @returns {string} The channel name or "home".
 */
export default function getChannelNameFromData(serverData, serverId, channelId) {
    // Find the server that matches the provided serverId
    const matchingServer = serverData?.find((server) => server.id === Number(serverId));
  
    // Find the channel within the matchingServer that matches the provided channelId
    const matchingChannel =
      matchingServer?.channel_server?.find((channel) => channel.id === Number(channelId));
  
    // Return the channel name or use "home" as a default if no channel is found
    return matchingChannel?.name || "home";
  }
  
  // Example usage:
  const serverData = [
    {
      id: 2,
      channel_server: [
        {
          id: 2,
          name: "Movement Disorders",
          // ... other properties
        },
        // ... other channels
      ],
      // ... other server properties
    },
    // ... other servers
  ];
  
  const serverId = "2";
  const channelId = "2";
  
  const channelName = getChannelNameFromData(serverData, serverId, channelId);
  console.log("Channel Name:", channelName); // Output: "Movement Disorders"
  