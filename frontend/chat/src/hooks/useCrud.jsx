import { publicAxios } from "../axiosinterceptors/publicAxios";
import { useState, useCallback } from "react"

export const useCrud = () => {
    const [isLoading, setIsloading] = useState(false);
    const [error, setError] = useState("")
    const [serverData, setServerData] = useState({});

    const fetchData = useCallback(async (apiURL)=> {
        setIsloading(true);
        setError(null);
        try {
            const { data } = publicAxios.get(apiURL);
            return data;
        } catch (error) {
            setError(error.response?.data?.error || "Something went wrong")
            return null;
        } finally {
            setIsloading(false);
        }
    }, []);

    return{
        fetchData,
        isLoading,
        error
    }
    
};