import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  AvatarGroup,
  Chip,
  IconButton,
  Button,
  LinearProgress,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Schedule as ScheduleIcon,
  Comment as CommentIcon,
  Attachment as AttachmentIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { DndContext, closestCenter, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CreateTaskModal from './CreateTaskModal';
import { tasksAPI } from '../utils/api';

// Mock data for demonstration
const mockTasks = {
  'todo': [
    {
      id: '1',
      title: 'Wireframing',
      description: 'Create wireframes for the new product feature',
      priority: 'high',
      stage: 'UX design',
      progress: 0,
      assignees: [
        { id: 1, name: 'Karen Smith', avatar: 'KS', color: '#FF6B6B' },
        { id: 2, name: 'Steve McConnell', avatar: 'SM', color: '#4ECDC4' },
      ],
      comments: 2,
      attachments: 0,
      dueDate: '2025-08-25',
    },
    {
      id: '2',
      title: 'First design concept',
      description: 'Create a concept based on requirements and stakeholder discovery phase',
      priority: 'medium',
      stage: 'Design',
      progress: 0,
      assignees: [
        { id: 3, name: 'John Doe', avatar: 'JD', color: '#95E1D3' },
      ],
      comments: 1,
      attachments: 2,
      dueDate: '2025-08-28',
    },
  ],
  'in-progress': [
    {
      id: '3',
      title: 'User research',
      description: 'Conduct user interviews and analyze feedback',
      priority: 'high',
      stage: 'Research',
      progress: 65,
      assignees: [
        { id: 4, name: 'Alice Johnson', avatar: 'AJ', color: '#FFE66D' },
        { id: 5, name: 'Bob Wilson', avatar: 'BW', color: '#FF8B94' },
      ],
      comments: 5,
      attachments: 1,
      dueDate: '2025-08-30',
    },
  ],
  'review': [
    {
      id: '4',
      title: 'Design system',
      description: 'Create comprehensive design system documentation',
      priority: 'medium',
      stage: 'Design',
      progress: 90,
      assignees: [
        { id: 6, name: 'Emma Davis', avatar: 'ED', color: '#A8E6CF' },
      ],
      comments: 3,
      attachments: 3,
      dueDate: '2025-09-01',
    },
  ],
  'done': [
    {
      id: '5',
      title: 'Project kickoff',
      description: 'Initial project meeting and requirements gathering',
      priority: 'high',
      stage: 'Planning',
      progress: 100,
      assignees: [
        { id: 7, name: 'Mike Brown', avatar: 'MB', color: '#FFB3BA' },
      ],
      comments: 8,
      attachments: 5,
      dueDate: '2025-08-20',
    },
  ],
};

// Priority colors
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high': return '#ef4444';
    case 'medium': return '#f59e0b';
    case 'low': return '#10b981';
    default: return '#6b7280';
  }
};

// Task Card Component
const TaskCard = ({ task, onDelete, isDragging = false }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
  };

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    onDelete(task.id);
    handleMenuClose();
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        mb: 2,
        cursor: 'grab',
        '&:hover': {
          boxShadow: 4,
        },
        ...(isDragging && {
          opacity: 0.5,
          transform: 'rotate(5deg)',
        }),
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Chip
            label={task.priority}
            size="small"
            sx={{
              bgcolor: getPriorityColor(task.priority),
              color: 'white',
              fontSize: '0.7rem',
              fontWeight: 600,
            }}
          />
          <IconButton
            size="small"
            onClick={handleMenuClick}
            sx={{ mt: -0.5, mr: -0.5 }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>

        <Typography variant="h6" component="h3" gutterBottom sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
          {task.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.8rem' }}>
          {task.description}
        </Typography>

        {task.progress > 0 && (
          <Box sx={{ mb: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                Progress
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                {task.progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={task.progress}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        )}

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.7rem' } }}>
            {task.assignees.map((assignee) => (
              <Avatar
                key={assignee.id}
                sx={{ bgcolor: assignee.color, width: 24, height: 24 }}
              >
                {assignee.avatar}
              </Avatar>
            ))}
          </AvatarGroup>

          <Box display="flex" alignItems="center" gap={1}>
            {task.comments > 0 && (
              <Box display="flex" alignItems="center" gap={0.5}>
                <CommentIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {task.comments}
                </Typography>
              </Box>
            )}
            {task.attachments > 0 && (
              <Box display="flex" alignItems="center" gap={0.5}>
                <AttachmentIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {task.attachments}
                </Typography>
              </Box>
            )}
            <Box display="flex" alignItems="center" gap={0.5}>
              <ScheduleIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {new Date(task.dueDate).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem onClick={handleMenuClose}>
            <EditIcon sx={{ mr: 1, fontSize: 16 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <DeleteIcon sx={{ mr: 1, fontSize: 16 }} />
            Delete
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

// Kanban Column Component
const KanbanColumn = ({ columnId, title, tasks, color, onAddTask, onDeleteTask }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleAddTask = (taskData) => {
    onAddTask(columnId, taskData);
    setShowCreateModal(false);
  };

  return (
    <Box
      sx={{
        minWidth: 300,
        maxWidth: 300,
        bgcolor: 'background.paper',
        borderRadius: 2,
        p: 2,
        height: 'fit-content',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: color,
            }}
          />
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
            {title}
          </Typography>
          <Chip
            label={tasks.length}
            size="small"
            sx={{
              bgcolor: 'grey.100',
              color: 'text.secondary',
              height: 20,
              fontSize: '0.7rem',
            }}
          />
        </Box>
      </Box>

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        fullWidth
        onClick={() => setShowCreateModal(true)}
        sx={{
          mb: 2,
          borderStyle: 'dashed',
          color: 'text.secondary',
          borderColor: 'grey.300',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'primary.50',
          },
        }}
      >
        Add New Task
      </Button>

      <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
        <Box
          id={`column-${columnId}`}
          sx={{
            minHeight: 100,
            '&.droppable': {
              bgcolor: 'primary.50',
            },
          }}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={onDeleteTask} />
          ))}
        </Box>
      </SortableContext>

      <CreateTaskModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleAddTask}
        columnId={columnId}
      />
    </Box>
  );
};

// Main Kanban Board Component
const KanbanBoard = ({ projectId }) => {
  const [activeId, setActiveId] = useState(null);
  const [tasks, setTasks] = useState(mockTasks);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const columns = [
    { id: 'todo', title: 'To Do', tasks: tasks.todo || [], color: '#6b7280' },
    { id: 'in-progress', title: 'In Progress', tasks: tasks['in-progress'] || [], color: '#3b82f6' },
    { id: 'review', title: 'Need Review', tasks: tasks.review || [], color: '#f59e0b' },
    { id: 'done', title: 'Done', tasks: tasks.done || [], color: '#10b981' },
  ];

  const findContainer = (id) => {
    if (tasks.todo?.find(task => task.id === id)) return 'todo';
    if (tasks['in-progress']?.find(task => task.id === id)) return 'in-progress';
    if (tasks.review?.find(task => task.id === id)) return 'review';
    if (tasks.done?.find(task => task.id === id)) return 'done';
    return null;
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    setActiveId(null);
    const { active, over } = event;
    
    if (!over) return;

    const sourceContainer = findContainer(active.id);
    let destinationContainer = over.id;
    
    // If dropped on a column container
    if (over.id.startsWith('column-')) {
      destinationContainer = over.id.replace('column-', '');
    }
    // If dropped on a task, get the container of that task
    else if (!columns.find(col => col.id === over.id)) {
      destinationContainer = findContainer(over.id);
    }
    
    if (!sourceContainer || !destinationContainer || sourceContainer === destinationContainer) return;

    setTasks(prevTasks => {
      const sourceItems = [...(prevTasks[sourceContainer] || [])];
      const destItems = [...(prevTasks[destinationContainer] || [])];
      const taskIndex = sourceItems.findIndex(task => task.id === active.id);
      
      if (taskIndex === -1) return prevTasks;
      
      const task = sourceItems[taskIndex];
      
      // Remove from source
      sourceItems.splice(taskIndex, 1);
      
      // Add to destination
      const updatedTask = { ...task, status: destinationContainer };
      destItems.push(updatedTask);
      
      // Show success message
      setSnackbar({
        open: true,
        message: `Task moved to ${columns.find(col => col.id === destinationContainer)?.title}`,
        severity: 'success',
      });

      return {
        ...prevTasks,
        [sourceContainer]: sourceItems,
        [destinationContainer]: destItems,
      };
    });
  };

  const handleAddTask = (columnId, taskData) => {
    const newTask = {
      ...taskData,
      id: Date.now().toString(),
      status: columnId,
      assignees: [
        { id: 1, name: 'Current User', avatar: 'CU', color: '#6366f1' },
      ],
      comments: 0,
      attachments: 0,
      progress: 0,
    };

    setTasks(prevTasks => ({
      ...prevTasks,
      [columnId]: [...(prevTasks[columnId] || []), newTask],
    }));

    setSnackbar({
      open: true,
      message: 'Task created successfully!',
      severity: 'success',
    });
  };

  const handleDeleteTask = (taskId) => {
    setTaskToDelete(taskId);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteTask = () => {
    const container = findContainer(taskToDelete);
    if (container) {
      setTasks(prevTasks => ({
        ...prevTasks,
        [container]: prevTasks[container].filter(task => task.id !== taskToDelete),
      }));

      setSnackbar({
        open: true,
        message: 'Task deleted successfully!',
        severity: 'success',
      });
    }
    setDeleteConfirmOpen(false);
    setTaskToDelete(null);
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            p: 3,
            minHeight: 'calc(100vh - 64px)',
            bgcolor: 'background.default',
            overflowX: 'auto',
          }}
        >
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              columnId={column.id}
              title={column.title}
              tasks={column.tasks}
              color={column.color}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </Box>

        <DragOverlay>
          {activeId ? (
            <TaskCard
              task={
                Object.values(tasks)
                  .flat()
                  .find((task) => task.id === activeId)
              }
              isDragging
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this task? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteTask} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default KanbanBoard;
