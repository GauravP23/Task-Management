import React, { useState } from 'react';
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
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Schedule as ScheduleIcon,
  Comment as CommentIcon,
  Attachment as AttachmentIcon,
} from '@mui/icons-material';
import { DndContext, closestCenter, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CreateTaskModal from './CreateTaskModal';

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
        { id: 3, name: 'Sarah Green', avatar: 'SG', color: '#45B7D1' },
      ],
      comments: 1,
      attachments: 3,
      dueDate: '2025-08-22',
    },
  ],
  'in-progress': [
    {
      id: '3',
      title: 'Customer Journey Mapping',
      description: 'Map the customer journey and develop strategies to improve the overall customer experience',
      priority: 'high',
      stage: 'UX design',
      progress: 45,
      assignees: [
        { id: 4, name: 'Brad Smith', avatar: 'BS', color: '#96CEB4' },
        { id: 5, name: 'Alice Cornell', avatar: 'AC', color: '#FECA57' },
      ],
      comments: 4,
      attachments: 1,
      dueDate: '2025-08-20',
    },
    {
      id: '4',
      title: 'Persona development',
      description: 'Create user personas based on research data',
      priority: 'medium',
      stage: 'UX design',
      progress: 70,
      assignees: [
        { id: 6, name: 'Mike Johnson', avatar: 'MJ', color: '#FF9FF3' },
      ],
      comments: 2,
      attachments: 2,
      dueDate: '2025-08-23',
    },
  ],
  'review': [
    {
      id: '5',
      title: 'Competitor research',
      description: 'Analyze competitors and their strategies',
      priority: 'low',
      stage: 'UX design',
      progress: 90,
      assignees: [
        { id: 7, name: 'Emma Wilson', avatar: 'EW', color: '#54A0FF' },
        { id: 8, name: 'John Doe', avatar: 'JD', color: '#5F27CD' },
      ],
      comments: 0,
      attachments: 1,
      dueDate: '2025-08-19',
    },
  ],
  'done': [
    {
      id: '6',
      title: 'Branding, visual identity',
      description: 'Develop visual identity including logo, typography, color palettes',
      priority: 'high',
      stage: 'Branding',
      progress: 100,
      assignees: [
        { id: 9, name: 'Lisa Brown', avatar: 'LB', color: '#00D2D3' },
      ],
      comments: 3,
      attachments: 0,
      dueDate: '2025-08-18',
    },
    {
      id: '7',
      title: 'Marketing materials',
      description: 'Create a template materials such as documents, presentations and social media graphics',
      priority: 'medium',
      stage: 'Branding',
      progress: 100,
      assignees: [
        { id: 10, name: 'Tom Davis', avatar: 'TD', color: '#FF7675' },
      ],
      comments: 5,
      attachments: 2,
      dueDate: '2025-08-17',
    },
  ],
};

const priorityColors = {
  high: '#FF6B6B',
  medium: '#FFE66D',
  low: '#4ECDC4',
};

const TaskCard = ({ task }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
          boxShadow: 3,
        },
        '&:active': {
          cursor: 'grabbing',
        },
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Chip
            label={task.stage}
            size="small"
            sx={{
              bgcolor: priorityColors[task.priority],
              color: 'white',
              fontSize: '0.7rem',
              height: 20,
            }}
          />
          <IconButton size="small" onClick={handleMenuClick}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
            <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
            <MenuItem onClick={handleMenuClose}>Duplicate</MenuItem>
          </Menu>
        </Box>

        <Typography variant="h6" sx={{ fontSize: '0.95rem', fontWeight: 600, mb: 1 }}>
          {task.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, fontSize: '0.8rem', lineHeight: 1.3 }}
        >
          {task.description}
        </Typography>

        {task.progress > 0 && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="caption" color="text.secondary">
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
                  bgcolor: task.progress === 100 ? '#4CAF50' : '#2196F3',
                },
              }}
            />
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.7rem' } }}>
            {task.assignees.map((assignee) => (
              <Avatar
                key={assignee.id}
                sx={{ bgcolor: assignee.color }}
                title={assignee.name}
              >
                {assignee.avatar}
              </Avatar>
            ))}
          </AvatarGroup>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {task.comments > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                <CommentIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {task.comments}
                </Typography>
              </Box>
            )}
            {task.attachments > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                <AttachmentIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {task.attachments}
                </Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              <ScheduleIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const KanbanColumn = ({ title, tasks, count, color, onAddTask, columnId }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleAddTask = (taskData) => {
    onAddTask(columnId, taskData);
    setShowCreateModal(false);
  };

  return (
    <Box sx={{ flex: 1, minWidth: 280, mx: 1 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          px: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: color,
            }}
          />
          <Typography variant="subtitle2" fontWeight={600}>
            {title}
          </Typography>
          <Chip
            label={count}
            size="small"
            sx={{
              bgcolor: 'grey.100',
              color: 'text.secondary',
              height: 20,
              fontSize: '0.7rem',
            }}
          />
        </Box>
        <IconButton size="small">
          <MoreVertIcon fontSize="small" />
        </IconButton>
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
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
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

const KanbanBoard = () => {
  const [activeId, setActiveId] = useState(null);
  const [tasks, setTasks] = useState(mockTasks);
  const sensors = useSensors(useSensor(PointerSensor));

  const columns = [
    { id: 'todo', title: 'To Do', tasks: tasks.todo, color: '#FF6B6B' },
    { id: 'in-progress', title: 'In Progress', tasks: tasks['in-progress'], color: '#4ECDC4' },
    { id: 'review', title: 'Need Review', tasks: tasks.review, color: '#FFE66D' },
    { id: 'done', title: 'Done', tasks: tasks.done, color: '#95E1D3' },
  ];

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    setActiveId(null);
    // Handle task movement logic here
    const { active, over } = event;
    
    if (!over) return;
    
    // Task movement between columns would be implemented here
    console.log('Moving task', active.id, 'to', over.id);
  };

  const handleAddTask = (columnId, taskData) => {
    const newTask = {
      ...taskData,
      id: Date.now().toString(),
    };

    setTasks(prevTasks => ({
      ...prevTasks,
      [columnId]: [...prevTasks[columnId], newTask],
    }));
  };

  return (
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
          bgcolor: '#f8fafc',
          overflowX: 'auto',
        }}
      >
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            columnId={column.id}
            title={column.title}
            tasks={column.tasks}
            count={column.tasks.length}
            color={column.color}
            onAddTask={handleAddTask}
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
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
