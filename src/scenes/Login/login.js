import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import the Link component
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Container, Avatar, CssBaseline, Paper, CircularProgress } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import desertImage from '../Login/desert.jpg'; // Ensure the correct path

const theme = createTheme();

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const login = localStorage.getItem("login");
        if (login) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleLogin = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true); // Start loading

        try {
            const response = await axios.post('https://a-khuhro-abidipro.mdbgo.io/api/users/login', { email, password });
            console.log("data", response.data)
            localStorage.setItem('userId', response.data.userId);
            localStorage.setItem('email', response.data.email);
            localStorage.setItem("data", JSON.stringify(response.data))

            const name = await axios.get('https://a-khuhro-abidipro.mdbgo.io/api/getName', { params: { email: email } });
            localStorage.setItem('name', JSON.stringify(response.data));
            localStorage.setItem("login", "login");
            // Fetch the logged-in user's data from /getUser
            const getUser = await axios.get('https://a-khuhro-abidipro.mdbgo.io/api/getUser');
            console.log("getUser", getUser)
            const loggedInUser = getUser.data.find(user => user.personalEmail === response.data.email); // Match the logged-in user by email
           localStorage.setItem("loggedInUser" , JSON.stringify(loggedInUser))
            console.log("loggedInUser", loggedInUser)

            navigate('/dashboard');
        } catch (error) {
            if (error.response) {
                setError(error.response.data.error || 'Invalid login credentials');
            } else {
                setError('Something went wrong. Please try again later.');
            }
            setLoading(false); // Stop loading on error
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    height: '100vh',
                    width: '100vw',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundImage: `url(${desertImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <CssBaseline />
                <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
                            <TextField
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
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={loading} // Disable button while loading
                            >
                                {loading ? <CircularProgress size={24} /> : 'Sign In'}
                            </Button>

                            {/* Add Forgot Password Link */}
                            <Typography component="p" sx={{ textAlign: 'center' }}>
                                <Link to="/forgot-password" style={{ textDecoration: 'none', color: 'blue' }}>
                                    Forgot Password?
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </ThemeProvider>
    );
};

export default Login;
