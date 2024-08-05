import { createContext, useContext } from 'react';

const ServerByIdContext = createContext(undefined);

export const useServerByIdContext = () => {
    const context = useContext(ServerByIdContext);
    // Check against `undefined` to ensure the context is not just 'null' or falsy.
    if (context === undefined) { 
        throw new Error("useServerByIdContext must be used within a ServerByIdProvider");
    }
    return context;
};

export default ServerByIdContext;
