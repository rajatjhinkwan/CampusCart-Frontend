// pages/user-dashboard/components/Sidebar.jsx
import React from 'react';
import {
  Home,
  BarChart2,
  Users,
  Settings,
  X,
  Package,
  Heart,       // Wishlist icon
  Gift,        // Promotions icon
} from 'lucide-react';

const Wishlist = Heart;
const Promotions = Gift;

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    zIndex: 20,
  },
  sidebar: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 30,
    width: '256px',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #e5e7eb',
    paddingTop: '8px',
    transition: 'transform 0.25s ease-in-out',
    display: 'flex',
    flexDirection: 'column',
  },
  staticSidebar: {
    transform: 'translateX(0)',
    position: 'relative',
    height: '100vh',
  },
  hiddenSidebar: {
    transform: 'translateX(-110%)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px',
    borderBottom: '1px solid #e5e7eb',
  },
  title: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#111827',
  },
  closeButton: {
    padding: '8px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  nav: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    overflowY: 'auto',
  },
  menuItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 14px',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#374151',
    border: 'none',
    textAlign: 'left',
  },
  menuItemActive: {
    backgroundColor: '#eff6ff',
    color: '#2563eb',
  },
};

export function Sidebar({ isOpen, onClose, onMenuSelect, activePage }) {
  const menuItems = [
    { icon: Home, label: 'Dashboard' },
    { icon: Package, label: 'My Listings' },
    { icon: Users, label: 'Messages' },
    { icon: BarChart2, label: 'Notifications' },
    { icon: Settings, label: 'Settings' },
    { icon: Wishlist, label: 'Wishlist' },
    { icon: Promotions, label: 'Promotions' },
  ];

  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const setVal = () => setIsDesktop(mq.matches);
    setVal();

    mq.addEventListener?.('change', setVal);
    return () => mq.removeEventListener?.('change', setVal);
  }, []);

  return (
    <>
      {!isDesktop && isOpen && <div style={styles.overlay} onClick={onClose} />}

      <aside
        style={{
          ...styles.sidebar,
          ...(isDesktop
            ? styles.staticSidebar
            : isOpen
            ? styles.staticSidebar
            : styles.hiddenSidebar),
        }}
      >
        <div style={styles.header}>
          <h2 style={styles.title}>Dashboard</h2>

          {!isDesktop && (
            <button
              onClick={onClose}
              style={styles.closeButton}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = '#f3f4f6')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = 'transparent')
              }
            >
              <X style={{ width: 18, height: 18 }} />
            </button>
          )}
        </div>

        <nav style={styles.nav}>
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              style={{
                ...styles.menuItem,
                ...(activePage === item.label
                  ? styles.menuItemActive
                  : {}),
              }}
              onClick={() => {
                onMenuSelect(item.label); // ← PAGE CHANGE
                if (!isDesktop) onClose(); // close on mobile
              }}
              onMouseEnter={(e) => {
                if (activePage !== item.label)
                  e.currentTarget.style.backgroundColor = '#f8fafc';
              }}
              onMouseLeave={(e) => {
                if (activePage !== item.label)
                  e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <item.icon style={{ width: 18, height: 18 }} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
