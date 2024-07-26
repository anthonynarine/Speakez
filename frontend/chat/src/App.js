import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import ExplorePage from "./pages/ExplorePage";
import ServerPage from "./pages/ServerPage";
import "./theme/main.css";
import { Box } from "@mui/material";
import ToggleColorMode from "./theme/color/ToggleColorMode";


function App() {


  return (
    <ToggleColorMode>
      <Box sx={{ display: "flex" }}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/explore/:categoryName" element={<ExplorePage />} />
          <Route path="/server" element={<ServerPage />} />
        </Routes>
      </Box>
    </ToggleColorMode>
  );
}

export default App;
