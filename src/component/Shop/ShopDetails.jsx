import { 
    Divider, 
    FormControl, 
    Grid, 
    Radio, 
    RadioGroup, 
    Typography, 
    FormControlLabel, 
    Chip, 
    Button, 
    Card, 
    CardMedia, 
    CardContent, 
    CardActions, 
    Box, 
    Rating, 
    IconButton, 
    Pagination
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
    LocationOn as LocationOnIcon,
    CalendarMonth as CalendarMonthIcon,
    ShoppingCart as ShoppingCartIcon,
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    FilterList as FilterListIcon
} from '@mui/icons-material';
import apiService from '../../services/api';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const category=[
    "Laptop",
    "Gaming Laptop", 
    "Gaming Build",
    "Desktop",
    "Desktop Build",
]

const brands=[
    "Dell",
    "HP", 
    "Lenovo",
    "Acer",
    "Asus",
    "Apple",
    "MSI",
    "Razer",    
    "Gigabyte",
    "Alienware",
    "Samsung"
]

const userTypes = [
    { key: 'gamer', label: 'Gaming' },
    { key: 'designer', label: 'Design & Creative' },
    { key: 'developer', label: 'Development' },
    { key: 'homeUser', label: 'Home & Personal' },
    { key: 'businessUser', label: 'Business' },
    { key: 'seasonal', label: 'Limited Edition' }
]

export const ShopDetails = () => {
    const { shopId } = useParams();    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedUserType, setSelectedUserType] = useState('');
    const [computers, setComputers] = useState([]);
    const [techGadgets, setTechGadgets] = useState([]);
    const [shop, setShop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // For error handling
    // Pagination state
    const [page, setPage] = useState(1);
    const [favorites, setFavorites] = useState(new Set());    // For pagination
    const [, setTotalPages] = useState(1);
      const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    
    // Mock computer data for development
    const mockComputers = React.useMemo(() => [
        {
            id: 1,
            name: "Gaming Beast Pro",
            description: "Professional laptop for business use",
            price: 180000,
            brand: "Dell",
            cpu: "Intel i7-12700H",
            ram: "16GB DDR4",
            storage: "512GB SSD",
            gpu: "Integrated",
            rating: 4.5,
            stockQuantity: 12,
            images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"],
            computerType: "LAPTOP",
            isBusinessUser: true,
            isHomeUser: true,
            available: true
        },
        {
            id: 3,
            name: "Creator Workstation",
            description: "Powerful desktop for content creation",
            price: 420000,
            brand: "Asus",
            cpu: "AMD Ryzen 9 7900X",
            ram: "64GB DDR5",
            storage: "2TB NVMe SSD",
            gpu: "RTX 4090",
            rating: 4.9,
            stockQuantity: 3,
            images: ["https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=400"],
            computerType: "PC",
            isDesigner: true,
            isDeveloper: true,
            available: true
        }
    ], []);    useEffect(() => {
        // Track if component is still mounted to prevent state updates after unmount
        let isMounted = true;
        
        const loadShopData = async () => {
            if (!isMounted) return;
            
            try {
                setLoading(true);
                setError(null);
                
                // Fetch shop details
                try {
                    const shopResponse = await apiService.getShopById(shopId);
                    
                    // Validate shop data and only update state if component is still mounted
                    if (isMounted && shopResponse && typeof shopResponse === 'object') {
                        setShop(shopResponse);
                    } else if (isMounted) {
                        console.warn('Invalid shop data returned:', shopResponse);
                        setError('Shop data is in an invalid format. Using default values.');
                    }
                } catch (shopErr) {
                    if (isMounted) {
                        console.error('Error fetching shop details:', shopErr);
                        setError('Could not load shop details. Using default values.');
                    }
                }
                
                // Fetch computers - now with proper filter support               
                try {
                    // Include all current filters in the API call
                    const filters = {};
                    
                    if (selectedUserType) {
                        const userTypeKey = userTypes.find(ut => ut.label === selectedUserType)?.key;
                        if (userTypeKey) {
                            filters[userTypeKey] = true;
                        }
                    }
                    
                    if (selectedCategory) {
                        filters.computer_category = selectedCategory;
                    }
                    
                    // Don't apply brand filter to API call, we'll do that client-side
                    // as the backend may not support it
                    
                    const computersData = await apiService.getShopComputers(shopId, filters);
                    
                    if (!isMounted) return;
                    
                    // Validate computers data
                    let computersToSet = [];
                    
                    if (Array.isArray(computersData)) {
                        computersToSet = computersData;
                    } else if (computersData && computersData.data && Array.isArray(computersData.data)) {
                        computersToSet = computersData.data;
                    } else {
                        console.warn('Invalid computers data format:', computersData);
                        computersToSet = Array.isArray(mockComputers) ? mockComputers : [];
                    }
                    
                    // Apply brand filter client-side if needed
                    if (selectedBrand && selectedBrand.trim() !== '') {
                        computersToSet = computersToSet.filter(comp => 
                            comp && typeof comp.brand === 'string' && 
                            comp.brand.toLowerCase() === selectedBrand.toLowerCase()
                        );
                    }
                    
                    // Only update state if this is still the most recent request
                    if (isMounted) {
                        // Set computers only once when data is loaded using functional update
                        // to avoid dependency on the previous state
                        setComputers(() => computersToSet);
                        
                        // Update total pages based on the computers we just loaded
                        if (Array.isArray(computersToSet)) {
                            setTotalPages(Math.ceil(computersToSet.length / 12));
                        }
                    }
                } catch (computerErr) {
                    if (!isMounted) return;
                    
                    console.warn('Could not fetch computers, using mock data:', computerErr);
                    
                    // Use mock data as fallback if API fails
                    // Apply all filters to mock data
                    const filteredMockData = filterMockComputers();
                    
                    setComputers(() => filteredMockData);
                    setTotalPages(Math.ceil(filteredMockData.length / 12));
                }

                // Fetch tech gadgets
                try {
                    const gadgetsData = await apiService.getTechGadgetsByShop(shopId);
                    
                    if (!isMounted) return;
                    
                    // Validate gadgets data
                    if (Array.isArray(gadgetsData)) {
                        setTechGadgets(gadgetsData);
                    } else if (gadgetsData && gadgetsData.data && Array.isArray(gadgetsData.data)) {
                        setTechGadgets(gadgetsData.data);
                    } else {
                        console.warn('Invalid tech gadgets data format:', gadgetsData);
                        setTechGadgets([]);
                    }
                } catch (gadgetsErr) {
                    if (!isMounted) return;
                    
                    console.warn('Could not fetch tech gadgets:', gadgetsErr);
                    setTechGadgets([]);
                }            
            } catch (err) {
                if (!isMounted) return;
                
                console.error('Error loading shop data:', err);
                setError('Failed to load shop data. Please try again later.');
            } finally {
                if (!isMounted) return;
                
                // Don't access computers state directly in finally block to avoid infinite loops
                setLoading(false);
            }
        };
        
        loadShopData();
        
        // Cleanup function to prevent state updates after unmount
        return () => {
            isMounted = false;
        };
    // Include filter changes in the dependency array to reload data when they change
    // This replaces our separate filter effect for a more integrated approach
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shopId, selectedCategory, selectedUserType, selectedBrand, mockComputers]);
    
    // Placeholder for shop data while loading
    const shopData = shop || {
        id: shopId,
        name: "Loading...",
        location: "",
        description: "Loading shop details...",
        address: "",        hours: "",
        images: [],
        logo: ""
    };    // We're using direct arrays for rendering rather than pagination slices    // This function is only used for client-side filtering of mock data
    // when we can't connect to the API
    const filterMockComputers = React.useCallback(() => {
        if (!Array.isArray(mockComputers) || mockComputers.length === 0) return [];
        
        return mockComputers.filter(computer => {
            // Skip invalid computer objects
            if (!computer || typeof computer !== 'object') return false;
            
            // Filter by brand
            if (selectedBrand && typeof computer.brand === 'string' && computer.brand !== selectedBrand) return false;
            
            // Filter by user type
            if (selectedUserType) {
                const userTypeKey = userTypes.find(ut => ut.label === selectedUserType)?.key;
                const userTypeProperty = userTypeKey ? `is${userTypeKey.charAt(0).toUpperCase() + userTypeKey.slice(1)}` : '';
                
                // Check if the computer has the expected user type property set to true
                if (userTypeKey && typeof computer[userTypeProperty] !== 'boolean') {
                    return false;
                } else if (userTypeKey && !computer[userTypeProperty]) {
                    return false;
                }
            }
            
            // Filter by category type
            if (selectedCategory && typeof computer.computerType === 'string' && computer.computerType !== selectedCategory) {
                return false;
            }
            
            return true;
        });
    }, [selectedBrand, selectedUserType, selectedCategory, mockComputers]);// Apply client-side filtering when filters change
    useEffect(() => {
        // Skip filtering if we're still loading
        if (loading) {
            return;
        }

        // Detect if we're using mock data by comparing with our mock data source
        const existingComputerIds = Array.isArray(computers) ? computers.map(c => c.id) : [];
        const mockComputerIds = Array.isArray(mockComputers) ? mockComputers.map(c => c.id) : [];
        
        // Simple check for overlap between existing computers and mock data
        const usingMockData = existingComputerIds.some(id => mockComputerIds.includes(id));
        
        // Only apply client-side filtering for mock data
        // API data would be filtered by the backend
        if (usingMockData && Array.isArray(mockComputers) && mockComputers.length > 0) {
            // Filter the mock computers when filters change
            const filtered = filterMockComputers();
            
            // Use functional update to avoid dependency on `computers` state
            setComputers(() => {
                setTotalPages(Math.ceil(filtered.length / 12));
                return filtered;
            });
        }
    // We specifically exclude 'computers' from dependencies to break the infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBrand, selectedCategory, selectedUserType, filterMockComputers, loading, mockComputers]);
    const handleAddToCart = async (product) => {
        try {
            // Check if product is valid
            if (!product || typeof product !== 'object' || !product.id) {
                console.error('Invalid product object:', product);
                alert('Cannot add invalid item to cart.');
                return;
            }

            if (!isAuthenticated) {
                // Redirect to login with return URL
                window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
                return;
            }

            // Determine if we're using mock data
            const isMockData = mockComputers.some(mock => mock.id === product.id);
            
            if (isMockData) {
                // For mock data, just update the local cart context
                if (addToCart) {
                    addToCart(product.id, 1);
                    alert(`${typeof product.name === 'string' ? product.name : 'Item'} added to cart!`);
                } else {
                    alert('Cart functionality is not available in demo mode.');
                }
                return;
            }

            // For real API data, proceed with API call
            // Determine product type
            const productType = product.computerType ? 'computer' : 'techgadget';
            const cartItem = {
                productId: product.id,
                productType: productType.toUpperCase(),
                quantity: 1
            };
            
            try {
                await apiService.addToCart(cartItem);
                
                // Update cart context
                if (addToCart) {
                    addToCart(product.id, 1);
                }
                
                // Show success message
                alert(`${typeof product.name === 'string' ? product.name : 'Item'} added to cart!`);
            } catch (apiError) {
                console.error('API error when adding to cart:', apiError);
                
                // Fallback to client-side cart update if API fails
                if (addToCart) {
                    addToCart(product.id, 1);
                    alert(`${typeof product.name === 'string' ? product.name : 'Item'} added to cart (offline mode)!`);
                } else {
                    alert('Failed to add item to cart: API error. Please try again.');
                }
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add item to cart. Please try again.');
        }
    }

    const toggleFavorite = (computerId) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev)
            if (newFavorites.has(computerId)) {
                newFavorites.delete(computerId)
            } else {
                newFavorites.add(computerId)
            }
            return newFavorites
        })
        // In real app, call API to add/remove favorite
        // API call: PUT /api/shops/{id}/add-favourites
    }

    const ComputerCard = ({ computer }) => (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>            <CardMedia
                component="img"
                height="200"
                image={Array.isArray(computer.images) && computer.images[0] ? computer.images[0] : '/placeholder-image.jpg'}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-image.jpg';
                }}
                alt={typeof computer.name === 'string' ? computer.name : 'Computer image'}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                    {computer.name}
                </Typography>                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {typeof computer.description === 'object' ? JSON.stringify(computer.description) : computer.description || 'No description available'}
                </Typography>
                  <Box sx={{ mb: 1 }}>
                    <Chip label={typeof computer.brand === 'string' ? computer.brand : 'Unknown Brand'} size="small" sx={{ mr: 1 }} />
                    <Chip label={typeof computer.computerType === 'string' ? computer.computerType : 'Unknown Type'} size="small" variant="outlined" />
                </Box><Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>CPU:</strong> {typeof computer.cpu === 'object' ? JSON.stringify(computer.cpu) : computer.cpu || 'Not specified'}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>RAM:</strong> {typeof computer.ram === 'object' ? JSON.stringify(computer.ram) : computer.ram || 'Not specified'}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Storage:</strong> {typeof computer.storage === 'object' ? JSON.stringify(computer.storage) : computer.storage || 'Not specified'}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>GPU:</strong> {typeof computer.gpu === 'object' ? JSON.stringify(computer.gpu) : computer.gpu || 'Not specified'}
                </Typography>                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={typeof computer.rating === 'number' ? computer.rating : 0} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                        ({typeof computer.rating === 'number' ? computer.rating : 'N/A'})
                    </Typography>
                </Box><Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                    LKR {typeof computer.price === 'number' ? computer.price.toLocaleString() : 'Price unavailable'}
                </Typography>
                  <Typography variant="body2" color={typeof computer.stockQuantity === 'number' && computer.stockQuantity > 0 ? 'success.main' : 'error.main'}>
                    {typeof computer.stockQuantity === 'number' && computer.stockQuantity > 0 ? `${computer.stockQuantity} in stock` : 'Out of stock'}
                </Typography>
            </CardContent>
            
            <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <IconButton 
                    onClick={() => toggleFavorite(computer.id)}
                    color={favorites.has(computer.id) ? 'error' : 'default'}
                >
                    {favorites.has(computer.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>                  <Button 
                    variant="contained"
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => handleAddToCart(computer)}
                    disabled={!computer.id || typeof computer.stockQuantity !== 'number' || computer.stockQuantity === 0}
                    sx={{ ml: 1 }}
                >
                    Add to Cart
                </Button>
            </CardActions>
        </Card>
    )

return (
    <div className='px-5 lg:px-20 text-left'>
        <section>            <h3 className='text-gray-500 py-2 mt-10 mb-7'>
                Home/Sri Lanka/TechHub/{typeof shopData.location === 'string' ? shopData.location : 'Shop'}
            </h3>
            <div>                <Grid container spacing={2} className='mt-5'>                    <Grid item xs={12} lg={8}>
                        <img className='w-full h-[60vh] object-cover rounded-lg' 
                            src={Array.isArray(shopData.images) && shopData.images[0] ? shopData.images[0] : '/placeholder-image.jpg'} 
                            onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                            alt={typeof shopData.name === 'string' ? shopData.name : 'Shop image'} />
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        <Grid container spacing={2} direction="column">
                            <Grid item>
                                <img className='w-full h-[28vh] object-cover rounded-lg' 
                                    src={Array.isArray(shopData.images) && shopData.images[1] ? shopData.images[1] : '/placeholder-image.jpg'} 
                                    onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                                    alt="Shop interior" />
                            </Grid>
                            <Grid item>
                                <img className='w-full h-[28vh] object-cover rounded-lg' 
                                    src={Array.isArray(shopData.images) && shopData.images[2] ? shopData.images[2] : '/placeholder-image.jpg'} 
                                    onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                                    alt="Shop products" />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
            <div className='pt-3 pb-5'>                <div className="flex items-center mb-5 mt-5">                    <img 
                        src={shopData.logo || '/placeholder-logo.jpg'} 
                        alt={typeof shopData.name === 'string' ? shopData.name : 'Shop'} 
                        className="h-17"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-logo.jpg';
                        }}
                    />
                    <h1 className='text-4xl font-semibold'>- {typeof shopData.location === 'string' ? shopData.location : 'Location'}</h1>
                </div>                <p className='text-gray-500 flex items-center gap-3'>
                    <span>{typeof shopData.description === 'object' ? JSON.stringify(shopData.description) : shopData.description || 'No description available'}</span>
                </p>                <p className='text-gray-500 flex items-center gap-3 mt-5'>
                    <LocationOnIcon/>
                    <span>{typeof shopData.address === 'object' ? JSON.stringify(shopData.address) : shopData.address || 'Address not available'}</span>
                </p>
                <p className='text-orange-300 flex items-center gap-3 mt-5'>
                    <CalendarMonthIcon/>
                    <span>{typeof shopData.hours === 'object' ? JSON.stringify(shopData.hours) : shopData.hours || 'Hours not specified'}</span>
                </p>
            </div>
        </section>
        <Divider/>
        <section className='pt-[2rem] lg:flex relative'>
            <div className='space-y-10 lg:w-[20%] filter'>
                <div className='box space-y-5 lg:sticky top-28'>
                    <Typography variant='h5' sx={{paddingBottom:"1rem", display: 'flex', alignItems: 'center'}}>
                        <FilterListIcon sx={{ mr: 1 }} />
                        Filters
                    </Typography>
                    
                    {/* Computer Category Filter */}
                    <FormControl className='py-5 space-y-5' component={"fieldset"}>
                        <Typography variant='h6'>Computer Type</Typography>
                        <RadioGroup value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                            <FormControlLabel value="" control={<Radio />} label="All Types" />
                            {category.map((item) => (
                                <FormControlLabel key={item} value={item} control={<Radio />} label={item} />
                            ))}
                        </RadioGroup>
                    </FormControl>

                    {/* User Type Filter */}
                    <FormControl className='py-5 space-y-5' component={"fieldset"}>
                        <Typography variant='h6'>Use Case</Typography>
                        <RadioGroup value={selectedUserType} onChange={(e) => setSelectedUserType(e.target.value)}>
                            <FormControlLabel value="" control={<Radio />} label="All Uses" />
                            {userTypes.map((item) => (
                                <FormControlLabel key={item.key} value={item.label} control={<Radio />} label={item.label} />
                            ))}
                        </RadioGroup>
                    </FormControl>

                    {/* Brand Filter */}
                    <FormControl className='py-5 space-y-5' component={"fieldset"}>
                        <Typography variant='h6'>Brand</Typography>
                        <RadioGroup value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                            <FormControlLabel value="" control={<Radio />} label="All Brands" />
                            {brands.map((item) => (
                                <FormControlLabel key={item} value={item} control={<Radio />} label={item} />
                            ))}
                        </RadioGroup>
                    </FormControl>

                    <Button 
                        variant="outlined" 
                        fullWidth 
                        onClick={() => {
                            setSelectedCategory('')
                            setSelectedBrand('')
                            setSelectedUserType('')
                        }}
                    >
                        Clear Filters
                    </Button>
                </div>
            </div>
            
            <div className='space-y-5 lg:w-[80%] lg:pl-10'>                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>                    <Typography variant='h5'>
                        Computers & Tech Gadgets ({Array.isArray(computers) ? computers.length : 0} + {Array.isArray(techGadgets) ? techGadgets.length : 0})
                    </Typography>
                    {(selectedCategory || selectedBrand || selectedUserType) && (
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {selectedCategory && <Chip label={selectedCategory} onDelete={() => setSelectedCategory('')} />}
                            {selectedBrand && <Chip label={selectedBrand} onDelete={() => setSelectedBrand('')} />}
                            {selectedUserType && <Chip label={selectedUserType} onDelete={() => setSelectedUserType('')} />}
                        </Box>
                    )}
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <Typography>Loading computers...</Typography>
                    </Box>
                ) : error ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <Typography color="error">{error}</Typography>
                    </Box>
                ) : Array.isArray(computers) && computers.length > 0 ? (
                    <>
                        <Grid container spacing={3}>                            {Array.isArray(computers) && computers.map((computer) => (
                                <Grid item xs={12} sm={6} md={4} key={computer.id || Math.random().toString()}>
                                    <ComputerCard computer={computer} />
                                </Grid>
                            ))}
                        </Grid>
                          {Array.isArray(computers) && computers.length > 6 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <Pagination 
                                    count={Math.ceil(computers.length / 6)} 
                                    page={page} 
                                    onChange={(e, value) => setPage(value)}
                                    color="primary" 
                                />
                            </Box>
                        )}
                    </>
                ) : (
                    <Box sx={{ textAlign: 'center', p: 4 }}>
                        <Typography variant="h6" color="text.secondary">
                            No computers found matching your filters
                        </Typography>
                        <Button 
                            variant="outlined" 
                            onClick={() => {
                                setSelectedCategory('')
                                setSelectedBrand('')
                                setSelectedUserType('')
                            }}
                            sx={{ mt: 2 }}
                        >
                            Clear Filters
                        </Button>
                    </Box>
                )}
            </div>        </section>
    </div>
  );
};

export default ShopDetails;

//mekta dann type(computer category) ekt laptop,gaming lap, gaming build wge
//brand ekth add krnn 
//backend ekt dann components computer eke. like ram, cpu, gpu, etc
//nanotek wge ghpn Computer wlt compnent(ram, rom, graphic card) wenamai external component(screen, printer, powerbank wenamai)
//1.33