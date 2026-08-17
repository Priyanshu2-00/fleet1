import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import MetricCard from '../../components/MetricCard/MetricCard';
import DataTable from '../../components/DataTable/DataTable';

const MOCK_UTIL_DATA = [
  { name: 'MH-12', util: 85 }, { name: 'MH-14', util: 92 },
  { name: 'MH-09', util: 45 }, { name: 'MH-11', util: 78 },
  { name: 'MH-04', util: 60 }
];

const MOCK_STATUS_DATA = [
  { name: 'Delivered', value: 450, color: '#10b981' },
  { name: 'In Transit', value: 120, color: '#3b82f6' },
  { name: 'Pending', value: 80, color: '#f59e0b' },
  { name: 'Cancelled', value: 15, color: '#ef4444' }
];

const MOCK_TRIPS = [
  { id: 'TRP-101', vehicle: 'MH-12-AB-1234', distance: '120 km', duration: '2h / 2.5h', util: '85%', delay: 'None', status: 'COMPLETED' },
  { id: 'TRP-102', vehicle: 'MH-14-CD-5678', distance: '85 km', duration: '1.8h / 1.5h', util: '92%', delay: '+18m', status: 'COMPLETED' }
];

const Analytics = () => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2>Fleet Analytics</h2>
        <select className="input-field w-auto bg-card">
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
          <option>All Time</option>
        </select>
      </div>

      <div className="grid grid-cols-6 gap-4">
        <MetricCard title="Total Vehicles" value="30" icon="🚚" />
        <MetricCard title="Active" value="24" icon="🟢" accentColor="var(--color-accent-primary)" />
        <MetricCard title="Avg Utilization" value="78%" icon="📊" trend="up" />
        <MetricCard title="Total Distance" value="4,250" subtitle="km" icon="🗺️" />
        <MetricCard title="Completed Trips" value="142" icon="✅" />
        <MetricCard title="Delay Rate" value="8.5%" icon="⚠️" trend="down" accentColor="var(--color-accent-secondary)" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="card h-80 flex flex-col">
          <h3 className="mb-4">Vehicle Utilization (%)</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_UTIL_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)', borderRadius: '8px' }} />
                <Bar dataKey="util" fill="var(--color-accent-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card h-80 flex flex-col">
          <h3 className="mb-4">Shipment Status</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={MOCK_STATUS_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {MOCK_STATUS_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)', borderRadius: '8px' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card p-6 border-l-4 border-accent" style={{ borderLeftColor: 'var(--color-accent-primary)' }}>
        <h3 className="mb-4 text-accent">Optimization Impact (AI vs Baseline)</h3>
        <div className="grid grid-cols-3 gap-8">
          <div>
            <div className="text-sm text-secondary mb-1">Distance Saved</div>
            <div className="text-3xl font-bold flex items-center gap-2 text-primary">
              24% <span className="text-sm text-accent">↓ (1,200 km)</span>
            </div>
          </div>
          <div>
            <div className="text-sm text-secondary mb-1">Vehicles Required</div>
            <div className="text-3xl font-bold flex items-center gap-2 text-primary">
              -4 <span className="text-sm text-accent">↓ (Cost Saving)</span>
            </div>
          </div>
          <div>
            <div className="text-sm text-secondary mb-1">Avg Utilization</div>
            <div className="text-3xl font-bold flex items-center gap-2 text-primary">
              +18% <span className="text-sm text-accent">↑</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card flex flex-col">
        <h3 className="mb-4">Trip Performance</h3>
        <DataTable 
          columns={[
            { key: 'id', label: 'Trip ID' },
            { key: 'vehicle', label: 'Vehicle' },
            { key: 'distance', label: 'Distance' },
            { key: 'duration', label: 'Actual / Planned' },
            { key: 'util', label: 'Utilization' },
            { key: 'delay', label: 'Delay' },
            { key: 'status', label: 'Status' }
          ]} 
          data={MOCK_TRIPS} 
        />
      </div>
    </div>
  );
};

export default Analytics;
