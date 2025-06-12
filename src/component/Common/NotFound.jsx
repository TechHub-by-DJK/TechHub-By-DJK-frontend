import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon, ArrowBack as BackIcon } from '@mui/icons-material';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          minHeight: '50vh',
          justifyContent: 'center'
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '6rem', md: '8rem' },
            fontWeight: 'bold',
            color: 'primary.main',
            lineHeight: 1
          }}
        >
          404
        </Typography>
        
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
          Page Not Found
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
          Sorry, the page you are looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            size="large"
          >
            Go Home
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={() => navigate(-1)}
            size="large"
          >
            Go Back
          </Button>
        </Box>
        
        <Box sx={{ mt: 6 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Popular Sections
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              variant="text"
              onClick={() => navigate('/search?q=laptop')}
            >
              Laptops
            </Button>
            <Button
              variant="text"
              onClick={() => navigate('/search?q=desktop')}
            >
              Desktops
            </Button>
            <Button
              variant="text"
              onClick={() => navigate('/gadgets')}
            >
              Tech Gadgets
            </Button>
            <Button
              variant="text"
              onClick={() => navigate('/search?q=gaming')}
            >
              Gaming
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default NotFound;
