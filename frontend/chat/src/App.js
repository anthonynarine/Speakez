import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import ExplorePage from "./pages/ExplorePage";
import ServerPage from "./pages/ServerPage";
import "./theme/main.css";
import { Box } from "@mui/material";
import ToggleColorMode from "./theme/color/ToggleColorMode";
import LoginPage from "./pages/loginpage/LoginPage";
import RegisterPage from "./pages/registerpage/RegisterPage";
import AuthProvider from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";


function App() {
  return (
    <AuthProvider> 
      <ToggleColorMode>
        <Box sx={{ display: "flex" }}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/explore/:categoryName" element={<ExplorePage />} />
            {/* the ? makes it optional without it will expect a property */}
            <Route path="/server/:serverId/:channelId?" element={
              <ProtectedRoute>
                <ServerPage />
              </ProtectedRoute>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </Box>
      </ToggleColorMode>
    </AuthProvider>
  );
}

export default App;
