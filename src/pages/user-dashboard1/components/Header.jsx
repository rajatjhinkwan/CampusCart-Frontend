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
  brandLogo: {
    width: '34px',
    height: '34px',
    borderRadius: '8px',
    objectFit: 'cover',
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
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
  const [isDesktop, setIsDesktop] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const setVal = () => setIsDesktop(mq.matches);
    setVal();
    mq.addEventListener?.('change', setVal);
    return () => mq.removeEventListener?.('change', setVal);
  }, []);

  return (
    <header style={styles.header}>
      {/* LEFT SIDE: Logo + Title */}
      <div style={styles.left}>
        <img
          src={import.meta.env.VITE_APP_LOGO_URL || "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/googlemessages.svg"}
          alt="CampusHub"
          style={styles.brandLogo}
        />
        <span style={styles.title}>Campus Cart</span>
      </div>

      {/* MENU BUTTON (Mobile Only) */}
      {!isDesktop && (
        <button
          style={styles.menuButton}
          onClick={onMenuClick}
          className="dashboard-menu-btn"
        >
          <Menu size={22} />
        </button>
      )}
    </header>
  );
}
