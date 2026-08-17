import React, { useState } from 'react';
import DataTable from '../../components/DataTable/DataTable';
import StatusBadge from '../../components/StatusBadge/StatusBadge';

const MOCK_SHIPMENTS = [
  { id: 'SHP-1001', farmer: 'Ramesh Patel', produce: 'Onions', qty: '5 tons', origin: 'Nashik', dest: 'Mumbai APMC', status: 'PENDING', priority: 'HIGH', date: 'Oct 15, 2024' },
  { id: 'SHP-1002', farmer: 'Suresh Kumar', produce: 'Tomatoes', qty: '2 tons', origin: 'Pune', dest: 'Mumbai APMC', status: 'IN_TRANSIT', priority: 'URGENT', date: 'Oct 14, 2024' },
  { id: 'SHP-1003', farmer: 'Anita Desai', produce: 'Potatoes', qty: '8 tons', origin: 'Satara', dest: 'Vashi Market', status: 'DELIVERED', priority: 'NORMAL', date: 'Oct 12, 2024' },
];

const Shipments = () => {
  const [filter, setFilter] = useState('ALL');

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'farmer', label: 'Farmer' },
    { key: 'produce', label: 'Produce' },
    { key: 'qty', label: 'Qty' },
    { key: 'origin', label: 'Origin' },
    { key: 'dest', label: 'Destination' },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'priority', label: 'Priority', render: (val) => <StatusBadge status={val} /> },
    { key: 'date', label: 'Created' },
  ];

  const filteredData = filter === 'ALL' ? MOCK_SHIPMENTS : MOCK_SHIPMENTS.filter(s => s.status === filter);

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2>Shipments</h2>
      </div>

      <div className="card">
        <div className="flex gap-2 mb-4">
          {['ALL', 'PENDING', 'IN_TRANSIT', 'DELIVERED'].map(f => (
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

export default Shipments;
