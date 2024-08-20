// THIS COMPONENT HAS A LOT OF CODE BUT I MAY KEEP IT THIS WAY

import React, { useState } from "react";
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
import useRegister from "../../hooks/useRegister";

const RegisterPage = () => {
  const theme = useTheme(); // Access the theme
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const { formFields, isLoading, error, handleChange, register } = useRegister();

  const handleSubmit = async (event) => {
    event.preventDefault();
    await register();
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  return (
    <Container component="main" maxWidth={false} disableGutters>
      <Grid
        container
        justifyContent="center"
        alignItems="flex-start" // Align items to the top
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1a1a1a, #0d0d0d)',
          padding: theme.spacing(8, 0), // Add top padding instead of margin
          maxWidth: '100vw',
          overflow: 'auto', // Ensure the container can scroll if content overflows
        }}
      >
        <Grid item xs={12} md={12}>
          <Paper
            elevation={15}
            sx={{
              padding: theme.spacing(4),
              borderRadius: theme.shape.borderRadius,
              maxWidth: 500,
              margin: 'auto',
              backgroundColor: 'rgba(34, 34, 34, 0.9)',
              backdropFilter: 'blur(10px)',
              color: '#e0e0e0',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography component="h1" variant="h4" gutterBottom sx={{ color: '#e0e0e0' }}>
                Create an Account
              </Typography>
              <Typography variant="subtitle1" gutterBottom sx={{ color: '#b0b0b0' }}>
                Join us today!
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ mt: 3, width: '100%' }}
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
                    id="firstName"
                    label="First Name"
                    name="firstName"
                    autoComplete="given-name"
                    value={formFields.firstName}
                    onChange={handleChange}
                    error={Boolean(error?.firstName)}
                    helperText={error?.firstName}
                    InputLabelProps={{
                    shrink: formFields.firstName.length > 0,
                    style: { color: formFields.firstName.length > 0 ? '#e0e0e0' : '#b0b0b0' },
                }}
                InputProps={{
                    style: { color: '#e0e0e0' }, // Keep the input text color consistent
                    // Override the focus state as well
                    classes: {
                    input: {
                        color: '#e0e0e0', // Ensure the input color remains consistent
                    },
                    },
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                        borderColor: '#e0e0e0', // Control the border color when focused
                    },
                    },
                }}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={formFields.lastName}
                  onChange={handleChange}
                  error={Boolean(error?.lastName)}
                  helperText={error?.lastName}
                  InputLabelProps={{
                    shrink: formFields.lastName.length > 0,
                    style: { color: formFields.lastName.length > 0 ? '#e0e0e0' : '#b0b0b0' },
                  }}
                  InputProps={{
                    style: { color: '#e0e0e0' },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#e0e0e0',
                      },
                    },
                    color: '#e0e0e0',
                  }}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formFields.email}
                  onChange={handleChange}
                  error={Boolean(error?.email)}
                  helperText={error?.email}
                  InputLabelProps={{
                    shrink: formFields.email.length > 0,
                    style: { color: formFields.email.length > 0 ? '#e0e0e0' : '#b0b0b0' },
                  }}
                  InputProps={{
                    style: { color: '#e0e0e0' },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#e0e0e0',
                      },
                    },
                    color: '#e0e0e0',
                  }}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={passwordVisible ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  value={formFields.password}
                  onChange={handleChange}
                  error={Boolean(error?.password)}
                  helperText={error?.password}
                  InputLabelProps={{
                    shrink: formFields.password.length > 0,
                    style: { color: formFields.password.length > 0 ? '#e0e0e0' : '#b0b0b0' },
                  }}
                  InputProps={{
                    style: { color: '#e0e0e0' },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={togglePasswordVisibility}
                          edge="end"
                          sx={{ color: '#e0e0e0' }}
                        >
                          {passwordVisible ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#e0e0e0',
                      },
                    },
                    color: '#e0e0e0',
                  }}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type={confirmPasswordVisible ? 'text' : 'password'}
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={formFields.confirmPassword}
                  onChange={handleChange}
                  error={Boolean(error?.confirmPassword)}
                  helperText={error?.confirmPassword}
                  InputLabelProps={{
                    shrink: formFields.confirmPassword.length > 0,
                    style: { color: formFields.confirmPassword.length > 0 ? '#e0e0e0' : '#b0b0b0' },
                  }}
                  InputProps={{
                    style: { color: '#e0e0e0' },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={toggleConfirmPasswordVisibility}
                          edge="end"
                          sx={{ color: '#e0e0e0' }}
                        >
                          {confirmPasswordVisible ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#e0e0e0',
                      },
                    },
                    color: '#e0e0e0',
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    marginTop: theme.spacing(3),
                    marginBottom: theme.spacing(2),
                    height: '45px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    textTransform: 'none',
                    boxShadow: theme.shadows[4],
                    background: 'linear-gradient(135deg, #303030, #424242)',
                    color: '#e0e0e0',
                    transition: 'transform 0.3s ease, background-color 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#606060',
                      transform: 'scale(1.05)',
                      color: '#ffffff',
                    },
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Sign Up'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RegisterPage;
