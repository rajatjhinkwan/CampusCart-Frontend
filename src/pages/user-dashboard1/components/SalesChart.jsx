// pages/user-dashboard/components/SalesChart.jsx
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const styles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    border: '1px solid #e5e7eb',
    padding: 16,
    height: '100%',
    minHeight: 320,
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: 600,
    color: '#111827',
  },
};

const data = [
  { name: 'Jan', sales: 4000, revenue: 2400 },
  { name: 'Feb', sales: 3000, revenue: 1398 },
  { name: 'Mar', sales: 9800, revenue: 3908 },
  { name: 'Apr', sales: 4800, revenue: 3800 },
  { name: 'May', sales: 5200, revenue: 4300 },
  { name: 'Jun', sales: 4300, revenue: 2100 },
  { name: 'Jul', sales: 5400, revenue: 2400 },
  { name: 'Aug', sales: 10000, revenue: 1100 },
];

export function SalesChart() {
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Revenue Overview</h3>

      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 8, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: 12 }} />
            <YAxis stroke="#9ca3af" style={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                fontSize: 13,
              }}
            />
            <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="Revenue" />
            <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={3} dot={{ r: 3 }} name="Sales" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
