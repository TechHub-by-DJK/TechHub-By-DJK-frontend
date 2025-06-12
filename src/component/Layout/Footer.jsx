import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        mt: 'auto',
        py: 6
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              TechHUB
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Your one-stop destination for the latest technology products. 
              From gaming laptops to business solutions, we have it all.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <FacebookIcon />
              </IconButton>
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <TwitterIcon />
              </IconButton>
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <InstagramIcon />
              </IconButton>
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/" color="text.secondary" underline="hover">
                Home
              </Link>
              <Link href="/search?q=laptop" color="text.secondary" underline="hover">
                Laptops
              </Link>
              <Link href="/search?q=desktop" color="text.secondary" underline="hover">
                Desktops
              </Link>
              <Link href="/gadgets" color="text.secondary" underline="hover">
                Tech Gadgets
              </Link>
              <Link href="/search?q=gaming" color="text.secondary" underline="hover">
                Gaming
              </Link>
            </Box>
          </Grid>

          {/* Customer Service */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Customer Service
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/help" color="text.secondary" underline="hover">
                Help Center
              </Link>
              <Link href="/contact" color="text.secondary" underline="hover">
                Contact Us
              </Link>
              <Link href="/returns" color="text.secondary" underline="hover">
                Returns & Exchanges
              </Link>
              <Link href="/shipping" color="text.secondary" underline="hover">
                Shipping Info
              </Link>
              <Link href="/warranty" color="text.secondary" underline="hover">
                Warranty
              </Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Contact Info
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  support@techhub.lk
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  +94 11 234 5678
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <LocationIcon sx={{ fontSize: 18, color: 'text.secondary', mt: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  123 Tech Street,<br />
                  Colombo 03, Sri Lanka
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Bottom Section */}
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="body2" color="text.secondary">
              © 2025 TechHUB by DJK. All rights reserved.
            </Typography>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Link href="/privacy" color="text.secondary" underline="hover" variant="body2">
                Privacy Policy
              </Link>
              <Link href="/terms" color="text.secondary" underline="hover" variant="body2">
                Terms of Service
              </Link>
              <Link href="/cookies" color="text.secondary" underline="hover" variant="body2">
                Cookie Policy
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
