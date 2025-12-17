import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import axios from '../../lib/axios';
import Navbar from '../../components/navbar';
import { useUserStore } from '../../store/userStore';
import { Users, Heart, Layers, Trash2 } from 'lucide-react';

const styles = {
  container: { background: '#f9fafb', minHeight: '100vh' },
  wrap: { maxWidth: '1200px', margin: '0 auto', padding: '20px' },
  header: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 700, color: '#111827' },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: 16 },
  cardHead: { padding: 14, borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 },
  list: { padding: 14 },
  itemRow: { display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: 12, padding: '10px 0', borderBottom: '1px solid #f3f4f6' },
  avatar: { width: 72, height: 72, borderRadius: '50%', border: '1px solid #e5e7eb', objectFit: 'cover' },
  btn: { background: '#0F172A', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontWeight: 600 },
  btnAlt: { background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontWeight: 600 },
  meta: { fontSize: 12, color: '#6b7280' },
};

export default function AdminUserProfile() {
  const { id } = useParams();
  const { user } = useUserStore();
  const [profile, setProfile] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [u, w, l] = await Promise.all([
          axios.get(`/api/users/${id}`),
          axios.get(`/api/users/${id}/wishlist`),
          axios.get(`/api/products/seller/${id}`),
        ]);
        setProfile(u.data?.user || u.data);
        setWishlist(w.data?.wishlist || []);
        setListings(l.data?.products || []);
      } catch (e) {
        console.error('Failed to load admin user profile', e);
        setProfile(null);
        setWishlist([]);
        setListings([]);
      }
    };
    load();
  }, [id]);

  if (!user?._id || user?.role !== 'admin') {
    return <Navigate to="/user-dashboard" replace />;
  }

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.wrap}>
        <div style={styles.header}>
          <img src={profile?.avatar || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'} alt="" style={styles.avatar} />
          <div>
            <div style={styles.title}>{profile ? (profile.name || profile.email) : 'Loading...'}</div>
            <div style={styles.meta}>{profile?.email} • Role: {profile?.role}</div>
          </div>
        </div>

        <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={styles.card}>
            <div style={styles.cardHead}><Layers size={18} /> Listings</div>
            <div style={styles.list}>
              {listings.length === 0 && <div style={{ color: '#6b7280' }}>No listings</div>}
              {listings.map(p => (
                <div key={p._id} style={styles.itemRow}>
                  <img src={(p.images && p.images[0]?.url) || 'https://via.placeholder.com/64x64.png?text=+'} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', border: '1px solid #e5e7eb' }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{p.title}</div>
                    <div style={styles.meta}>₹{p.price} • {p.location || 'No location'} • {p.category?.name || p.category}</div>
                  </div>
                  <Link to={`/product/${p._id}`} style={{ color: '#2563EB', textDecoration: 'none', alignSelf: 'center' }}>Open</Link>
                  <button
                    style={{ ...styles.btnAlt, alignSelf: 'center', display: 'flex', alignItems: 'center', gap: 6 }}
                    onClick={async () => {
                      try {
                        await axios.delete(`/api/products/${p._id}`);
                        setListings(prev => prev.filter(x => x._id !== p._id));
                      } catch (e) {
                        console.error('Failed to delete product', e);
                      }
                    }}
                  >
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHead}><Heart size={18} /> Favorites</div>
            <div style={styles.list}>
              {wishlist.length === 0 && <div style={{ color: '#6b7280' }}>No favorites</div>}
              {wishlist.map(p => (
                <div key={p._id} style={styles.itemRow}>
                  <img src={(p.images && p.images[0]?.url) || 'https://via.placeholder.com/64x64.png?text=+'} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', border: '1px solid #e5e7eb' }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{p.title}</div>
                    <div style={styles.meta}>₹{p.price}</div>
                  </div>
                  <Link to={`/product/${p._id}`} style={{ color: '#2563EB', textDecoration: 'none', alignSelf: 'center' }}>Open</Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
