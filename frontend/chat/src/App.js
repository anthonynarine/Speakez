import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import ExplorePage from "./pages/ExplorePage";
import "./theme/main.css";
import { Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { createMuiTheme } from "./theme/theme";


function App() {
  // Create the theme
  const theme = createMuiTheme();

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/explore/:categoryName" element={<ExplorePage />} />
        </Routes>
      </Box>
    </ThemeProvider>
  );
}

export default App;
