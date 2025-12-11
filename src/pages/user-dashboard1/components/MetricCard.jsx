// pages/user-dashboard/components/MetricCard.jsx
import React from 'react';

const styles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    border: '1px solid #e5e7eb',
    padding: '20px',
    minHeight: '96px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: 500,
  },
  iconContainer: {
    padding: 8,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  value: {
    fontSize: 24,
    fontWeight: 700,
    color: '#111827',
  },
  change: {
    fontSize: 14,
    fontWeight: 600,
  },
  changeUp: {
    color: '#16a34a',
  },
  changeDown: {
    color: '#dc2626',
  },
};

export function MetricCard({ title, value, change, trend, icon: Icon }) {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.title}>{title}</span>
        <div style={styles.iconContainer}>
          <Icon style={{ width: 18, height: 18, color: '#2563eb' }} />
        </div>
      </div>

      <div style={styles.footer}>
        <div style={styles.value}>{value}</div>
        <div style={{ ...styles.change, ...(trend === 'up' ? styles.changeUp : styles.changeDown) }}>
          {change}
        </div>
      </div>
    </div>
  );
}
