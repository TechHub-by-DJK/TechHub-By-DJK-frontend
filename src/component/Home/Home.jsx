import React, { useState, useEffect } from 'react'
import { Grid, Card, CardMedia, CardContent, Typography, Box, Button, Chip, Container, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StoreIcon from '@mui/icons-material/Store';
import ApiService from '../../services/api'
import './Home.css'
import MultiItemCarousal from './MultiItemCarousal'

const Home = () => {
    const navigate = useNavigate();
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [featuredComputers, setFeaturedComputers] = useState([]);

    useEffect(() => {
        fetchShops();
        fetchFeaturedComputers();
    }, []);

    const fetchShops = async () => {
        try {
            const shopsData = await ApiService.getAllShops();
            setShops(shopsData.slice(0, 8)); // Show first 8 shops
        } catch (error) {
            console.error('Failed to fetch shops:', error);
            // Use mock data if API fails
            setShops([
                {
                    id: 1,
                    name: "Sell-X Computers",
                    description: "Gaming and professional computers",
                    buildingtype: "Gaming",
                    images: ["https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400"],
                    address: { city: "Matara" },
                    open: true
                },
                {
                    id: 2,
                    name: "Tech Valley",
                    description: "Business laptops and workstations",
                    buildingtype: "Business",
                    images: ["https://images.unsplash.com/photo-1554774853-719586f82d77?w=400"],
                    address: { city: "Colombo" },
                    open: true
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const fetchFeaturedComputers = async () => {
        try {
            // In a real app, you might have a featured products endpoint
            // For now, we'll use mock data
            setFeaturedComputers([
                {
                    id: 1,
                    name: "Gaming Beast Pro",
                    price: 350000,
                    images: ["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400"],
                    rating: 4.8,
                    brand: "MSI"
                },
                {
                    id: 2,
                    name: "Business Elite",
                    price: 180000,
                    images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"],
                    rating: 4.5,
                    brand: "Dell"
                }
            ]);
        } catch (error) {
            console.error('Failed to fetch featured computers:', error);
        }
    };

    const ShopCard = ({ shop }) => (
        <Card 
            sx={{ 
                height: '100%', 
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'scale(1.02)'
                }
            }}
            onClick={() => navigate(`/shop/${shop.id}`)}
        >
            <CardMedia
                component="img"
                height="200"
                image={shop.images?.[0] || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400"}
                alt={shop.name}
            />
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <StoreIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" component="div">
                        {shop.name}
                    </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {shop.description}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOnIcon sx={{ mr: 0.5, fontSize: 16 }} />
                    <Typography variant="body2">
                        {shop.address?.city || 'Sri Lanka'}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip 
                        label={shop.buildingtype || 'Tech Store'} 
                        size="small" 
                        color="primary"
                        variant="outlined"
                    />
                    <Chip 
                        label={shop.open ? 'Open' : 'Closed'} 
                        size="small" 
                        color={shop.open ? 'success' : 'error'}
                    />
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <div className='pb-10'>
            <section className='banner -z-50 relative flex flex-col justify-center items-center'>
                <div className='w-[50vw] z-10 text-center'>
                    <p className='text-2xl lg:text-6xl font-bold z-10 py-5'>TechHub</p>
                    <p className='z-10 text-gray-300 text-xl lg:text-4xl'>
                        Taste the Convenience: PC Builds, Gaming Laptops, 
                        Customizable Workstations Delivered Fast
                    </p>
                </div>
                <div className='cover absolute top-0 left-0 right-0'></div>
                <div className='fadout'></div>
            </section>

            <section className='p-10 lg:py-10 lg:px-20'>
                <p className='text-2xl font-semibold text-gray-400 py-3 pb-10'>Featured Products</p>
                <MultiItemCarousal computers={featuredComputers} />
            </section>

            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom sx={{ color: 'text.secondary', mb: 4 }}>
                    Order From Our Handpicked Shops
                </Typography>
                
                {loading ? (
                    <Box display="flex" justifyContent="center" p={4}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {shops.map((shop) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={shop.id}>
                                <ShopCard shop={shop} />
                            </Grid>
                        ))}
                    </Grid>
                )}                <Box textAlign="center" mt={4}>
                    <Button 
                        variant="outlined" 
                        size="large"
                        onClick={() => navigate('/shops')}
                    >
                        View All Shops
                    </Button>
                </Box>

                {/* Quick Navigation Section */}
                <Box sx={{ mt: 6, mb: 4 }}>
                    <Typography variant="h4" textAlign="center" sx={{ mb: 3, fontWeight: 'bold' }}>
                        Explore Categories
                    </Typography>
                    <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={12} sm={6} md={3}>
                            <Card 
                                sx={{ 
                                    cursor: 'pointer', 
                                    transition: 'transform 0.3s',
                                    '&:hover': { transform: 'translateY(-8px)' }
                                }}
                                onClick={() => navigate('/search?q=laptop')}
                            >
                                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        💻 Laptops
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Gaming, Business & Personal Laptops
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card 
                                sx={{ 
                                    cursor: 'pointer', 
                                    transition: 'transform 0.3s',
                                    '&:hover': { transform: 'translateY(-8px)' }
                                }}
                                onClick={() => navigate('/search?q=desktop')}
                            >
                                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        🖥️ Desktops
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Custom Builds & Workstations
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card 
                                sx={{ 
                                    cursor: 'pointer', 
                                    transition: 'transform 0.3s',
                                    '&:hover': { transform: 'translateY(-8px)' }
                                }}
                                onClick={() => navigate('/gadgets')}
                            >
                                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        🔧 Tech Gadgets
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Accessories & Components
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card 
                                sx={{ 
                                    cursor: 'pointer', 
                                    transition: 'transform 0.3s',
                                    '&:hover': { transform: 'translateY(-8px)' }
                                }}
                                onClick={() => navigate('/search?q=gaming')}
                            >
                                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        🎮 Gaming
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Gaming PCs & Peripherals
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </div>
    )
}

export default Home