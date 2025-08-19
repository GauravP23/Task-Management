const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// Mock projects data
let projects = [
  {
    id: '1',
    name: 'Piper Enterprise',
    description: 'Enterprise project management platform',
    owner: 'mock-user-id',
    members: [
      { user: 'user1', role: 'admin', joinedAt: new Date() },
      { user: 'user2', role: 'member', joinedAt: new Date() },
    ],
    status: 'active',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-12-31'),
    color: '#2196F3',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Web Platform',
    description: 'Modern web application development',
    owner: 'mock-user-id',
    members: [
      { user: 'user1', role: 'admin', joinedAt: new Date() },
    ],
    status: 'planning',
    startDate: new Date('2025-02-01'),
    endDate: new Date('2025-08-31'),
    color: '#4CAF50',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// @route   GET /api/projects
// @desc    Get all projects for user
// @access  Private
router.get('/', auth, (req, res) => {
  try {
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/projects/:id
// @desc    Get project by ID
// @access  Private
router.get('/:id', auth, (req, res) => {
  try {
    const project = projects.find(p => p.id === req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private
router.post('/', auth, (req, res) => {
  try {
    const { name, description, startDate, endDate, color } = req.body;
    
    const newProject = {
      id: Date.now().toString(),
      name,
      description,
      owner: req.user._id,
      members: [
        { user: req.user._id, role: 'admin', joinedAt: new Date() }
      ],
      status: 'planning',
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      color: color || '#2196F3',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    projects.push(newProject);
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private
router.put('/:id', auth, (req, res) => {
  try {
    const projectIndex = projects.findIndex(p => p.id === req.params.id);
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const { name, description, status, startDate, endDate, color } = req.body;
    
    projects[projectIndex] = {
      ...projects[projectIndex],
      name: name || projects[projectIndex].name,
      description: description || projects[projectIndex].description,
      status: status || projects[projectIndex].status,
      startDate: startDate ? new Date(startDate) : projects[projectIndex].startDate,
      endDate: endDate ? new Date(endDate) : projects[projectIndex].endDate,
      color: color || projects[projectIndex].color,
      updatedAt: new Date(),
    };

    res.json(projects[projectIndex]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private
router.delete('/:id', auth, (req, res) => {
  try {
    const projectIndex = projects.findIndex(p => p.id === req.params.id);
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Project not found' });
    }

    projects.splice(projectIndex, 1);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
