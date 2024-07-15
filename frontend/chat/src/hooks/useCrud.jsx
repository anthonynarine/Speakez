import { publicAxios } from "../axiosinterceptors/publicAxios";
import { useState, useCallback } from "react"

export const useCrud = () => {
    const [isLoading, setIsloading] = useState(false);
    const [error, setError] = useState("")

    const fetchData = useCallback(async (apiURL)=> {
        setIsloading(true);
        setError(null);
        try {
            const { data } = publicAxios.get(apiURL, {})
            
        } catch (error) {
            
        }
    })


    
    return{
        fetchData
    }
    
}