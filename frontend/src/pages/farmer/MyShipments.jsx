import React from 'react';
import DataTable from '../../components/DataTable/DataTable';
import StatusBadge from '../../components/StatusBadge/StatusBadge';

const MOCK_SHIPMENTS = [
  { id: 'SHP-2041', produce: 'Onions', qty: '5 tons', pickup: 'Farm 1', dest: 'Mumbai APMC', status: 'PENDING', date: 'Oct 15, 2024', eta: '-' },
  { id: 'SHP-2038', produce: 'Wheat', qty: '12 tons', pickup: 'Farm 2', dest: 'Pune Market', status: 'IN_TRANSIT', date: 'Oct 14, 2024', eta: 'Today, 4 PM' },
  { id: 'SHP-2010', produce: 'Tomatoes', qty: '2 tons', pickup: 'Farm 1', dest: 'Vashi Market', status: 'DELIVERED', date: 'Oct 10, 2024', eta: 'Delivered' },
];

const MyShipments = () => {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'produce', label: 'Produce' },
    { key: 'qty', label: 'Qty' },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'pickup', label: 'Pickup' },
    { key: 'dest', label: 'Destination' },
    { key: 'date', label: 'Created' },
    { key: 'eta', label: 'ETA' }
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2>My Shipments</h2>
      </div>

      <div className="card">
        <DataTable columns={columns} data={MOCK_SHIPMENTS} />
      </div>
    </div>
  );
};

export default MyShipments;
