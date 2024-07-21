import React, { useEffect } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  ListItemAvatar,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Container,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useCrud } from "../../hooks/useCrud";

const MEDIA_URL = process.env.REACT_APP_MEDIA_URL;

function ExploreServers() {
  const { categoryName } = useParams();
  const url = categoryName
    ? `/server/select/?category=${categoryName}`
    : "/server/select";
  const { serverData, fetchData } = useCrud(url);

  useEffect(() => {
    fetchData();
  }, [categoryName]); // triggers a refresh if category name changes

  return (
    <div>
      <Container maxWidth="lg">
        <Box sx={{ pt: 6 }}>
          <Typography
            variant="h3"
            noWrap
            component="h1"
            sx={{
              display: {
                sm: "block",
                fontWeight: 700,
                letterSpacing: "-2px",
                textTransform: "capitalize",
              },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            {categoryName ? categoryName : "Popular Channels"}
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="h6"
            noWrap
            component="h2"
            color="textSecondary"
            sx={{
              display: {
                sm: "block",
                fontWeight: 700,
                letterSpacing: "-1px",
              },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            {categoryName
              ? `Channels talking about ${categoryName}`
              : "Check out some of our popular channels"}
          </Typography>
        </Box>
        <Typography
          variant="h6"
          sx={{ pt: 6, pb: 1, fontWeight: 700, letterSpacing: "-1px" }}
        >
          Recommended Channels
        </Typography>
        <Grid container spacing={{ xs: 0, sm: 2 }}>
          {serverData.map((server) => {
            return (
              <Grid item key={server.id} xs={12} sm={6} md={4} lg={3}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "none",
                    backgroundImage: "none",
                    borderRadius: 0,
                  }}
                >
                  <Link
                    to={`/server/${server.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <CardMedia
                      component="img"
                      image={
                        server.banner_img
                          ? `${MEDIA_URL}${server.banner_img}`
                          : "http://source.unsplash.com/random/"
                      }
                      alt="random"
                      sx={{ display: { xs: "none", sm: "block" },  width: '100%', height: 150, objectFit: 'cover' }}
                    />
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        p: 0,
                        "&:last-child": { paddingBottom: 0 },
                      }}
                    >
                      <List>
                        <ListItem disablePadding>
                          <ListItemIcon sx={{ minWidth: 0 }}>
                            <ListItemAvatar sx={{ minWidth: "50px" }}>
                              <Avatar
                                alt="server Icon"
                                src={`${MEDIA_URL}${server.icon}`}
                              ></Avatar>
                            </ListItemAvatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography
                                variant="body2"
                                textAlign="start"
                                sx={{
                                  textOverflow: "ellipsis",
                                  overflow: "hidden",
                                  whiteSpace: "nowrap",
                                  fontWeight: 700,
                                }}
                              >
                                {server.name}
                              </Typography>
                            }
                            secondary={
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 500,
                                  lineHeight: 1.2,
                                  color: "textSecondary",
                                }}
                              >
                                {server.category}
                              </Typography>
                            }
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                            }}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Link>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </div>
  );
}

export default ExploreServers;
