// pages/user-dashboard/index.jsx
import React, { useEffect, useState } from 'react';
import axios from '../../lib/axios';
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

  const [carbonData, setCarbonData] = useState([]);
  const [carbonTotal, setCarbonTotal] = useState(0);
  const [wasteAvoidedKg, setWasteAvoidedKg] = useState(0);

  useEffect(() => {
    const run = async () => {
      try {
       const [meRes, productsRes, convsRes, envRes] = await Promise.all([
          axios.get('/api/users/me'),
          axios.get('/api/products/my-products'),
          axios.get('/api/conversations'),
          axios.get('/api/users/me/environment'),
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

        const coeff = {
          Laptop: 200,
          Mobile: 70,
          Furniture: 100,
          Fashion: 25,
          Electronics: 120,
          Default: 60,
        };
        const savedFactor = 0.7;
        const byCat = {};
        const harmCoeff = {
          Laptop: 3.0,
          Mobile: 1.8,
          Furniture: 5.0,
          Fashion: 0.8,
          Electronics: 2.5,
          Default: 1.0,
        };
        const avoidedHarmFactor = 0.6;
        const harmByCat = {};
        sold.forEach((p) => {
          const cat = p.category || p.categoryName || 'Default';
          const base = coeff[cat] ?? coeff.Default;
          const saved = base * savedFactor;
          byCat[cat] = (byCat[cat] || 0) + saved;
          const harmBase = harmCoeff[cat] ?? harmCoeff.Default;
          const harmAvoided = harmBase * avoidedHarmFactor;
          harmByCat[cat] = (harmByCat[cat] || 0) + harmAvoided;
        });
        const chart = Object.keys(byCat).map((k) => ({ category: k, savedKgCO2: Number(byCat[k].toFixed(1)) }));
        const totalSaved = envRes.data?.totalSaved ?? chart.reduce((s, r) => s + r.savedKgCO2, 0);
        const wasteKg = envRes.data?.wasteAvoided ?? sold.length * 1.5;
        const harmChart = envRes.data?.harmChart ?? Object.keys(harmByCat).map((k) => ({ category: k, avoidedKg: Number(harmByCat[k].toFixed(2)) }));
        const harmAvoidedTotal = envRes.data?.harmAvoidedTotal ?? harmChart.reduce((s, r) => s + r.avoidedKg, 0);
        const harmNewTotal = envRes.data?.harmNewTotal ?? sold.reduce((s, p) => {
          const cat = p.category || p.categoryName || 'Default';
          const harmBase = harmCoeff[cat] ?? harmCoeff.Default;
          return s + harmBase;
        }, 0);

        setCarbonData(chart);
        setCarbonTotal(Number(totalSaved.toFixed(1)));
        setWasteAvoidedKg(Number(wasteKg.toFixed(1)));

        setMetrics([
          { title: 'Total Revenue', value: `₹${revenueSum}`, change: '', trend: 'up', icon: DollarSign },
          { title: 'Active Users', value: String(participantSet.size), change: '', trend: 'up', icon: Users },
          { title: 'Total Orders', value: String(sold.length), change: '', trend: 'up', icon: ShoppingCart },
          { title: 'Growth Rate', value: `${rateFixed}%`, change: changeStr, trend: trendDir, icon: TrendingUp },
        ]);
        setHarmStats({ harmChart, harmAvoidedTotal: Number(harmAvoidedTotal.toFixed(2)), harmNewTotal: Number(harmNewTotal.toFixed(2)) });
      } catch {
        setCarbonData([]);
        setCarbonTotal(0);
        setWasteAvoidedKg(0);
        setMetrics([
          { title: 'Total Revenue', value: '₹0', change: '', trend: 'up', icon: DollarSign },
          { title: 'Active Users', value: '0', change: '', trend: 'up', icon: Users },
          { title: 'Total Orders', value: '0', change: '', trend: 'up', icon: ShoppingCart },
          { title: 'Growth Rate', value: '0.0%', change: '', trend: 'up', icon: TrendingUp },
        ]);
        setHarmStats({ harmChart: [], harmAvoidedTotal: 0, harmNewTotal: 0 });
      }
    };
    run();
  }, []);

  const [harmStats, setHarmStats] = useState({ harmChart: [], harmAvoidedTotal: 0, harmNewTotal: 0 });
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
              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 16 }}>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#111827', marginBottom: 8 }}>Carbon Impact (kg CO₂ saved)</div>
                <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>
                  Total saved: {carbonTotal} kg CO₂ • E‑waste avoided: {wasteAvoidedKg} kg
                </div>
                <div style={{ width: '100%', height: 260 }}>
                  {/* Simple inline bar chart without separate component */}
                  {carbonData.length === 0 ? (
                    <div style={{ color: '#6b7280' }}>No sold items yet</div>
                  ) : (
                    <svg width="100%" height="100%" viewBox={`0 0 ${carbonData.length * 60} 240`} preserveAspectRatio="none">
                      {carbonData.map((d, i) => {
                        const max = Math.max(...carbonData.map(c => c.savedKgCO2)) || 1;
                        const barH = (d.savedKgCO2 / max) * 180;
                        const x = i * 60 + 20;
                        const y = 200 - barH;
                        return (
                          <g key={d.category}>
                            <rect x={x} y={y} width={28} height={barH} fill="#2563EB" rx="6" />
                            <text x={x + 14} y={220} fontSize="12" textAnchor="middle" fill="#374151">{d.category}</text>
                            <text x={x + 14} y={y - 6} fontSize="12" textAnchor="middle" fill="#111827">{d.savedKgCO2}</text>
                          </g>
                        );
                      })}
                    </svg>
                  )}
                </div>
              </div>
              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 16 }}>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#111827', marginBottom: 8 }}>Harmful Waste Impact (kg)</div>
                <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>
                  New item impact: {harmStats.harmNewTotal} kg • Avoided by reuse: {harmStats.harmAvoidedTotal} kg
                </div>
                <div style={{ width: '100%', height: 240 }}>
                  {harmStats.harmChart.length === 0 ? (
                    <div style={{ color: '#6b7280' }}>No sold items yet</div>
                  ) : (
                    <svg width="100%" height="100%" viewBox={`0 0 ${harmStats.harmChart.length * 60} 220`} preserveAspectRatio="none">
                      {harmStats.harmChart.map((d, i) => {
                        const max = Math.max(...harmStats.harmChart.map(c => c.avoidedKg)) || 1;
                        const barH = (d.avoidedKg / max) * 160;
                        const x = i * 60 + 20;
                        const y = 180 - barH;
                        return (
                          <g key={d.category}>
                            <rect x={x} y={y} width={28} height={barH} fill="#10B981" rx="6" />
                            <text x={x + 14} y={200} fontSize="12" textAnchor="middle" fill="#374151">{d.category}</text>
                            <text x={x + 14} y={y - 6} fontSize="12" textAnchor="middle" fill="#111827">{d.avoidedKg}</text>
                          </g>
                        );
                      })}
                    </svg>
                  )}
                </div>
              </div>
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
