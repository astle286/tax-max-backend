import React from 'react';
import { logout } from '../utils/auth'; // adjust path if needed

function Header() {
  return (
    <header style={{
      backgroundColor: '#0077cc',
      color: 'white',
      padding: '1rem',
      fontSize: '1.2rem',
      fontWeight: 'bold',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span>Tax-Max Admin Panel</span>
      <button
        onClick={logout}
        style={{
          backgroundColor: 'white',
          color: '#0077cc',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Logout
      </button>
    </header>
  );
}

export default Header;
