const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');



const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/tasks', async (req, res) => {
  const tasks = await prisma.task.findMany();
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Task text is required' });

  try {
    const newTask = await prisma.task.create({
      data: {
        title: text,
      },
    });
    res.json(newTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.put('/tasks/:id', async (req, res) => {
  const taskId = parseInt(req.params.id);
  const { completed } = req.body;

  if (typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Completed must be a boolean' });
  }

  try {
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

app.delete('/tasks/:id', async (req, res) => {
  const taskId = parseInt(req.params.id);

  try {
    await prisma.task.delete({
      where: { id: taskId },
    });
    res.status(204).end(); // 204 No Content means successful delete with no response body
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});




const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
