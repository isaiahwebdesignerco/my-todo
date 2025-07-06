import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import Register from './components/Register';
import Tasks from './components/Tasks';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [username, setUsername] = useState('');


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoggedIn(false);
      return;
    }

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));

      console.log('Decoded JWT payload:', payload); // ✅ Check what we actually decoded

      if (payload.username) {
        setUsername(payload.username);
      } else {
        setUsername('User');
      }

      setLoggedIn(true);
    } catch (error) {
      console.error('Failed to decode token:', error);
      setLoggedIn(false);
    }
  }, []);



  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    setTasks([]);
  };

  if (!loggedIn) {
    return (
      <div style={{ maxWidth: 400, margin: '2rem auto', fontFamily: 'helvetica' }}>
        {showRegister ? (
          <>
            <Register onRegister={() => setShowRegister(false)} />
            <p style={{ textAlign: 'center', marginTop: '1rem' }}>
              Already have an account?{' '}
              <button onClick={() => setShowRegister(false)} style={{ cursor: 'pointer' }}>
                Log In
              </button>
            </p>
          </>
        ) : (
          <>
            <Login
              onLogin={() => {
                const token = localStorage.getItem('token');
                if (token) {
                  try {
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const payload = JSON.parse(atob(base64));
                    setUsername(payload.username || 'User');
                  } catch (err) {
                    console.error('Failed to decode token after login:', err);
                    setUsername('User');
                  }
                }
                setLoggedIn(true);
              }}
            />

            <p style={{ textAlign: 'center', marginTop: '1rem' }}>
              Don't have an account?{' '}
              <button onClick={() => setShowRegister(true)} style={{ cursor: 'pointer' }}>
                Register
              </button>
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <h3 style={{ marginRight: 'auto' }}>{username}</h3>
        <button
          onClick={handleLogout}
          style={{
            marginBottom: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#ff5252',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
          }}
        >
          Log Out
        </button>
      </div>

      <div style={{ maxWidth: 400, margin: '2rem auto', fontFamily: 'helvetica' }}>
        <h1 style={{ margin: '0 0 1rem 0', fontSize: '3rem' }}>My To-Do ✔️</h1>
        <Tasks tasks={tasks} setTasks={setTasks} />
      </div>

    </>
  );
};

export default App;
