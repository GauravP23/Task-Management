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
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  FolderOpen as ProjectIcon,
  People as PeopleIcon,
  Schedule as TimeIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Circle as CircleIcon,
} from '@mui/icons-material';

const DRAWER_WIDTH = 280;

// Mock project data
const projects = [
  {
    id: 1,
    name: 'Piper Enterprise',
    progress: 75,
    status: 'active',
    color: '#2196F3',
    members: [
      { id: 1, name: 'Alice', avatar: 'A', color: '#FF6B6B' },
      { id: 2, name: 'Bob', avatar: 'B', color: '#4ECDC4' },
      { id: 3, name: 'Carol', avatar: 'C', color: '#45B7D1' },
    ],
  },
  {
    id: 2,
    name: 'Web platform',
    progress: 45,
    status: 'planning',
    color: '#4CAF50',
    members: [
      { id: 4, name: 'David', avatar: 'D', color: '#96CEB4' },
      { id: 5, name: 'Eve', avatar: 'E', color: '#FECA57' },
    ],
  },
  {
    id: 3,
    name: 'Mobile Loop',
    progress: 90,
    status: 'review',
    color: '#FF9800',
    members: [
      { id: 6, name: 'Frank', avatar: 'F', color: '#FF9FF3' },
    ],
  },
  {
    id: 4,
    name: 'Win Mobile App',
    progress: 60,
    status: 'active',
    color: '#9C27B0',
    members: [
      { id: 7, name: 'Grace', avatar: 'G', color: '#54A0FF' },
      { id: 8, name: 'Henry', avatar: 'H', color: '#5F27CD' },
      { id: 9, name: 'Ivy', avatar: 'I', color: '#00D2D3' },
    ],
  },
];

const teamMembers = [
  { id: 1, name: 'Karen Smith', role: 'Designer', avatar: 'KS', status: 'online', color: '#FF6B6B' },
  { id: 2, name: 'Steve McConnell', role: 'Developer', avatar: 'SM', status: 'online', color: '#4ECDC4' },
  { id: 3, name: 'Sarah Green', role: 'PM', avatar: 'SG', status: 'away', color: '#45B7D1' },
  { id: 4, name: 'Brad Smith', role: 'Developer', avatar: 'BS', status: 'offline', color: '#96CEB4' },
  { id: 5, name: 'Alice Cornell', role: 'Designer', avatar: 'AC', status: 'online', color: '#FECA57' },
];

const statusColors = {
  online: '#4CAF50',
  away: '#FF9800',
  offline: '#9E9E9E',
};

const ProjectSidebar = ({ selectedProject, onProjectSelect }) => {
  const [selectedItem, setSelectedItem] = useState('projects');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'projects', label: 'Projects', icon: <ProjectIcon /> },
    { id: 'team', label: 'Team', icon: <PeopleIcon /> },
    { id: 'time', label: 'Time', icon: <TimeIcon /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          bgcolor: '#fafbfc',
          borderRight: '1px solid #e0e7ff',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Avatar sx={{ bgcolor: '#2196F3', width: 32, height: 32 }}>
            <ProjectIcon />
          </Avatar>
          <Typography variant="h6" fontWeight={600}>
            Projects
          </Typography>
        </Box>

        {/* Navigation Menu */}
        <List sx={{ mb: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                selected={selectedItem === item.id}
                onClick={() => setSelectedItem(item.id)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: '#e3f2fd',
                    '&:hover': {
                      bgcolor: '#e3f2fd',
                    },
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

        <Divider sx={{ mb: 2 }} />

        {/* Projects Section */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
              Projects
            </Typography>
            <IconButton size="small">
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
                      bgcolor: '#e3f2fd',
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
                        {project.members.map((member) => (
                          <Avatar
                            key={member.id}
                            sx={{ bgcolor: member.color }}
                            title={member.name}
                          >
                            {member.avatar}
                          </Avatar>
                        ))}
                      </AvatarGroup>
                      <Typography variant="caption" color="text.secondary">
                        {project.progress}%
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
              color: 'text.secondary',
              borderColor: 'grey.300',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'primary.50',
              },
            }}
          >
            Add Project
          </Button>
        </Box>

        <Divider sx={{ mb: 2 }} />

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
        <Card sx={{ bgcolor: '#f8f9fa', border: '1px solid #e9ecef' }}>
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
    </Drawer>
  );
};

export default ProjectSidebar;
