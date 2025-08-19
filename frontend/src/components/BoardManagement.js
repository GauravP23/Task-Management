import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
  IconButton,
  Chip,
  Avatar,
  AvatarGroup,
  Menu,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Add as AddIcon,
  Dashboard as DashboardIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';

const BoardManagement = ({ projectId, onBoardSelect, selectedBoard }) => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedBoardForEdit, setSelectedBoardForEdit] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuBoard, setMenuBoard] = useState(null);
  
  const [newBoard, setNewBoard] = useState({
    name: '',
    description: '',
    type: 'kanban',
    color: 'hsl(243, 82%, 67%)',
    isStarred: false,
  });

  useEffect(() => {
    const fetchBoardsData = async () => {
      try {
        setLoading(true);
        // Mock data for now - replace with actual API call
        const mockBoards = [
          {
            id: 'main-board',
            name: 'Main Kanban Board',
            description: 'Primary task management board',
            type: 'kanban',
            color: 'hsl(243, 82%, 67%)',
            isStarred: true,
            taskCount: 12,
            lastUpdated: new Date(),
            members: [
              { name: 'Alice', avatar: 'A', color: 'hsl(0, 68%, 70%)' },
              { name: 'Bob', avatar: 'B', color: 'hsl(178, 68%, 70%)' },
              { name: 'Carol', avatar: 'C', color: 'hsl(200, 68%, 70%)' },
            ],
          },
          {
            id: 'sprint-board',
            name: 'Sprint Planning',
            description: 'Current sprint tasks and planning',
            type: 'scrum',
            color: 'hsl(142, 68%, 60%)',
            isStarred: false,
            taskCount: 8,
            lastUpdated: new Date(Date.now() - 86400000), // 1 day ago
            members: [
              { name: 'Alice', avatar: 'A', color: 'hsl(0, 68%, 70%)' },
              { name: 'David', avatar: 'D', color: 'hsl(142, 68%, 70%)' },
            ],
          },
          {
            id: 'backlog-board',
            name: 'Product Backlog',
            description: 'Future features and improvements',
            type: 'backlog',
            color: 'hsl(280, 68%, 65%)',
            isStarred: false,
            taskCount: 25,
            lastUpdated: new Date(Date.now() - 172800000), // 2 days ago
            members: [
              { name: 'Carol', avatar: 'C', color: 'hsl(200, 68%, 70%)' },
              { name: 'Eve', avatar: 'E', color: 'hsl(50, 68%, 70%)' },
            ],
          },
        ];
        setBoards(mockBoards);
        
        // Select the first board if none is selected
        if (!selectedBoard && mockBoards.length > 0) {
          onBoardSelect(mockBoards[0]);
        }
      } catch (error) {
        console.error('Error fetching boards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoardsData();
  }, [projectId, selectedBoard, onBoardSelect]);

  const handleCreateBoard = () => {
    const board = {
      id: `board-${Date.now()}`,
      ...newBoard,
      taskCount: 0,
      lastUpdated: new Date(),
      members: [],
    };
    
    setBoards([...boards, board]);
    setNewBoard({
      name: '',
      description: '',
      type: 'kanban',
      color: 'hsl(243, 82%, 67%)',
      isStarred: false,
    });
    setCreateDialogOpen(false);
    onBoardSelect(board);
  };

  const handleEditBoard = () => {
    const updatedBoards = boards.map(board =>
      board.id === selectedBoardForEdit.id
        ? { ...board, ...newBoard }
        : board
    );
    setBoards(updatedBoards);
    setEditDialogOpen(false);
    setSelectedBoardForEdit(null);
    setNewBoard({
      name: '',
      description: '',
      type: 'kanban',
      color: 'hsl(243, 82%, 67%)',
      isStarred: false,
    });
  };

  const handleDeleteBoard = (boardId) => {
    const updatedBoards = boards.filter(board => board.id !== boardId);
    setBoards(updatedBoards);
    
    // If the deleted board was selected, select the first remaining board
    if (selectedBoard?.id === boardId && updatedBoards.length > 0) {
      onBoardSelect(updatedBoards[0]);
    }
    setMenuAnchor(null);
  };

  const handleDuplicateBoard = (board) => {
    const duplicatedBoard = {
      ...board,
      id: `board-${Date.now()}`,
      name: `${board.name} (Copy)`,
      taskCount: 0,
      lastUpdated: new Date(),
    };
    setBoards([...boards, duplicatedBoard]);
    setMenuAnchor(null);
  };

  const handleToggleStarred = (boardId) => {
    const updatedBoards = boards.map(board =>
      board.id === boardId
        ? { ...board, isStarred: !board.isStarred }
        : board
    );
    setBoards(updatedBoards);
    setMenuAnchor(null);
  };

  const openEditDialog = (board) => {
    setSelectedBoardForEdit(board);
    setNewBoard({
      name: board.name,
      description: board.description,
      type: board.type,
      color: board.color,
      isStarred: board.isStarred,
    });
    setEditDialogOpen(true);
    setMenuAnchor(null);
  };

  const handleMenuClick = (event, board) => {
    setMenuAnchor(event.currentTarget);
    setMenuBoard(board);
  };

  const getBoardTypeIcon = (type) => {
    switch (type) {
      case 'kanban': return '📋';
      case 'scrum': return '🏃';
      case 'backlog': return '📚';
      default: return '📋';
    }
  };

  const getBoardTypeLabel = (type) => {
    switch (type) {
      case 'kanban': return 'Kanban';
      case 'scrum': return 'Scrum';
      case 'backlog': return 'Backlog';
      default: return 'Board';
    }
  };

  const colorOptions = [
    { label: 'Indigo', value: 'hsl(243, 82%, 67%)' },
    { label: 'Blue', value: 'hsl(200, 82%, 67%)' },
    { label: 'Green', value: 'hsl(142, 68%, 60%)' },
    { label: 'Purple', value: 'hsl(280, 68%, 65%)' },
    { label: 'Orange', value: 'hsl(35, 100%, 65%)' },
    { label: 'Red', value: 'hsl(0, 68%, 65%)' },
  ];

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <Typography>Loading boards...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        pb: 2,
        borderBottom: '1px solid hsl(243, 100%, 94%)',
      }}>
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ color: 'hsl(243, 82%, 25%)', mb: 1 }}>
            Boards
          </Typography>
          <Typography variant="body1" sx={{ color: 'hsl(243, 82%, 55%)' }}>
            Manage your project boards and workflows
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          className="button-primary-modern"
          sx={{
            background: 'linear-gradient(135deg, hsl(243, 82%, 67%) 0%, hsl(252, 82%, 67%) 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, hsl(243, 82%, 57%) 0%, hsl(252, 82%, 57%) 100%)',
            },
          }}
        >
          Create Board
        </Button>
      </Box>

      {/* Boards Grid */}
      <Grid container spacing={3}>
        {boards.map((board) => (
          <Grid item xs={12} sm={6} md={4} key={board.id}>
            <Card 
              className="card-modern"
              sx={{
                cursor: 'pointer',
                border: selectedBoard?.id === board.id ? '2px solid hsl(243, 82%, 67%)' : '1px solid hsl(243, 100%, 94%)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 32px hsla(243, 82%, 67%, 0.15)',
                },
              }}
              onClick={() => onBoardSelect(board)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: board.color,
                      }}
                    />
                    <Typography variant="subtitle2" sx={{ color: 'hsl(243, 82%, 55%)' }}>
                      {getBoardTypeIcon(board.type)} {getBoardTypeLabel(board.type)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {board.isStarred && (
                      <StarIcon sx={{ color: 'hsl(50, 100%, 65%)', fontSize: 16 }} />
                    )}
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuClick(e, board);
                      }}
                      sx={{ color: 'hsl(243, 82%, 67%)' }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="h6" fontWeight={600} sx={{ color: 'hsl(243, 82%, 25%)', mb: 1 }}>
                  {board.name}
                </Typography>
                
                <Typography variant="body2" sx={{ color: 'hsl(243, 82%, 55%)', mb: 2, minHeight: 40 }}>
                  {board.description}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Chip
                    label={`${board.taskCount} tasks`}
                    size="small"
                    sx={{
                      bgcolor: 'hsl(243, 100%, 97%)',
                      color: 'hsl(243, 82%, 67%)',
                      fontWeight: 500,
                    }}
                  />
                  
                  <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.7rem' } }}>
                    {board.members.map((member, index) => (
                      <Avatar
                        key={index}
                        sx={{ bgcolor: member.color }}
                        title={member.name}
                      >
                        {member.avatar}
                      </Avatar>
                    ))}
                  </AvatarGroup>
                </Box>

                <Typography variant="caption" sx={{ color: 'hsl(243, 82%, 65%)' }}>
                  Updated {board.lastUpdated.toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Board Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        PaperProps={{
          sx: {
            bgcolor: 'hsl(0, 0%, 100%)',
            border: '1px solid hsl(243, 100%, 94%)',
            boxShadow: '0 8px 32px hsla(243, 82%, 67%, 0.12)',
          }
        }}
      >
        <MenuItem onClick={() => handleToggleStarred(menuBoard?.id)}>
          <ListItemIcon>
            {menuBoard?.isStarred ? <StarIcon /> : <StarBorderIcon />}
          </ListItemIcon>
          <ListItemText>
            {menuBoard?.isStarred ? 'Remove from favorites' : 'Add to favorites'}
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={() => openEditDialog(menuBoard)}>
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText>Edit board</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleDuplicateBoard(menuBoard)}>
          <ListItemIcon>
            <CopyIcon />
          </ListItemIcon>
          <ListItemText>Duplicate board</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleDeleteBoard(menuBoard?.id)} sx={{ color: 'hsl(0, 68%, 65%)' }}>
          <ListItemIcon>
            <DeleteIcon sx={{ color: 'hsl(0, 68%, 65%)' }} />
          </ListItemIcon>
          <ListItemText>Delete board</ListItemText>
        </MenuItem>
      </Menu>

      {/* Create Board Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
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
            <DashboardIcon />
            Create New Board
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <TextField
              fullWidth
              label="Board Name"
              value={newBoard.name}
              onChange={(e) => setNewBoard({ ...newBoard, name: e.target.value })}
              className="text-field-modern"
            />
            
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={newBoard.description}
              onChange={(e) => setNewBoard({ ...newBoard, description: e.target.value })}
              className="text-field-modern"
            />
            
            <FormControl fullWidth>
              <InputLabel>Board Type</InputLabel>
              <Select
                value={newBoard.type}
                label="Board Type"
                onChange={(e) => setNewBoard({ ...newBoard, type: e.target.value })}
              >
                <MenuItem value="kanban">📋 Kanban Board</MenuItem>
                <MenuItem value="scrum">🏃 Scrum Board</MenuItem>
                <MenuItem value="backlog">📚 Backlog Board</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Color</InputLabel>
              <Select
                value={newBoard.color}
                label="Color"
                onChange={(e) => setNewBoard({ ...newBoard, color: e.target.value })}
              >
                {colorOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          bgcolor: option.value,
                        }}
                      />
                      {option.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid hsl(243, 100%, 94%)' }}>
          <Button 
            onClick={() => setCreateDialogOpen(false)}
            sx={{ color: 'hsl(243, 82%, 67%)' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateBoard}
            variant="contained"
            disabled={!newBoard.name.trim()}
            className="button-primary-modern"
            sx={{
              background: 'linear-gradient(135deg, hsl(243, 82%, 67%) 0%, hsl(252, 82%, 67%) 100%)',
            }}
          >
            Create Board
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Board Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
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
            <EditIcon />
            Edit Board
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <TextField
              fullWidth
              label="Board Name"
              value={newBoard.name}
              onChange={(e) => setNewBoard({ ...newBoard, name: e.target.value })}
              className="text-field-modern"
            />
            
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={newBoard.description}
              onChange={(e) => setNewBoard({ ...newBoard, description: e.target.value })}
              className="text-field-modern"
            />
            
            <FormControl fullWidth>
              <InputLabel>Board Type</InputLabel>
              <Select
                value={newBoard.type}
                label="Board Type"
                onChange={(e) => setNewBoard({ ...newBoard, type: e.target.value })}
              >
                <MenuItem value="kanban">📋 Kanban Board</MenuItem>
                <MenuItem value="scrum">🏃 Scrum Board</MenuItem>
                <MenuItem value="backlog">📚 Backlog Board</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Color</InputLabel>
              <Select
                value={newBoard.color}
                label="Color"
                onChange={(e) => setNewBoard({ ...newBoard, color: e.target.value })}
              >
                {colorOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          bgcolor: option.value,
                        }}
                      />
                      {option.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid hsl(243, 100%, 94%)' }}>
          <Button 
            onClick={() => setEditDialogOpen(false)}
            sx={{ color: 'hsl(243, 82%, 67%)' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEditBoard}
            variant="contained"
            disabled={!newBoard.name.trim()}
            className="button-primary-modern"
            sx={{
              background: 'linear-gradient(135deg, hsl(243, 82%, 67%) 0%, hsl(252, 82%, 67%) 100%)',
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BoardManagement;
