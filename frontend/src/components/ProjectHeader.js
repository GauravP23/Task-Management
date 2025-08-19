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
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  ViewModule as BoardIcon,
  TableRows as TableIcon,
  List as ListIcon,
  MoreVert as MoreVertIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

const ProjectHeader = ({ project, onViewChange, currentView }) => {
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const viewIcons = {
    board: <BoardIcon />,
    table: <TableIcon />,
    list: <ListIcon />,
  };

  const projectTabs = [
    { label: 'Overview', value: 0 },
    { label: 'Tasks', value: 1 },
    { label: 'Notes', value: 2 },
    { label: 'Questions', value: 3 },
  ];

  return (
    <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e0e7ff' }}>
      {/* Project Title and Status */}
      <Box sx={{ p: 3, pb: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
              {project?.name || 'Piper Enterprise'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                label="12% complete"
                size="small"
                sx={{
                  bgcolor: '#e3f2fd',
                  color: '#1976d2',
                  fontWeight: 500,
                }}
              />
              <LinearProgress
                variant="determinate"
                value={12}
                sx={{
                  width: 100,
                  height: 6,
                  borderRadius: 3,
                  bgcolor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#1976d2',
                  },
                }}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AvatarGroup max={5} sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
              <Avatar sx={{ bgcolor: '#FF6B6B' }}>A</Avatar>
              <Avatar sx={{ bgcolor: '#4ECDC4' }}>B</Avatar>
              <Avatar sx={{ bgcolor: '#45B7D1' }}>C</Avatar>
              <Avatar sx={{ bgcolor: '#96CEB4' }}>D</Avatar>
              <Avatar sx={{ bgcolor: '#FECA57' }}>E</Avatar>
            </AvatarGroup>
            <Button
              variant="contained"
              startIcon={<PersonIcon />}
              sx={{
                ml: 1,
                bgcolor: '#1976d2',
                '&:hover': { bgcolor: '#1565c0' },
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
              bgcolor: '#1976d2',
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
                '&.Mui-selected': {
                  color: '#1976d2',
                },
              }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Task Management Controls */}
      <Box sx={{ px: 3, py: 2, bgcolor: '#f8f9fa', borderTop: '1px solid #e9ecef' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Task Status Columns */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#FF6B6B' }} />
                <Typography variant="body2" fontWeight={500}>To Do</Typography>
                <Chip label="3" size="small" sx={{ bgcolor: 'white', fontSize: '0.7rem', height: 20 }} />
              </Box>
              <IconButton size="small">
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4ECDC4' }} />
                <Typography variant="body2" fontWeight={500}>In Progress</Typography>
                <Chip label="2" size="small" sx={{ bgcolor: 'white', fontSize: '0.7rem', height: 20 }} />
              </Box>
              <IconButton size="small">
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#FFE66D' }} />
                <Typography variant="body2" fontWeight={500}>Need Review</Typography>
                <Chip label="1" size="small" sx={{ bgcolor: 'white', fontSize: '0.7rem', height: 20 }} />
              </Box>
              <IconButton size="small">
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#95E1D3' }} />
                <Typography variant="body2" fontWeight={500}>Done</Typography>
                <Chip label="2" size="small" sx={{ bgcolor: 'white', fontSize: '0.7rem', height: 20 }} />
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
            <Box sx={{ display: 'flex', bgcolor: 'white', borderRadius: 1, p: 0.25 }}>
              {['board', 'table', 'list'].map((view) => (
                <IconButton
                  key={view}
                  size="small"
                  onClick={() => onViewChange(view)}
                  sx={{
                    bgcolor: currentView === view ? '#e3f2fd' : 'transparent',
                    color: currentView === view ? '#1976d2' : 'text.secondary',
                    '&:hover': {
                      bgcolor: currentView === view ? '#e3f2fd' : 'grey.100',
                    },
                  }}
                >
                  {viewIcons[view]}
                </IconButton>
              ))}
            </Box>

            <IconButton size="small">
              <FilterIcon fontSize="small" />
            </IconButton>

            <IconButton size="small" onClick={handleMenuClick}>
              <MoreVertIcon fontSize="small" />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>
                <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
                Project Settings
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>Export Data</MenuItem>
              <MenuItem onClick={handleMenuClose}>Archive Project</MenuItem>
            </Menu>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectHeader;
