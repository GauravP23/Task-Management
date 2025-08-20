import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Typography,
  Avatar,
  AvatarGroup,
  IconButton,
  Divider,
  Button,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  FolderOpen as ProjectIcon,
  People as PeopleIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Circle as CircleIcon,
  CalendarToday as CalendarIcon,
  ViewColumn as BoardIcon,
  Assignment as TaskIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';

const DRAWER_WIDTH = 280;

// Mock team members data (will be replaced with real data later)
const teamMembers = [
  { id: 1, name: 'Karen Smith', role: 'Designer', avatar: 'KS', status: 'online', color: 'hsl(0, 68%, 70%)' },
  { id: 2, name: 'Steve McConnell', role: 'Developer', avatar: 'SM', status: 'online', color: 'hsl(178, 68%, 70%)' },
  { id: 3, name: 'Sarah Green', role: 'PM', avatar: 'SG', status: 'away', color: 'hsl(200, 68%, 70%)' },
  { id: 4, name: 'Brad Smith', role: 'Developer', avatar: 'BS', status: 'offline', color: 'hsl(142, 68%, 70%)' },
  { id: 5, name: 'Alice Cornell', role: 'Designer', avatar: 'AC', status: 'online', color: 'hsl(50, 68%, 70%)' },
];

const statusColors = {
  online: 'hsl(142, 68%, 55%)',
  away: 'hsl(35, 100%, 55%)',
  offline: 'hsl(0, 0%, 65%)',
};

const ProjectSidebar = ({ selectedProject, onProjectSelect, onNavigationChange, projects, setProjects, onCreateProject, mobileOpen, onMobileClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedItem, setSelectedItem] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'projects', label: 'Projects', icon: <ProjectIcon /> },
    { id: 'boards', label: 'Boards', icon: <BoardIcon /> },
    { id: 'tasks', label: 'My Tasks', icon: <TaskIcon /> },
    { id: 'calendar', label: 'Calendar', icon: <CalendarIcon /> },
    { id: 'analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
    { id: 'team', label: 'Team', icon: <PeopleIcon /> },
  ];

  const handleProjectSelect = (project) => {
    onProjectSelect(project);
  };

  const handleMenuItemClick = (itemId) => {
    setSelectedItem(itemId);
    // Handle navigation based on menu item
    if (onNavigationChange) {
      onNavigationChange(itemId);
    }
  };

  const drawerContent = (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Avatar sx={{ 
          bgcolor: 'primary.main', 
          width: 32, 
          height: 32,
        }}>
          <ProjectIcon />
        </Avatar>
        <Typography variant="h6" fontWeight={600} sx={{ color: 'text.primary' }}>
          Projects
          </Typography>
        </Box>

        {/* Navigation Menu */}
        <List sx={{ mb: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                selected={selectedItem === item.id}
                onClick={() => handleMenuItemClick(item.id)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  color: 'text.primary',
                  '&.Mui-selected': {
                    bgcolor: 'action.selected',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  },
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ mb: 2, borderColor: 'divider' }} />

        {/* Projects Section */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ color: 'text.secondary' }}>
              Projects
            </Typography>
            <IconButton 
              size="small" 
              sx={{ color: 'primary.main' }}
              onClick={onCreateProject}
              title="Create new project"
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>

          <List>
            {projects.map((project) => (
              <ListItem key={project.id} disablePadding>
                <ListItemButton
                  selected={selectedProject?.id === project.id}
                  onClick={() => onProjectSelect(project)}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    '&.Mui-selected': {
                      bgcolor: 'action.selected',
                      border: 1,
                      borderColor: 'primary.main',
                    },
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CircleIcon sx={{ color: project.color, fontSize: 12 }} />
                  </ListItemIcon>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={500}>
                      {project.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 16, height: 16, fontSize: '0.6rem' } }}>
                        {(project.members || []).map((member) => (
                          <Avatar
                            key={member._id || member.id}
                            sx={{ bgcolor: member.color || 'hsl(243, 82%, 67%)' }}
                            title={member.name || member.email}
                          >
                            {(member.name || member.email)?.charAt(0).toUpperCase()}
                          </Avatar>
                        ))}
                      </AvatarGroup>
                      <Typography variant="caption" sx={{ color: 'hsl(243, 82%, 55%)' }}>
                        {project.progress || 0}%
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton size="small">
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            fullWidth
            sx={{
              mt: 1,
              borderStyle: 'dashed',
              color: 'hsl(243, 82%, 55%)',
              borderColor: 'hsl(243, 100%, 88%)',
              '&:hover': {
                borderColor: 'hsl(243, 82%, 67%)',
                bgcolor: 'hsl(243, 100%, 97%)',
              },
            }}
          >
            Add Project
          </Button>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Mini Calendar Widget */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ color: 'hsl(243, 82%, 55%)', mb: 2 }}>
            Calendar
          </Typography>
          <Card sx={{ 
            bgcolor: 'hsl(240, 40%, 98%)', 
            border: '1px solid hsl(243, 100%, 94%)',
            boxShadow: '0 4px 16px hsla(243, 82%, 67%, 0.06)',
          }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="body2" fontWeight={600} sx={{ color: 'hsl(243, 82%, 35%)' }}>
                  {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </Typography>
              </Box>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(7, 1fr)', 
                gap: 0.5,
                textAlign: 'center'
              }}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                  <Typography 
                    key={index} 
                    variant="caption" 
                    sx={{ 
                      color: 'hsl(243, 82%, 55%)', 
                      fontWeight: 600,
                      py: 0.5
                    }}
                  >
                    {day}
                  </Typography>
                ))}
                {Array.from({ length: 35 }, (_, index) => {
                  const date = new Date();
                  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                  const startDate = new Date(firstDay);
                  startDate.setDate(startDate.getDate() - firstDay.getDay() + index);
                  const isCurrentMonth = startDate.getMonth() === date.getMonth();
                  const isToday = startDate.toDateString() === date.toDateString();
                  
                  return (
                    <Box
                      key={index}
                      sx={{
                        p: 0.5,
                        cursor: 'pointer',
                        borderRadius: 1,
                        bgcolor: isToday ? 'hsl(243, 82%, 67%)' : 'transparent',
                        color: isToday ? 'white' : isCurrentMonth ? 'hsl(243, 82%, 35%)' : 'hsl(243, 82%, 75%)',
                        '&:hover': {
                          bgcolor: isToday ? 'hsl(243, 82%, 57%)' : 'hsl(243, 100%, 97%)',
                        },
                      }}
                    >
                      <Typography variant="caption" fontWeight={isToday ? 600 : 400}>
                        {startDate.getDate()}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Team Members Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 2 }}>
            Team members
          </Typography>

          <List>
            {teamMembers.slice(0, 5).map((member) => (
              <ListItem key={member.id} disablePadding>
                <ListItemButton sx={{ borderRadius: 1, mb: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Box sx={{ position: 'relative' }}>
                      <Avatar sx={{ bgcolor: member.color, width: 24, height: 24, fontSize: '0.7rem' }}>
                        {member.avatar}
                      </Avatar>
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: -2,
                          right: -2,
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: statusColors[member.status],
                          border: '1px solid white',
                        }}
                      />
                    </Box>
                  </ListItemIcon>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={500}>
                      {member.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {member.role}
                    </Typography>
                  </Box>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Time Tracking Card */}
        <Card sx={{ 
          bgcolor: 'hsl(240, 40%, 98%)', 
          border: '1px solid hsl(243, 100%, 94%)',
          boxShadow: '0 4px 16px hsla(243, 82%, 67%, 0.06)',
        }}>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Time
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
              23.7 hours
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
              <Typography variant="caption" color="success.main">
                +24%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                from last week
              </Typography>
            </Box>
            <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 20, height: 20, fontSize: '0.6rem' } }}>
              {teamMembers.slice(0, 4).map((member) => (
                <Avatar
                  key={member.id}
                  sx={{ bgcolor: member.color }}
                  title={member.name}
                >
                  {member.avatar}
                </Avatar>
              ))}
            </AvatarGroup>
          </CardContent>
        </Card>
      </Box>
    );

  return (
    <>
      {/* Desktop Drawer - Permanent */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          display: { xs: 'none', md: 'flex' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
            borderRight: 1,
            borderColor: 'divider',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Mobile Drawer - Temporary */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default ProjectSidebar;
