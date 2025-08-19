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
  DialogActions,
  TextField,
  Grid,
  Paper,
  Badge,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Add as AddIcon,
  Event as EventIcon,
  Today as TodayIcon,
  ViewWeek as WeekIcon,
  ViewDay as DayIcon,
  ViewModule as MonthIcon,
  Schedule as ScheduleIcon,
  Circle as CircleIcon,
} from '@mui/icons-material';
import { tasksAPI } from '../utils/api';

const CalendarView = ({ projectId }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // 'month', 'week', 'day'
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [selectedDateForEvent, setSelectedDateForEvent] = useState(null);

  // Calendar categories (like Google Calendar's "My calendars")
  const [calendars, setCalendars] = useState([
    { id: 'tasks', name: 'Tasks', color: 'hsl(243, 82%, 67%)', visible: true },
    { id: 'meetings', name: 'Meetings', color: 'hsl(142, 68%, 55%)', visible: true },
    { id: 'deadlines', name: 'Deadlines', color: 'hsl(0, 68%, 65%)', visible: true },
    { id: 'personal', name: 'Personal', color: 'hsl(35, 100%, 65%)', visible: false },
  ]);

  useEffect(() => {
    const fetchTasksData = async () => {
      try {
        setLoading(true);
        if (projectId && projectId !== 'default') {
          const response = await tasksAPI.getByProject(projectId);
          setTasks(response.data || []);
        } else {
          // Enhanced mock data with calendar categories
          setTasks([
            {
              id: 1,
              title: 'Team Standup',
              description: 'Daily team synchronization',
              dueDate: new Date(2025, 7, 19, 9, 0),
              endDate: new Date(2025, 7, 19, 9, 30),
              priority: 'medium',
              status: 'todo',
              category: 'meetings',
              type: 'meeting'
            },
            {
              id: 2,
              title: 'Design Review',
              description: 'Review new design proposals',
              dueDate: new Date(2025, 7, 20, 14, 0),
              endDate: new Date(2025, 7, 20, 15, 30),
              priority: 'high',
              status: 'todo',
              category: 'meetings',
              type: 'meeting'
            },
            {
              id: 3,
              title: 'Project Deadline',
              description: 'Final submission',
              dueDate: new Date(2025, 7, 22),
              priority: 'high',
              status: 'todo',
              category: 'deadlines',
              type: 'deadline'
            },
            {
              id: 4,
              title: 'Code Implementation',
              description: 'Implement new features',
              dueDate: new Date(2025, 7, 21, 10, 0),
              endDate: new Date(2025, 7, 21, 12, 0),
              priority: 'medium',
              status: 'inprogress',
              category: 'tasks',
              type: 'task'
            },
            {
              id: 5,
              title: 'Client Presentation',
              description: 'Present project progress',
              dueDate: new Date(2025, 7, 23, 15, 0),
              endDate: new Date(2025, 7, 23, 16, 0),
              priority: 'high',
              status: 'todo',
              category: 'meetings',
              type: 'meeting'
            }
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasksData();
  }, [projectId]);

  // Utility functions
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

  const handleDateClick = (date) => {
    setSelectedDateForEvent(date);
    setCreateEventOpen(true);
  };

  const handleCalendarToggle = (calendarId) => {
    setCalendars(prev => prev.map(cal => 
      cal.id === calendarId ? { ...cal, visible: !cal.visible } : cal
    ));
  };

  const getVisibleTasks = () => {
    const visibleCalendarIds = calendars.filter(cal => cal.visible).map(cal => cal.id);
    return tasks.filter(task => visibleCalendarIds.includes(task.category));
  };

  const getTasksForDate = (date) => {
    return getVisibleTasks().filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <Typography>Loading calendar...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
      {/* Google Calendar-style Header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid hsl(0, 0%, 90%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        bgcolor: 'white',
        zIndex: 10,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            onClick={() => setCurrentDate(new Date())}
            sx={{ 
              color: 'hsl(243, 82%, 67%)',
              border: '1px solid hsl(243, 100%, 90%)',
              borderRadius: 1,
              px: 2,
              py: 0.5,
              '&:hover': { bgcolor: 'hsl(243, 100%, 98%)' }
            }}
          >
            <TodayIcon sx={{ mr: 1, fontSize: 18 }} />
            <Typography variant="body2" fontWeight={500}>Today</Typography>
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              sx={{ color: 'hsl(0, 0%, 40%)' }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton 
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              sx={{ color: 'hsl(0, 0%, 40%)' }}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>
          
          <Typography variant="h5" fontWeight={400} sx={{ color: 'hsl(0, 0%, 20%)', ml: 2 }}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(e, newView) => newView && setView(newView)}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                border: '1px solid hsl(0, 0%, 85%)',
                color: 'hsl(0, 0%, 40%)',
                px: 2,
                py: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'hsl(243, 82%, 67%)',
                  color: 'white',
                  '&:hover': { bgcolor: 'hsl(243, 82%, 60%)' }
                }
              }
            }}
          >
            <ToggleButton value="day">
              <DayIcon sx={{ mr: 1, fontSize: 16 }} />
              Day
            </ToggleButton>
            <ToggleButton value="week">
              <WeekIcon sx={{ mr: 1, fontSize: 16 }} />
              Week
            </ToggleButton>
            <ToggleButton value="month">
              <MonthIcon sx={{ mr: 1, fontSize: 16 }} />
              Month
            </ToggleButton>
          </ToggleButtonGroup>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateEventOpen(true)}
            sx={{
              bgcolor: 'hsl(243, 82%, 67%)',
              color: 'white',
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 2,
              px: 3,
              '&:hover': { bgcolor: 'hsl(243, 82%, 60%)' }
            }}
          >
            Create
          </Button>
        </Box>
      </Box>

      {/* Main Content Area - Google Calendar Layout */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Sidebar - Mini Calendar & My Calendars */}
        <Box sx={{ 
          width: 280, 
          borderRight: '1px solid hsl(0, 0%, 90%)', 
          bgcolor: 'hsl(0, 0%, 99%)',
          p: 2,
          overflow: 'auto'
        }}>
          {/* Mini Calendar */}
          <Card sx={{ mb: 3, boxShadow: 'none', border: '1px solid hsl(0, 0%, 92%)' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ color: 'hsl(0, 0%, 30%)' }}>
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </Typography>
                <Box>
                  <IconButton 
                    size="small"
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  >
                    <ChevronLeftIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small"
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  >
                    <ChevronRightIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              
              <Grid container spacing={0}>
                {dayNames.map(day => (
                  <Grid item xs key={day}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'block', 
                        textAlign: 'center', 
                        color: 'hsl(0, 0%, 50%)',
                        fontWeight: 500,
                        mb: 1
                      }}
                    >
                      {day.charAt(0)}
                    </Typography>
                  </Grid>
                ))}
                {getDaysInMonth(currentDate).map((date, index) => (
                  <Grid item xs key={index}>
                    <Box
                      sx={{
                        height: 28,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: date ? 'pointer' : 'default',
                        borderRadius: '50%',
                        bgcolor: date && date.toDateString() === new Date().toDateString() 
                          ? 'hsl(243, 82%, 67%)' : 'transparent',
                        color: date && date.toDateString() === new Date().toDateString() 
                          ? 'white' : 'hsl(0, 0%, 30%)',
                        '&:hover': date ? { bgcolor: 'hsl(243, 100%, 95%)' } : {},
                        position: 'relative'
                      }}
                      onClick={() => date && handleDateClick(date)}
                    >
                      {date && (
                        <>
                          <Typography variant="body2" sx={{ fontSize: 12 }}>
                            {date.getDate()}
                          </Typography>
                          {getTasksForDate(date).length > 0 && (
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: 2,
                                width: 4,
                                height: 4,
                                borderRadius: '50%',
                                bgcolor: 'hsl(243, 82%, 67%)'
                              }}
                            />
                          )}
                        </>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* My Calendars Section */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: 'hsl(0, 0%, 30%)' }}>
              My calendars
            </Typography>
            <List dense>
              {calendars.map((calendar) => (
                <ListItem key={calendar.id} sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Checkbox
                      checked={calendar.visible}
                      onChange={() => handleCalendarToggle(calendar.id)}
                      sx={{
                        color: calendar.color,
                        p: 0,
                        '&.Mui-checked': { color: calendar.color }
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText 
                    primary={calendar.name}
                    primaryTypographyProps={{
                      variant: 'body2',
                      color: calendar.visible ? 'hsl(0, 0%, 20%)' : 'hsl(0, 0%, 60%)'
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>

        {/* Main Calendar Grid */}
        <Box sx={{ flex: 1, overflow: 'auto', bgcolor: 'white' }}>
          {/* Day Names Header */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)',
            borderBottom: '1px solid hsl(0, 0%, 90%)',
            bgcolor: 'hsl(0, 0%, 98%)',
            position: 'sticky',
            top: 0,
            zIndex: 5
          }}>
            {dayNames.map(day => (
              <Box key={day} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ color: 'hsl(0, 0%, 40%)' }}>
                  {day}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Calendar Grid */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)',
            height: 'calc(100vh - 180px)',
            borderRight: '1px solid hsl(0, 0%, 90%)'
          }}>
            {getDaysInMonth(currentDate).map((date, index) => (
              <Box
                key={index}
                sx={{
                  borderLeft: '1px solid hsl(0, 0%, 90%)',
                  borderBottom: '1px solid hsl(0, 0%, 90%)',
                  p: 1,
                  minHeight: 120,
                  bgcolor: date ? (
                    date.toDateString() === new Date().toDateString() 
                      ? 'hsl(243, 100%, 99%)' 
                      : 'white'
                  ) : 'hsl(0, 0%, 97%)',
                  cursor: date ? 'pointer' : 'default',
                  '&:hover': date ? { bgcolor: 'hsl(243, 100%, 99%)' } : {},
                  position: 'relative'
                }}
                onClick={() => date && handleDateClick(date)}
              >
                {date && (
                  <>
                    <Typography 
                      variant="body2" 
                      fontWeight={date.toDateString() === new Date().toDateString() ? 700 : 500}
                      sx={{ 
                        color: date.toDateString() === new Date().toDateString() 
                          ? 'hsl(243, 82%, 67%)' 
                          : 'hsl(0, 0%, 30%)',
                        mb: 1
                      }}
                    >
                      {date.getDate()}
                    </Typography>
                    
                    {/* Events for this date */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {getTasksForDate(date).slice(0, 3).map((task) => {
                        const calendar = calendars.find(cal => cal.id === task.category);
                        return (
                          <Tooltip key={task.id} title={task.description}>
                            <Box
                              sx={{
                                fontSize: 11,
                                p: 0.5,
                                borderRadius: 1,
                                bgcolor: calendar?.color || 'hsl(243, 82%, 67%)',
                                color: 'white',
                                cursor: 'pointer',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                '&:hover': { opacity: 0.8 }
                              }}
                            >
                              {task.endDate && formatTime(task.dueDate)} {task.title}
                            </Box>
                          </Tooltip>
                        );
                      })}
                      {getTasksForDate(date).length > 3 && (
                        <Typography variant="caption" sx={{ color: 'hsl(0, 0%, 50%)', fontSize: 10 }}>
                          +{getTasksForDate(date).length - 3} more
                        </Typography>
                      )}
                    </Box>
                  </>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Create Event Dialog */}
      <Dialog open={createEventOpen} onClose={() => setCreateEventOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Event Title"
              placeholder="Add title"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Start Date"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                defaultValue={selectedDateForEvent?.toISOString().slice(0, 16)}
                sx={{ flex: 1 }}
              />
              <TextField
                label="End Date"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                sx={{ flex: 1 }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateEventOpen(false)}>Cancel</Button>
          <Button variant="contained" sx={{ bgcolor: 'hsl(243, 82%, 67%)' }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CalendarView;
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
