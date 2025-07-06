import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import Tasks from './components/Tasks';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios
      .get('http://localhost:3001/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setTasks(res.data);
        setLoggedIn(true);
      })
      .catch(() => {
        localStorage.removeItem('token');
        setLoggedIn(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    setTasks([]);
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', fontFamily: 'helvetica' }}>
      {loggedIn ? (
        <>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
            onClick={handleLogout}
            style={{
              marginBottom: '2rem',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              backgroundColor: '#ff4d4d',
              border: 'none',
              borderRadius: '0.5rem',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem',
            }}
          >
            Logout
          </button>
          </div>

          <h1 style={{ margin: '0 0 1rem 0', fontSize: '3rem' }}>My To-Do ✔️</h1>

          <Tasks tasks={tasks} setTasks={setTasks} />
        </>
      ) : (
        <Login onLogin={() => setLoggedIn(true)} />
      )}
    </div>
  );
};

export default App;
