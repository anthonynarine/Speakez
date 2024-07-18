// src/context/ServerDataContext.js

import { createContext, useContext } from "react";
import { useCrud } from "../hooks/useCrud";

// Create context for server data
// This context will be used to share server data across different components
const ServerDataContext = createContext(undefined);

// Custom hook to easily access server data within components
// This hook will be used by components to access the server data context
export function useServerData() {
  // Retrieve the context value
  const context = useContext(ServerDataContext);

  // Ensure the hook is used within a ServerDataProvider
  // This prevents accessing the context outside of its provider
  if (context === undefined) {
    throw new Error("Component must be wrapped with ServerDataProvider to access it's state and functions");
  }


  return context;
}

// Provider component for server data
// This component fetches the server data and provides it to its children
export function ServerDataProvider({ children }) {
  // Use the useCrud hook to fetch server data from the specified endpoint
  const serverData = useCrud("server/select/");
  console.log("FETCHED DATA", serverData)

  // Provide the server data to the children components via context
  return (
    <ServerDataContext.Provider value={serverData}>
      {children}
    </ServerDataContext.Provider>
  );
}

export default ServerDataProvider;


// The ServerDataProvider component calls the useCrud hook
// with the API URL "server/select/". This initializes the 
// state and functions in the useCrud hook and returns
// them as an object. This object is then provided as the
// value for the ServerDataContext.Provider.
