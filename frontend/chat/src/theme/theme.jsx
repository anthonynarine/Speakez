import { createTheme, responsiveFontSizes } from "@mui/material";

// Function to create and customize the MUI theme
export const createMuiTheme = (mode) => {
    // Create the default theme and customize it
    let theme = createTheme({
        typography: {
            fontFamily: ['"Roboto"', 'sans-serif'].join(","), // Custom font family for the entire application
            body2: {
                fontWeight: 600, // Custom font weight for body2 text
                letterSpacing: "0.5px", // Custom letter spacing for body2 text
            },
        },
        primaryAppBar: {
            height: 50, // Height value for the primary app bar
        },
        primaryDraw: {
            width: 240, // Width value for the primary drawer when open
            closed: 80 // Width value for the primary drawer when closed
        },
        secondaryDraw: {
            width: 240 // Width value for the secondary drawer
        },
        palette: {
            mode, // Theme mode (light or dark)
        },
        components: {
            MuiAppBar: {
                defaultProps: {
                    color: "default", // Default color for the AppBar component
                    elevation: 0, // No shadow for the AppBar component
                },
            },
            MuiTypography: {
                defaultProps: {
                    variantMapping: {
                        h1: 'h1', // Use <h1> tag for h1 variant
                        h2: 'h2', // Use <h2> tag for h2 variant
                        h3: 'h3', // Use <h3> tag for h3 variant
                        h4: 'h4', // Use <h4> tag for h4 variant
                        h5: 'h5', // Use <h5> tag for h5 variant
                        h6: 'h6', // Use <h6> tag for h6 variant
                        subtitle1: 'h2', // Use <h2> tag for subtitle1 variant
                        subtitle2: 'h3', // Use <h3> tag for subtitle2 variant
                        body1: 'span', // Use <span> tag for body1 variant
                        body2: 'span', // Use <span> tag for body2 variant
                    }, // Default HTML element mapping for typography variants
                },
            },
            MuiCssBaseline: {
                styleOverrides: {
                    '*': {
                        scrollbarWidth: 'thin',  // For Firefox
                        scrollbarColor: '#BFBFBF #fff',  // For Firefox
                    },
                    'body': {
                        '&::-webkit-scrollbar': {
                            width: '8px',  // Thin scrollbar
                            height: '8px', // Thin scrollbar for horizontal scroll
                        },
                        '&::-webkit-scrollbar-track': {
                            background: '#FFFFFF',  // Light background for the scrollbar track
                            borderRadius: '10px',  // Rounded corners for the scrollbar track
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#FFFFFF',  // Gray color for the scrollbar thumb
                            borderRadius: '10px',  // Rounded corners for the scrollbar thumb
                            border: '2px solid #FFFFFF',  // Border to add some padding
                            opacity: 0,  // Hide the scrollbar thumb by default
                            transition: 'opacity 0.3s',  // Smooth transition for the scrollbar thumb
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            backgroundColor: '#555',  // Darker gray on hover
                        },
                        '&:hover::-webkit-scrollbar-thumb': {
                            opacity: 1,  // Show the scrollbar thumb on hover
                        },
                    },
                },
            },
        },
    });

    // Apply responsive font sizes to the theme
    theme = responsiveFontSizes(theme);

    // Return the customized theme
    return theme;
}

// Export the "createMuiTheme" function as the default export of this module
export default createMuiTheme;
