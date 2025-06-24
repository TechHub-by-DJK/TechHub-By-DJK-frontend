import React, { useState, useEffect } from 'react';
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
    MenuItem,
    Grid,
    Tab,
    Tabs,
    IconButton,
    InputAdornment,
    Stepper,
    Step,
    StepLabel,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import {
    Person as PersonIcon,
    Lock as LockIcon,
    Email as EmailIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Store as StoreIcon,
    AccountCircle as AccountIcon,
    ShoppingBag as CustomerIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [activeTab, setActiveTab] = useState(0); // 0: Login, 1: Register
    const [registerStep, setRegisterStep] = useState(0);
    const [shopDetails, setShopDetails] = useState({
        name: '',
        description: '',
        address: {
            streetAddress: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'Sri Lanka'
        },
        phoneNumber: '',
        businessRegistrationNumber: '',
        category: 'ELECTRONICS'
    });
    
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        role: 'ROLE_CUSTOMER',
        acceptTerms: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    
    // Detect if user was redirected here from a protected route
    useEffect(() => {
        if (location.state?.from) {
            setError('Please log in to access that page');
        }
    }, [location]);

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
        setError('');
    };
    
    const handleShopDetailsChange = (e) => {
        const { name, value } = e.target;
        
        // Handle nested address fields
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setShopDetails({
                ...shopDetails,
                address: {
                    ...shopDetails.address,
                    [addressField]: value
                }
            });
        } else {
            setShopDetails({
                ...shopDetails,
                [name]: value
            });
        }
    };
    
    const handleNextStep = () => {
        // Basic validation before moving to next step
        if (registerStep === 0) {
            if (!formData.email || !formData.password || !formData.confirmPassword || !formData.fullName) {
                setError('Please fill in all required fields');
                return;
            }
            
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                return;
            }
        }
        
        // If user is a shop owner and on the first step, show shop details form
        if (formData.role === 'ROLE_SHOP_OWNER' && registerStep === 0) {
            setRegisterStep(1);
        } else {
            // Otherwise, submit the form
            handleSubmit();
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        
        setLoading(true);
        setError('');
        
        // Validation
        if (!isLogin && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }
        
        if (!isLogin && !formData.acceptTerms) {
            setError('You must accept the Terms and Conditions');
            setLoading(false);
            return;
        }

        try {
            let result;
            if (isLogin) {
                result = await login({
                    email: formData.email,
                    password: formData.password
                });
            } else {
                // For shop owners, include shop details
                const registrationData = {
                    email: formData.email,
                    password: formData.password,
                    fullName: formData.fullName,
                    role: formData.role
                };
                
                if (formData.role === 'ROLE_SHOP_OWNER') {
                    registrationData.shop = shopDetails;
                }
                
                result = await register(registrationData);
            }            if (result.success) {
                // Redirect based on user role
                // Check string roles and numeric values
                if (result.role === 'ADMIN' || result.role === 2) {
                    navigate('/admin-dashboard');
                } else if (result.role === 'SHOP_OWNER' || result.role === 1) {
                    console.log('Login: Redirecting shop owner to dashboard');
                    navigate('/dashboard/shop');
                } else {
                    navigate(from);
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
                    marginBottom: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper 
                    elevation={3} 
                    sx={{ 
                        padding: 4, 
                        width: '100%',
                        borderRadius: 2,
                        background: theme => theme.palette.mode === 'dark' 
                            ? 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)' 
                            : 'white'
                    }}
                >
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        mb: 3
                    }}>
                        <StoreIcon sx={{ color: 'primary.main', fontSize: 40, mr: 1 }} />
                        <Typography 
                            component="h1" 
                            variant="h4" 
                            sx={{
                                background: 'linear-gradient(45deg, #e91e63 30%, #f48fb1 90%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: 'bold'
                            }}
                        >
                            TechHub
                        </Typography>
                    </Box>
                    
                    <Tabs 
                        value={activeTab} 
                        onChange={(_, newValue) => {
                            setActiveTab(newValue);
                            setIsLogin(newValue === 0);
                            setError('');
                            setRegisterStep(0);
                        }} 
                        centered
                        sx={{ mb: 3 }}
                    >
                        <Tab 
                            label="Sign In" 
                            icon={<AccountIcon />} 
                            iconPosition="start"
                        />
                        <Tab 
                            label="Create Account" 
                            icon={<PersonIcon />} 
                            iconPosition="start"
                        />
                    </Tabs>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={(e) => {
                        e.preventDefault();
                        if (isLogin || registerStep > 0) {
                            handleSubmit();
                        } else {
                            handleNextStep();
                        }
                    }} sx={{ mt: 1 }}>
                        {/* Login Form */}
                        {isLogin && (
                            <>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    value={formData.email}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={loading}
                                    sx={{ mt: 3, mb: 2, py: 1.2 }}
                                >
                                    {loading ? 'Signing in...' : 'Sign In'}
                                </Button>
                            </>
                        )}
                        
                        {/* Registration Form - Step 1: Basic Info */}
                        {!isLogin && registerStep === 0 && (
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="fullName"
                                            label="Full Name"
                                            name="fullName"
                                            autoComplete="name"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PersonIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="email"
                                            label="Email Address"
                                            name="email"
                                            autoComplete="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <EmailIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="password"
                                            label="Password"
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            autoComplete="new-password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            edge="end"
                                                        >
                                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="confirmPassword"
                                            label="Confirm Password"
                                            type={showPassword ? 'text' : 'password'}
                                            id="confirmPassword"
                                            autoComplete="new-password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <InputLabel id="role-select-label">I want to join as</InputLabel>
                                            <Select
                                                labelId="role-select-label"
                                                id="role-select"
                                                name="role"
                                                value={formData.role}
                                                label="I want to join as"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value="ROLE_CUSTOMER">
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <CustomerIcon sx={{ mr: 1 }} />
                                                        Customer
                                                    </Box>
                                                </MenuItem>
                                                <MenuItem value="ROLE_SHOP_OWNER">
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <StoreIcon sx={{ mr: 1 }} />
                                                        Shop Owner
                                                    </Box>
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox 
                                                    name="acceptTerms" 
                                                    checked={formData.acceptTerms}
                                                    onChange={handleChange}
                                                    color="primary"
                                                />
                                            }
                                            label="I accept the Terms and Conditions"
                                        />
                                    </Grid>
                                </Grid>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={loading}
                                    sx={{ mt: 3, mb: 2, py: 1.2 }}
                                >
                                    {formData.role === 'ROLE_SHOP_OWNER' ? 'Next - Shop Details' : 'Create Account'}
                                </Button>
                            </>
                        )}
                        
                        {/* Registration Form - Step 2: Shop Details */}
                        {!isLogin && registerStep === 1 && (
                            <>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Shop Details
                                </Typography>
                                
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="name"
                                            label="Shop Name"
                                            value={shopDetails.name}
                                            onChange={handleShopDetailsChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="description"
                                            label="Shop Description"
                                            multiline
                                            rows={3}
                                            value={shopDetails.description}
                                            onChange={handleShopDetailsChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <InputLabel>Shop Category</InputLabel>
                                            <Select
                                                name="category"
                                                value={shopDetails.category}
                                                label="Shop Category"
                                                onChange={handleShopDetailsChange}
                                            >
                                                <MenuItem value="ELECTRONICS">Electronics</MenuItem>
                                                <MenuItem value="COMPUTERS">Computers</MenuItem>
                                                <MenuItem value="PERIPHERALS">Peripherals</MenuItem>
                                                <MenuItem value="ACCESSORIES">Accessories</MenuItem>
                                                <MenuItem value="NETWORKING">Networking</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="businessRegistrationNumber"
                                            label="Business Registration Number"
                                            value={shopDetails.businessRegistrationNumber}
                                            onChange={handleShopDetailsChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="phoneNumber"
                                            label="Phone Number"
                                            value={shopDetails.phoneNumber}
                                            onChange={handleShopDetailsChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                            Shop Address
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="address.streetAddress"
                                            label="Street Address"
                                            value={shopDetails.address.streetAddress}
                                            onChange={handleShopDetailsChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="address.city"
                                            label="City"
                                            value={shopDetails.address.city}
                                            onChange={handleShopDetailsChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="address.state"
                                            label="State/Province"
                                            value={shopDetails.address.state}
                                            onChange={handleShopDetailsChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="address.zipCode"
                                            label="Postal/ZIP Code"
                                            value={shopDetails.address.zipCode}
                                            onChange={handleShopDetailsChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="address.country"
                                            label="Country"
                                            value={shopDetails.address.country}
                                            onChange={handleShopDetailsChange}
                                        />
                                    </Grid>
                                </Grid>
                                
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, mb: 2 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => setRegisterStep(0)}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={loading}
                                    >
                                        {loading ? 'Creating Account...' : 'Create Shop & Account'}
                                    </Button>
                                </Box>
                            </>
                        )}
                        
                        <Divider sx={{ my: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}
                            </Typography>
                        </Divider>
                        
                        <Box sx={{ textAlign: 'center' }}>
                            <Button
                                variant="text"
                                color="primary"
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setActiveTab(isLogin ? 1 : 0);
                                    setRegisterStep(0);
                                }}
                            >
                                {isLogin ? 'Create a new account' : 'Sign in with existing account'}
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login;
