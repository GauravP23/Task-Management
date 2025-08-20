const Task = require('../models/Task');
const Project = require('../models/Project');

// Mock tasks data for development
const mockTasks = [
  {
    _id: 'mock_task_1',
    title: 'Design Homepage Layout',
    description: 'Create wireframes and mockups for the new homepage design',
    project: 'mock_project_1',
    status: 'in-progress',
    priority: 'high',
    assignedTo: {
      _id: 'mock_user_1',
      name: 'John Doe',
      email: 'john@example.com'
    },
    createdBy: {
      _id: 'mock_user_1',
      name: 'John Doe',
      email: 'john@example.com'
    },
    dueDate: new Date('2024-02-15'),
    position: 1,
    tags: ['design', 'ui'],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-25')
  },
  {
    _id: 'mock_task_2',
    title: 'Implement User Authentication',
    description: 'Set up login, registration, and password reset functionality',
    project: 'mock_project_1',
    status: 'todo',
    priority: 'high',
    assignedTo: {
      _id: 'mock_user_1',
      name: 'John Doe',
      email: 'john@example.com'
    },
    createdBy: {
      _id: 'mock_user_1',
      name: 'John Doe',
      email: 'john@example.com'
    },
    dueDate: new Date('2024-02-20'),
    position: 2,
    tags: ['backend', 'security'],
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22')
  },
  {
    _id: 'mock_task_3',
    title: 'Setup Database Schema',
    description: 'Design and implement the database structure for the application',
    project: 'mock_project_1',
    status: 'done',
    priority: 'medium',
    assignedTo: {
      _id: 'mock_user_1',
      name: 'John Doe',
      email: 'john@example.com'
    },
    createdBy: {
      _id: 'mock_user_1',
      name: 'John Doe',
      email: 'john@example.com'
    },
    dueDate: new Date('2024-01-30'),
    position: 3,
    tags: ['database', 'backend'],
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-28')
  },
  {
    _id: 'mock_task_4',
    title: 'Create React Components',
    description: 'Build reusable React components for the mobile app',
    project: 'mock_project_2',
    status: 'in-progress',
    priority: 'medium',
    assignedTo: {
      _id: 'mock_user_1',
      name: 'John Doe',
      email: 'john@example.com'
    },
    createdBy: {
      _id: 'mock_user_1',
      name: 'John Doe',
      email: 'john@example.com'
    },
    dueDate: new Date('2024-03-15'),
    position: 1,
    tags: ['frontend', 'react'],
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-05')
  }
];

// Get all tasks for a project
const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check if we're in mock mode
    if (!global.isMongoConnected) {
      // Mock mode - find tasks for this project
      const projectTasks = mockTasks.filter(task => task.project === projectId);
      return res.json(projectTasks);
    }

    // MongoDB mode - original logic
    // Check if project exists and user has access
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const hasAccess = project.owner.toString() === req.user._id.toString() ||
                     project.members.some(member => member.user.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const tasks = await Task.find({ project: projectId })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ position: 1, createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get a single task by ID
const getTaskById = async (req, res) => {
  try {
    // Check if we're in mock mode
    if (!global.isMongoConnected) {
      const task = mockTasks.find(t => t._id === req.params.id);
      
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      return res.json(task);
    }

    // MongoDB mode - original logic
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('project', 'name');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to the project
    const project = await Project.findById(task.project._id);
    const hasAccess = project.owner.toString() === req.user._id.toString() ||
                     project.members.some(member => member.user.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task by ID error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo, priority, dueDate, tags } = req.body;

    if (!title || !project) {
      return res.status(400).json({ message: 'Title and project are required' });
    }

    // Check if project exists and user has access
    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const hasAccess = projectDoc.owner.toString() === req.user._id.toString() ||
                     projectDoc.members.some(member => member.user.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // If assignedTo is provided, check if the user is a member of the project
    if (assignedTo) {
      const isAssigneeInProject = projectDoc.owner.toString() === assignedTo ||
                                 projectDoc.members.some(member => member.user.toString() === assignedTo);
      
      if (!isAssigneeInProject) {
        return res.status(400).json({ message: 'Assigned user is not a member of this project' });
      }
    }

    // Get the highest position for ordering
    const lastTask = await Task.findOne({ project }).sort({ position: -1 });
    const position = lastTask ? lastTask.position + 1 : 0;

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      createdBy: req.user._id,
      priority,
      dueDate,
      tags,
      position,
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('project', 'name');

    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate, tags } = req.body;

    const task = await Task.findById(req.params.id).populate('project');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to the project
    const project = await Project.findById(task.project._id);
    const hasAccess = project.owner.toString() === req.user._id.toString() ||
                     project.members.some(member => member.user.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // If assignedTo is provided, check if the user is a member of the project
    if (assignedTo) {
      const isAssigneeInProject = project.owner.toString() === assignedTo ||
                                 project.members.some(member => member.user.toString() === assignedTo);
      
      if (!isAssigneeInProject) {
        return res.status(400).json({ message: 'Assigned user is not a member of this project' });
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, assignedTo, priority, dueDate, tags },
      { new: true, runValidators: true }
    )
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .populate('project', 'name');

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update task status
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['todo', 'in-progress', 'review', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const task = await Task.findById(req.params.id).populate('project');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to the project
    const project = await Project.findById(task.project._id);
    const hasAccess = project.owner.toString() === req.user._id.toString() ||
                     project.members.some(member => member.user.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .populate('project', 'name');

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update task position (for drag and drop)
const updateTaskPosition = async (req, res) => {
  try {
    const { position, status } = req.body;

    const task = await Task.findById(req.params.id).populate('project');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to the project
    const project = await Project.findById(task.project._id);
    const hasAccess = project.owner.toString() === req.user._id.toString() ||
                     project.members.some(member => member.user.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updateData = { position };
    if (status) {
      updateData.status = status;
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .populate('project', 'name');

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task position error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('project');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to the project
    const project = await Project.findById(task.project._id);
    const hasAccess = project.owner.toString() === req.user._id.toString() ||
                     project.members.some(member => member.user.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Only task creator, assigned user, or project admin can delete
    const canDelete = task.createdBy.toString() === req.user._id.toString() ||
                     task.assignedTo?.toString() === req.user._id.toString() ||
                     project.owner.toString() === req.user._id.toString() ||
                     project.members.some(member => 
                       member.user.toString() === req.user._id.toString() && member.role === 'admin'
                     );

    if (!canDelete) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasksByProject,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  updateTaskPosition,
  deleteTask,
};
