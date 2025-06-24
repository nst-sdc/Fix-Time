import React, { useEffect, useState } from 'react';

const Navbar = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      background: theme === 'dark' ? '#222' : '#f5f5f5',
      color: theme === 'dark' ? '#fff' : '#222',
    }}>
      <div style={{ fontWeight: 'bold' }}>FixTime</div>
      <button onClick={toggleTheme} style={{
        padding: '0.5rem 1rem',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        background: theme === 'dark' ? '#444' : '#ddd',
        color: theme === 'dark' ? '#fff' : '#222',
      }}>
        {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </button>
    </nav>
  );
};

export default Navbar; 