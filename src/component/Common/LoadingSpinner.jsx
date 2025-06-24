import React from 'react';
import { Box, CircularProgress, Typography, Paper, LinearProgress } from '@mui/material';

const LoadingSpinner = ({ 
  message = 'Loading...', 
  size = 40, 
  fullPage = false, 
  variant = 'circular',
  overlay = false,
  transparent = false 
}) => {
  // For full page loading
  if (fullPage) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backgroundColor: transparent ? 'rgba(0,0,0,0.7)' : 'background.default'
        }}
      >
        <Paper
          elevation={transparent ? 0 : 3}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: transparent ? 0 : 4,
            minWidth: 200,
            background: transparent ? 'transparent' : 'background.paper'
          }}
        >
          {variant === 'linear' ? (
            <LinearProgress sx={{ width: '100%', mb: 2 }} />
          ) : (
            <CircularProgress size={size} sx={{ mb: 2 }} />
          )}
          <Typography variant="body1" color={transparent ? 'common.white' : 'text.secondary'}>
            {message}
          </Typography>
        </Paper>
      </Box>
    );
  }

  // For overlay loading (on a component)
  if (overlay) {
    return (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.6)',
          zIndex: 5,
          borderRadius: 1
        }}
      >
        {variant === 'linear' ? (
          <LinearProgress sx={{ width: '80%', mb: 2 }} />
        ) : (
          <CircularProgress size={size} sx={{ mb: 2 }} />
        )}
        <Typography variant="body2" color="common.white">
          {message}
        </Typography>
      </Box>
    );
  }

  // Default inline loading
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        gap: 2
      }}
    >
      {variant === 'linear' ? (
        <LinearProgress sx={{ width: '80%', mb: 2 }} />
      ) : (
        <CircularProgress size={size} />
      )}
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
