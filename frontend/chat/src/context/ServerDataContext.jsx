// src/context/ServerDataContext.js

import { createContext, useContext, useState, useEffect } from "react";
import { useCrud } from "../hooks/useCrud";

// Create context for server data
const ServerDataContext = createContext(undefined);

// Hook to easily access server data within components
export function useServerData() {
    const context = useContext(ServerDataContext);

    if (context === undefined) {
        throw new Error("userServerData must be used within a ServerDataProvider")
    };

    return context;
};


// Provider Component for server data
export function ServerDataProvider({ children }) {
    const { fetchData, isLoading, error } = useCrud();
    const [serverData, setServerData] = useState([]);
    console.log("ServerDataProvider rendered with", serverData)

    useEffect(() => {
        const getServerData = async () => {
            const data = await fetchData()
        };

        getServerData();
    }, [fetchData]);

    return(
        <ServerDataContext.Provider value={{}}></ServerDataContext.Provider>
    )
}
