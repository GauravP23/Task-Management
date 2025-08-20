import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assignment as TaskIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout, isAuthenticated } = useAuth();
  const { toggleDarkMode, darkMode } = useThemeMode();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navigationItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { label: 'Tasks', icon: <TaskIcon />, path: '/tasks' },
    { label: 'Create Project', icon: <AddIcon />, path: '/projects/create' },
    { label: 'Profile', icon: <PersonIcon />, path: '/profile' },
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Task Manager
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              selected={isActivePath(item.path)}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
            >
              <ListItemIcon sx={{ color: isActivePath(item.path) ? 'primary.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  // Don't show navigation on login page or when not authenticated
  if (location.pathname === '/login' || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Task Management System
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.label}
                  color="inherit"
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  sx={{
                    bgcolor: isActivePath(item.path) ? 'rgba(255,255,255,0.1)' : 'transparent',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          <IconButton 
            color="inherit" 
            onClick={toggleDarkMode} 
            sx={{ 
              mr: 1,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                transform: 'scale(1.1)',
              }
            }}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Profile menu */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        id="primary-search-account-menu"
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
          <PersonIcon sx={{ mr: 1 }} />
          Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default Navigation;
