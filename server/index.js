const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = 'your_jwt_secret_here';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer TOKEN"

  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });
    req.user = user; // Attach user info (userId, email) to the request object
    next();
  });
}

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Get tasks for logged-in user
app.get('/tasks', authenticateToken, async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.userId },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create task for logged-in user
app.post('/tasks', authenticateToken, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Task text is required' });

  try {
    const newTask = await prisma.task.create({
      data: {
        title: text,
        user: { connect: { id: req.user.userId } }
      },
    });
    res.json(newTask);
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});


// Update task's completion status if owned by logged-in user
app.put('/tasks/:id', authenticateToken, async (req, res) => {
  const taskId = parseInt(req.params.id);
  const { completed } = req.body;

  if (typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Completed must be a boolean' });
  }

  try {
    const existingTask = await prisma.task.findUnique({ where: { id: taskId } });
    if (!existingTask || existingTask.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to update this task' });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { completed },
    });
    res.json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete task if owned by logged-in user
app.delete('/tasks/:id', authenticateToken, async (req, res) => {
  const taskId = parseInt(req.params.id);

  try {
    const existingTask = await prisma.task.findUnique({ where: { id: taskId } });
    if (!existingTask || existingTask.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this task' });
    }

    await prisma.task.delete({ where: { id: taskId } });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Register user
app.post('/register', async (req, res) => {
  const { email, password, username } = req.body;

  // Basic validation
  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Email, username, and password are required' });
  }

  try {
    // Check if email or username already exists
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ error: 'Username already in use' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user with username
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
      },
    });

    res.status(201).json({ message: 'User registered', userId: newUser.id });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});





// Login user
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
