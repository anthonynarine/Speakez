import { useCallback, useReducer } from "react";
import { useNavigate } from "react-router";
import useAuthAxios from "./useAuthAxios";

/**
 * Initial state for the registration form and other related states.
 */
const initialState = {
    formFields: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    },
    isLoading: false, // Indicates whether the registration process is ongoing
    error: "", // Holds any error message returned by the API
};

/**
 * Reducer function to manage the state of the registration form.
 * Handles different actions such as updating form fields, setting loading state, 
 * handling errors, and resetting the form after submission.
 *
 * @param {object} state - The current state of the form.
 * @param {object} action - The action dispatched to update the state.
 * @returns {object} The new state after applying the action.
 */
const formReducer = (state, action) => {
    switch (action.type) {
        case "UPDATE_FIELD":
            // Update the specific form field with the new value
            return {
                ...state,
                formFields: {
                    ...state.formFields,
                    [action.payload.name]: action.payload.value,
                },
            };
        case "SET_LOADING":
            // Set the loading state to indicate the registration process is ongoing
            return {
                ...state,
                isLoading: action.payload,
            };
        case "SET_ERROR":
            // Update the state with the error message returned from the API
            return {
                ...state,
                error: action.payload,
            };
        case "RESET_FORM":
            // Reset the form fields and states to the initial state
            return initialState;
        default:
            // Return the current state if no matching action type is found
            return state;
    }
};

/**
 * Custom hook to handle the registration process.
 * Manages form state, handles form field updates, submits registration data to the API,
 * and handles the navigation and error states.
 *
 * @returns {object} An object containing the form state, loading state, error message,
 * and functions to handle form changes and registration submission.
 */
const useRegister = () => {
    // Use the reducer to manage form state and actions
    const [state, dispatch] = useReducer(formReducer, initialState);

    // useNavigate hook from React Router for navigation
    const navigate = useNavigate();

    // Custom Axios instance with authentication interceptors
    const authAxios = useAuthAxios();

    /**
     * Function to handle form field changes.
     * Dispatches the UPDATE_FIELD action to update the specific form field in the state.
     *
     * @param {object} event - The change event from the input field.
     */
    const handleChange = (event) => {
        const { name, value } = event.target;
        // Dispatch an action to update the specific form field
        dispatch({
            type: "UPDATE_FIELD",
            payload: { name, value },
        });
    };

    /**
     * Function to handle the registration process.
     * Submits the form data to the registration endpoint, handles errors, and navigates the user
     * to the login page upon successful registration.
     */
    const register = useCallback(async () => {
        // Set loading state to true before starting the registration process
        dispatch({ type: "SET_LOADING", payload: true });
        // Clear any previous error messages
        dispatch({ type: "SET_ERROR", payload: "" });

        try {
            // Submit the registration data to the server using authAxios
            await authAxios.post("/register/", {
                first_name: state.formFields.firstName,
                last_name: state.formFields.lastName,
                email: state.formFields.email,
                password: state.formFields.password,
                password_confirm: state.formFields.confirmPassword,
            });

            // Reset the form fields and state after successful registration
            dispatch({ type: "RESET_FORM" });

            // Navigate the user to the login page after successful registration
            navigate("/login");
        } catch (error) {
            // Handle any errors that occur during the registration process
            const errorMessage = error.response?.data?.error || "An error occurred";
            dispatch({ type: "SET_ERROR", payload: errorMessage });
            console.error("Registration error:", error);
        } finally {
            // Set loading state back to false once the registration process is complete
            dispatch({ type: "SET_LOADING", payload: false });
        }
    }, [state.formFields, authAxios, navigate]);

    // Return the form state, loading state, error, and handlers for the consuming component
    return {
        formFields: state.formFields,
        isLoading: state.isLoading,
        error: state.error,
        handleChange,
        register,
    };
};

export default useRegister;
