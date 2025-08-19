import React, { useState, useEffect } from 'react';
import {
  Box,
  CssBaseline,
  CircularProgress,
  Typography,
  Alert,
} from '@mui/material';
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
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentView, setCurrentView] = useState('board');
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [sidebarView, setSidebarView] = useState('dashboard'); // New state for sidebar navigation
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [projects, setProjects] = useState([]);
  const [boards, setBoards] = useState([]);
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

  const handleProjectCreated = (newProject) => {
    setProjects(prev => [...prev, newProject]);
    setSelectedProject(newProject);
  };

  const renderMainContent = () => {
    if (!selectedProject) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: 'hsl(243, 82%, 55%)' }}>
            Select a project to get started
          </Typography>
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
            <Typography variant="h6" sx={{ color: 'hsl(243, 82%, 55%)' }}>
              Table view coming soon...
            </Typography>
          </Box>
        );
      case 'list':
        return (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: 'hsl(243, 82%, 55%)' }}>
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
          background: 'linear-gradient(135deg, hsl(243, 100%, 99%) 0%, hsl(243, 100%, 97%) 100%)',
        }}
      >
        <CircularProgress 
          size={40} 
          sx={{ color: 'hsl(243, 82%, 67%)' }}
        />
        <Typography variant="body1" sx={{ color: 'hsl(243, 82%, 55%)' }}>
          Loading your workspace...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      
      {error && (
        <Alert 
          severity="warning" 
          sx={{ 
            position: 'fixed', 
            top: 16, 
            right: 16, 
            zIndex: 1300,
            maxWidth: 400,
            bgcolor: 'hsl(45, 100%, 97%)',
            color: 'hsl(45, 82%, 35%)',
            border: '1px solid hsl(45, 100%, 85%)',
            boxShadow: '0 8px 32px hsla(45, 82%, 67%, 0.12)',
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
      />
      
      {/* Main Content */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          bgcolor: 'hsl(243, 100%, 99%)',
          minHeight: '100vh',
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
