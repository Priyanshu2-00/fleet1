import React from 'react';
import DataTable from '../../components/DataTable/DataTable';
import StatusBadge from '../../components/StatusBadge/StatusBadge';

const MOCK_USERS = [
  { id: 1, name: 'Ramesh Patel', email: 'ramesh@farm.com', phone: '9876543210', role: 'FARMER', status: 'ACTIVE', created: 'Oct 1, 2024' },
  { id: 2, name: 'Suresh Kumar', email: 'suresh@fleet.com', phone: '8765432109', role: 'DRIVER', status: 'ACTIVE', created: 'Oct 5, 2024' },
  { id: 3, name: 'Anita Desai', email: 'anita@admin.com', phone: '7654321098', role: 'FLEET_MANAGER', status: 'ACTIVE', created: 'Sep 15, 2024' },
  { id: 4, name: 'Vikram Singh', email: 'vikram@farm.com', phone: '6543210987', role: 'FARMER', status: 'INACTIVE', created: 'Oct 10, 2024' }
];

const Users = () => {
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'role', label: 'Role', render: (val) => <span className="text-xs px-2 py-1 bg-white/10 rounded">{val.replace('_', ' ')}</span> },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val === 'ACTIVE' ? 'AVAILABLE' : 'CANCELLED'} /> },
    { key: 'created', label: 'Joined' },
    { 
      key: 'actions', 
      label: 'Actions',
      render: () => (
        <div className="flex gap-2">
          <button className="text-xs text-info hover:underline">Edit</button>
          <button className="text-xs text-danger hover:underline">Disable</button>
        </div>
      )
    }
  ];

  return (
    <div className="animate-fade-in flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2>User Management</h2>
        <button className="btn btn-primary">➕ Add User</button>
      </div>

      <div className="card flex-1 min-h-0 flex flex-col">
        <div className="flex gap-2 mb-4">
          <select className="input-field w-auto bg-black/20">
            <option value="">All Roles</option>
            <option value="FARMER">Farmers</option>
            <option value="DRIVER">Drivers</option>
            <option value="FLEET_MANAGER">Fleet Managers</option>
          </select>
          <input type="text" className="input-field max-w-xs bg-black/20" placeholder="Search by name or email..." />
        </div>
        
        <DataTable columns={columns} data={MOCK_USERS} />
      </div>
    </div>
  );
};

export default Users;
