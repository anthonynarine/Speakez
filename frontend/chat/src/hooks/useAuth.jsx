import { useReducer, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useAuthAxios from "./useAuthAxios";

// Define the initial state 
const initialState = {
    isLoading: false,
    user: null,
    isLoggedIn: null, 
    error: "",
};

// Define the reducer function withinthe the hook
function reducer(state, action) {
    switch (action.type) {
        case "SET_LOADING":
            return {...state, isLoading: action.payload };
        case "SET_USER":
            return {...state, user: action.payload, isLoggedIn: true, error: ""};
        case "SET_ERROR":
            return {...state, error: action.payload };
        case "LOGOUT":
            return {...state, user: null, isLoggedIn: false, isLoading: false, error: "" };
        default:
            return state;
    }
};

export const useAuth = () => {

    const [state, dispatch] = useReducer(reducer, initialState);
    const navigate = useNavigate();
    const authAxios = useAuthAxios()

    const login = useCallback(async ({email, password}) => {
        dispatch({ type: "SET_LODING", payload: true});
        try{
            /// Step 1: Log in and obtain tokens using authAxios
            const loginResponse = await authAxios.post("/login/", { email, password });

            // Step 2: Validate the session and fetch user information
            const userInfoResponse = await authAxios.get("/validate-session/")

            // Update the state with the user information
            dispatch({ type: "SET_USER", payload: userInfoResponse.data });
            navigate("/")            
        } catch (error) {
            const errorMessage = error.response?.data?.error || "An error occurred during login.";
            dispatch({ type: "SET_ERROR", payload: errorMessage});
            console.error("Login error:", error)
        } finally {
            dispatch({ type: "SET_LOADING", payload: false });
        }
    }, [navigate]);


    const logout = useCallback(async () => {
        dispatch({ type: "SET_LOADING", payload: true });
        try {
            await authAxios.post("/logout/");
            // authAxios interceptor will remove tokens
            dispatch({ type: "LOGOUT"});
            navigate("/login");
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            dispatch({ type: "SET_LOADING", payload: false });
        }
    }, [navigate])

    return {
        ...state,
        login,
        logout,
    };
};