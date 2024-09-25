import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, InputAdornment, IconButton } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();  // For redirection after reset
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Handle toggling the visibility of the password
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`https://a-khuhro-abidipro.mdbgo.io/api/reset-password/${token}`, { password });

      // Check if the response message is about using the same password
      if (response.data.message === 'New password cannot be the same as the old password') {
        alert('Password exists, please select another one');
      } else {
        // Redirect to login page after successful password reset
        alert('Password reset successful, please log in with your new password');
        navigate('/');  // Redirect to login page
      }
    } catch (error) {
      console.error(error);
      alert('Error resetting password');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
        padding: '2rem',
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={6} sx={{ padding: '2rem', borderRadius: '10px', backgroundColor: '#1e1e1e' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            {/* Replace with your actual logo */}
            <img src="/logo.png" alt="Logo" style={{ width: '80px', height: '80px' }} />
          </Box>
          <Typography variant="h4" gutterBottom sx={{ color: '#ffffff', textAlign: 'center' }}>
            Reset Password
          </Typography>
          <Typography variant="body2" sx={{ color: '#b0b0b0', textAlign: 'center', mb: 2 }}>
            Enter your new password below to reset it.
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3, input: { color: '#ffffff' } }}
              InputLabelProps={{
                style: { color: '#b0b0b0' },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: '#b0b0b0' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      edge="end"
                      sx={{ color: '#b0b0b0' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                style: {
                  backgroundColor: '#2a2a2a',
                  borderRadius: '5px',
                },
              }}
            />
            <TextField
              label="Confirm New Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mb: 3, input: { color: '#ffffff' } }}
              InputLabelProps={{
                style: { color: '#b0b0b0' },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: '#b0b0b0' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      edge="end"
                      sx={{ color: '#b0b0b0' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                style: {
                  backgroundColor: '#2a2a2a',
                  borderRadius: '5px',
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: '#007bff',
                '&:hover': { backgroundColor: '#0056b3' },
                padding: '0.75rem',
                fontWeight: 'bold',
                borderRadius: '5px',
              }}
              startIcon={<LockResetIcon />}
            >
              Reset Password
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default ResetPassword;
