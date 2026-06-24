import React, { useEffect, useMemo, useState } from 'react';
import axios from '../../lib/axios';
import Navbar from '../../components/navbar';
import { Shield, Ban, CheckCircle, AlertTriangle, Users, Flag, LayoutDashboard, Package, Building2, Wrench, Briefcase, Car, Home, ShoppingBag, TrendingUp } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';

const styles = {
  container: { background: '#f9fafb', minHeight: '100vh' },
  wrap: { maxWidth: '1200px', margin: '0 auto', padding: '20px' },
  header: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 700, color: '#111827' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  cardHead: { padding: 14, borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 },
  list: { padding: 14 },
  item: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f3f4f6' },
  actions: { display: 'flex', gap: 8 },
  btn: { background: '#2563EB', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontWeight: 600 },
  btnAlt: { background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontWeight: 600 },
  btnSecondary: { background: '#10B981', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontWeight: 600 },
  pill: { background: '#EEF2FF', color: '#3730A3', borderRadius: 9999, padding: '3px 8px', fontSize: 12, fontWeight: 700 },
  layout: { display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 'calc(100vh - 72px)' },
  sidebar: { background: 'linear-gradient(180deg, #1e3a8a 0%, #3b82f6 100%)', color: '#CBD5E1', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 },
  sideItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, cursor: 'pointer' },
  sideItemActive: { background: '#111827', color: '#fff' },
  content: { padding: 16 },
  metrics: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 },
  metricCard: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  metricIconBox: { width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#EFF6FF' },
  charts: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 },
};

export default function AdminDashboard() {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allListings, setAllListings] = useState([]);
  const [filters, setFilters] = useState({ q: '', category: '', min: '', max: '', location: '' });
  const [rooms, setRooms] = useState([]);
  const [services, setServices] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [serviceFilters, setServiceFilters] = useState({ location: '', min: '', max: '' });
  const [jobFilters, setJobFilters] = useState({ location: '', min: '', max: '' });
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | users | drivers | products | rooms | services | jobs | reports
  const [adminTotals, setAdminTotals] = useState({});
  const [dailySales, setDailySales] = useState([]);
  const [rangeDays, setRangeDays] = useState(30);
  const [dailyAdded, setDailyAdded] = useState([]);
  const [baselineValueBeforeStart, setBaselineValueBeforeStart] = useState(0);
  const [categoryDist, setCategoryDist] = useState([]);
  const [avgPriceCatAll, setAvgPriceCatAll] = useState([]);
  const [topSalesCat, setTopSalesCat] = useState([]);
  const [rideOverview, setRideOverview] = useState({ rides: {}, drivers: {} });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [usersRes, reportsRes] = await Promise.all([
          axios.get('/api/users'),
          axios.get('/api/reports'),
        ]);
        setUsers(usersRes.data?.users || usersRes.data || []);
        setReports(reportsRes.data?.reports || []);
        const [roomsRes, servicesRes, jobsRes] = await Promise.all([
          axios.get('/api/rooms'),
          axios.get('/api/services'),
          axios.get('/api/jobs'),
        ]);
        setRooms(roomsRes.data?.data || roomsRes.data?.rooms || []);
        setServices(servicesRes.data?.data || servicesRes.data?.services || []);
        setJobs(jobsRes.data?.jobs || jobsRes.data?.data || []);
        try {
          const catRes = await axios.get('/api/categories?type=product');
          const cats = catRes.data?.categories || [];
          const main = cats.find(c => c.title === 'Product');
          const subs = main ? cats.filter(c => String(c.parent) === String(main._id)) : cats.filter(c => c.type === 'product');
          setProductCategories(subs);
        } catch (err) {
          console.warn('Categories fetch failed', err);
        }
        const loadStats = async () => {
          try {
            const statsRes = await axios.get(`/api/products/admin/stats?rangeDays=${rangeDays}`);
            setAdminTotals(statsRes.data?.totals || {});
            setDailySales(statsRes.data?.dailySales || []);
            setDailyAdded(statsRes.data?.dailyAdded || []);
            setBaselineValueBeforeStart(Number(statsRes.data?.baselineValueBeforeStart || 0));
          } catch (err) {
            console.warn('Admin stats fetch failed', err);
          }
        };
        const loadCatDist = async () => {
          try {
            const res = await axios.get('/api/products/admin/category-distribution');
            setCategoryDist(res.data?.categories || []);
          } catch (err) {
            console.warn('Category distribution fetch failed', err);
          }
        };
        const loadAvg = async () => {
          try {
            const res = await axios.get('/api/products/admin/avg-price-by-category');
            setAvgPriceCatAll(res.data?.all || []);
          } catch (err) {
            console.warn('Avg price by category fetch failed', err);
          }
        };
        const loadTop = async () => {
          try {
            const res = await axios.get('/api/products/admin/top-category-sales');
            setTopSalesCat(res.data?.categories || []);
          } catch (err) {
            console.warn('Top category sales fetch failed', err);
          }
        };
        const loadRideOverview = async () => {
          try {
            const res = await axios.get('/api/rides/admin/overview');
            setRideOverview(res.data || { rides: {}, drivers: {} });
          } catch (err) {
            console.warn('Ride overview fetch failed', err);
          }
        };
        await Promise.all([loadStats(), loadCatDist(), loadAvg(), loadTop(), loadRideOverview()]);
      } catch (e) {
        console.error('Failed to load admin data', e);
        setUsers([]);
        setReports([]);
        setRooms([]);
        setServices([]);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [rangeDays]);

  useEffect(() => {
    const loadListings = async () => {
      try {
        const params = new URLSearchParams();
        if (filters.q) params.set('q', filters.q);
        if (filters.category) params.set('category', filters.category);
        if (filters.min) params.set('min', filters.min);
        if (filters.max) params.set('max', filters.max);
        if (filters.location) params.set('location', filters.location);
        const res = await axios.get(`/api/products?${params.toString()}`);
        setAllListings(res.data?.products || res.data?.data || []);
      } catch (e) {
        console.error('Failed to load listings', e);
        setAllListings([]);
      }
    };
    loadListings();
  }, [filters.q, filters.category, filters.min, filters.max, filters.location]);

  const ban = async (userId) => {
    try {
      await axios.patch(`/api/users/${userId}/ban`, { action: 'ban' });
      setUsers((prev) => prev.map(u => u._id === userId ? { ...u, role: 'banned' } : u));
    } catch (e) {
      console.error('Ban user failed', e);
    }
  };
  const unban = async (userId) => {
    try {
      await axios.patch(`/api/users/${userId}/ban`, { action: 'unban' });
      setUsers((prev) => prev.map(u => u._id === userId ? { ...u, role: 'buyer' } : u));
    } catch (e) {
      console.error('Unban user failed', e);
    }
  };
  const deleteUser = async (userId) => {
    try {
      await axios.delete(`/api/users/${userId}`);
      setUsers(prev => prev.filter(u => u._id !== userId));
    } catch (e) {
      console.error('Delete user failed', e);
    }
  };
  const resolveReport = async (reportId, action) => {
    try {
      await axios.patch(`/api/reports/${reportId}/resolve`, { action });
      setReports((prev) => prev.filter(r => r._id !== reportId));
    } catch (e) {
      console.error('Resolve report failed', e);
    }
  };
  const blockRoom = async (id, active) => {
    try {
      await axios.patch(`/api/rooms/${id}/admin/active`, { active });
      setRooms(prev => prev.map(r => r._id === id ? { ...r, isActive: active } : r));
    } catch (e) { console.error('Block/unblock room failed', e); }
  };
  const deleteRoom = async (id) => {
    try { await axios.delete(`/api/rooms/${id}/admin`); setRooms(prev => prev.filter(r => r._id !== id)); } catch (e) { console.error('Delete room failed', e); }
  };
  const blockService = async (id, available) => {
    try { await axios.patch(`/api/services/${id}/admin/available`, { available }); setServices(prev => prev.map(s => s._id === id ? { ...s, isAvailable: available } : s)); } catch (e) { console.error('Block/unblock service failed', e); }
  };
  const deleteService = async (id) => {
    try { await axios.delete(`/api/services/${id}/admin`); setServices(prev => prev.filter(s => s._id !== id)); } catch (e) { console.error('Delete service failed', e); }
  };
  const blockJob = async (id, active) => {
    try { await axios.patch(`/api/jobs/${id}/admin/active`, { active }); setJobs(prev => prev.map(j => j._id === id ? { ...j, isActive: active } : j)); } catch (e) { console.error('Block/unblock job failed', e); }
  };
  const deleteJob = async (id) => {
    try { await axios.delete(`/api/jobs/${id}/admin`); setJobs(prev => prev.filter(j => j._id !== id)); } catch (e) { console.error('Delete job failed', e); }
  };

  const drivers = users.filter(u => u.settings?.selling?.driverRegistered);
  const metrics = [
    { title: 'Total Users', value: String(users.length), icon: <Users color="#2563EB" size={20} />, iconBg: '#E0EDFF' },
    { title: 'Active Listings', value: String(allListings.length), icon: <Package color="#10B981" size={20} />, iconBg: '#D1FAE5' },
    { title: 'Total Product Value', value: `₹${Number(adminTotals?.totalValue || 0).toLocaleString('en-IN')}`, icon: <Home color="#A855F7" size={20} />, iconBg: '#F3E8FF' },
    { title: 'Total Sales', value: `₹${Number(adminTotals?.totalSalesValue || 0).toLocaleString('en-IN')}`, icon: <ShoppingBag color="#F59E0B" size={20} />, iconBg: '#FEF3C7' },
    { title: 'Sold Products', value: String(Number(adminTotals?.soldCount || 0)), icon: <CheckCircle color="#10B981" size={20} />, iconBg: '#D1FAE5' },
    { title: 'Unsold Inventory', value: String(Number(adminTotals?.unsoldCount || 0)), icon: <AlertTriangle color="#ef4444" size={20} />, iconBg: '#fde7e7' },
    { title: 'Sell-Through Rate', value: `${adminTotals?.totalProducts ? Math.round((Number(adminTotals.soldCount || 0) / Number(adminTotals.totalProducts)) * 100) : 0}%`, icon: <TrendingUp color="#6366F1" size={20} />, iconBg: '#EEF2FF' },
    { title: 'Drivers Registered', value: String(Number(rideOverview?.drivers?.driverRegistered || 0)), icon: <Car color="#3B82F6" size={20} />, iconBg: '#E0EDFF' },
    { title: 'Drivers Approved', value: String(Number(rideOverview?.drivers?.driverApproved || 0)), icon: <Car color="#10B981" size={20} />, iconBg: '#D1FAE5' },
    { title: 'Open Rides', value: String(Number(rideOverview?.rides?.openCount || 0)), icon: <Car color="#F59E0B" size={20} />, iconBg: '#FEF3C7' },
  ];
  const salesData = useMemo(() => {
    if (dailySales && dailySales.length) {
      return dailySales.map(d => ({
        day: new Date(d.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        value: Number(d.total || 0),
      }));
    }
    const now = new Date();
    const days = [];
    for (let i = rangeDays - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({ key, label: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) });
    }
    const map = {};
    for (const p of allListings) {
      const created = new Date(p.createdAt || Date.now());
      const key = created.toISOString().slice(0, 10);
      if (!map[key]) map[key] = 0;
      map[key] += Number(p.price || 0);
    }
    return days.map(d => ({ day: d.label, value: map[d.key] || 0 }));
  }, [dailySales, allListings, rangeDays]);
  const inventoryData = useMemo(() => {
    const seq = [];
    let acc = Number(baselineValueBeforeStart || 0);
    const sorted = [...dailyAdded].sort((a, b) => new Date(a.date) - new Date(b.date));
    for (const d of sorted) {
      acc += Number(d.totalValue || 0);
      seq.push({ day: new Date(d.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }), value: acc });
    }
    if (!seq.length) {
      return salesData;
    }
    return seq;
  }, [dailyAdded, baselineValueBeforeStart, salesData]);
  const newListingsData = useMemo(() => {
    const sorted = [...dailyAdded].sort((a, b) => new Date(a.date) - new Date(b.date));
    return sorted.map(d => ({ day: new Date(d.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }), count: Number(d.count || 0) }));
  }, [dailyAdded]);
  const colors = ['#3b82f6','#10b981','#f59e0b','#a855f7','#ef4444','#6366f1','#14b8a6'];
  const pieData = categoryDist.map(c => ({ name: c.title || c.name || 'Uncategorized', value: Number(c.count || 0) }));
  const avgPriceData = avgPriceCatAll.map(c => ({ name: c.title || c.name || 'Uncategorized', avg: Number(c.avgPrice || 0) }));
  const topSalesData = topSalesCat.map(c => ({ name: c.title || c.name || 'Uncategorized', total: Number(c.totalSales || 0) }));

  if (!user?._id || user?.role !== 'admin') {
    return <Navigate to="/user-dashboard" replace />;
  }

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.layout}>
        <aside style={styles.sidebar}>
          <div style={{ ...styles.sideItem, ...(activeTab === 'dashboard' ? styles.sideItemActive : {}) }} onClick={() => setActiveTab('dashboard')}><LayoutDashboard size={18} /> Dashboard</div>
          <div style={{ ...styles.sideItem, ...(activeTab === 'users' ? styles.sideItemActive : {}) }} onClick={() => setActiveTab('users')}><Users size={18} /> Users</div>
          <div style={{ ...styles.sideItem, ...(activeTab === 'drivers' ? styles.sideItemActive : {}) }} onClick={() => setActiveTab('drivers')}><Car size={18} /> Drivers</div>
          <div style={{ ...styles.sideItem, ...(activeTab === 'products' ? styles.sideItemActive : {}) }} onClick={() => setActiveTab('products')}><Package size={18} /> Products</div>
          <div style={{ ...styles.sideItem, ...(activeTab === 'rooms' ? styles.sideItemActive : {}) }} onClick={() => setActiveTab('rooms')}><Building2 size={18} /> Rooms</div>
          <div style={{ ...styles.sideItem, ...(activeTab === 'services' ? styles.sideItemActive : {}) }} onClick={() => setActiveTab('services')}><Wrench size={18} /> Services</div>
          <div style={{ ...styles.sideItem, ...(activeTab === 'jobs' ? styles.sideItemActive : {}) }} onClick={() => setActiveTab('jobs')}><Briefcase size={18} /> Jobs</div>
          <div style={{ ...styles.sideItem, ...(activeTab === 'reports' ? styles.sideItemActive : {}) }} onClick={() => setActiveTab('reports')}><Flag size={18} /> Reports</div>
        </aside>
        <div style={styles.content}>
          <div style={styles.header}>
            <Shield color="#2563EB" />
            <span style={styles.title}>Admin Dashboard</span>
            <span style={styles.pill}>{loading ? 'Loading...' : `Users: ${users.length} • Reports: ${reports.length}`}</span>
          </div>

          {activeTab === 'dashboard' && (
            <>
              <div style={styles.metrics}>
                {metrics.map((m, idx) => (
                  <div key={idx} style={styles.metricCard}>
                    <div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>{m.title}</div>
                      <div style={{ fontSize: 24, fontWeight: 700 }}>{m.value}</div>
                    </div>
                    <div style={{ ...styles.metricIconBox, background: m.iconBg }}>{m.icon}</div>
                  </div>
                ))}
              </div>
              <div style={{ ...styles.charts, gridTemplateColumns: '1fr 1fr' }}>
                <div style={styles.card}>
                  <div style={styles.cardHead}>Sales Performance (Last {rangeDays} days)</div>
                  <div style={{ height: 260, padding: 12 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={salesData}>
                        <defs>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis tickFormatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`} />
                        <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Total']} />
                        <Area type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div style={styles.card}>
                  <div style={styles.cardHead}>Inventory Worth Over Time</div>
                  <div style={{ height: 260, padding: 12 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={inventoryData}>
                        <defs>
                          <linearGradient id="colorInv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis tickFormatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`} />
                        <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Total']} />
                        <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorInv)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div style={styles.card}>
                  <div style={styles.cardHead}>Category Distribution</div>
                  <div style={{ height: 260, padding: 12 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          outerRadius={100}
                          innerRadius={0}
                          paddingAngle={2}
                          labelLine={false}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div style={styles.card}>
                  <div style={styles.cardHead}>New Listings Added</div>
                  <div style={{ height: 260, padding: 12 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={newListingsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#6366F1" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div style={styles.card}>
                  <div style={styles.cardHead}>Average Price by Category</div>
                  <div style={{ height: 260, padding: 12 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={avgPriceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`} />
                        <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Avg']} />
                        <Bar dataKey="avg" fill="#F59E0B" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div style={styles.card}>
                  <div style={styles.cardHead}>Top Categories by Sales Value</div>
                  <div style={{ height: 260, padding: 12 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topSalesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`} />
                        <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Total']} />
                        <Bar dataKey="total" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8, marginTop: 8 }}>
                <span style={{ fontSize: 12, color: '#6b7280' }}>Range</span>
                <select value={rangeDays} onChange={(e) => setRangeDays(Number(e.target.value))} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }}>
                  <option value={1}>Last 1 day</option>
                  <option value={7}>Last 7 days</option>
                  <option value={30}>Last 30 days</option>
                  <option value={90}>Last 90 days</option>
                  <option value={365}>Last 1 year</option>
                </select>
              </div>
              
              <div style={{ marginTop: 24, padding: 16, backgroundColor: '#f0f9ff', borderRadius: 8, border: '1px solid #bae6fd' }}>
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: '#0369a1', marginBottom: 8 }}>Dashboard Guide</h4>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#2563EB' }}></span>
                          <span>Sales Volume</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10B981' }}></span>
                          <span>Inventory Value</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#F59E0B' }}></span>
                          <span>Avg. Price</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#6366F1' }}></span>
                          <span>New Listings</span>
                      </div>
                  </div>
              </div>
            </>
          )}

          {activeTab === 'users' && (
            <div style={styles.card}>
              <div style={styles.cardHead}><Users size={18} /> Users</div>
              <div style={styles.list}>
                {users.map(u => (
                  <div key={u._id} style={styles.item}>
                    <Link to={`/admin/users/${u._id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={u.avatar || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'} alt="" style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid #e5e7eb', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 600 }}>{u.name || u.email}</div>
                        <div style={{ fontSize: 12, color: '#6b7280' }}>{u.email} • Role: {u.role}</div>
                      </div>
                    </Link>
                    <div style={styles.actions}>
                      <button style={styles.btnAlt} onClick={() => ban(u._id)}><Ban size={16} /> Ban</button>
                      <button style={styles.btnSecondary} onClick={() => unban(u._id)}><CheckCircle size={16} /> Unban</button>
                      <button style={styles.btnAlt} onClick={() => deleteUser(u._id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'drivers' && (
            <div style={styles.card}>
              <div style={styles.cardHead}><Car size={18} /> Drivers</div>
              <div style={styles.list}>
                {drivers.length === 0 && <div style={{ color: '#6b7280' }}>No drivers</div>}
                {drivers.map(u => (
                  <div key={u._id} style={styles.item}>
                    <Link to={`/admin/users/${u._id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={u.avatar || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'} alt="" style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid #e5e7eb', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 600 }}>{u.name || u.email}</div>
                        <div style={{ fontSize: 12, color: '#6b7280' }}>{u.email} • Driver</div>
                      </div>
                    </Link>
                    <div style={styles.actions}>
                      <button style={styles.btnAlt} onClick={() => ban(u._id)}><Ban size={16} /> Ban</button>
                      <button style={styles.btnSecondary} onClick={() => unban(u._id)}><CheckCircle size={16} /> Unban</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div style={styles.card}>
              <div style={styles.cardHead}>All Listings</div>
              <div style={{ padding: 14, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                <input placeholder="Search title" value={filters.q} onChange={(e) => setFilters(f => ({ ...f, q: e.target.value }))} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }} />
                <select value={filters.category} onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }}>
                  <option value="">All Categories</option>
                  {productCategories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.title}</option>
                  ))}
                </select>
                <input placeholder="Min Price" value={filters.min} onChange={(e) => setFilters(f => ({ ...f, min: e.target.value }))} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }} />
                <input placeholder="Max Price" value={filters.max} onChange={(e) => setFilters(f => ({ ...f, max: e.target.value }))} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }} />
                <input placeholder="Location" value={filters.location} onChange={(e) => setFilters(f => ({ ...f, location: e.target.value }))} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }} />
              </div>
              <div style={styles.list}>
                {allListings.map(p => (
                  <div key={p._id} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 12, padding: '10px 0', borderBottom: '1px solid #f3f4f6', cursor: 'pointer' }} onClick={() => navigate(`/product/${p._id}`)}>
                    <img src={(p.images && (p.images[0]?.url || p.images[0])) || 'https://via.placeholder.com/64x64.png?text=+'} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', border: '1px solid #e5e7eb' }} />
                    <div>
                      <div style={{ fontWeight: 600 }}>{p.title}</div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>
                        ₹{p.price} • {p.location || 'No location'} • {p.category?.title || p.category?.name || (typeof p.category === 'string' ? p.category : 'Uncategorized')}
                      </div>
                    </div>
                    <button
                      style={{ ...styles.btnAlt, alignSelf: 'center' }}
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          await axios.delete(`/api/products/${p._id}`);
                          setAllListings(prev => prev.filter(x => x._id !== p._id));
                        } catch (e) {
                          console.error('Delete listing failed', e);
                        }
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {allListings.length === 0 && <div style={{ color: '#6b7280', padding: 14 }}>No listings found</div>}
              </div>
            </div>
          )}

          {activeTab === 'rooms' && (
            <div style={styles.card}>
              <div style={styles.cardHead}><Building2 size={18} /> Rooms</div>
              <div style={styles.list}>
                {rooms.map(r => (
                  <div key={r._id} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: 12, padding: '10px 0', borderBottom: '1px solid #e5e7eb', cursor: 'pointer' }} onClick={() => navigate(`/rooms/${r._id}`)}>
                    <img src={(r.images && (r.images[0]?.url || r.images[0])) || 'https://via.placeholder.com/64x64.png?text=+'} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', border: '1px solid #e5e7eb' }} />
                    <div>
                      <div style={{ fontWeight: 600 }}>{r.title}</div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>{r.location?.city || r.location || ''} • ₹{r.rent || r.price || ''}</div>
                    </div>
                    <button style={styles.btn} onClick={() => blockRoom(r._id, !r.isActive)}>{r.isActive ? 'Block' : 'Unblock'}</button>
                    <button style={styles.btnAlt} onClick={() => deleteRoom(r._id)}>Delete</button>
                  </div>
                ))}
                {rooms.length === 0 && <div style={{ color: '#6b7280' }}>No rooms</div>}
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div style={styles.card}>
              <div style={styles.cardHead}><Wrench size={18} /> Services</div>
              <div style={{ padding: 14, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                <input placeholder="Location" value={serviceFilters.location} onChange={(e) => setServiceFilters(f => ({ ...f, location: e.target.value }))} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }} />
                <input placeholder="Min Price" value={serviceFilters.min} onChange={(e) => setServiceFilters(f => ({ ...f, min: e.target.value }))} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }} />
                <input placeholder="Max Price" value={serviceFilters.max} onChange={(e) => setServiceFilters(f => ({ ...f, max: e.target.value }))} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }} />
              </div>
              <div style={styles.list}>
                {services
                  .filter(s => {
                    const locOk = serviceFilters.location ? (String(s.location || '').toLowerCase().includes(serviceFilters.location.toLowerCase())) : true;
                    const minOk = serviceFilters.min ? Number(s.price || 0) >= Number(serviceFilters.min) : true;
                    const maxOk = serviceFilters.max ? Number(s.price || 0) <= Number(serviceFilters.max) : true;
                    return locOk && minOk && maxOk;
                  })
                  .map(s => (
                  <div key={s._id} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: 12, padding: '12px 0', borderBottom: '1px solid #e5e7eb', cursor: 'pointer' }} onClick={() => navigate(`/services/${s._id}`)}>
                    <img src={(s.images && (s.images[0]?.url || s.images[0])) || 'https://via.placeholder.com/64x64.png?text=+'} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', border: '1px solid #e5e7eb' }} />
                    <div>
                      <div style={{ fontWeight: 600 }}>{s.title}</div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>{s.category} • ₹{Number(s.price || 0).toLocaleString('en-IN')}</div>
                    </div>
                    <button style={styles.btn} onClick={(e) => { e.stopPropagation(); blockService(s._id, !s.isAvailable); }}>{s.isAvailable ? 'Block' : 'Unblock'}</button>
                    <button style={styles.btnAlt} onClick={(e) => { e.stopPropagation(); deleteService(s._id); }}>Delete</button>
                  </div>
                ))}
                {services.length === 0 && <div style={{ color: '#6b7280' }}>No services</div>}
              </div>
            </div>
          )}

          {activeTab === 'jobs' && (
            <div style={styles.card}>
              <div style={styles.cardHead}><Briefcase size={18} /> Jobs</div>
              <div style={{ padding: 14, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                <input placeholder="Location" value={jobFilters.location} onChange={(e) => setJobFilters(f => ({ ...f, location: e.target.value }))} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }} />
                <input placeholder="Min Salary" value={jobFilters.min} onChange={(e) => setJobFilters(f => ({ ...f, min: e.target.value }))} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }} />
                <input placeholder="Max Salary" value={jobFilters.max} onChange={(e) => setJobFilters(f => ({ ...f, max: e.target.value }))} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }} />
              </div>
              <div style={styles.list}>
                {jobs
                  .filter(j => {
                    const locOk = jobFilters.location ? (String(j.location || '').toLowerCase().includes(jobFilters.location.toLowerCase())) : true;
                    const salary = Number(j.salary || 0);
                    const minOk = jobFilters.min ? salary >= Number(jobFilters.min) : true;
                    const maxOk = jobFilters.max ? salary <= Number(jobFilters.max) : true;
                    return locOk && minOk && maxOk;
                  })
                  .map(j => (
                  <div key={j._id} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 12, padding: '12px 0', borderBottom: '1px solid #e5e7eb', cursor: 'pointer' }} onClick={() => navigate(`/jobs/${j._id}`)}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{j.title}</div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>{j.companyName} • {j.location}</div>
                    </div>
                    <button style={styles.btn} onClick={(e) => { e.stopPropagation(); blockJob(j._id, !j.isActive); }}>{j.isActive ? 'Block' : 'Unblock'}</button>
                    <button style={styles.btnAlt} onClick={(e) => { e.stopPropagation(); deleteJob(j._id); }}>Delete</button>
                  </div>
                ))}
                {jobs.length === 0 && <div style={{ color: '#6b7280' }}>No jobs</div>}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div style={styles.card}>
              <div style={styles.cardHead}><Flag size={18} /> Reports</div>
              <div style={styles.list}>
                {reports.length === 0 && <div style={{ color: '#6b7280' }}>No reports</div>}
                {reports.map(r => (
                  <div key={r._id} style={styles.item}>
                    <div>
                      <div style={{ fontWeight: 600 }}>Type: {r.type} • Reason: {r.reason}</div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>{r.details || r.text || r.content || ''}</div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>By: {r.reportedBy?.name || r.reportedBy}</div>
                    </div>
                    <div style={styles.actions}>
                      <button style={styles.btnAlt} onClick={() => resolveReport(r._id, 'remove')}><AlertTriangle size={16} /> Remove</button>
                      <button style={styles.btnSecondary} onClick={() => resolveReport(r._id, 'ignore')}><CheckCircle size={16} /> Ignore</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
