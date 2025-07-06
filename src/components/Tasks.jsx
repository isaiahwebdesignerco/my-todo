import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Tasks = ({ tasks, setTasks }) => {
  const [task, setTask] = useState('');
  const token = localStorage.getItem('token');

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:3001/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  const handleAddTask = async () => {
    if (task.trim() === '') return;

    try {
      const res = await axios.post(
        'http://localhost:3001/tasks',
        { text: task.trim() }, // or title: task.trim() if your API expects that
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks([...tasks, res.data]);
      setTask('');
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const toggleComplete = async (id, currentStatus) => {
    try {
      const res = await axios.put(
        `http://localhost:3001/tasks/${id}`,
        { completed: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks(tasks.map((t) => (t.id === id ? res.data : t)));
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <input
        type="text"
        placeholder="Enter a task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        style={{
          width: '100%',
          padding: '0.5rem',
          boxSizing: 'border-box',
          fontSize: '1.5rem',
        }}
      />

      <button
        onClick={handleAddTask}
        style={{
          margin: '0.5rem 0 1rem 0',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
        }}
      >
        Add Task
      </button>

      <div id="tasksWrapper" style={{ display: 'flex', flexDirection: 'column' }}>
        {tasks.map((t) => (
          <div
            key={t.id}
            className="taskLine"
            style={{
              margin: '10px 0 0 0',
              display: 'flex',
              flexWrap: 'wrap',
              border: '1px solid grey',
              padding: '1rem',
              borderRadius: '0.5rem',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div className="taskContentWrapper" style={{ display: 'flex' }}>
              <div style={{ display: 'flex', marginRight: '5px', padding: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggleComplete(t.id, t.completed)}
                  style={{ cursor: 'pointer', transform: 'scale(1.5)', accentColor: '#00F2F2' }}
                />
              </div>

              <p
                style={{
                  display: 'inline-block',
                  textDecoration: t.completed ? 'line-through' : 'none',
                  color: t.completed ? 'grey' : 'white',
                  fontSize: '1.5rem',
                }}
              >
                {t.title}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <button className="deleteButton" onClick={() => handleDelete(t.id)}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
