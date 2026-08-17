import React from 'react';
import MetricCard from '../../components/MetricCard/MetricCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const MOCK_USERS = [
  { name: 'Farmers', count: 124, color: '#10b981' },
  { name: 'Drivers', count: 45, color: '#3b82f6' },
  { name: 'Fleet Mgrs', count: 8, color: '#f59e0b' },
  { name: 'Admins', count: 3, color: '#ef4444' }
];

const MOCK_VEHICLES = [
  { name: 'Active', value: 24, color: '#10b981' },
  { name: 'Maintenance', value: 4, color: '#f59e0b' },
  { name: 'Inactive', value: 2, color: '#ef4444' }
];

const AdminDashboard = () => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <h2>Admin Dashboard</h2>
      
      <div className="grid grid-cols-4 gap-6">
        <MetricCard title="Total Users" value="180" icon="👥" trend="up" />
        <MetricCard title="Total Vehicles" value="30" icon="🚚" />
        <MetricCard title="Total Locations" value="56" icon="📍" accentColor="var(--color-accent-secondary)" />
        <MetricCard title="Total Shipments" value="1,425" icon="📦" trend="up" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="card h-80 flex flex-col">
          <h3 className="mb-4">User Roles Distribution</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_USERS} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)' }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-primary)' }} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)', borderRadius: '8px' }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {MOCK_USERS.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card h-80 flex flex-col">
          <h3 className="mb-4">Vehicle Status</h3>
          <div className="flex-1 min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={MOCK_VEHICLES} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value">
                  {MOCK_VEHICLES.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
              <span className="text-3xl font-bold">30</span>
              <span className="text-xs text-secondary">Total</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
