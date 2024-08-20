import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  Alert,
  Grid,
  Paper,
  useTheme,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuthServices } from "../../context/AuthContext";

const LoginPage = () => {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const { login, error, } = useAuthServices();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login({email, password});
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

    //   // Manually dispatch the SET_USER action on component mount
    // useEffect(() => {
    //     // Simulating a user login
    //     console.log("Manually dispatching SET_USER");
    //     dispatch({ type: "SET_USER", payload: { id: 1, first_name: 'Test', last_name: 'User' } });
    // }, [dispatch]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <Container component="main" maxWidth={false} disableGutters>
      <Grid
        container
        justifyContent="center"
        alignItems="flex-start" // Align items to the top like in RegisterPage
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #1a1a1a, #0d0d0d)",
          padding: theme.spacing(8, 0), // Ensure consistent padding
          maxWidth: "100vw",
          overflow: "auto", // Ensure scrolling if needed
        }}
      >
        <Grid item xs={12} md={12}>
          <Paper
            elevation={15}
            sx={{
              padding: theme.spacing(4),
              borderRadius: theme.shape.borderRadius,
              maxWidth: 500,
              margin: "auto",
              backgroundColor: "rgba(34, 34, 34, 0.9)",
              backdropFilter: "blur(10px)",
              color: "#e0e0e0",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Typography component="h1" variant="h4" gutterBottom sx={{ color: "#e0e0e0" }}>
                Welcome Back
              </Typography>
              <Typography variant="subtitle1" gutterBottom sx={{ color: "#b0b0b0" }}>
                Please sign in to continue
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ mt: 3, width: "100%" }}
              >
                {error?.general && (
                  <Alert severity="error" sx={{ marginBottom: theme.spacing(2) }}>
                    {error.general}
                  </Alert>
                )}
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={Boolean(error?.email)}
                  helperText={error?.email}
                  InputLabelProps={{
                    shrink: email.length > 0,
                    style: { color: email.length > 0 ? "#e0e0e0" : "#b0b0b0" },
                  }}
                  InputProps={{
                    style: { color: "#e0e0e0" },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "#e0e0e0",
                      },
                    },
                  }}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={Boolean(error?.password)}
                  helperText={error?.password}
                  InputLabelProps={{
                    shrink: password.length > 0,
                    style: { color: password.length > 0 ? "#e0e0e0" : "#b0b0b0" },
                  }}
                  InputProps={{
                    style: { color: "#e0e0e0" },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={togglePasswordVisibility}
                          edge="end"
                          sx={{ color: "#e0e0e0" }}
                        >
                          {passwordVisible ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "#e0e0e0",
                      },
                    },
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
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
                  }}
                >
                  Sign In
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginPage;
