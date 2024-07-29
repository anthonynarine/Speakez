import { useState, useCallback } from "react";
import { publicAxios } from "../axiosinterceptors/publicAxios";

export const useCrud = (initialData, apiURL) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serverData, setServerData] = useState([]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // console.log("Fetching data from API URL in useCrud:", apiURL);
      const { data } = await publicAxios.get(apiURL);
      // console.log("API response data:", data);

      setServerData(data);
    } catch (error) {
      setError(error.response?.data?.error || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [apiURL]);

  return {
    fetchData,
    serverData,
    isLoading,
    error,
  };
};

export default useCrud
