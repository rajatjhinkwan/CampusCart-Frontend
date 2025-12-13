// pages/user-dashboard/index.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
    padding: 20,
  },
  maxWidth: {
    maxWidth: '1280px',
    margin: '0 auto',
    width: '100%',
  },
  heading: {
    marginBottom: 16,
    fontSize: 28,
    fontWeight: 700,
    color: '#111827',
  },
  metricsGrid: (cols) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: 20,
    marginBottom: 24,
  }),
  chartsGrid: (isDesktop) => ({
    display: 'grid',
    gridTemplateColumns: isDesktop ? '2fr 1fr' : '1fr',
    gap: 20,
  }),
};

export default function UserDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState('Dashboard');

  const [metricCols, setMetricCols] = useState(1);
  const [isDesktopLayout, setIsDesktopLayout] = useState(false);
  const [metrics, setMetrics] = useState([
    { title: 'Total Revenue', value: '₹0', change: '', trend: 'up', icon: DollarSign },
    { title: 'Active Users', value: '0', change: '', trend: 'up', icon: Users },
    { title: 'Total Orders', value: '0', change: '', trend: 'up', icon: ShoppingCart },
    { title: 'Growth Rate', value: '0.0%', change: '', trend: 'up', icon: TrendingUp },
  ]);

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

  useEffect(() => {
    const run = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const [meRes, productsRes, convsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/users/me', { headers }),
          axios.get('http://localhost:5000/api/products/my-products', { headers }),
          axios.get('http://localhost:5000/api/conversations', { headers }),
        ]);
        const me = meRes.data?.user || meRes.data || {};
        const userId = me?._id || me?.id || '';
        const products = productsRes.data?.products || [];
        const sold = products.filter((p) => p.isSold);
        const revenueSum = sold.reduce((sum, p) => {
          const price = typeof p.price === 'number' ? p.price : Number(p.price) || 0;
          return sum + price;
        }, 0);
        const conversations = Array.isArray(convsRes.data) ? convsRes.data : [];
        const participantSet = new Set();
        conversations.forEach((c) => {
          const parts = Array.isArray(c.participants) ? c.participants : [];
          parts.forEach((pid) => {
            const v = typeof pid === 'object' ? (pid._id || pid.id) : pid;
            if (v && String(v) !== String(userId)) participantSet.add(String(v));
          });
        });
        const now = Date.now();
        const inDays = (d) => (now - new Date(d).getTime());
        const last30 = products.filter((p) => p.createdAt && inDays(p.createdAt) <= 30 * 24 * 3600 * 1000).length;
        const prev30 = products.filter((p) => p.createdAt && inDays(p.createdAt) > 30 * 24 * 3600 * 1000 && inDays(p.createdAt) <= 60 * 24 * 3600 * 1000).length;
        const rate = prev30 ? ((last30 - prev30) / prev30) * 100 : (last30 ? 100 : 0);
        const rateFixed = Number.isFinite(rate) ? rate.toFixed(1) : '0.0';
        const changeStr = (Number(rateFixed) >= 0 ? `+${rateFixed}%` : `${rateFixed}%`);
        const trendDir = Number(rateFixed) >= 0 ? 'up' : 'down';

        setMetrics([
          { title: 'Total Revenue', value: `₹${revenueSum}`, change: '', trend: 'up', icon: DollarSign },
          { title: 'Active Users', value: String(participantSet.size), change: '', trend: 'up', icon: Users },
          { title: 'Total Orders', value: String(sold.length), change: '', trend: 'up', icon: ShoppingCart },
          { title: 'Growth Rate', value: `${rateFixed}%`, change: changeStr, trend: trendDir, icon: TrendingUp },
        ]);
      } catch {
        setMetrics([
          { title: 'Total Revenue', value: '₹0', change: '', trend: 'up', icon: DollarSign },
          { title: 'Active Users', value: '0', change: '', trend: 'up', icon: Users },
          { title: 'Total Orders', value: '0', change: '', trend: 'up', icon: ShoppingCart },
          { title: 'Growth Rate', value: '0.0%', change: '', trend: 'up', icon: TrendingUp },
        ]);
      }
    };
    run();
  }, []);

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
