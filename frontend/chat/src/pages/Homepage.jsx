import { Box, CssBaseline } from "@mui/material";
import  PrimaryAppBar  from "../pages/scaffold/primaryAppBar/PrimaryAppBar"


const Homepage = () => {

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline>
        <PrimaryAppBar></PrimaryAppBar>
      </CssBaseline>
    </Box>
  );
};

export default Homepage;
