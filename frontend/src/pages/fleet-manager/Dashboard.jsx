import React from 'react';
import MetricCard from '../../components/MetricCard/MetricCard';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import DataTable from '../../components/DataTable/DataTable';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';

const MOCK_SHIPMENTS = [
  { id: 'SHP-1001', farmer: 'Ramesh Patel', produce: 'Onions', qty: '5 tons', status: 'PENDING', priority: 'HIGH' },
  { id: 'SHP-1002', farmer: 'Suresh Kumar', produce: 'Tomatoes', qty: '2 tons', status: 'IN_TRANSIT', priority: 'URGENT' },
  { id: 'SHP-1003', farmer: 'Anita Desai', produce: 'Potatoes', qty: '8 tons', status: 'DELIVERED', priority: 'NORMAL' },
];

const MOCK_ALERTS = [
  { id: 1, message: 'Vehicle MH-12-AB-1234 delayed by 45 mins', type: 'WARNING', time: '10 mins ago' },
  { id: 2, message: 'Temperature drop in Reefer TRK-09', type: 'CRITICAL', time: '25 mins ago' },
];

const FleetDashboard = () => {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'farmer', label: 'Farmer' },
    { key: 'produce', label: 'Produce' },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'priority', label: 'Priority', render: (val) => <StatusBadge status={val} /> }
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="grid grid-cols-4 gap-6">
        <MetricCard title="Active Vehicles" value="24/30" subtitle="80% utilization" icon="🚚" trend="up" />
        <MetricCard title="Pending Pickups" value="12" subtitle="3 high priority" icon="📦" trend="up" accentColor="var(--color-accent-secondary)" />
        <MetricCard title="On-Time Delivery" value="94.2%" subtitle="+2.1% from yesterday" icon="⏱️" trend="up" />
        <MetricCard title="Active Alerts" value="2" subtitle="Requires attention" icon="⚠️" trend="down" accentColor="var(--color-accent-danger)" />
      </div>

      <div className="grid grid-cols-3 gap-6 h-full" style={{ minHeight: '400px' }}>
        <div className="card grid-cols-2" style={{ gridColumn: 'span 2' }}>
          <h3 className="mb-4">Live Fleet Map</h3>
          <div style={{ height: '300px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <MapContainer center={[19.0760, 72.8777]} zoom={10} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
              <Marker position={[19.0760, 72.8777]}><Popup>Vehicle MH-12-AB-1234</Popup></Marker>
            </MapContainer>
          </div>
        </div>

        <div className="card flex flex-col">
          <h3 className="mb-4">Recent Alerts</h3>
          <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
            {MOCK_ALERTS.map(alert => (
              <div key={alert.id} className="p-3 rounded-md" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderLeft: `3px solid ${alert.type === 'CRITICAL' ? 'var(--color-accent-danger)' : 'var(--color-accent-secondary)'}` }}>
                <div className="text-sm">{alert.message}</div>
                <div className="text-xs text-tertiary mt-1">{alert.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3>Recent Shipments</h3>
          <Link to="/fleet/shipments" className="btn btn-ghost text-sm">View All →</Link>
        </div>
        <DataTable columns={columns} data={MOCK_SHIPMENTS} />
      </div>
    </div>
  );
};

export default FleetDashboard;
