import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  AvatarGroup,
  IconButton,
  Tabs,
  Tab,
  LinearProgress,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  ViewModule as BoardIcon,
  TableRows as TableIcon,
  List as ListIcon,
  CalendarMonth as CalendarIcon,
  Dashboard as DashboardIcon,
  MoreVert as MoreVertIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useThemeMode } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const ProjectHeader = ({ project, onViewChange, currentView, taskCounts = {} }) => {
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  
  const { darkMode, toggleDarkMode } = useThemeMode();
  const { user, logout } = useAuth();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileMenuClick = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
  };

  const viewIcons = {
    board: <BoardIcon />,
    table: <TableIcon />,
    list: <ListIcon />,
    calendar: <CalendarIcon />,
    boards: <DashboardIcon />,
  };

  const projectTabs = [
    { label: 'Overview', value: 0 },
    { label: 'Tasks', value: 1 },
    { label: 'Notes', value: 2 },
    { label: 'Questions', value: 3 },
  ];

  return (
    <Box sx={{ bgcolor: 'hsl(0, 0%, 100%)', borderBottom: '1px solid hsl(243, 100%, 94%)' }}>
      {/* Project Title and Status */}
      <Box sx={{ p: 3, pb: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 1, color: 'hsl(243, 82%, 15%)' }}>
              {project?.name || 'Select a Project'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                label={`${project?.progress || 0}% complete`}
                size="small"
                className="status-chip-info"
                sx={{
                  bgcolor: 'hsl(243, 100%, 97%)',
                  color: 'hsl(243, 82%, 67%)',
                  fontWeight: 500,
                }}
              />
              <LinearProgress
                variant="determinate"
                value={project?.progress || 0}
                sx={{
                  width: 100,
                  height: 6,
                  borderRadius: 3,
                  bgcolor: 'hsl(0, 0%, 90%)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(135deg, hsl(243, 82%, 67%) 0%, hsl(243, 82%, 77%) 100%)',
                  },
                }}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AvatarGroup max={5} sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
              {project?.members?.map((member, index) => (
                <Avatar 
                  key={member._id || member.id || index} 
                  sx={{ bgcolor: `hsl(${(index * 60) % 360}, 68%, 70%)` }}
                  title={member.name || member.email}
                >
                  {(member.name || member.email)?.charAt(0).toUpperCase()}
                </Avatar>
              )) || (
                // Fallback avatars if no members
                Array.from({ length: 3 }, (_, index) => (
                  <Avatar key={index} sx={{ bgcolor: `hsl(${(index * 120) % 360}, 68%, 70%)` }}>
                    {String.fromCharCode(65 + index)}
                  </Avatar>
                ))
              )}
            </AvatarGroup>
            <Button
              variant="contained"
              startIcon={<PersonIcon />}
              className="button-primary-modern"
              sx={{
                ml: 1,
                background: 'linear-gradient(135deg, hsl(243, 82%, 67%) 0%, hsl(243, 82%, 77%) 100%)',
                '&:hover': { 
                  background: 'linear-gradient(135deg, hsl(243, 82%, 57%) 0%, hsl(243, 82%, 67%) 100%)',
                },
              }}
            >
              Add Member
            </Button>
          </Box>
        </Box>

        {/* Project Navigation Tabs */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            '& .MuiTabs-indicator': {
              background: 'linear-gradient(135deg, hsl(243, 82%, 67%) 0%, hsl(243, 82%, 77%) 100%)',
            },
          }}
        >
          {projectTabs.map((tab) => (
            <Tab
              key={tab.value}
              label={tab.label}
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                color: 'hsl(243, 82%, 35%)',
                '&.Mui-selected': {
                  color: 'hsl(243, 82%, 67%)',
                },
              }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Task Management Controls */}
      <Box sx={{ px: 3, py: 2, bgcolor: 'hsl(240, 40%, 98%)', borderTop: '1px solid hsl(243, 100%, 94%)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Task Status Columns */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box className="status-indicator status-todo" />
                <Typography variant="body2" fontWeight={500} color="hsl(243, 82%, 25%)">To Do</Typography>
                <Chip label={taskCounts.todo || 0} size="small" className="status-chip-count" />
              </Box>
              <IconButton size="small">
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box className="status-indicator status-in-progress" />
                <Typography variant="body2" fontWeight={500} color="hsl(243, 82%, 25%)">In Progress</Typography>
                <Chip label={taskCounts['in-progress'] || 0} size="small" className="status-chip-count" />
              </Box>
              <IconButton size="small">
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box className="status-indicator status-review" />
                <Typography variant="body2" fontWeight={500} color="hsl(243, 82%, 25%)">Need Review</Typography>
                <Chip label={taskCounts.review || 0} size="small" className="status-chip-count" />
              </Box>
              <IconButton size="small">
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box className="status-indicator status-done" />
                <Typography variant="body2" fontWeight={500} color="hsl(243, 82%, 25%)">Done</Typography>
                <Chip label={taskCounts.done || 0} size="small" className="status-chip-count" />
              </Box>
              <IconButton size="small">
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Search */}
            <TextField
              size="small"
              placeholder="Search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="search-field-modern"
              sx={{ width: 200 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            {/* View Toggle */}
            <Box sx={{ 
              display: 'flex', 
              bgcolor: 'hsl(0, 0%, 100%)', 
              borderRadius: 1, 
              p: 0.25,
              border: '1px solid hsl(243, 100%, 94%)',
              boxShadow: '0 2px 8px hsla(243, 82%, 67%, 0.08)',
            }}>
              {['board', 'calendar', 'boards', 'table', 'list'].map((view) => (
                <IconButton
                  key={view}
                  size="small"
                  onClick={() => onViewChange(view)}
                  sx={{
                    bgcolor: currentView === view ? 'hsl(243, 100%, 97%)' : 'transparent',
                    color: currentView === view ? 'hsl(243, 82%, 67%)' : 'hsl(243, 82%, 45%)',
                    '&:hover': {
                      bgcolor: currentView === view ? 'hsl(243, 100%, 97%)' : 'hsl(243, 100%, 99%)',
                    },
                  }}
                  title={view.charAt(0).toUpperCase() + view.slice(1)}
                >
                  {viewIcons[view]}
                </IconButton>
              ))}
            </Box>

            <IconButton size="small" sx={{ color: 'hsl(243, 82%, 45%)' }}>
              <FilterIcon fontSize="small" />
            </IconButton>

            {/* Dark Mode Toggle */}
            <IconButton size="small" onClick={toggleDarkMode} sx={{ color: 'hsl(243, 82%, 45%)' }}>
              {darkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>

            {/* User Profile Menu */}
            <IconButton size="small" onClick={handleProfileMenuClick}>
              <Avatar sx={{ 
                width: 24, 
                height: 24, 
                bgcolor: 'hsl(243, 82%, 67%)',
                color: 'hsl(0, 0%, 100%)',
              }}>
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={profileMenuAnchor}
              open={Boolean(profileMenuAnchor)}
              onClose={() => setProfileMenuAnchor(null)}
              PaperProps={{
                sx: {
                  bgcolor: 'hsl(0, 0%, 100%)',
                  border: '1px solid hsl(243, 100%, 94%)',
                  boxShadow: '0 8px 32px hsla(243, 82%, 67%, 0.12)',
                  borderRadius: 2,
                }
              }}
            >
              <MenuItem disabled>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="body2" fontWeight={500} color="hsl(243, 82%, 25%)">
                    {user?.email || 'User'}
                  </Typography>
                  <Typography variant="caption" color="hsl(243, 82%, 55%)">
                    Manage your account
                  </Typography>
                </Box>
              </MenuItem>
              <Divider sx={{ borderColor: 'hsl(243, 100%, 94%)' }} />
              <MenuItem 
                onClick={() => setProfileMenuAnchor(null)}
                sx={{ 
                  color: 'hsl(243, 82%, 35%)',
                  '&:hover': { bgcolor: 'hsl(243, 100%, 97%)' }
                }}
              >
                <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
                Profile Settings
              </MenuItem>
              <MenuItem 
                onClick={handleLogout}
                sx={{ 
                  color: 'hsl(243, 82%, 35%)',
                  '&:hover': { bgcolor: 'hsl(243, 100%, 97%)' }
                }}
              >
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>

            <IconButton size="small" onClick={handleMenuClick} sx={{ color: 'hsl(243, 82%, 45%)' }}>
              <MoreVertIcon fontSize="small" />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  bgcolor: 'hsl(0, 0%, 100%)',
                  border: '1px solid hsl(243, 100%, 94%)',
                  boxShadow: '0 8px 32px hsla(243, 82%, 67%, 0.12)',
                  borderRadius: 2,
                }
              }}
            >
              <MenuItem 
                onClick={handleMenuClose}
                sx={{ 
                  color: 'hsl(243, 82%, 35%)',
                  '&:hover': { bgcolor: 'hsl(243, 100%, 97%)' }
                }}
              >
                <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
                Project Settings
              </MenuItem>
              <MenuItem 
                onClick={handleMenuClose}
                sx={{ 
                  color: 'hsl(243, 82%, 35%)',
                  '&:hover': { bgcolor: 'hsl(243, 100%, 97%)' }
                }}
              >
                Export Data
              </MenuItem>
              <MenuItem 
                onClick={handleMenuClose}
                sx={{ 
                  color: 'hsl(243, 82%, 35%)',
                  '&:hover': { bgcolor: 'hsl(243, 100%, 97%)' }
                }}
              >
                Archive Project
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectHeader;
