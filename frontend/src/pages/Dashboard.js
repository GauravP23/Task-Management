import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  CssBaseline,
  CircularProgress,
  Typography,
  Alert,
  useTheme,
  useMediaQuery,
  IconButton,
  AppBar,
  Toolbar,
  Grid,
  Card,
  Avatar,
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Assignment,
  Add,
  Person,
  BarChart,
} from '@mui/icons-material';
import ProjectSidebar from '../components/ProjectSidebar';
import ProjectHeader from '../components/ProjectHeader';
import KanbanBoard from '../components/KanbanBoard';
import CalendarView from '../components/CalendarView';
import BoardManagement from '../components/BoardManagement';
import Analytics from '../components/Analytics';
import TaskManagement from '../components/TaskManagement';
import CreateProjectDialog from '../components/CreateProjectDialog';
import { useAuth } from '../context/AuthContext';
import { projectsAPI, tasksAPI } from '../utils/api';

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentView, setCurrentView] = useState('board');
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [sidebarView, setSidebarView] = useState('dashboard'); // New state for sidebar navigation
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [projects, setProjects] = useState([]);
  const [taskCounts, setTaskCounts] = useState({});
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await projectsAPI.getAll();
        const userProjects = response.data;
        
        setProjects(userProjects);
        
        // Auto-select first project if available
        if (userProjects.length > 0 && !selectedProject) {
          setSelectedProject(userProjects[0]);
        }
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setError('Failed to load projects. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProjects();
    }
  }, [user, selectedProject]);

  // Fetch task counts when project changes
  useEffect(() => {
    const fetchTaskCounts = async () => {
      if (selectedProject) {
        try {
          const response = await tasksAPI.getByProject(selectedProject._id || selectedProject.id);
          const tasks = response.data;
          
          const counts = {
            todo: tasks.filter(task => task.status === 'todo').length,
            'in-progress': tasks.filter(task => task.status === 'in-progress').length,
            review: tasks.filter(task => task.status === 'review').length,
            done: tasks.filter(task => task.status === 'done').length,
          };
          
          setTaskCounts(counts);
        } catch (err) {
          console.error('Failed to fetch task counts:', err);
        }
      }
    };

    fetchTaskCounts();
  }, [selectedProject]);

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleBoardSelect = (board) => {
    setSelectedBoard(board);
  };

  const handleCreateProject = () => {
    setCreateProjectOpen(true);
  };

  const handleCloseCreateProject = () => {
    setCreateProjectOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProjectCreated = (newProject) => {
    setProjects(prev => [...prev, newProject]);
    setSelectedProject(newProject);
  };

  const renderMainContent = () => {
    // Show dashboard overview when no project is selected or when in dashboard view
    if (!selectedProject || sidebarView === 'dashboard') {
      return (
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Welcome to Task Management System
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Get started by selecting a project or create a new one
          </Typography>
          
          {/* Quick Navigation Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { 
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                    transition: 'all 0.2s ease-in-out'
                  }
                }}
                onClick={() => navigate('/tasks')}
              >
                <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
                  <Assignment />
                </Avatar>
                <Typography variant="h6" fontWeight={600}>Task Management</Typography>
                <Typography variant="body2" color="text.secondary">
                  Organize and track all your tasks
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { 
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                    transition: 'all 0.2s ease-in-out'
                  }
                }}
                onClick={() => navigate('/projects/create')}
              >
                <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2 }}>
                  <Add />
                </Avatar>
                <Typography variant="h6" fontWeight={600}>Create Project</Typography>
                <Typography variant="body2" color="text.secondary">
                  Start a new project with team
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { 
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                    transition: 'all 0.2s ease-in-out'
                  }
                }}
                onClick={() => navigate('/profile')}
              >
                <Avatar sx={{ bgcolor: 'info.main', mx: 'auto', mb: 2 }}>
                  <Person />
                </Avatar>
                <Typography variant="h6" fontWeight={600}>Profile Setup</Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage your account settings
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { 
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                    transition: 'all 0.2s ease-in-out'
                  }
                }}
                onClick={() => setSidebarView('analytics')}
              >
                <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 2 }}>
                  <BarChart />
                </Avatar>
                <Typography variant="h6" fontWeight={600}>Analytics</Typography>
                <Typography variant="body2" color="text.secondary">
                  View project insights and reports
                </Typography>
              </Card>
            </Grid>
          </Grid>
          
          {/* Recent Projects */}
          {projects.length > 0 && (
            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Recent Projects
              </Typography>
              <Grid container spacing={2}>
                {projects.slice(0, 3).map((project) => (
                  <Grid item xs={12} sm={6} md={4} key={project.id || project._id}>
                    <Card 
                      sx={{ 
                        p: 2,
                        cursor: 'pointer',
                        '&:hover': { boxShadow: 2 }
                      }}
                      onClick={() => handleProjectSelect(project)}
                    >
                      <Typography variant="subtitle1" fontWeight={600}>
                        {project.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {project.description}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      );
    }

    // Handle sidebar navigation views
    if (sidebarView === 'analytics') {
      return <Analytics selectedProject={selectedProject} />;
    }
    
    if (sidebarView === 'tasks') {
      return <TaskManagement selectedProject={selectedProject} />;
    }

    if (sidebarView === 'calendar') {
      return <CalendarView projectId={selectedProject._id || selectedProject.id} />;
    }

    // Handle header navigation views (board, table, list, etc.)
    switch (currentView) {
      case 'board':
        return <KanbanBoard projectId={selectedProject._id || selectedProject.id} boardId={selectedBoard?.id} />;
      case 'calendar':
        return <CalendarView projectId={selectedProject._id || selectedProject.id} />;
      case 'boards':
        return (
          <BoardManagement 
            projectId={selectedProject._id || selectedProject.id} 
            onBoardSelect={handleBoardSelect}
            selectedBoard={selectedBoard}
          />
        );
      case 'table':
        return (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              Table view coming soon...
            </Typography>
          </Box>
        );
      case 'list':
        return (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              List view coming soon...
            </Typography>
          </Box>
        );
      default:
        return <KanbanBoard projectId={selectedProject._id || selectedProject.id} boardId={selectedBoard?.id} />;
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          flexDirection: 'column',
          gap: 2,
          background: theme.palette.mode === 'light' 
            ? 'linear-gradient(135deg, rgba(67, 56, 202, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(67, 56, 202, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
        }}
      >
        <CircularProgress 
          size={40} 
          sx={{ color: 'primary.main' }}
        />
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Loading your workspace...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* Mobile App Bar */}
      {isMobile && (
        <AppBar 
          position="fixed" 
          sx={{ 
            zIndex: (theme) => theme.zIndex.drawer + 1,
            bgcolor: 'background.paper',
            color: 'text.primary',
            boxShadow: 1,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {selectedProject?.name || 'TaskFlow'}
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {error && (
        <Alert 
          severity="warning" 
          sx={{ 
            position: 'fixed', 
            top: 16, 
            right: 16, 
            zIndex: 1300,
            maxWidth: 400,
            bgcolor: 'warning.light',
            color: 'warning.contrastText',
            border: 1,
            borderColor: 'warning.main',
            boxShadow: 2,
          }}
        >
          {error}
        </Alert>
      )}
      
      {/* Sidebar */}
      <ProjectSidebar 
        selectedProject={selectedProject}
        onProjectSelect={handleProjectSelect}
        onNavigationChange={setSidebarView}
        projects={projects}
        setProjects={setProjects}
        onCreateProject={handleCreateProject}
        mobileOpen={mobileOpen}
        onMobileClose={handleDrawerToggle}
      />
      
      {/* Main Content */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          bgcolor: 'background.default',
          minHeight: '100vh',
          ...(isMobile && { mt: 8 }), // Account for mobile app bar height
        }}
      >
        <ProjectHeader 
          project={selectedProject}
          onViewChange={handleViewChange}
          currentView={currentView}
          taskCounts={taskCounts}
        />
        {renderMainContent()}
      </Box>
      
      {/* Create Project Dialog */}
      <CreateProjectDialog
        open={createProjectOpen}
        onClose={handleCloseCreateProject}
        onProjectCreated={handleProjectCreated}
      />
    </Box>
  );
};

export default Dashboard;
