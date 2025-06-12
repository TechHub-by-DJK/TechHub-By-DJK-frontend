import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Button,
    IconButton,
    TextField,
    Divider,
    Chip,
    Alert,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import {
    Add as AddIcon,
    Remove as RemoveIcon,
    Delete as DeleteIcon,
    ShoppingCart as ShoppingCartIcon,
    Payment as PaymentIcon
} from '@mui/icons-material';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cart, loading, updateCartItem, removeFromCart, clearCart, getCartTotal } = useCart();
    const { isAuthenticated } = useAuth();
    const [updating, setUpdating] = useState({});
    const navigate = useNavigate();

    if (!isAuthenticated) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="warning">
                    Please login to view your cart.
                </Alert>
            </Container>
        );
    }

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography>Loading cart...</Typography>
            </Container>
        );
    }

    if (!cart || !cart.item || cart.item.length === 0) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <ShoppingCartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h5" gutterBottom>
                        Your cart is empty
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                        Start shopping to add items to your cart
                    </Typography>
                    <Button variant="contained" onClick={() => navigate('/')}>
                        Continue Shopping
                    </Button>
                </Paper>
            </Container>
        );
    }

    const handleQuantityChange = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;
        
        setUpdating(prev => ({ ...prev, [cartItemId]: true }));
        try {
            await updateCartItem(cartItemId, newQuantity);
        } catch (error) {
            console.error('Failed to update quantity:', error);
        } finally {
            setUpdating(prev => ({ ...prev, [cartItemId]: false }));
        }
    };

    const handleRemoveItem = async (cartItemId) => {
        setUpdating(prev => ({ ...prev, [cartItemId]: true }));
        try {
            await removeFromCart(cartItemId);
        } catch (error) {
            console.error('Failed to remove item:', error);
        } finally {
            setUpdating(prev => ({ ...prev, [cartItemId]: false }));
        }
    };

    const handleClearCart = async () => {
        try {
            await clearCart();
        } catch (error) {
            console.error('Failed to clear cart:', error);
        }
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    const CartItem = ({ item }) => (
        <TableRow>
            <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {item.computer.images && item.computer.images.length > 0 && (
                        <Box
                            component="img"
                            sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
                            src={item.computer.images[0]}
                            alt={item.computer.name}
                        />
                    )}
                    <Box>
                        <Typography variant="h6">{item.computer.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {item.computer.brand} | {item.computer.computerType}
                        </Typography>
                        {item.components && item.components.length > 0 && (
                            <Box sx={{ mt: 1 }}>
                                {item.components.map((component, index) => (
                                    <Chip 
                                        key={index}
                                        label={component}
                                        size="small"
                                        sx={{ mr: 0.5, mb: 0.5 }}
                                    />
                                ))}
                            </Box>
                        )}
                    </Box>
                </Box>
            </TableCell>
            
            <TableCell align="center">
                LKR {item.computer.price.toLocaleString()}
            </TableCell>
            
            <TableCell align="center">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={updating[item.id] || item.quantity <= 1}
                    >
                        <RemoveIcon />
                    </IconButton>
                    
                    <TextField
                        size="small"
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                            const newQuantity = parseInt(e.target.value) || 1;
                            if (newQuantity !== item.quantity) {
                                handleQuantityChange(item.id, newQuantity);
                            }
                        }}
                        inputProps={{ min: 1, style: { textAlign: 'center', width: '60px' } }}
                        disabled={updating[item.id]}
                    />
                    
                    <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={updating[item.id]}
                    >
                        <AddIcon />
                    </IconButton>
                </Box>
            </TableCell>
            
            <TableCell align="center">
                <Typography variant="h6">
                    LKR {(item.totalPrice || item.computer.price * item.quantity).toLocaleString()}
                </Typography>
            </TableCell>
            
            <TableCell align="center">
                <IconButton
                    color="error"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={updating[item.id]}
                >
                    <DeleteIcon />
                </IconButton>
            </TableCell>
        </TableRow>
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Shopping Cart ({cart.item.length} items)
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product</TableCell>
                                    <TableCell align="center">Price</TableCell>
                                    <TableCell align="center">Quantity</TableCell>
                                    <TableCell align="center">Total</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cart.item.map((item) => (
                                    <CartItem key={item.id} item={item} />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <Button variant="outlined" onClick={() => navigate('/')}>
                            Continue Shopping
                        </Button>
                        <Button 
                            variant="outlined" 
                            color="error" 
                            onClick={handleClearCart}
                            disabled={Object.values(updating).some(Boolean)}
                        >
                            Clear Cart
                        </Button>
                    </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Order Summary
                        </Typography>
                        
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography>Subtotal:</Typography>
                                <Typography>LKR {getCartTotal().toLocaleString()}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography>Shipping:</Typography>
                                <Typography>Calculated at checkout</Typography>
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6">Total:</Typography>
                                <Typography variant="h6">
                                    LKR {getCartTotal().toLocaleString()}
                                </Typography>
                            </Box>
                        </Box>

                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            startIcon={<PaymentIcon />}
                            onClick={handleCheckout}
                            disabled={Object.values(updating).some(Boolean)}
                        >
                            Proceed to Checkout
                        </Button>

                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                            Secure checkout with SSL encryption
                        </Typography>
                    </Paper>

                    {/* Shop Information */}
                    {cart.item.length > 0 && cart.item[0].computer.shop && (
                        <Paper sx={{ p: 3, mt: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Shop Information
                            </Typography>
                            <Typography variant="body2">
                                {cart.item[0].computer.shop.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {cart.item[0].computer.shop.address}
                            </Typography>
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default Cart;
