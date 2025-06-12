import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Typography,
    Box,
    Button,
    Card,
    CardMedia,
    Chip,
    Rating,
    Divider,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    IconButton,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    ShoppingCart as ShoppingCartIcon,
    FavoriteBorder as FavoriteBorderIcon,
    Share as ShareIcon,
    Memory as MemoryIcon,
    Storage as StorageIcon,
    Computer as ComputerIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const ComputerDetail = () => {
    const { computerId } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    
    const [computer, setComputer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);    const fetchComputerDetails = React.useCallback(async () => {
        try {
            setLoading(true);
            // In real app, fetch from API
            // const computerData = await ApiService.getComputerById(computerId);
            
            // Mock data for now
            const mockComputer = {
                id: parseInt(computerId),
                name: "Gaming Beast Pro X1",
                description: "Ultimate gaming laptop with cutting-edge performance for enthusiasts and professionals. Featuring the latest RTX graphics and blazing-fast processing power.",
                price: 450000,
                brand: "MSI",
                cpu: "Intel Core i9-13900HX",
                ram: "32GB DDR5-5600",
                storage: "2TB NVMe SSD",
                gpu: "NVIDIA RTX 4080 12GB",
                operatingSystem: "Windows 11 Pro",
                rating: 4.8,
                stockQuantity: 5,
                computerType: "LAPTOP",
                images: [
                    "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600",
                    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
                    "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=600"
                ],
                isGamer: true,
                isDesigner: true,
                isDeveloper: true,
                available: true,
                shop: {
                    id: 1,
                    name: "Sell-X Computers",
                    location: "Matara"
                },
                includedComponents: [
                    { id: 1, name: "Gaming Keyboard", category: "Accessories" },
                    { id: 2, name: "Gaming Mouse", category: "Accessories" },
                    { id: 3, name: "Laptop Stand", category: "Accessories" }
                ]
            };
            
            setComputer(mockComputer);
        } catch (error) {
            console.error('Failed to fetch computer details:', error);
            setError('Failed to load computer details');
        } finally {
            setLoading(false);
        }
    }, [computerId]);

    useEffect(() => {
        fetchComputerDetails();
    }, [fetchComputerDetails]);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setAddingToCart(true);
        try {
            await addToCart(computer.id, quantity);
            // Show success message or redirect to cart
            navigate('/cart');
        } catch (error) {
            console.error('Failed to add to cart:', error);
            setError('Failed to add to cart');
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Loading computer details...
                </Typography>
            </Container>
        );
    }

    if (error || !computer) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="error">
                    {error || 'Computer not found'}
                </Alert>
                <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>
                    Back to Home
                </Button>
            </Container>
        );
    }

    const specifications = [
        { label: 'Processor', value: computer.cpu, icon: <ComputerIcon /> },
        { label: 'Memory', value: computer.ram, icon: <MemoryIcon /> },
        { label: 'Storage', value: computer.storage, icon: <StorageIcon /> },
        { label: 'Graphics', value: computer.gpu, icon: <ComputerIcon /> },
        { label: 'Operating System', value: computer.operatingSystem, icon: <ComputerIcon /> },
        { label: 'Type', value: computer.computerType, icon: <ComputerIcon /> }
    ];

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={4}>
                {/* Image Gallery */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardMedia
                            component="img"
                            height="400"
                            image={computer.images[selectedImage]}
                            alt={computer.name}
                        />
                    </Card>
                    
                    <Box sx={{ display: 'flex', gap: 1, mt: 2, overflowX: 'auto' }}>
                        {computer.images.map((image, index) => (
                            <Card
                                key={index}
                                sx={{ 
                                    minWidth: 80, 
                                    cursor: 'pointer',
                                    border: selectedImage === index ? 2 : 0,
                                    borderColor: 'primary.main'
                                }}
                                onClick={() => setSelectedImage(index)}
                            >
                                <CardMedia
                                    component="img"
                                    height="60"
                                    image={image}
                                    alt={`${computer.name} ${index + 1}`}
                                />
                            </Card>
                        ))}
                    </Box>
                </Grid>

                {/* Product Details */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                        <Chip label={computer.brand} color="primary" sx={{ mb: 1 }} />
                        <Typography variant="h4" gutterBottom>
                            {computer.name}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Rating value={computer.rating} precision={0.1} readOnly />
                            <Typography variant="body2" sx={{ ml: 1 }}>
                                ({computer.rating} / 5.0)
                            </Typography>
                        </Box>

                        <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
                            LKR {computer.price.toLocaleString()}
                        </Typography>

                        <Typography variant="body1" color="text.secondary" paragraph>
                            {computer.description}
                        </Typography>
                    </Box>

                    {/* Use Cases */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Perfect For:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {computer.isGamer && <Chip label="Gaming" color="success" />}
                            {computer.isDesigner && <Chip label="Design" color="info" />}
                            {computer.isDeveloper && <Chip label="Development" color="warning" />}
                        </Box>
                    </Box>

                    {/* Stock Status */}
                    <Box sx={{ mb: 3 }}>
                        <Typography 
                            variant="body1" 
                            color={computer.stockQuantity > 0 ? 'success.main' : 'error.main'}
                            sx={{ fontWeight: 'bold' }}
                        >
                            {computer.stockQuantity > 0 
                                ? `In Stock (${computer.stockQuantity} available)` 
                                : 'Out of Stock'
                            }
                        </Typography>
                    </Box>

                    {/* Add to Cart */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<ShoppingCartIcon />}
                            onClick={handleAddToCart}
                            disabled={computer.stockQuantity === 0 || addingToCart}
                            sx={{ flex: 1 }}
                        >
                            {addingToCart ? 'Adding...' : 'Add to Cart'}
                        </Button>
                        
                        <IconButton size="large" color="error">
                            <FavoriteBorderIcon />
                        </IconButton>
                        
                        <IconButton size="large">
                            <ShareIcon />
                        </IconButton>
                    </Box>

                    {/* Shop Information */}
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Sold by: {computer.shop.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Location: {computer.shop.location}
                        </Typography>
                        <Button 
                            variant="outlined" 
                            size="small" 
                            sx={{ mt: 1 }}
                            onClick={() => navigate(`/shop/${computer.shop.id}`)}
                        >
                            Visit Shop
                        </Button>
                    </Paper>
                </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Specifications */}
            <Typography variant="h5" gutterBottom>
                Technical Specifications
            </Typography>
            
            <TableContainer component={Paper} sx={{ mb: 4 }}>
                <Table>
                    <TableBody>
                        {specifications.map((spec, index) => (
                            <TableRow key={index}>
                                <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {spec.icon}
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        {spec.label}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body1">
                                        {spec.value}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Included Components */}
            {computer.includedComponents && computer.includedComponents.length > 0 && (
                <>
                    <Typography variant="h5" gutterBottom>
                        Included Accessories
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        {computer.includedComponents.map((component) => (
                            <Grid item key={component.id}>
                                <Chip 
                                    label={component.name} 
                                    variant="outlined"
                                    color="primary"
                                />
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
        </Container>
    );
};

export default ComputerDetail;
