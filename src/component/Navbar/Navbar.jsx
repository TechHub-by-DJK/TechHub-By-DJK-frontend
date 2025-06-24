import { Avatar, Badge, Box, IconButton, Menu, MenuItem, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, InputAdornment } from '@mui/material'
import React, { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { pink } from '@mui/material/colors';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import StoreIcon from '@mui/icons-material/Store';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { isShopOwner, isAdmin, isCustomer } from '../../utils/roleUtils';

export const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const { getCartItemCount } = useCart();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleMenuClose();
        navigate('/');
    };    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchOpen(false);
            setSearchQuery('');
        }
    };
      // We're now using the imported role helper functions
    const getMenuItems = () => {
        if (!user) return [];

        const items = [];
        
        // Common items for all users
        items.push({
            label: 'Profile',
            icon: <AccountCircleIcon />,
            onClick: () => {
                navigate('/profile');
                handleMenuClose();
            }
        });        // Use the imported role utility functions
        const userIsShopOwner = isShopOwner(user);
        const userIsAdmin = isAdmin(user);
        const userIsCustomer = isCustomer(user);
          // Show customer-specific options only for regular users
        if (userIsCustomer) {
            items.push({
                label: 'My Orders',
                icon: <ShoppingCartIcon />,
                onClick: () => {
                    navigate('/orders');
                    handleMenuClose();
                }
            });
            
            items.push({
                label: 'Favorites',
                icon: <FavoriteIcon />,
                onClick: () => {
                    navigate('/favorites');
                    handleMenuClose();
                }
            });
        }
          // Shop owner specific options
        if (userIsShopOwner) {
            items.push({
                label: 'Shop Dashboard',
                icon: <StoreIcon />,
                onClick: () => {
                    navigate('/dashboard/shop');
                    handleMenuClose();
                }
            });
            
            items.push({
                label: 'Manage Products',
                icon: <ShoppingCartIcon />,
                onClick: () => {
                    navigate('/dashboard/shop');
                    handleMenuClose();
                }
            });
            
            items.push({
                label: 'Shop Orders',
                icon: <ShoppingCartIcon />,
                onClick: () => {
                    navigate('/dashboard/shop');
                    handleMenuClose();
                }
            });
        }

        if (userIsAdmin) {
            items.push({
                label: 'Admin Dashboard',
                icon: <AdminPanelSettingsIcon />,
                onClick: () => {
                    navigate('/admin-dashboard');
                    handleMenuClose();
                }
            });
        }

        items.push({
            label: 'Logout',
            icon: <LogoutIcon />,
            onClick: handleLogout
        });

        return items;
    };

    return (
        <>
            <Box className='px-5 sticky top-0 z-50 py-[.8rem] bg-[#e91e63] lg:px-20 flex justify-between items-center'>
                
                <div className='lg:mr-10 cursor-pointer flex items-center space-x-4' onClick={() => navigate('/')}>
                    <li className='logo font-semibold text-white text-2xl'>
                        TechHub
                    </li>
                </div>                <div className='flex items-center space-x-2 lg:space-x-10'>
                    <div className=''>
                        <IconButton onClick={() => setSearchOpen(true)} sx={{ color: 'white' }}>
                            <SearchIcon sx={{fontSize:"1.5rem"}}/>
                        </IconButton>
                    </div>
                      {/* Shop Owner Dashboard Button */}
                    {isAuthenticated && isShopOwner(user) && (
                        <Button 
                            startIcon={<StoreIcon />}
                            onClick={() => navigate('/dashboard/shop')}
                            sx={{ 
                                color: 'white',
                                border: '1px solid white',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                }
                            }}
                        >
                            My Shop
                        </Button>
                    )}
                    
                    <div className=''>
                        {isAuthenticated ? (
                            <>
                                <IconButton onClick={handleMenuOpen} sx={{ color: 'white' }}>
                                    <Avatar sx={{bgcolor:"white", color:pink.A400, width: 32, height: 32}}>
                                        {user?.fullName?.charAt(0).toUpperCase() || <PersonIcon />}
                                    </Avatar>
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                    PaperProps={{
                                        sx: { mt: 1, minWidth: 200 }
                                    }}
                                >
                                    <MenuItem disabled>
                                        <Typography variant="body2" color="text.secondary">
                                            {user?.fullName}
                                        </Typography>
                                    </MenuItem>
                                    {getMenuItems().map((item, index) => (
                                        <MenuItem key={index} onClick={item.onClick}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {item.icon}
                                                {item.label}
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </>
                        ) : (
                            <Button 
                                color="inherit" 
                                onClick={() => navigate('/login')}
                                sx={{ color: 'white' }}
                            >
                                Login
                            </Button>
                        )}
                    </div>                    {/* Show cart only for regular customers and guests */}
                    {(!user || (user && isCustomer(user))) && (
                        <div className=''>
                            <IconButton onClick={() => navigate('/cart')} sx={{ color: 'white' }}>
                                <Badge badgeContent={getCartItemCount()} color='primary'>
                                    <ShoppingCartIcon sx={{fontSize:"1.5rem"}}/>
                                </Badge>
                            </IconButton>
                        </div>
                    )}
                </div>
            </Box>

            {/* Search Dialog */}
            <Dialog open={searchOpen} onClose={() => setSearchOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Search Products</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSearch} sx={{ mt: 1 }}>
                        <TextField
                            autoFocus
                            fullWidth
                            placeholder="Search for computers, laptops, accessories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton type="submit" disabled={!searchQuery.trim()}>
                                            <SearchIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
}