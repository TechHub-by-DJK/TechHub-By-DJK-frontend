import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { apiService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [computers, setComputers] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState('relevance');
  const [filterBy, setFilterBy] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      performSearch(query);
    }
  }, [searchParams]);

  const performSearch = async (query) => {
    setLoading(true);
    try {
      // Search computers and shops
      const [computersResponse, shopsResponse] = await Promise.allSettled([
        apiService.searchComputers(query),
        apiService.getAllShops()
      ]);

      if (computersResponse.status === 'fulfilled') {
        setComputers(computersResponse.value.data || []);
      }

      if (shopsResponse.status === 'fulfilled') {
        // Filter shops by name containing search query
        const filteredShops = (shopsResponse.value.data || []).filter(shop =>
          shop.name.toLowerCase().includes(query.toLowerCase()) ||
          shop.description?.toLowerCase().includes(query.toLowerCase())
        );
        setShops(filteredShops);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleComputerClick = (computer) => {
    navigate(`/computer/${computer.id}`);
  };

  const handleShopClick = (shop) => {
    navigate(`/shop/${shop.id}`);
  };

  const totalResults = computers.length + shops.length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Search Header */}
      <Box sx={{ mb: 4 }}>
        <form onSubmit={handleSearch}>
          <TextField
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for computers, shops, and more..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
        </form>

        {/* Results Summary */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" color="text.secondary">
            {loading ? 'Searching...' : `${totalResults} results for "${searchParams.get('q')}"`}
          </Typography>

          {/* Sort and Filter Controls */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                label="Sort by"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="relevance">Relevance</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Filter</InputLabel>
              <Select
                value={filterBy}
                label="Filter"
                onChange={(e) => setFilterBy(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="computers">Computers</MenuItem>
                <MenuItem value="shops">Shops</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Divider />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Computers Section */}
          {computers.length > 0 && (filterBy === 'all' || filterBy === 'computers') && (
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                Computers ({computers.length})
              </Typography>
              <Grid container spacing={3}>
                {computers.map((computer) => (
                  <Grid item xs={12} sm={6} md={4} key={computer.id}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        '&:hover': { transform: 'translateY(-4px)', transition: 'transform 0.3s' }
                      }}
                    >
                      <CardActionArea onClick={() => handleComputerClick(computer)}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={computer.imageUrl || 'https://images.unsplash.com/photo-1593642532973-d31b6557fa68?auto=format&fit=crop&w=800&q=80'}
                          alt={computer.name}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h6" component="div" noWrap>
                            {computer.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {computer.brand} • {computer.category?.name}
                          </Typography>
                          <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                            {formatPrice(computer.price)}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {computer.processor && (
                              <Chip label={computer.processor} size="small" variant="outlined" />
                            )}
                            {computer.ram && (
                              <Chip label={`${computer.ram}GB RAM`} size="small" variant="outlined" />
                            )}
                          </Box>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Shops Section */}
          {shops.length > 0 && (filterBy === 'all' || filterBy === 'shops') && (
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Shops ({shops.length})
              </Typography>
              <Grid container spacing={3}>
                {shops.map((shop) => (
                  <Grid item xs={12} sm={6} md={4} key={shop.id}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        '&:hover': { transform: 'translateY(-4px)', transition: 'transform 0.3s' }
                      }}
                    >
                      <CardActionArea onClick={() => handleShopClick(shop)}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={shop.imageUrl || 'https://penbodisplay.com/wp-content/uploads/2024/10/computer-shop-interior-design2.jpg'}
                          alt={shop.name}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h6" component="div">
                            {shop.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {shop.address?.city}, {shop.address?.district}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {shop.description}
                          </Typography>
                          <Chip 
                            label={shop.open ? "Open" : "Closed"} 
                            color={shop.open ? "success" : "error"} 
                            size="small" 
                          />
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* No Results */}
          {!loading && totalResults === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                No results found
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Try adjusting your search terms or browse our categories
              </Typography>
              <Button variant="contained" onClick={() => navigate('/')}>
                Back to Home
              </Button>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default SearchResults;
