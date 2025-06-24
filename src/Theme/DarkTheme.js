import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#e91e63',
      light: '#f48fb1',
      dark: '#c2185b',
    },
    secondary: {
      main: '#5A20CB',
      light: '#7c4dff',
      dark: '#3f1dcb',
    },
    background: {
      default: '#0D1117',
      paper: '#161B22',
    },
    text: {
      primary: '#C9D1D9',
      secondary: '#8B949E',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#03a9f4',
    },
    success: {
      main: '#4caf50',
    },
  },  typography: {
    fontFamily: 'Outfit, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    body1: {
      fontWeight: 400,
    },
    body2: {
      fontWeight: 400,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
          },
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          }
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #e91e63 30%, #f06292 90%)',
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(22, 27, 34, 0.9)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
        }
      }
    }
  },
});