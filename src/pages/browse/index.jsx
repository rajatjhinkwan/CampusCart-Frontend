import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from '../../lib/axios';

import Navbar from '../../components/navbar';
import SearchFilter from './components/SearchFilter';
import SearchFilterList from './components/SearchFilterList';

const Index = () => {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [activeTab, setActiveTab] = useState("Products"); // Current active tab
  const [searchText, setSearchText] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  const isDesktop = width >= 1024;

  // Reset filters when changing tabs to avoid cross-tab params
  useEffect(() => {
    setFilters({});
    setSearchText("");
    setSearchLocation("");
  }, [activeTab]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ["Products", "Rooms", "Services", "Jobs"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Determine API endpoint based on active tab
    let apiUrl = "/api/products";
    if (activeTab === "Rooms") apiUrl = "/api/rooms";
    else if (activeTab === "Services") apiUrl = "/api/services";
    else if (activeTab === "Jobs") apiUrl = "/api/jobs";

    // Check if filters actually have values
    const hasFilters =
      filters &&
      Object.values(filters).some(
        (value) => value !== "" && value !== null && value !== undefined && value.length !== 0
      );

    const fetchData = async () => {
      try {
        let res;
        if (hasFilters) {
          // Use filtered endpoint
          res = await axios.get(`${apiUrl}/filter`, { params: filters });
        } else {
          // Fetch all items
          res = await axios.get(apiUrl);
        }

        let fetchedItems = [];
        if (activeTab === "Rooms") fetchedItems = res.data?.data || [];
        else if (activeTab === "Services") fetchedItems = res.data?.data || []; // <-- SERVICES use data
        else if (activeTab === "Products") fetchedItems = res.data?.products || [];
        else if (activeTab === "Jobs") fetchedItems = res.data?.jobs || [];

        const sorted = Array.isArray(fetchedItems)
          ? [...fetchedItems].sort((a, b) => {
              const at = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
              const bt = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
              return bt - at;
            })
          : [];
        setItems(sorted);
      } catch (err) {
        setError(`Failed to load ${activeTab}.`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, activeTab]);

  // --- Styles ---
  const styles = {
    pageWrapper: { backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' },
    mainContent: { display: 'flex', justifyContent: 'center', padding: isMobile ? '12px' : '20px', width: '100%' },
    container: { display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '16px' : (isTablet ? '24px' : '30px'), maxWidth: isDesktop ? '1400px' : '100%', width: '100%', alignItems: isMobile ? 'stretch' : 'flex-start' },
    sidebarWrapper: { flexShrink: 0, position: isMobile ? 'static' : 'sticky', top: '70px', width: isMobile ? '100%' : 'auto' },
    listWrapper: { flexGrow: 1, minWidth: 0, paddingTop: isMobile ? '8px' : '20px' },
    btnStyle: (isActive) => ({
      padding: isMobile ? '8px 12px' : '10px 20px',
      margin: isMobile ? '0 6px' : '0 10px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: isActive ? '#1d4ed8' : '#3b82f6',
      color: '#ffffff',
      cursor: 'pointer',
    }),
    hero: {
      width: '100%',
      background: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 60%, #14B8A6 100%)',
      padding: isMobile ? '36px 12px 24px' : '60px 20px 40px',
      color: '#fff',
      display: 'flex',
      justifyContent: 'center',
    },
    heroInner: {
      width: '100%',
      maxWidth: isMobile ? '640px' : '1000px',
      textAlign: 'center',
    },
    heroTitle: { fontSize: isMobile ? '24px' : '34px', fontWeight: 800, marginBottom: '6px' },
    heroSub: { fontSize: isMobile ? '14px' : '16px', opacity: 0.9, marginBottom: '18px' },
    searchRow: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : (isTablet ? '1fr 1fr auto' : '1fr 220px auto'),
      gap: isMobile ? '8px' : '12px',
      background: '#ffffff',
      padding: isMobile ? '8px' : '10px',
      borderRadius: isMobile ? '20px' : '999px',
      boxShadow: isMobile ? '0 8px 20px rgba(0,0,0,0.15)' : '0 12px 32px rgba(0,0,0,0.18)',
    },
    searchInput: {
      border: 'none',
      outline: 'none',
      padding: isMobile ? '10px 12px' : '12px 16px',
      borderRadius: isMobile ? '16px' : '999px',
      fontSize: isMobile ? '14px' : '15px',
      color: '#0f172a',
      background: '#f8fafc',
    },
    searchButton: {
      padding: isMobile ? '10px 14px' : '12px 20px',
      borderRadius: isMobile ? '16px' : '999px',
      border: 'none',
      background: '#1e293b',
      color: '#ffffff',
      fontWeight: 700,
      cursor: 'pointer',
    },
    chipRow: {
      marginTop: isMobile ? '12px' : '16px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: isMobile ? '8px' : '10px',
      justifyContent: 'center',
    },
    chip: {
      background: 'rgba(255,255,255,0.18)',
      color: '#ffffff',
      border: '1px solid rgba(255,255,255,0.35)',
      borderRadius: '999px',
      padding: isMobile ? '6px 10px' : '8px 14px',
      fontSize: isMobile ? '12px' : '13px',
      cursor: 'pointer',
      backdropFilter: 'blur(2px)',
    },
  };

  const heroText = {
    Products: { title: "Find Great Deals", sub: "Search verified items from your campus community" },
    Rooms: { title: "Find Your Perfect Room", sub: "Browse verified accommodations near campus" },
    Services: { title: "Hire Trusted Services", sub: "Find tutors, cleaning, repair and more" },
    Jobs: { title: "Discover Jobs & Internships", sub: "Flexible roles tailored for students" },
  }[activeTab];

  const popularChips = {
    Products: ["Electronics", "Furniture", "Books", "Sports"],
    Rooms: ["Single Room", "Shared", "Apartment", "< ₹500", "Furnished", "Available Now"],
    Services: ["Plumbing", "Electrical", "Tutoring", "Web Dev"],
    Jobs: ["Internship", "Part-time", "Remote", "On-site"],
  }[activeTab];

  const applyChip = (label) => {
    if (activeTab === "Products") {
      setFilters({ ...filters, category: label === "< ₹500" ? undefined : label, ...(label === "< ₹500" ? { maxPrice: 500 } : {}) });
    } else if (activeTab === "Rooms") {
      if (label === "< ₹500") setFilters({ ...filters, maxPrice: 500 });
      else if (label === "Furnished") setFilters({ ...filters, furnished: "Furnished" });
      else if (label === "Available Now") setFilters({ ...filters, availableFrom: new Date().toISOString().slice(0, 10) });
      else setFilters({ ...filters, roomType: label });
    } else if (activeTab === "Services") {
      setFilters({ ...filters, query: label });
    } else if (activeTab === "Jobs") {
      setFilters({ ...filters, query: label });
    }
  };

  const onSearch = () => {
    if (activeTab === "Products") {
      setFilters({ ...filters, query: searchText, location: searchLocation || undefined, sort: "createdAt_desc" });
    } else if (activeTab === "Rooms") {
      setFilters({ ...filters, query: searchText, city: searchLocation || undefined, sort: "createdAt_desc" });
    } else if (activeTab === "Services") {
      setFilters({ ...filters, query: searchText, city: searchLocation || undefined, sort: "createdAt_desc" });
    } else if (activeTab === "Jobs") {
      setFilters({ ...filters, query: searchText, location: searchLocation || undefined, sort: "createdAt_desc" });
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <Navbar />


      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.heroTitle}>{heroText.title}</div>
          <div style={styles.heroSub}>{heroText.sub}</div>
          <div style={styles.searchRow}>
            <input
              style={styles.searchInput}
              placeholder={activeTab === "Rooms" ? "Search location…" : "Search keyword…"}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <input
              style={styles.searchInput}
              placeholder="Location"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
            <button style={styles.searchButton} onClick={onSearch}>Search</button>
          </div>
          <div style={styles.chipRow}>
            {popularChips.map((c) => (
              <button key={c} style={styles.chip} onClick={() => applyChip(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.container}>

          {/* Left Sidebar: Filters */}
          <div style={styles.sidebarWrapper}>
            <SearchFilter filters={filters} setFilters={setFilters} type={activeTab} />
          </div>

          {/* Right List */}
          <div style={styles.listWrapper}>
            <SearchFilterList
              products={items}
              loading={loading}
              error={error}
              type={activeTab}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
