import React from 'react';
import MetricCard from '../../components/MetricCard/MetricCard';
import DataTable from '../../components/DataTable/DataTable';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const MOCK_SHIPMENTS = [
  { id: 'SHP-2041', produce: 'Onions', qty: '5 tons', status: 'PENDING', dest: 'Mumbai APMC', date: 'Today' },
  { id: 'SHP-2038', produce: 'Wheat', qty: '12 tons', status: 'IN_TRANSIT', dest: 'Pune Market', date: 'Yesterday' },
];

const FarmerDashboard = () => {
  const { user } = useAuth();

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'produce', label: 'Produce' },
    { key: 'qty', label: 'Qty' },
    { key: 'dest', label: 'Destination' },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'date', label: 'Date' }
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2>Welcome, {user?.name || 'Farmer'}</h2>
          <p className="mb-0">Here is your farm logistics overview.</p>
        </div>
        <Link to="/farmer/new-pickup" className="btn btn-primary">➕ New Pickup Request</Link>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <MetricCard title="Total Shipments" value="42" icon="📦" />
        <MetricCard title="Pending" value="1" icon="⏳" accentColor="var(--color-accent-secondary)" />
        <MetricCard title="In Transit" value="1" icon="🚚" accentColor="var(--color-accent-info)" />
        <MetricCard title="Completed (This Month)" value="8" icon="✅" />
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3>Recent Shipments</h3>
          <Link to="/farmer/shipments" className="btn btn-ghost text-sm">View All →</Link>
        </div>
        <DataTable columns={columns} data={MOCK_SHIPMENTS} />
      </div>
    </div>
  );
};

export default FarmerDashboard;
