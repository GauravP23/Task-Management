const Project = require('../models/Project');
const User = require('../models/User');

// Mock projects data for development
const mockProjects = [
  {
    _id: 'mock_project_1',
    name: 'Website Redesign',
    description: 'Complete redesign of company website with modern UI/UX',
    owner: {
      _id: 'mock_user_1',
      name: 'John Doe',
      email: 'john@example.com'
    },
    status: 'active',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-06-15'),
    color: '#3f51b5',
    members: [
      {
        user: {
          _id: 'mock_user_1',
          name: 'John Doe',
          email: 'john@example.com'
        },
        role: 'admin',
        joinedAt: new Date('2024-01-15')
      }
    ],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    _id: 'mock_project_2',
    name: 'Mobile App Development',
    description: 'Cross-platform mobile application using React Native',
    owner: {
      _id: 'mock_user_1',
      name: 'John Doe',
      email: 'john@example.com'
    },
    status: 'planning',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-09-01'),
    color: '#4caf50',
    members: [
      {
        user: {
          _id: 'mock_user_1',
          name: 'John Doe',
          email: 'john@example.com'
        },
        role: 'admin',
        joinedAt: new Date('2024-03-01')
      }
    ],
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15')
  },
  {
    _id: 'mock_project_3',
    name: 'API Documentation',
    description: 'Create comprehensive API documentation and examples',
    owner: {
      _id: 'mock_user_1',
      name: 'John Doe',
      email: 'john@example.com'
    },
    status: 'completed',
    startDate: new Date('2023-11-01'),
    endDate: new Date('2024-01-01'),
    color: '#ff9800',
    members: [
      {
        user: {
          _id: 'mock_user_1',
          name: 'John Doe',
          email: 'john@example.com'
        },
        role: 'admin',
        joinedAt: new Date('2023-11-01')
      }
    ],
    createdAt: new Date('2023-10-15'),
    updatedAt: new Date('2024-01-01')
  }
];

// Get all projects for the authenticated user
const getProjects = async (req, res) => {
  try {
    // Check if we're in mock mode
    if (!global.isMongoConnected) {
      // Return mock projects for the authenticated user
      const userId = req.user._id || req.user.id;
      const userProjects = mockProjects.filter(project => 
        project.owner._id === userId || 
        project.members.some(member => member.user._id === userId)
      );
      return res.json(userProjects);
    }

    // MongoDB mode - original logic
    const projects = await Project.find({
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id }
      ]
    })
    .populate('owner', 'name email')
    .populate('members.user', 'name email')
    .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get a single project by ID
const getProjectById = async (req, res) => {
  try {
    // Check if we're in mock mode
    if (!global.isMongoConnected) {
      const project = mockProjects.find(p => p._id === req.params.id);
      
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      // Check if user has access to this project
      const userId = req.user._id || req.user.id;
      const hasAccess = project.owner._id === userId ||
                       project.members.some(member => member.user._id === userId);

      if (!hasAccess) {
        return res.status(403).json({ message: 'Access denied' });
      }

      return res.json(project);
    }

    // MongoDB mode - original logic
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user has access to this project
    const hasAccess = project.owner._id.toString() === req.user._id.toString() ||
                     project.members.some(member => member.user._id.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(project);
  } catch (error) {
    console.error('Get project by ID error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create a new project
const createProject = async (req, res) => {
  try {
    const { name, description, startDate, endDate, color } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    // Check if we're in mock mode
    if (!global.isMongoConnected) {
      const newProject = {
        _id: `mock_project_${Date.now()}`,
        name,
        description,
        owner: {
          _id: req.user._id || req.user.id,
          name: req.user.name,
          email: req.user.email
        },
        status: 'planning',
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        color: color || '#3f51b5',
        members: [{
          user: {
            _id: req.user._id || req.user.id,
            name: req.user.name,
            email: req.user.email
          },
          role: 'admin',
          joinedAt: new Date()
        }],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockProjects.push(newProject);
      return res.status(201).json(newProject);
    }

    // MongoDB mode - original logic
    const project = await Project.create({
      name,
      description,
      owner: req.user._id,
      startDate,
      endDate,
      color,
      members: [{
        user: req.user._id,
        role: 'admin',
        joinedAt: new Date()
      }]
    });

    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');

    res.status(201).json(populatedProject);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update a project
const updateProject = async (req, res) => {
  try {
    const { name, description, status, startDate, endDate, color } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner or admin
    const isOwner = project.owner.toString() === req.user._id.toString();
    const isAdmin = project.members.some(member => 
      member.user.toString() === req.user._id.toString() && member.role === 'admin'
    );

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Only project owner or admin can update project' });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description, status, startDate, endDate, color },
      { new: true, runValidators: true }
    )
    .populate('owner', 'name email')
    .populate('members.user', 'name email');

    res.json(updatedProject);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Only owner can delete project
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only project owner can delete project' });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Add member to project
const addMember = async (req, res) => {
  try {
    const { email, role = 'member' } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner or admin
    const isOwner = project.owner.toString() === req.user._id.toString();
    const isAdmin = project.members.some(member => 
      member.user.toString() === req.user._id.toString() && member.role === 'admin'
    );

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Only project owner or admin can add members' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is already a member
    const isMember = project.members.some(member => 
      member.user.toString() === user._id.toString()
    );

    if (isMember) {
      return res.status(400).json({ message: 'User is already a member of this project' });
    }

    project.members.push({
      user: user._id,
      role,
      joinedAt: new Date()
    });

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');

    res.json(updatedProject);
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Remove member from project
const removeMember = async (req, res) => {
  try {
    const { userId } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner or admin
    const isOwner = project.owner.toString() === req.user._id.toString();
    const isAdmin = project.members.some(member => 
      member.user.toString() === req.user._id.toString() && member.role === 'admin'
    );

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Only project owner or admin can remove members' });
    }

    // Cannot remove owner
    if (project.owner.toString() === userId) {
      return res.status(400).json({ message: 'Cannot remove project owner' });
    }

    project.members = project.members.filter(member => 
      member.user.toString() !== userId
    );

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');

    res.json(updatedProject);
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};
