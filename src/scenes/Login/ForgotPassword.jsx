import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, InputAdornment } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockResetIcon from '@mui/icons-material/LockReset';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://murtaza011-abidipro.mdbgo.io/api/forgot-password', { email });
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert('Error sending reset link');
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
            <img src="Frontend\src\scenes\Login\logo.png" alt="Logo" style={{ width: '80px', height: '80px' }} />
          </Box>
          <Typography variant="h4" gutterBottom sx={{ color: '#ffffff', textAlign: 'center' }}>
            Forgot Password
          </Typography>
          <Typography variant="body2" sx={{ color: '#b0b0b0', textAlign: 'center', mb: 2 }}>
            Enter your email address and we'll send you a link to reset your password.
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 3, input: { color: '#ffffff' } }}
              InputLabelProps={{
                style: { color: '#b0b0b0' },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#b0b0b0' }} />
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
              Send Reset Link
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
