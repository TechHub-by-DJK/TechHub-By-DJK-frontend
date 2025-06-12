import React, { useState } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    Link,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        role: 'ROLE_CUSTOMER'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let result;
            if (isLogin) {
                result = await login({
                    email: formData.email,
                    password: formData.password
                });
            } else {
                result = await register({
                    email: formData.email,
                    password: formData.password,
                    fullName: formData.fullName,
                    role: formData.role
                });
            }

            if (result.success) {
                // Redirect based on user role
                if (result.role === 'ROLE_ADMIN') {
                    navigate('/admin');
                } else if (result.role === 'ROLE_SHOP_OWNER') {
                    navigate('/shop-admin');
                } else {
                    navigate('/');
                }
            } else {
                setError(result.error || `${isLogin ? 'Login' : 'Registration'} failed`);
            }
        } catch (error) {
            setError(error.message || `${isLogin ? 'Login' : 'Registration'} failed`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="sm">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
                    <Typography component="h1" variant="h4" align="center" gutterBottom>
                        TechHub
                    </Typography>
                    <Typography component="h2" variant="h5" align="center" gutterBottom>
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        {!isLogin && (
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="fullName"
                                label="Full Name"
                                name="fullName"
                                autoComplete="name"
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                        )}
                        
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
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
                            value={formData.password}
                            onChange={handleChange}
                        />

                        {!isLogin && (
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="role-label">Account Type</InputLabel>
                                <Select
                                    labelId="role-label"
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    label="Account Type"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="ROLE_CUSTOMER">Customer</MenuItem>
                                    <MenuItem value="ROLE_SHOP_OWNER">Shop Owner</MenuItem>
                                </Select>
                            </FormControl>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
                        </Button>

                        <Divider sx={{ my: 2 }} />

                        <Box textAlign="center">
                            <Link
                                component="button"
                                variant="body2"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsLogin(!isLogin);
                                    setError('');
                                    setFormData({
                                        email: '',
                                        password: '',
                                        fullName: '',
                                        role: 'ROLE_CUSTOMER'
                                    });
                                }}
                            >
                                {isLogin 
                                    ? "Don't have an account? Sign Up" 
                                    : "Already have an account? Sign In"
                                }
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login;
