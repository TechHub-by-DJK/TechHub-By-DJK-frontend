import { Divider, FormControl, Grid, Radio, RadioGroup, Typography, FormControlLabel, Chip, Button, Card, CardMedia, CardContent, CardActions, Box, Rating, IconButton, Pagination } from '@mui/material'
import React, { useState, useEffect } from 'react'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FilterListIcon from '@mui/icons-material/FilterList';

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
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedBrand, setSelectedBrand] = useState('')
    const [selectedUserType, setSelectedUserType] = useState('')
    const [computers, setComputers] = useState([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [favorites, setFavorites] = useState(new Set())

    // Mock shop data - in real app, get from route params or API
    const shopData = {
        id: 1,
        name: "Sell-X Computers",
        location: "Matara",
        description: "Sell-X Computers in Matara is a reputable computer store situated on Kalidasa Road. As part of the Sell-X Computers (Pvt) Ltd. network, established in 2003, the Matara branch offers a comprehensive range of IT products and services. Their inventory includes desktop computers, laptops, printers, computer accessories, office automation products, and CCTV and security solutions. They are also known for their expertise in gaming computers",
        address: "Kalidasa Road, Matara, Sri Lanka",
        hours: "Monday - Sunday: 9:00 AM - 7:00 PM",
        images: [
            "https://lh3.googleusercontent.com/p/AF1QipNx0_jIVOWBTIQK3JrviTqWTl-uFQlQFZL-wBxU=s1360-w1360-h1020-rw",
            "https://i.ytimg.com/vi/JyfktkmM9Qk/maxresdefault.jpg",
            "https://lh3.googleusercontent.com/p/AF1QipOWqPkkZxuYlc489_hfqZZhDOrVefotkYuxz8zT=s1360-w1360-h1020-rw"
        ],
        logo: "https://www.gallelaptop.lk/images/common/company_logo.png"
    }    // Mock computers data - in real app, fetch from API
    const mockComputers = React.useMemo(() => [
        {
            id: 1,
            name: "Gaming Beast Pro",
            description: "High-performance gaming laptop with RTX 4080",
            price: 350000,
            brand: "MSI",
            cpu: "Intel i9-13900H",
            ram: "32GB DDR5",
            storage: "1TB NVMe SSD",
            gpu: "RTX 4080",
            rating: 4.8,
            stockQuantity: 5,
            images: ["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400"],
            computerType: "LAPTOP",
            isGamer: true,
            isDesigner: true,
            available: true
        },
        {
            id: 2,
            name: "Business Elite",
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
            computerType: "PC",            isDesigner: true,
            isDeveloper: true,
            available: true
        }
    ], []);

    const fetchComputers = React.useCallback(async () => {
        setLoading(true)
        try {
            // In real app, make API call to /api/computer/shop/{shopId} with filters
            // For now, use mock data with client-side filtering
            let filtered = mockComputers.filter(computer => {
                if (selectedBrand && computer.brand !== selectedBrand) return false
                if (selectedUserType) {
                    const userTypeKey = userTypes.find(ut => ut.label === selectedUserType)?.key
                    if (userTypeKey && !computer[`is${userTypeKey.charAt(0).toUpperCase() + userTypeKey.slice(1)}`]) return false
                }
                return true
            })
            setComputers(filtered)
        } catch (error) {
            console.error('Error fetching computers:', error)
        } finally {
            setLoading(false)
        }
    }, [selectedBrand, selectedUserType, mockComputers])

    useEffect(() => {
        fetchComputers()
    }, [fetchComputers])

    const addToCart = (computer) => {
        // In real app, call API to add to cart
        console.log('Adding to cart:', computer)
        // API call: POST /api/cart/add
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
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
                component="img"
                height="200"
                image={computer.images[0]}
                alt={computer.name}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                    {computer.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {computer.description}
                </Typography>
                
                <Box sx={{ mb: 1 }}>
                    <Chip label={computer.brand} size="small" sx={{ mr: 1 }} />
                    <Chip label={computer.computerType} size="small" variant="outlined" />
                </Box>

                <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>CPU:</strong> {computer.cpu}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>RAM:</strong> {computer.ram}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Storage:</strong> {computer.storage}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>GPU:</strong> {computer.gpu}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={computer.rating} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                        ({computer.rating})
                    </Typography>
                </Box>

                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                    LKR {computer.price.toLocaleString()}
                </Typography>
                
                <Typography variant="body2" color={computer.stockQuantity > 0 ? 'success.main' : 'error.main'}>
                    {computer.stockQuantity > 0 ? `${computer.stockQuantity} in stock` : 'Out of stock'}
                </Typography>
            </CardContent>
            
            <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <IconButton 
                    onClick={() => toggleFavorite(computer.id)}
                    color={favorites.has(computer.id) ? 'error' : 'default'}
                >
                    {favorites.has(computer.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
                
                <Button 
                    variant="contained"
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => addToCart(computer)}
                    disabled={computer.stockQuantity === 0}
                    sx={{ ml: 1 }}
                >
                    Add to Cart
                </Button>
            </CardActions>
        </Card>
    )

return (
    <div className='px-5 lg:px-20 text-left'>
        <section>
            <h3 className='text-gray-500 py-2 mt-10 mb-7'>
                Home/Sri Lanka/TechHub/{shopData.location}
            </h3>
            <div>
                <Grid container spacing={2} className='mt-5'>
                    <Grid item xs={12} lg={8}>
                        <img className='w-full h-[60vh] object-cover rounded-lg' src={shopData.images[0]} alt={shopData.name} />
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        <Grid container spacing={2} direction="column">
                            <Grid item>
                                <img className='w-full h-[28vh] object-cover rounded-lg' src={shopData.images[1]} alt="" />
                            </Grid>
                            <Grid item>
                                <img className='w-full h-[28vh] object-cover rounded-lg' src={shopData.images[2]} alt="" />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
            <div className='pt-3 pb-5'>
                <div className="flex items-center mb-5 mt-5">
                    <img src={shopData.logo} alt={shopData.name} className="h-17" />
                    <h1 className='text-4xl font-semibold'>- {shopData.location}</h1>
                </div>
                <p className='text-gray-500 flex items-center gap-3'>
                    <span>{shopData.description}</span>
                </p>
                <p className='text-gray-500 flex items-center gap-3 mt-5'>
                    <LocationOnIcon/>
                    <span>{shopData.address}</span>
                </p>
                <p className='text-orange-300 flex items-center gap-3 mt-5'>
                    <CalendarMonthIcon/>
                    <span>{shopData.hours}</span>
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
            
            <div className='space-y-5 lg:w-[80%] lg:pl-10'>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant='h5'>
                        Computers & Laptops ({computers.length})
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
                ) : computers.length > 0 ? (
                    <>
                        <Grid container spacing={3}>
                            {computers.map((computer) => (
                                <Grid item xs={12} sm={6} md={4} key={computer.id}>
                                    <ComputerCard computer={computer} />
                                </Grid>
                            ))}
                        </Grid>
                        
                        {computers.length > 6 && (
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
            </div>
        </section>
    </div>
)
}

//mekta dann type(computer category) ekt laptop,gaming lap, gaming build wge
//brand ekth add krnn 
//backend ekt dann components computer eke. like ram, cpu, gpu, etc
//nanotek wge ghpn Computer wlt compnent(ram, rom, graphic card) wenamai external component(screen, printer, powerbank wenamai)
//1.33