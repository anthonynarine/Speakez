import { publicAxios } from "../axiosinterceptors/publicAxios";
import { useState, useCallback, useEffect } from "react"

export const useCrud = (apiURL) => {
    const [isLoading, setIsloading] = useState(false);
    const [error, setError] = useState("")
    const [serverData, setServerData] = useState([]);

    const fetchData = useCallback(async (apiURL)=> {
        setIsloading(true);
        setError(null);
        try {
            const { data } = await publicAxios.get(apiURL);
            setServerData(data);
        } catch (error) {
            setError(error.response?.data?.error || "Something went wrong")
        } finally {
            setIsloading(false);
        }
        
    }, [apiURL]);

    useEffect(() => {
        fetchData(); // Fetch data when the component mounts
    }, [fetchData])

    return{
        fetchData,
        serverData,
        isLoading,
        error
    }
    
};