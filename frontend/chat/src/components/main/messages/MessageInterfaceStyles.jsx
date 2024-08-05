
export const MessageInterfaceStyles = (theme) => ({
  messageInterfaceNoChannelSelectedBox: {
    overflow: "hidden",
    padding: theme.spacing(0),
    height: `calc(80vh - ${theme.primaryAppBar.height}px)`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // Other properties can be added here as needed
  },
  listItemAvatarBox: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  renderMessageList: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  submitBtn: {
    backgroundColor: "#060606",
    width: 150,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
    "&:hover": {
      backgroundColor: "#FF3F00",
    },
  },
  card: {
    maxWidth: 500,
    margin: "auto",
    marginTop: theme.spacing(10),
  },
  msgInterFToolbar: {
    minHeight: theme.primaryAppBar.height,
  },
  channelInterfaceAppBar: {
    backgroundColor: theme.palette.background.default,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  channelInterfaceToolBar: {
    minHeight: theme.primaryAppBar.height,
    height: theme.primaryAppBar.height,
    display: "flex",
    alignItems: "center",
  },
  msgFormBox: {
    position: "sticky",
    bottom: 0,
    width: "102%",
  },
  msgForm: {
    bottom: 0,
    right: 0,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    zIndex: 1,
  },
});
