import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Paper,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Add as AddIcon,
  Event as EventIcon,
  Today as TodayIcon,
} from '@mui/icons-material';
import { tasksAPI } from '../utils/api';

const CalendarView = ({ projectId }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasksData = async () => {
      try {
        setLoading(true);
        if (projectId && projectId !== 'default') {
          const response = await tasksAPI.getByProject(projectId);
          setTasks(response.data || []);
        } else {
          // Mock data for demo
          setTasks([
            {
              id: 1,
              title: 'Design Review Meeting',
              description: 'Review new design proposals',
              dueDate: new Date(2025, 7, 20),
              priority: 'high',
              status: 'todo',
              assignedTo: [{ name: 'Alice', avatar: 'A' }],
            },
            {
              id: 2,
              title: 'Update Documentation',
              description: 'Update API documentation',
              dueDate: new Date(2025, 7, 22),
              priority: 'medium',
              status: 'in-progress',
              assignedTo: [{ name: 'Bob', avatar: 'B' }],
            },
            {
              id: 3,
              title: 'Code Review',
              description: 'Review pull request #123',
              dueDate: new Date(2025, 7, 25),
              priority: 'low',
              status: 'review',
              assignedTo: [{ name: 'Carol', avatar: 'C' }],
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasksData();
  }, [projectId]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDate = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDate; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getTasksForDate = (date) => {
    if (!date) return [];
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date) => {
    const tasksForDate = getTasksForDate(date);
    setSelectedDate(date);
    setSelectedTasks(tasksForDate);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'hsl(0, 85%, 65%)';
      case 'medium': return 'hsl(35, 85%, 65%)';
      case 'low': return 'hsl(142, 85%, 65%)';
      default: return 'hsl(243, 82%, 67%)';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return 'hsl(0, 85%, 92%)';
      case 'in-progress': return 'hsl(200, 85%, 92%)';
      case 'review': return 'hsl(35, 85%, 92%)';
      case 'done': return 'hsl(142, 85%, 92%)';
      default: return 'hsl(243, 100%, 97%)';
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <Typography>Loading calendar...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Calendar Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        pb: 2,
        borderBottom: '1px solid hsl(243, 100%, 94%)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" fontWeight={700} sx={{ color: 'hsl(243, 82%, 25%)' }}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              onClick={() => navigateMonth(-1)}
              sx={{ color: 'hsl(243, 82%, 67%)' }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton 
              onClick={() => navigateMonth(1)}
              sx={{ color: 'hsl(243, 82%, 67%)' }}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<TodayIcon />}
            onClick={goToToday}
            sx={{
              borderColor: 'hsl(243, 82%, 67%)',
              color: 'hsl(243, 82%, 67%)',
              '&:hover': {
                borderColor: 'hsl(243, 82%, 57%)',
                bgcolor: 'hsl(243, 100%, 97%)',
              },
            }}
          >
            Today
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            className="button-primary-modern"
            sx={{
              background: 'linear-gradient(135deg, hsl(243, 82%, 67%) 0%, hsl(252, 82%, 67%) 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, hsl(243, 82%, 57%) 0%, hsl(252, 82%, 57%) 100%)',
              },
            }}
          >
            Add Task
          </Button>
        </Box>
      </Box>

      {/* Calendar Grid */}
      <Card className="card-modern" sx={{ mb: 3 }}>
        <CardContent sx={{ p: 0 }}>
          {/* Day Headers */}
          <Grid container>
            {dayNames.map((day) => (
              <Grid item xs key={day}>
                <Box sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  bgcolor: 'hsl(243, 100%, 97%)',
                  borderBottom: '1px solid hsl(243, 100%, 94%)',
                }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ color: 'hsl(243, 82%, 55%)' }}>
                    {day}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Calendar Days */}
          <Grid container>
            {getDaysInMonth(currentDate).map((date, index) => {
              const tasksForDate = getTasksForDate(date);
              const isToday = date && date.toDateString() === new Date().toDateString();
              
              return (
                <Grid item xs key={index}>
                  <Paper
                    sx={{
                      minHeight: 120,
                      p: 1,
                      m: 0.5,
                      cursor: date ? 'pointer' : 'default',
                      bgcolor: date ? 'hsl(0, 0%, 100%)' : 'hsl(243, 100%, 99%)',
                      border: isToday ? '2px solid hsl(243, 82%, 67%)' : '1px solid hsl(243, 100%, 94%)',
                      borderRadius: 1,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: date ? 'hsl(243, 100%, 98%)' : 'hsl(243, 100%, 99%)',
                        transform: date ? 'translateY(-2px)' : 'none',
                        boxShadow: date ? '0 4px 16px hsla(243, 82%, 67%, 0.1)' : 'none',
                      },
                    }}
                    onClick={() => date && handleDateClick(date)}
                  >
                    {date && (
                      <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography 
                            variant="body2" 
                            fontWeight={isToday ? 700 : 500}
                            sx={{ 
                              color: isToday ? 'hsl(243, 82%, 67%)' : 'hsl(243, 82%, 35%)',
                            }}
                          >
                            {date.getDate()}
                          </Typography>
                          {tasksForDate.length > 0 && (
                            <Badge 
                              badgeContent={tasksForDate.length} 
                              sx={{
                                '& .MuiBadge-badge': {
                                  bgcolor: 'hsl(243, 82%, 67%)',
                                  color: 'white',
                                  fontSize: '0.7rem',
                                  minWidth: 16,
                                  height: 16,
                                },
                              }}
                            />
                          )}
                        </Box>
                        
                        {/* Task previews */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          {tasksForDate.slice(0, 2).map((task) => (
                            <Tooltip key={task.id} title={task.description || task.title}>
                              <Box
                                sx={{
                                  bgcolor: getStatusColor(task.status),
                                  borderLeft: `3px solid ${getPriorityColor(task.priority)}`,
                                  p: 0.5,
                                  borderRadius: 0.5,
                                  cursor: 'pointer',
                                }}
                              >
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    display: 'block',
                                    color: 'hsl(243, 82%, 35%)',
                                    fontSize: '0.7rem',
                                    lineHeight: 1.2,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {task.title}
                                </Typography>
                              </Box>
                            </Tooltip>
                          ))}
                          {tasksForDate.length > 2 && (
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: 'hsl(243, 82%, 55%)',
                                textAlign: 'center',
                                fontSize: '0.7rem',
                              }}
                            >
                              +{tasksForDate.length - 2} more
                            </Typography>
                          )}
                        </Box>
                      </>
                    )}
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>

      {/* Task Details Dialog */}
      <Dialog
        open={Boolean(selectedDate)}
        onClose={() => setSelectedDate(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'hsl(0, 0%, 100%)',
            border: '1px solid hsl(243, 100%, 94%)',
            boxShadow: '0 24px 64px hsla(243, 82%, 67%, 0.15)',
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'hsl(243, 100%, 97%)',
          color: 'hsl(243, 82%, 25%)',
          borderBottom: '1px solid hsl(243, 100%, 94%)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventIcon />
            <Typography variant="h6" fontWeight={600}>
              {selectedDate && selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedTasks.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {selectedTasks.map((task) => (
                <Card key={task.id} className="card-modern">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" fontWeight={600} sx={{ color: 'hsl(243, 82%, 25%)' }}>
                        {task.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip 
                          label={task.priority} 
                          size="small"
                          sx={{
                            bgcolor: getPriorityColor(task.priority),
                            color: 'white',
                            fontWeight: 500,
                          }}
                        />
                        <Chip 
                          label={task.status} 
                          size="small"
                          sx={{
                            bgcolor: getStatusColor(task.status),
                            color: 'hsl(243, 82%, 35%)',
                            fontWeight: 500,
                          }}
                        />
                      </Box>
                    </Box>
                    {task.description && (
                      <Typography variant="body2" sx={{ color: 'hsl(243, 82%, 55%)', mb: 2 }}>
                        {task.description}
                      </Typography>
                    )}
                    {task.assignedTo && task.assignedTo.length > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ color: 'hsl(243, 82%, 55%)' }}>
                          Assigned to:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {task.assignedTo.map((person, index) => (
                            <Avatar 
                              key={index}
                              sx={{ 
                                width: 24, 
                                height: 24, 
                                fontSize: '0.7rem',
                                bgcolor: 'hsl(243, 82%, 67%)',
                              }}
                            >
                              {person.avatar}
                            </Avatar>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <EventIcon sx={{ fontSize: 48, color: 'hsl(243, 82%, 80%)', mb: 2 }} />
              <Typography variant="h6" sx={{ color: 'hsl(243, 82%, 55%)', mb: 1 }}>
                No tasks for this date
              </Typography>
              <Typography variant="body2" sx={{ color: 'hsl(243, 82%, 65%)' }}>
                Click "Add Task" to create a new task for this date.
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CalendarView;
