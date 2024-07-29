import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Custom hook to validate the presence of a channel within server data and navigate if invalid.
 *
 * This hook checks if a given "channelId" exists within the "serverData" (server data).
 * If a "channelId" does not exist or is invalid, it navigates the user back to the server page without a specific channel.
 *
 * @param {Array} serverData - Array containing server data. Each server object should have a "channel_server" property which is an array of channels.
 * @param {String} serverId - The ID of the server extracted from the URL parameters.
 * @param {String|null} channelId - The ID of the channel extracted from the URL parameters. This can be null if no specific channel is requested.
 */

const useValidateChannel = (serverData, serverId, channelId) => {
    const navigate = useNavigate();

    useEffect(() => {
        /**
         * Function to check if the channelId is valid.
         *
         * @returns {boolean} - Returns true if the channelId is valid or not provided, otherwise false.
         */
        const isChannel = () => {
            // If no channelId is provided, consider it valid.
            if (!channelId) {
                return true;
            }
            // Iterate over each server and check if any channel in the "channel_server" array
            // has a matching channelId
            return serverData.some(server =>
                server.channel_server.some(channel => channel.id === parseInt(channelId))
            );
        };

        // Navigate to the server page without a specific channel if the channelId is invalid.
        if (!isChannel()) {
            navigate(`/server/${serverId}`);
        }
    }, [serverData, channelId, navigate, serverId]);
};

export default useValidateChannel;
