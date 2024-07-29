import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  ListItemButton,
} from "@mui/material";

import { useEffect } from "react";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import { useCrud } from "../../hooks/useCrud";

const MEDIA_URL = process.env.REACT_APP_MEDIA_URL;


const PopularChannels = ({ open }) => {
  const {  error, isLoading, serverData, fetchData } = useCrud([],"server/select/");

  useEffect(() => {
    fetchData();
  }, []);

  // useEffect(() => {
  //   console.log("PopularChannels Data", serverData);
  //   console.log("Media URL", MEDIA_URL)
  // }, [serverData]);

  return (
    <>

      <List sx={{paddingTop: "0"}}>
        {serverData.map((server) => (
          <ListItem
            key={server.id}
            disableGutters
            sx={{ display: "block" }}
            dense={true}
          >
            <Link
              to={`/server/${server.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemButton sx={{ minHeight: 0, justifyContent: "center" }}>
                <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
                  <ListItemAvatar sx={{ minWidth: "50px" }}>
                    <Avatar alt="Server Icon" src={`${MEDIA_URL}${server.icon}`} />
                  </ListItemAvatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        lineHeight: 1.2,
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {server.name}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 400, lineHeight: 1.2, color: "textSecondary" }}
                    >
                      {server.category}
                    </Typography>
                  }
                  sx={{ 
                    opacity: open ? 1 : 0,
                    display: "flex",
                    flexDirection: "column"
                  }}
                  primaryTypographyProps={{
                    sx: {
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    },
                  }}
                />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default PopularChannels;
