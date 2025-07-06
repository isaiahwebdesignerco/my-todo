import React, { useState } from 'react';

const Register = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:3001/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Registration successful! You can now log in.');
      onRegister(); // Switch back to login page if needed
    } else {
      alert('Registration failed: ' + (data.error || 'Unknown error'));
    }
  };

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '3rem', margin: 0 }}>My To-Do ✔️</h1>
        <p style={{ color: '#aaa', marginTop: '0.5rem', fontSize: '1rem' }}>
          Create your account to get started
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: 400,
          margin: '4rem auto',
          padding: '2rem',
          border: '1px solid #ccc',
          borderRadius: '1rem',
          fontFamily: 'helvetica',
          background: '#1e1e1e',
          color: 'white',
          boxShadow: '0 0 20px rgba(0,0,0,0.3)',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Register</h2>

        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your username"
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            marginBottom: '1.5rem',
            borderRadius: '0.5rem',
            border: '1px solid #555',
            background: '#2a2a2a',
            color: 'white',
            fontSize: '1rem',
          }}
        />

        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            marginBottom: '1.5rem',
            borderRadius: '0.5rem',
            border: '1px solid #555',
            background: '#2a2a2a',
            color: 'white',
            fontSize: '1rem',
          }}
        />

        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            marginBottom: '2rem',
            borderRadius: '0.5rem',
            border: '1px solid #555',
            background: '#2a2a2a',
            color: 'white',
            fontSize: '1rem',
          }}
        />

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#00f2f2',
            color: 'black',
            fontWeight: 'bold',
            fontSize: '1rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Register
        </button>
      </form>
    </>
  );
};

export default Register;
