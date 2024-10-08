import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  ListItemButton,
} from "@mui/material";

import { useCrud } from "../../hooks/useCrud";
import { useEffect } from "react";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const MEDIA_URL = process.env.REACT_APP_MEDIA_URL;

function ExploreCategories() {
  // Theme
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const { serverData, error, isLoading, fetchData } = useCrud([], "/server/category/");

  useEffect(() => {
    fetchData();
  }, []);

  //....FOR TESTING
  // useEffect(() => {
  //   console.log("Category", serverData);
  // }, [serverData]);

  return (
    <>
      <Box
        sx={{
          height: "50px",
          display: "flex",
          alignItems: "center",
          px: 2,
          borderBottom: `2px solid ${theme.palette.divider}`,
          positon: "sticky",
          top: 0,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Typography variant="h6" sx={{ color: "#637C5B",  }}>Category</Typography>
      </Box>
      <List sx={{ py: 0 }}>
        {serverData.map((category) => (
          <ListItem
            key={category.id}
            disablePadding
            sx={{ display: "block" }}
            dense={true}
          >
            <Link
              to={`/explore/${category.name}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemButton sx={{ minHeight: 48 }}>
                <ListItemIcon sx={{ minWidth: 0, justifyContent: "" }}>
                  <ListItemAvatar sx={{ minWidth: "0px" }}>
                    <img
                      alt="server Icon"
                      src={`${MEDIA_URL}${category.icon}`}
                      style={{
                        width: "25px",
                        height: "25px",
                        display: "block",
                        margin: "auto",
                        // filter: isDarkMode ? "invert(100%)" : "none",
                      }}
                    />
                  </ListItemAvatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" textAlign="start" paddingLeft={1}>
                      {category.name}
                    </Typography>
                  }
                />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </>
  );
}

export default ExploreCategories;
