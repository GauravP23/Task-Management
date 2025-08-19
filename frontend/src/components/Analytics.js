import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  LinearProgress,
  Chip,
  Avatar,
  AvatarGroup,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Assignment as TaskIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CompletedIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { tasksAPI, projectsAPI } from '../utils/api';

const Analytics = ({ selectedProject }) => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    inProgressTasks: 0,
    teamMembers: 0,
    projectProgress: 0,
    tasksByStatus: {
      todo: 0,
      'in-progress': 0,
      review: 0,
      done: 0,
    },
    recentActivity: [],
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!selectedProject) return;
      
      try {
        setLoading(true);
        
        // Fetch tasks
        const tasksResponse = await tasksAPI.getByProject(selectedProject._id || selectedProject.id);
        const tasks = tasksResponse.data;
        
        // Calculate analytics
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.status === 'done').length;
        const overdueTasks = tasks.filter(task => {
          return task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
        }).length;
        const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
        
        const tasksByStatus = {
          todo: tasks.filter(task => task.status === 'todo').length,
          'in-progress': tasks.filter(task => task.status === 'in-progress').length,
          review: tasks.filter(task => task.status === 'review').length,
          done: tasks.filter(task => task.status === 'done').length,
        };
        
        const projectProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        
        setAnalytics({
          totalTasks,
          completedTasks,
          overdueTasks,
          inProgressTasks,
          teamMembers: selectedProject.members?.length || 0,
          projectProgress,
          tasksByStatus,
          recentActivity: tasks.slice(0, 5), // Show recent 5 tasks
        });
        
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedProject]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <CircularProgress sx={{ color: 'hsl(243, 82%, 67%)' }} />
      </Box>
    );
  }

  const MetricCard = ({ title, value, icon, color, subtitle }) => (
    <Card className="card-modern" sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: 'hsl(243, 82%, 25%)', mb: 0.5 }}>
              {value}
            </Typography>
            <Typography variant="body2" sx={{ color: 'hsl(243, 82%, 55%)' }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" sx={{ color: 'hsl(243, 82%, 65%)' }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: 'hsl(243, 82%, 25%)' }}>
        Analytics Dashboard
      </Typography>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Tasks"
            value={analytics.totalTasks}
            icon={<TaskIcon />}
            color="hsl(243, 82%, 67%)"
            subtitle="All project tasks"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Completed"
            value={analytics.completedTasks}
            icon={<CompletedIcon />}
            color="hsl(142, 68%, 55%)"
            subtitle={`${analytics.projectProgress}% complete`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="In Progress"
            value={analytics.inProgressTasks}
            icon={<TrendingUpIcon />}
            color="hsl(200, 68%, 60%)"
            subtitle="Active tasks"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Overdue"
            value={analytics.overdueTasks}
            icon={<WarningIcon />}
            color="hsl(0, 68%, 65%)"
            subtitle="Need attention"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Project Progress */}
        <Grid item xs={12} md={6}>
          <Card className="card-modern">
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: 'hsl(243, 82%, 25%)' }}>
                Project Progress
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h3" fontWeight={700} sx={{ color: 'hsl(243, 82%, 67%)', mr: 1 }}>
                  {analytics.projectProgress}%
                </Typography>
                <Typography variant="body2" sx={{ color: 'hsl(243, 82%, 55%)' }}>
                  Complete
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={analytics.projectProgress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'hsl(243, 100%, 95%)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(135deg, hsl(243, 82%, 67%) 0%, hsl(243, 82%, 77%) 100%)',
                    borderRadius: 4,
                  },
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Typography variant="caption" sx={{ color: 'hsl(243, 82%, 55%)' }}>
                  {analytics.completedTasks} of {analytics.totalTasks} tasks completed
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Task Distribution */}
        <Grid item xs={12} md={6}>
          <Card className="card-modern">
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: 'hsl(243, 82%, 25%)' }}>
                Task Distribution
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {Object.entries(analytics.tasksByStatus).map(([status, count]) => {
                  const colors = {
                    todo: 'hsl(0, 68%, 65%)',
                    'in-progress': 'hsl(200, 68%, 60%)',
                    review: 'hsl(35, 100%, 65%)',
                    done: 'hsl(142, 68%, 55%)',
                  };
                  
                  const percentage = analytics.totalTasks > 0 ? (count / analytics.totalTasks) * 100 : 0;
                  
                  return (
                    <Box key={status}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              bgcolor: colors[status],
                            }}
                          />
                          <Typography variant="body2" sx={{ color: 'hsl(243, 82%, 35%)', textTransform: 'capitalize' }}>
                            {status.replace('-', ' ')}
                          </Typography>
                        </Box>
                        <Typography variant="body2" fontWeight={600} sx={{ color: 'hsl(243, 82%, 25%)' }}>
                          {count}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: 'hsl(243, 100%, 95%)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: colors[status],
                            borderRadius: 3,
                          },
                        }}
                      />
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Team Overview */}
        <Grid item xs={12} md={6}>
          <Card className="card-modern">
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: 'hsl(243, 82%, 25%)' }}>
                Team Overview
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box>
                  <Typography variant="h4" fontWeight={700} sx={{ color: 'hsl(243, 82%, 67%)' }}>
                    {analytics.teamMembers}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'hsl(243, 82%, 55%)' }}>
                    Team Members
                  </Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 48, color: 'hsl(243, 82%, 67%)' }} />
              </Box>
              {selectedProject?.members && (
                <AvatarGroup max={6} sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
                  {selectedProject.members.map((member, index) => (
                    <Avatar 
                      key={member._id || member.id || index}
                      sx={{ bgcolor: `hsl(${(index * 60) % 360}, 68%, 70%)` }}
                      title={member.name || member.email}
                    >
                      {(member.name || member.email)?.charAt(0).toUpperCase()}
                    </Avatar>
                  ))}
                </AvatarGroup>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card className="card-modern">
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: 'hsl(243, 82%, 25%)' }}>
                Recent Activity
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {analytics.recentActivity.length > 0 ? (
                  analytics.recentActivity.map((task, index) => (
                    <Box key={task._id || index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip
                        label={task.status}
                        size="small"
                        className={`status-chip-${task.status}`}
                        sx={{ minWidth: 80 }}
                      />
                      <Typography variant="body2" sx={{ color: 'hsl(243, 82%, 35%)', flex: 1 }}>
                        {task.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'hsl(243, 82%, 65%)' }}>
                        {task.priority || 'Medium'}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ color: 'hsl(243, 82%, 55%)', textAlign: 'center', py: 2 }}>
                    No recent activity
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
