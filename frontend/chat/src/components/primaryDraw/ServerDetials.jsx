// Material-UI imports
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  ListItemButton,
} from "@mui/material";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import { useServerByIdContext } from "../../context/ServerByIdContext";
import PropTypes from 'prop-types'; 

const MEDIA_URL = process.env.REACT_APP_MEDIA_URL;

/**
 * ServerDetails component
 *
 * This component displays details for the servers.
 * It takes server data, loading, and error states from context and renders the server details accordingly.
 *
 * @component
 * @param {boolean} open - Boolean indicating whether the drawer is open.
 * @returns {JSX.Element} The ServerDetails component
 */
const ServerDetails = ({ open }) => {
  const { serverData, isLoading, error } = useServerByIdContext();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <List>
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
            <ListItemButton sx={{ minHeight: 0, justifyContent: "center" }} disableGutters> 
              <ListItemIcon sx={{ minHeight: 0, justifyContent: "center" }}>
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
                  flexDirection: "column",
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
  );
};

ServerDetails.propTypes = { 
  open: PropTypes.bool.isRequired,
};

export default ServerDetails;
