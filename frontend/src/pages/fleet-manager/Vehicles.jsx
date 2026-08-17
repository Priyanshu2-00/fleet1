import React, { useState } from 'react';
import DataTable from '../../components/DataTable/DataTable';
import StatusBadge from '../../components/StatusBadge/StatusBadge';

const MOCK_VEHICLES = [
  { id: 'MH-12-AB-1234', type: 'Truck (10T)', capacity: 10, currentLoad: 8.5, status: 'IN_USE', driver: 'Arjun S.' },
  { id: 'MH-14-CD-5678', type: 'Reefer (5T)', capacity: 5, currentLoad: 0, status: 'AVAILABLE', driver: 'Raj K.' },
  { id: 'MH-09-EF-9012', type: 'Pickup (2T)', capacity: 2, currentLoad: 2, status: 'IN_USE', driver: 'Mohan L.' },
  { id: 'MH-11-GH-3456', type: 'Truck (15T)', capacity: 15, currentLoad: 0, status: 'MAINTENANCE', driver: '-' },
];

const Vehicles = () => {
  const [filter, setFilter] = useState('ALL');

  const columns = [
    { key: 'id', label: 'Registration' },
    { key: 'type', label: 'Type' },
    { key: 'driver', label: 'Driver' },
    { 
      key: 'utilization', 
      label: 'Utilization',
      render: (_, row) => {
        const util = (row.currentLoad / row.capacity) * 100;
        const color = util > 90 ? 'var(--color-accent-danger)' : util > 70 ? 'var(--color-accent-secondary)' : 'var(--color-accent-primary)';
        return (
          <div className="w-full flex items-center gap-2">
            <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--color-bg-base)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${util}%`, height: '100%', backgroundColor: color }} />
            </div>
            <span className="text-xs w-8">{util.toFixed(0)}%</span>
          </div>
        );
      }
    },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> }
  ];

  const filteredData = filter === 'ALL' ? MOCK_VEHICLES : MOCK_VEHICLES.filter(v => v.status === filter);

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2>Fleet Vehicles</h2>
        <button className="btn btn-primary">➕ Add Vehicle</button>
      </div>

      <div className="card">
        <div className="flex gap-2 mb-4">
          {['ALL', 'AVAILABLE', 'IN_USE', 'MAINTENANCE'].map(f => (
            <button 
              key={f}
              className={`btn ${filter === f ? 'btn-secondary' : 'btn-ghost'}`}
              onClick={() => setFilter(f)}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
        <DataTable columns={columns} data={filteredData} />
      </div>
    </div>
  );
};

export default Vehicles;
