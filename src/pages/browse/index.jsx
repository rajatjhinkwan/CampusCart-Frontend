import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Navbar from '../../components/navbar';
import SearchFilter from './components/SearchFilter';
import SearchFilterList from './components/SearchFilterList';

const Index = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [activeTab, setActiveTab] = useState("Products"); // Current active tab

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Determine API endpoint based on active tab
    let apiUrl = "http://localhost:5000/api/products";
    if (activeTab === "Rooms") apiUrl = "http://localhost:5000/api/rooms";
    else if (activeTab === "Services") apiUrl = "http://localhost:5000/api/services";
    else if (activeTab === "Jobs") apiUrl = "http://localhost:5000/api/jobs";

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

        setItems(fetchedItems);
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
    mainContent: { display: 'flex', justifyContent: 'center', padding: '40px 20px', width: '100%' },
    container: { display: 'flex', gap: '30px', maxWidth: '1400px', width: '100%', alignItems: 'flex-start' },
    sidebarWrapper: { flexShrink: 0, position: 'sticky', top: '70px' },
    listWrapper: { flexGrow: 1, minWidth: 0, paddingTop: '20px' },
    btnStyle: (isActive) => ({
      padding: '10px 20px',
      margin: '0 10px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: isActive ? '#1d4ed8' : '#3b82f6',
      color: '#ffffff',
      cursor: 'pointer',
    }),
  };

  return (
    <div style={styles.pageWrapper}>
      <Navbar />

      {/* Top section: Tabs */}
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        {["Products", "Rooms", "Services", "Jobs"].map((tab) => (
          <button
            key={tab}
            style={styles.btnStyle(activeTab === tab)}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
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
