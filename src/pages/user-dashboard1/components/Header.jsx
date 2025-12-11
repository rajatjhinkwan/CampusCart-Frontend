// pages/user-dashboard/components/Header.jsx
import React from 'react';
import { Menu } from 'lucide-react';

const styles = {
  header: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    padding: '14px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 40,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logo: {
    width: '34px',
    height: '34px',
    borderRadius: '8px',
    backgroundColor: '#2563eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 700,
    fontSize: '16px',
  },
  title: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#111827',
  },
  menuButton: {
    padding: '8px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
};

export function Header({ onMenuClick }) {
  return (
    <header style={styles.header}>
      {/* LEFT SIDE: Logo + Title */}
      <div style={styles.left}>
        <div style={styles.logo}>CC</div>
        <span style={styles.title}>Campus Cart</span>
      </div>

      {/* MENU BUTTON (Mobile Only) */}
      <button
        style={styles.menuButton}
        onClick={onMenuClick}
        className="dashboard-menu-btn"
      >
        <Menu size={22} />
      </button>
    </header>
  );
}
