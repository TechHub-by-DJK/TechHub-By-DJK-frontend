import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Box,
  Button,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Alert,
  Rating,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  GridView as GridViewIcon,
  ViewList as ListViewIcon,
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { useCart } from '../../contexts/CartContext';

const TechGadgets = () => {
  const [gadgets, setGadgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterBrand, setFilterBrand] = useState('');  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState([]);
  
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const itemsPerPage = 12;
  const fetchGadgets = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getAllTechGadgets({
        page: page - 1,
        size: itemsPerPage,
        sort: sortBy,
        brand: filterBrand,
        search: searchTerm
      });
      
      setGadgets(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching tech gadgets:', error);
      setError('Failed to load tech gadgets. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, filterBrand, searchTerm]);

  useEffect(() => {
    fetchGadgets();
  }, [fetchGadgets]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchGadgets();
  };

  const handleAddToCart = async (gadget) => {
    try {
      await addToCart(gadget.id, 1, 'TECH_GADGET');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleToggleFavorite = (gadgetId) => {
    setFavorites(prev => 
      prev.includes(gadgetId) 
        ? prev.filter(id => id !== gadgetId)
        : [...prev, gadgetId]
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const uniqueBrands = [...new Set(gadgets.map(gadget => gadget.brand).filter(Boolean))];

  const GadgetCard = ({ gadget, isListView = false }) => (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: isListView ? 'row' : 'column',
        '&:hover': { 
          transform: 'translateY(-4px)', 
          transition: 'transform 0.3s',
          boxShadow: 4
        }
      }}
    >
      <CardActionArea 
        onClick={() => navigate(`/gadget/${gadget.id}`)}
        sx={{ 
          display: 'flex', 
          flexDirection: isListView ? 'row' : 'column',
          alignItems: 'flex-start',
          height: '100%'
        }}
      >
        <CardMedia
          component="img"
          sx={{
            height: isListView ? 120 : 200,
            width: isListView ? 120 : '100%',
            objectFit: 'cover'
          }}
          image={gadget.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'}
          alt={gadget.name}
        />
        <CardContent sx={{ flex: 1, width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography gutterBottom variant="h6" component="div" noWrap>
              {gadget.name}
            </Typography>
            <IconButton 
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleFavorite(gadget.id);
              }}
            >
              {favorites.includes(gadget.id) ? 
                <FavoriteIcon color="error" /> : 
                <FavoriteBorderIcon />
              }
            </IconButton>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {gadget.brand} • {gadget.category?.name}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {gadget.description}
          </Typography>

          {gadget.rating && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Rating value={gadget.rating} precision={0.1} size="small" readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({gadget.reviewCount || 0})
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
              {formatPrice(gadget.price)}
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<CartIcon />}
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(gadget);
              }}
              sx={{ ml: 1 }}
            >
              Add to Cart
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
            {gadget.warranty && (
              <Chip label={`${gadget.warranty} Warranty`} size="small" variant="outlined" />
            )}
            {gadget.inStock && (
              <Chip label="In Stock" size="small" color="success" variant="outlined" />
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
          Tech Gadgets
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover the latest technology gadgets and accessories
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ mb: 4 }}>
        <form onSubmit={handleSearch}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tech gadgets..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Brand</InputLabel>
                <Select
                  value={filterBrand}
                  label="Brand"
                  onChange={(e) => setFilterBrand(e.target.value)}
                >
                  <MenuItem value="">All Brands</MenuItem>
                  {uniqueBrands.map(brand => (
                    <MenuItem key={brand} value={brand}>{brand}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort by"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="price">Price: Low to High</MenuItem>
                  <MenuItem value="price,desc">Price: High to Low</MenuItem>
                  <MenuItem value="brand">Brand</MenuItem>
                  <MenuItem value="rating,desc">Rating</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SearchIcon />}
                  sx={{ flex: 1 }}
                >
                  Search
                </Button>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Grid View">
                    <IconButton 
                      color={viewMode === 'grid' ? 'primary' : 'default'}
                      onClick={() => setViewMode('grid')}
                    >
                      <GridViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="List View">
                    <IconButton 
                      color={viewMode === 'list' ? 'primary' : 'default'}
                      onClick={() => setViewMode('list')}
                    >
                      <ListViewIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
          <Button onClick={fetchGadgets} sx={{ ml: 2 }}>
            Retry
          </Button>
        </Alert>
      )}

      {/* Results */}
      {!loading && !error && (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Showing {gadgets.length} of {totalPages * itemsPerPage} gadgets
          </Typography>

          {gadgets.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                No gadgets found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Try adjusting your search criteria
              </Typography>
            </Box>
          ) : (
            <>
              <Grid container spacing={3}>
                {gadgets.map((gadget) => (
                  <Grid 
                    item 
                    xs={12} 
                    sm={viewMode === 'grid' ? 6 : 12} 
                    md={viewMode === 'grid' ? 4 : 12} 
                    lg={viewMode === 'grid' ? 3 : 12}
                    key={gadget.id}
                  >
                    <GadgetCard gadget={gadget} isListView={viewMode === 'list'} />
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(e, newPage) => setPage(newPage)}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default TechGadgets;
