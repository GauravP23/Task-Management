import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Add as AddIcon,
  Today as TodayIcon,
  ViewWeek as WeekIcon,
  ViewDay as DayIcon,
  ViewModule as MonthIcon,
} from '@mui/icons-material';
import { tasksAPI } from '../utils/api';

const CalendarView = ({ projectId }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    category: 'tasks'
  });

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
        let tasksData = [];
        
        if (projectId && projectId !== 'default') {
          const response = await tasksAPI.getByProject(projectId);
          tasksData = response.data || [];
        } else {
          // Enhanced mock data with calendar categories
          tasksData = [
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
          ];
        }

        // Load saved events from localStorage
        const savedEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
        const allTasks = [...tasksData, ...savedEvents];
        
        setTasks(allTasks);
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

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleDateClick = (date) => {
    setCreateEventOpen(true);
    // Set default start time to the selected date
    const defaultStart = new Date(date);
    defaultStart.setHours(9, 0); // 9:00 AM
    const defaultEnd = new Date(date);
    defaultEnd.setHours(10, 0); // 10:00 AM
    
    setEventForm({
      title: '',
      description: '',
      startDate: defaultStart.toISOString().slice(0, 16),
      endDate: defaultEnd.toISOString().slice(0, 16),
      category: 'tasks'
    });
  };

  // Handle form input changes
  const handleEventFormChange = (field, value) => {
    setEventForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle saving new event
  const handleSaveEvent = () => {
    if (!eventForm.title.trim()) {
      alert('Please enter an event title');
      return;
    }

    if (eventForm.startDate > eventForm.endDate) {
      alert('End date must be after start date');
      return;
    }

    // Create new task/event object
    const newEvent = {
      id: Date.now().toString(),
      _id: Date.now().toString(),
      title: eventForm.title.trim(),
      description: eventForm.description.trim(),
      dueDate: new Date(eventForm.startDate), // Store as Date object for compatibility
      startDate: eventForm.startDate,
      endDate: eventForm.endDate,
      status: 'pending',
      priority: 'medium',
      category: eventForm.category,
      type: 'event',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to tasks state
    setTasks(prevTasks => [...prevTasks, newEvent]);

    // Save to localStorage for persistence in mock mode
    const existingEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
    localStorage.setItem('calendarEvents', JSON.stringify([...existingEvents, newEvent]));

    // Close dialog and reset form
    setCreateEventOpen(false);
    setEventForm({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      category: 'tasks'
    });

    // Show success feedback
    console.log('Event created successfully:', newEvent.title);
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
              
              {/* Day headers */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(7, 1fr)', 
                gap: 0.5,
                mb: 1 
              }}>
                {dayNames.map(day => (
                  <Typography 
                    key={day}
                    variant="caption" 
                    sx={{ 
                      textAlign: 'center', 
                      color: 'hsl(0, 0%, 50%)',
                      fontWeight: 600,
                      fontSize: '10px'
                    }}
                  >
                    {day.charAt(0)}
                  </Typography>
                ))}
              </Box>
              
              {/* Calendar days */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(7, 1fr)', 
                gap: '2px'
              }}>
                {getDaysInMonth(currentDate).map((date, index) => (
                  <Box
                    key={index}
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
                      '&:hover': date ? { 
                        bgcolor: date.toDateString() === new Date().toDateString() 
                          ? 'hsl(243, 82%, 60%)' 
                          : 'hsl(243, 100%, 95%)' 
                      } : {},
                      position: 'relative',
                      fontSize: '11px',
                      fontWeight: 500
                    }}
                    onClick={() => date && handleDateClick(date)}
                  >
                    {date && (
                      <>
                        {date.getDate()}
                        {getTasksForDate(date).length > 0 && (
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 1,
                              right: 1,
                              width: 4,
                              height: 4,
                              borderRadius: '50%',
                              bgcolor: date.toDateString() === new Date().toDateString() 
                                ? 'white' 
                                : 'hsl(243, 82%, 67%)'
                            }}
                          />
                        )}
                      </>
                    )}
                  </Box>
                ))}
              </Box>
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
              value={eventForm.title}
              onChange={(e) => handleEventFormChange('title', e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={eventForm.description}
              onChange={(e) => handleEventFormChange('description', e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Start Date"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                value={eventForm.startDate}
                onChange={(e) => handleEventFormChange('startDate', e.target.value)}
                sx={{ flex: 1 }}
              />
              <TextField
                label="End Date"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                value={eventForm.endDate}
                onChange={(e) => handleEventFormChange('endDate', e.target.value)}
                sx={{ flex: 1 }}
              />
            </Box>
            <TextField
              select
              fullWidth
              label="Category"
              value={eventForm.category}
              onChange={(e) => handleEventFormChange('category', e.target.value)}
              SelectProps={{ native: true }}
            >
              <option value="tasks">Tasks</option>
              <option value="meetings">Meetings</option>
              <option value="deadlines">Deadlines</option>
              <option value="personal">Personal</option>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateEventOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEvent} sx={{ bgcolor: 'hsl(243, 82%, 67%)' }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CalendarView;
