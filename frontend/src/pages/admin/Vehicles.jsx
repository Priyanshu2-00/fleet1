import React from 'react';
import DataTable from '../../components/DataTable/DataTable';
import StatusBadge from '../../components/StatusBadge/StatusBadge';

const MOCK_VEHICLES = [
  { id: 'MH-12-AB-1234', type: 'Truck (10T)', capacity: 10, currentLoad: 8.5, status: 'IN_USE', driver: 'Arjun S.' },
  { id: 'MH-14-CD-5678', type: 'Reefer (5T)', capacity: 5, currentLoad: 0, status: 'AVAILABLE', driver: 'Raj K.' },
  { id: 'MH-09-EF-9012', type: 'Pickup (2T)', capacity: 2, currentLoad: 2, status: 'IN_USE', driver: 'Mohan L.' },
  { id: 'MH-11-GH-3456', type: 'Truck (15T)', capacity: 15, currentLoad: 0, status: 'MAINTENANCE', driver: 'Unassigned' },
];

const AdminVehicles = () => {
  const columns = [
    { key: 'id', label: 'Registration' },
    { key: 'type', label: 'Type' },
    { key: 'capacity', label: 'Capacity', render: (val) => `${val} Tons` },
    { key: 'driver', label: 'Assigned Driver' },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    { 
      key: 'actions', 
      label: 'Actions',
      render: () => (
        <div className="flex gap-2">
          <button className="text-xs text-info hover:underline">Edit</button>
          <button className="text-xs text-secondary hover:underline">Assign Driver</button>
        </div>
      )
    }
  ];

  return (
    <div className="animate-fade-in flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2>Vehicle Management</h2>
        <button className="btn btn-primary">➕ Add Vehicle</button>
      </div>

      <div className="card flex-1 min-h-0">
        <DataTable columns={columns} data={MOCK_VEHICLES} />
      </div>
    </div>
  );
};

export default AdminVehicles;
