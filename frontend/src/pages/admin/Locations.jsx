import React, { useState } from 'react';
import DataTable from '../../components/DataTable/DataTable';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const MOCK_LOCATIONS = [
  { id: 1, name: 'Pune Depot', type: 'DEPOT', coords: [18.5204, 73.8567], address: 'Shivajinagar, Pune' },
  { id: 2, name: 'Mumbai APMC', type: 'MARKET', coords: [19.0760, 72.8777], address: 'Vashi, Navi Mumbai' },
  { id: 3, name: 'Nashik Collection Center', type: 'COLLECTION_CENTER', coords: [19.9975, 73.7898], address: 'Panchavati, Nashik' },
];

const getIconForType = (type) => {
  let content = '📍';
  let bg = '#1f2937';
  if (type === 'DEPOT') content = '⭐';
  if (type === 'MARKET') content = '🏁';
  if (type === 'COLLECTION_CENTER') content = '🏢';

  const html = `
    <div style="background-color:${bg};color:white;width:24px;height:24px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:12px;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);">
      ${content}
    </div>
  `;
  return L.divIcon({ html, className: '', iconAnchor: [12, 12] });
};

const Locations = () => {
  const [showMap, setShowMap] = useState(true);

  const columns = [
    { key: 'name', label: 'Name', render: (val) => <span className="font-bold">{val}</span> },
    { key: 'type', label: 'Type', render: (val) => <span className="text-xs px-2 py-1 bg-white/10 rounded">{val.replace('_', ' ')}</span> },
    { key: 'coords', label: 'Coordinates', render: (val) => <span className="font-mono text-xs text-secondary">{val[0].toFixed(4)}, {val[1].toFixed(4)}</span> },
    { key: 'address', label: 'Address' },
    { 
      key: 'actions', 
      label: 'Actions',
      render: () => (
        <div className="flex gap-2">
          <button className="text-xs text-info hover:underline">Edit</button>
        </div>
      )
    }
  ];

  return (
    <div className="animate-fade-in flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2>Location Management</h2>
        <div className="flex gap-4">
          <button className="btn btn-ghost" onClick={() => setShowMap(!showMap)}>
            {showMap ? 'Hide Map' : 'Show Map'}
          </button>
          <button className="btn btn-primary">➕ Add Location</button>
        </div>
      </div>

      <div className="flex flex-col gap-6 flex-1 min-h-0">
        {showMap && (
          <div className="card p-0 h-64 overflow-hidden border-border flex-shrink-0 relative z-0">
            <MapContainer center={[19.0, 73.5]} zoom={7} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
              {MOCK_LOCATIONS.map(loc => (
                <Marker key={loc.id} position={loc.coords} icon={getIconForType(loc.type)}>
                  <Popup>{loc.name} <br/> {loc.type}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}

        <div className="card flex-1 min-h-0">
          <DataTable columns={columns} data={MOCK_LOCATIONS} />
        </div>
      </div>
    </div>
  );
};

export default Locations;
