export const registerPageStyles = (theme) => ({
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a1a1a, #0d0d0d)",
      padding: 0,
      maxWidth: "100vw",
    },
    paper: {
      padding: theme.spacing(4),
      borderRadius: theme.shape.borderRadius,
      maxWidth: 500,
      margin: "auto",
      backgroundColor: "rgba(34, 34, 34, 0.9)",
      backdropFilter: "blur(10px)",
      color: "#e0e0e0",
    },
    formContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    title: {
      color: "#e0e0e0",
    },
    subtitle: {
      color: "#b0b0b0",
    },
    textField: {
      "& .MuiOutlinedInput-root": {
        "&.Mui-focused fieldset": {
          borderColor: "#e0e0e0",
        },
      },
      color: "#e0e0e0",
    },
    button: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(2),
      height: "45px",
      borderRadius: "8px",
      fontSize: "16px",
      textTransform: "none",
      boxShadow: theme.shadows[4],
      background: "linear-gradient(135deg, #303030, #424242)",
      color: "#e0e0e0",
      transition: "transform 0.3s ease, background-color 0.3s ease",
      "&:hover": {
        backgroundColor: "#606060",
        transform: "scale(1.05)",
        color: "#ffffff",
      },
    },
    iconButton: {
      color: "#e0e0e0",
    },
    alert: {
      marginBottom: theme.spacing(2),
    },
  });
  