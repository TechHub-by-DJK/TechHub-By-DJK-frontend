import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Chip, 
  IconButton, 
  Typography, 
  Box, 
  Rating,
  CardActionArea,
  Badge
} from '@mui/material';
import { 
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Store as StoreIcon,
  Computer as ComputerIcon,
  Devices as DevicesIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../services/api';

const ShopCard = ({ shop, onFavoriteToggle }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(shop?.isFavorite || false);
  const [loading, setLoading] = useState(false);
  
  const handleFavoriteClick = async (e) => {
    e.stopPropagation(); // Prevent card click navigation
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      setLoading(true);
      const apiService = new ApiService();
      await apiService.addToFavorites(shop.id);
      
      setIsFavorite(!isFavorite);
      if (onFavoriteToggle) {
        onFavoriteToggle(shop.id, !isFavorite);
      }
    } catch (error) {
      console.error('Failed to update favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/shop/${shop.id}`);
  };
  
  return (
    <Card 
      sx={{ 
        width: '100%', 
        maxWidth: 320,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => `0 10px 20px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`
        }
      }}
    >
      <CardActionArea onClick={handleCardClick} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="160"
            image={shop?.imageUrl || "https://penbodisplay.com/wp-content/uploads/2024/10/computer-shop-interior-design2.jpg"}
            alt={shop?.name || "Shop Image"}
          />
          <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 1 }}>
            <Chip
              size="small"
              color={shop?.isOpen ? "success" : "error"}
              label={shop?.isOpen ? "Open" : "Closed"}
              sx={{ fontSize: '0.75rem' }}
            />
            <Chip
              size="small"
              color="primary"
              label={shop?.category || "Electronics"}
              sx={{ fontSize: '0.75rem' }}
            />
          </Box>
        </Box>
        
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="h6" component="div" noWrap sx={{ fontWeight: 600 }}>
              {shop?.name || "Shop Name"}
            </Typography>
            <IconButton 
              size="small" 
              onClick={handleFavoriteClick}
              disabled={loading}
              sx={{ ml: 1 }}
            >
              {isFavorite 
                ? <FavoriteIcon sx={{ color: '#e91e63' }} /> 
                : <FavoriteBorderIcon />
              }
            </IconButton>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, minHeight: 40 }}>
            {shop?.description || "No description available"}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
            <Rating 
              value={shop?.rating || 0} 
              precision={0.5} 
              readOnly 
              size="small" 
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Badge badgeContent={shop?.computerCount || 0} color="primary" max={99}>
                <ComputerIcon fontSize="small" />
              </Badge>
              <Badge badgeContent={shop?.gadgetCount || 0} color="secondary" max={99}>
                <DevicesIcon fontSize="small" />
              </Badge>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default ShopCard