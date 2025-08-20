import { createTheme } from '@mui/material/styles';

export const createModernTheme = (mode = 'light') => createTheme({
  palette: {
    mode,
    primary: {
      main: 'hsl(243, 82%, 67%)', // Modern indigo - clean and professional
      light: 'hsl(243, 82%, 77%)',
      dark: 'hsl(243, 82%, 57%)',
      contrastText: 'hsl(0, 0%, 100%)',
    },
    secondary: {
      main: 'hsl(330, 85%, 60%)', // Vibrant pink accent
      light: 'hsl(330, 85%, 70%)',
      dark: 'hsl(330, 85%, 50%)',
      contrastText: 'hsl(0, 0%, 100%)',
    },
    background: {
      default: mode === 'light' ? 'hsl(210, 40%, 98%)' : 'hsl(0, 0%, 0%)', // True black for dark mode
      paper: mode === 'light' ? 'hsl(0, 0%, 100%)' : 'hsl(0, 0%, 5%)', // Very dark grey for paper
    },
    text: {
      primary: mode === 'light' ? 'hsl(217, 33%, 17%)' : 'hsl(0, 0%, 95%)', // Light text for dark mode
      secondary: mode === 'light' ? 'hsl(215, 25%, 45%)' : 'hsl(0, 0%, 70%)', // Softer light text
    },
    grey: {
      50: mode === 'light' ? 'hsl(210, 40%, 98%)' : 'hsl(0, 0%, 95%)',
      100: mode === 'light' ? 'hsl(210, 40%, 95%)' : 'hsl(0, 0%, 85%)',
      200: mode === 'light' ? 'hsl(214, 32%, 91%)' : 'hsl(0, 0%, 75%)',
      300: mode === 'light' ? 'hsl(213, 27%, 84%)' : 'hsl(0, 0%, 65%)',
      400: mode === 'light' ? 'hsl(214, 20%, 65%)' : 'hsl(0, 0%, 55%)',
      500: mode === 'light' ? 'hsl(215, 25%, 45%)' : 'hsl(0, 0%, 45%)',
      600: mode === 'light' ? 'hsl(215, 19%, 35%)' : 'hsl(0, 0%, 35%)',
      700: mode === 'light' ? 'hsl(215, 25%, 27%)' : 'hsl(0, 0%, 25%)',
      800: mode === 'light' ? 'hsl(217, 33%, 17%)' : 'hsl(0, 0%, 15%)',
      900: mode === 'light' ? 'hsl(222, 84%, 5%)' : 'hsl(0, 0%, 5%)',
    },
    success: {
      main: 'hsl(158, 76%, 39%)', // Clean emerald green
      light: 'hsl(158, 76%, 49%)',
      dark: 'hsl(158, 76%, 29%)',
    },
    warning: {
      main: 'hsl(38, 92%, 50%)', // Warm amber
      light: 'hsl(38, 92%, 60%)',
      dark: 'hsl(38, 92%, 40%)',
    },
    error: {
      main: 'hsl(0, 84%, 60%)', // Clean red
      light: 'hsl(0, 84%, 70%)',
      dark: 'hsl(0, 84%, 50%)',
    },
    info: {
      main: 'hsl(199, 89%, 48%)', // Clean blue
      light: 'hsl(199, 89%, 58%)',
      dark: 'hsl(199, 89%, 38%)',
    },
    // Custom colors for modern UI elements
    surface: {
      elevated: mode === 'light' ? 'hsl(0, 0%, 100%)' : 'hsl(0, 0%, 8%)', // Slightly elevated from true black
      overlay: mode === 'light' ? 'hsl(210, 40%, 96%)' : 'hsl(0, 0%, 3%)', // Very dark overlay
    },
    // Enhanced status colors with HSL
    status: {
      todo: {
        main: 'hsl(215, 20%, 65%)',
        bg: mode === 'light' ? 'hsl(215, 20%, 95%)' : 'hsl(215, 20%, 15%)',
        border: mode === 'light' ? 'hsl(215, 20%, 85%)' : 'hsl(215, 20%, 25%)',
      },
      inProgress: {
        main: 'hsl(217, 91%, 60%)',
        bg: mode === 'light' ? 'hsl(217, 91%, 95%)' : 'hsl(217, 91%, 15%)',
        border: mode === 'light' ? 'hsl(217, 91%, 85%)' : 'hsl(217, 91%, 25%)',
      },
      review: {
        main: 'hsl(38, 92%, 50%)',
        bg: mode === 'light' ? 'hsl(38, 92%, 95%)' : 'hsl(38, 92%, 15%)',
        border: mode === 'light' ? 'hsl(38, 92%, 85%)' : 'hsl(38, 92%, 25%)',
      },
      done: {
        main: 'hsl(158, 76%, 39%)',
        bg: mode === 'light' ? 'hsl(158, 76%, 95%)' : 'hsl(158, 76%, 15%)',
        border: mode === 'light' ? 'hsl(158, 76%, 85%)' : 'hsl(158, 76%, 25%)',
      },
    },
    // Priority colors
    priority: {
      low: {
        main: 'hsl(215, 20%, 65%)',
        bg: mode === 'light' ? 'hsl(215, 20%, 95%)' : 'hsl(215, 20%, 15%)',
      },
      medium: {
        main: 'hsl(38, 92%, 50%)',
        bg: mode === 'light' ? 'hsl(38, 92%, 95%)' : 'hsl(38, 92%, 15%)',
      },
      high: {
        main: 'hsl(25, 95%, 53%)',
        bg: mode === 'light' ? 'hsl(25, 95%, 95%)' : 'hsl(25, 95%, 15%)',
      },
      urgent: {
        main: 'hsl(0, 84%, 60%)',
        bg: mode === 'light' ? 'hsl(0, 84%, 95%)' : 'hsl(0, 84%, 15%)',
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: mode === 'light' ? [
    'none',
    '0 1px 3px 0 hsla(220, 25%, 10%, 0.08), 0 1px 2px -1px hsla(220, 25%, 10%, 0.08)',
    '0 4px 6px -1px hsla(220, 25%, 10%, 0.08), 0 2px 4px -2px hsla(220, 25%, 10%, 0.08)',
    '0 10px 15px -3px hsla(220, 25%, 10%, 0.08), 0 4px 6px -4px hsla(220, 25%, 10%, 0.08)',
    '0 20px 25px -5px hsla(220, 25%, 10%, 0.08), 0 8px 10px -6px hsla(220, 25%, 10%, 0.08)',
    '0 25px 50px -12px hsla(220, 25%, 10%, 0.16)',
    // Elegant progression for higher elevations
    '0 2px 4px -1px hsla(220, 25%, 10%, 0.06), 0 4px 6px -1px hsla(220, 25%, 10%, 0.1)',
    '0 4px 8px -2px hsla(220, 25%, 10%, 0.08), 0 6px 12px -2px hsla(220, 25%, 10%, 0.08)',
    '0 8px 16px -4px hsla(220, 25%, 10%, 0.08), 0 6px 12px -2px hsla(220, 25%, 10%, 0.08)',
    '0 16px 24px -4px hsla(220, 25%, 10%, 0.08), 0 8px 16px -4px hsla(220, 25%, 10%, 0.08)',
    '0 20px 32px -4px hsla(220, 25%, 10%, 0.12), 0 12px 20px -4px hsla(220, 25%, 10%, 0.08)',
    '0 24px 40px -4px hsla(220, 25%, 10%, 0.12), 0 16px 24px -4px hsla(220, 25%, 10%, 0.08)',
    '0 32px 48px -8px hsla(220, 25%, 10%, 0.14), 0 20px 32px -8px hsla(220, 25%, 10%, 0.08)',
    '0 40px 56px -8px hsla(220, 25%, 10%, 0.16), 0 24px 40px -8px hsla(220, 25%, 10%, 0.08)',
    '0 48px 64px -8px hsla(220, 25%, 10%, 0.16), 0 28px 48px -8px hsla(220, 25%, 10%, 0.08)',
    // Additional elevation levels
    ...Array(10).fill('0 56px 72px -8px hsla(220, 25%, 10%, 0.18), 0 32px 56px -8px hsla(220, 25%, 10%, 0.08)'),
  ] : [
    'none',
    '0 1px 3px 0 hsla(220, 25%, 5%, 0.2), 0 1px 2px -1px hsla(220, 25%, 5%, 0.2)',
    '0 4px 6px -1px hsla(220, 25%, 5%, 0.2), 0 2px 4px -2px hsla(220, 25%, 5%, 0.2)',
    '0 10px 15px -3px hsla(220, 25%, 5%, 0.2), 0 4px 6px -4px hsla(220, 25%, 5%, 0.2)',
    '0 20px 25px -5px hsla(220, 25%, 5%, 0.2), 0 8px 10px -6px hsla(220, 25%, 5%, 0.2)',
    '0 25px 50px -12px hsla(220, 25%, 5%, 0.35)',
    // Dark mode shadows with HSL
    '0 2px 4px -1px hsla(220, 25%, 5%, 0.15), 0 4px 6px -1px hsla(220, 25%, 5%, 0.25)',
    '0 4px 8px -2px hsla(220, 25%, 5%, 0.2), 0 6px 12px -2px hsla(220, 25%, 5%, 0.2)',
    '0 8px 16px -4px hsla(220, 25%, 5%, 0.2), 0 6px 12px -2px hsla(220, 25%, 5%, 0.2)',
    '0 16px 24px -4px hsla(220, 25%, 5%, 0.2), 0 8px 16px -4px hsla(220, 25%, 5%, 0.2)',
    '0 20px 32px -4px hsla(220, 25%, 5%, 0.28), 0 12px 20px -4px hsla(220, 25%, 5%, 0.2)',
    '0 24px 40px -4px hsla(220, 25%, 5%, 0.28), 0 16px 24px -4px hsla(220, 25%, 5%, 0.2)',
    '0 32px 48px -8px hsla(220, 25%, 5%, 0.32), 0 20px 32px -8px hsla(220, 25%, 5%, 0.2)',
    '0 40px 56px -8px hsla(220, 25%, 5%, 0.36), 0 24px 40px -8px hsla(220, 25%, 5%, 0.2)',
    '0 48px 64px -8px hsla(220, 25%, 5%, 0.36), 0 28px 48px -8px hsla(220, 25%, 5%, 0.2)',
    // Additional elevation levels for dark mode
    ...Array(10).fill('0 56px 72px -8px hsla(220, 25%, 5%, 0.4), 0 32px 56px -8px hsla(220, 25%, 5%, 0.2)'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: mode === 'light' 
              ? '0 4px 6px -1px hsla(220, 25%, 10%, 0.08), 0 2px 4px -2px hsla(220, 25%, 10%, 0.08)'
              : '0 4px 6px -1px hsla(220, 25%, 5%, 0.2), 0 2px 4px -2px hsla(220, 25%, 5%, 0.2)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, hsl(243, 82%, 67%) 0%, hsl(243, 82%, 72%) 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, hsl(243, 82%, 62%) 0%, hsl(243, 82%, 67%) 100%)',
            boxShadow: mode === 'light'
              ? '0 8px 16px -4px hsla(243, 82%, 67%, 0.3), 0 4px 6px -4px hsla(243, 82%, 67%, 0.2)'
              : '0 8px 16px -4px hsla(243, 82%, 67%, 0.4), 0 4px 6px -4px hsla(243, 82%, 67%, 0.3)',
          },
        },
        outlined: {
          borderColor: mode === 'light' ? 'hsl(214, 32%, 91%)' : 'hsl(215, 25%, 27%)',
          '&:hover': {
            borderColor: 'hsl(243, 82%, 67%)',
            backgroundColor: mode === 'light' ? 'hsla(243, 82%, 67%, 0.04)' : 'hsla(243, 82%, 67%, 0.1)',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: mode === 'light' ? 'hsla(243, 82%, 67%, 0.04)' : 'hsla(243, 82%, 67%, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: `1px solid ${mode === 'light' ? 'hsl(214, 32%, 91%)' : 'hsl(0, 0%, 20%)'}`,
          backgroundColor: mode === 'light' ? 'hsl(0, 0%, 100%)' : 'hsl(0, 0%, 8%)',
          boxShadow: mode === 'light'
            ? '0 1px 3px 0 hsla(220, 25%, 10%, 0.08), 0 1px 2px -1px hsla(220, 25%, 10%, 0.08)'
            : '0 1px 3px 0 hsla(0, 0%, 0%, 0.4), 0 1px 2px -1px hsla(0, 0%, 0%, 0.4)',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            borderColor: mode === 'light' ? 'hsl(213, 27%, 84%)' : 'hsl(0, 0%, 30%)',
            boxShadow: mode === 'light'
              ? '0 4px 6px -1px hsla(220, 25%, 10%, 0.08), 0 2px 4px -2px hsla(220, 25%, 10%, 0.08)'
              : '0 4px 6px -1px hsla(0, 0%, 0%, 0.6), 0 2px 4px -2px hsla(0, 0%, 0%, 0.6)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '& fieldset': {
              borderColor: mode === 'light' ? 'hsl(214, 32%, 91%)' : 'hsl(215, 25%, 27%)',
            },
            '&:hover fieldset': {
              borderColor: mode === 'light' ? 'hsl(213, 27%, 84%)' : 'hsl(215, 19%, 35%)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'hsl(243, 82%, 67%)',
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          border: `1px solid ${mode === 'light' ? 'hsl(214, 32%, 91%)' : 'hsl(215, 25%, 27%)'}`,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: mode === 'light'
              ? '0 2px 4px -1px hsla(220, 25%, 10%, 0.08)'
              : '0 2px 4px -1px hsla(220, 25%, 5%, 0.2)',
          },
        },
        colorPrimary: {
          backgroundColor: mode === 'light' ? 'hsla(243, 82%, 67%, 0.1)' : 'hsla(243, 82%, 67%, 0.2)',
          color: 'hsl(243, 82%, 67%)',
          borderColor: 'hsl(243, 82%, 67%)',
        },
        colorSecondary: {
          backgroundColor: mode === 'light' ? 'hsla(330, 85%, 60%, 0.1)' : 'hsla(330, 85%, 60%, 0.2)',
          color: 'hsl(330, 85%, 60%)',
          borderColor: 'hsl(330, 85%, 60%)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          border: 'none',
          backgroundColor: mode === 'light' 
            ? 'hsl(0, 0%, 100%)'
            : 'hsl(0, 0%, 3%)', // Very dark for sidebar
          borderRight: `1px solid ${mode === 'light' ? 'hsl(214, 32%, 91%)' : 'hsl(0, 0%, 15%)'}`,
          boxShadow: mode === 'light'
            ? '0 10px 15px -3px hsla(220, 25%, 10%, 0.08), 0 4px 6px -4px hsla(220, 25%, 10%, 0.08)'
            : '0 10px 15px -3px hsla(0, 0%, 0%, 0.4), 0 4px 6px -4px hsla(0, 0%, 0%, 0.4)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          border: `1px solid ${mode === 'light' ? 'hsl(214, 32%, 91%)' : 'hsl(215, 25%, 27%)'}`,
          background: mode === 'light'
            ? 'hsl(0, 0%, 100%)'
            : 'hsl(217, 33%, 17%)',
          boxShadow: mode === 'light'
            ? '0 20px 32px -4px hsla(220, 25%, 10%, 0.12), 0 12px 20px -4px hsla(220, 25%, 10%, 0.08)'
            : '0 20px 32px -4px hsla(220, 25%, 5%, 0.28), 0 12px 20px -4px hsla(220, 25%, 5%, 0.2)',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          border: `1px solid ${mode === 'light' ? 'hsl(214, 32%, 91%)' : 'hsl(215, 25%, 27%)'}`,
          background: mode === 'light'
            ? 'hsl(0, 0%, 100%)'
            : 'hsl(217, 33%, 17%)',
          boxShadow: mode === 'light'
            ? '0 8px 16px -4px hsla(220, 25%, 10%, 0.08), 0 6px 12px -2px hsla(220, 25%, 10%, 0.08)'
            : '0 8px 16px -4px hsla(220, 25%, 5%, 0.2), 0 6px 12px -2px hsla(220, 25%, 5%, 0.2)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          margin: '2px 6px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: mode === 'light' ? 'hsl(210, 40%, 96%)' : 'hsl(215, 25%, 22%)',
          },
          '&.Mui-selected': {
            backgroundColor: mode === 'light' ? 'hsla(243, 82%, 67%, 0.08)' : 'hsla(243, 82%, 67%, 0.16)',
            '&:hover': {
              backgroundColor: mode === 'light' ? 'hsla(243, 82%, 67%, 0.12)' : 'hsla(243, 82%, 67%, 0.2)',
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: mode === 'light' ? 'hsl(210, 40%, 96%)' : 'hsl(215, 25%, 22%)',
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 6,
          backgroundColor: mode === 'light' ? 'hsl(214, 32%, 91%)' : 'hsl(215, 25%, 27%)',
        },
        bar: {
          borderRadius: 4,
        },
      },
    },
  },
});

export const lightTheme = createModernTheme('light');
export const darkTheme = createModernTheme('dark');

export default lightTheme;
