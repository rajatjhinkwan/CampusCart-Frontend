// pages/user-dashboard/index.jsx
import React, { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MetricCard } from './components/MetricCard';
import { SalesChart } from './components/SalesChart';
import { RecentActivity } from './components/RecentActivity';
import {
  TrendingUp,
  DollarSign,
  Users,
  ShoppingCart,
} from 'lucide-react';

// IMPORT USER PAGES
import MyListings from '../mylistings';
import Messages from '../messages';
import Notifications from '../notifications';
import SettingsComp from '../settings';
import WishlistPage from '../wishlist';
import PromotionsPage from '../promotions';

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
  },
  maxWidth: {
    maxWidth: '1280px',
    margin: '0 auto',
    width: '100%',
  },
  heading: {
    marginBottom: '18px',
    fontSize: '28px',
    fontWeight: 700,
    color: '#111827',
  },
  metricsGrid: (cols) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: '24px',
    marginBottom: '32px',
  }),
  chartsGrid: (isDesktop) => ({
    display: 'grid',
    gridTemplateColumns: isDesktop ? '2fr 1fr' : '1fr',
    gap: '24px',
  }),
};

export default function UserDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState('Dashboard');

  const [metricCols, setMetricCols] = useState(1);
  const [isDesktopLayout, setIsDesktopLayout] = useState(false);

  useEffect(() => {
    function updateLayout() {
      const w = window.innerWidth;
      if (w >= 1024) {
        setMetricCols(4);
        setIsDesktopLayout(true);
      } else if (w >= 768) {
        setMetricCols(2);
        setIsDesktopLayout(false);
      } else {
        setMetricCols(1);
        setIsDesktopLayout(false);
      }
    }
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  const metrics = [
    {
      title: 'Total Revenue',
      value: '₹45,231',
      change: '+20.1%',
      trend: 'up',
      icon: DollarSign,
    },
    {
      title: 'Active Users',
      value: '2,543',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Total Orders',
      value: '1,234',
      change: '+8.3%',
      trend: 'up',
      icon: ShoppingCart,
    },
    {
      title: 'Growth Rate',
      value: '18.2%',
      change: '+4.2%',
      trend: 'up',
      icon: TrendingUp,
    },
  ];

  // PAGE RENDER LOGIC
  const renderPage = () => {
    switch (selectedPage) {
      case 'My Listings':
        return <MyListings />;
      case 'Messages':
        return <Messages />;
      case 'Notifications':
        return <Notifications />;
      case 'Settings':
        return <SettingsComp />;
      case 'Wishlist':
        return <WishlistPage />;
      case 'Promotions':
        return <PromotionsPage />;
      default:
        return (
          <>
            <h1 style={styles.heading}>Dashboard</h1>

            <div style={styles.metricsGrid(metricCols)}>
              {metrics.map((m, i) => (
                <MetricCard key={i} {...m} />
              ))}
            </div>

            <div style={styles.chartsGrid(isDesktopLayout)}>
              <SalesChart />
              <RecentActivity />
            </div>
          </>
        );
    }
  };

  return (
    <div style={styles.container}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onMenuSelect={(label) => setSelectedPage(label)}
        activePage={selectedPage}
      />

      <div style={styles.mainContent}>
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main style={styles.main}>
          <div style={styles.maxWidth}>{renderPage()}</div>
        </main>
      </div>
    </div>
  );
}
