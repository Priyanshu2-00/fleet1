import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useWebSocket } from '../../context/WebSocketContext';
import StatusBadge from '../../components/StatusBadge/StatusBadge';

// Mock Initial Fleet Data for fallback
const MOCK_FLEET = [
  { id: 'MH-12-AB-1234', lat: 18.5204, lng: 73.8567, status: 'AVAILABLE', driver: 'Ramesh K.', load: 0, capacity: 10, speed: 0 },
  { id: 'MH-14-CD-5678', lat: 18.6161, lng: 73.7382, status: 'IN_TRANSIT', driver: 'Suresh L.', load: 4, capacity: 5, speed: 45 },
  { id: 'MH-09-EF-9012', lat: 18.4529, lng: 73.8510, status: 'DELAYED', driver: 'Amit P.', load: 2, capacity: 2, speed: 0 },
];

const MOCK_ROUTE = [
  [18.6161, 73.7382], [18.55, 73.8], [18.5204, 73.8567]
];

const AutoFitBounds = ({ positions }) => {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [positions, map]);
  return null;
};

const createVehicleIcon = (status, id) => {
  let color = '#10b981'; // AVAILABLE
  if (status === 'IN_TRANSIT') color = '#3b82f6';
  if (status === 'AT_PICKUP') color = '#f59e0b';
  if (status === 'DELAYED') color = '#ef4444';

  const html = `
    <div style="
      background-color: ${color};
      color: white;
      border: 2px solid white;
      border-radius: 4px;
      padding: 2px 6px;
      font-size: 10px;
      font-weight: bold;
      white-space: nowrap;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      position: relative;
    ">
      ${id}
      <div style="
        position: absolute;
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
        border-width: 6px 6px 0;
        border-style: solid;
        border-color: ${color} transparent transparent transparent;
      "></div>
    </div>
  `;
  return L.divIcon({ html, className: '', iconAnchor: [30, 24], popupAnchor: [0, -24] });
};

const LiveFleetMap = () => {
  const { fleetPositions } = useWebSocket();
  const [vehicles, setVehicles] = useState(MOCK_FLEET);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Merge WS positions with mock data
  useEffect(() => {
    setVehicles(prev => prev.map(v => {
      const update = fleetPositions[v.id];
      if (update) return { ...v, lat: update.lat, lng: update.lng, speed: update.speed || v.speed };
      return v;
    }));
  }, [fleetPositions]);

  return (
    <div className="flex h-[calc(100vh-112px)] relative animate-fade-in" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      {/* Sidebar Panel */}
      <div className="w-80 bg-card border-r border-border flex flex-col z-10 shadow-lg" style={{ backgroundColor: 'var(--color-bg-card)', borderRight: '1px solid var(--color-border)' }}>
        <div className="p-4 border-b border-border" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <h3 className="m-0">Active Fleet</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {vehicles.map(v => (
            <div 
              key={v.id} 
              className={`p-3 rounded-md cursor-pointer transition-colors ${selectedVehicle?.id === v.id ? 'bg-accent-transparent' : 'hover:bg-card-hover'}`}
              style={{ 
                backgroundColor: selectedVehicle?.id === v.id ? 'var(--color-accent-primary-transparent)' : 'rgba(255,255,255,0.03)',
                border: selectedVehicle?.id === v.id ? '1px solid var(--color-accent-primary)' : '1px solid transparent'
              }}
              onClick={() => setSelectedVehicle(v)}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold">{v.id}</span>
                <StatusBadge status={v.status} />
              </div>
              <div className="text-xs text-secondary flex flex-col gap-1">
                <span>👨‍✈️ {v.driver}</span>
                <span>📦 Load: {v.load}/{v.capacity} T</span>
                <span>⚡ Speed: {v.speed} km/h</span>
              </div>
            </div>
          ))}
        </div>

        {selectedVehicle && (
          <div className="p-4 border-t border-border" style={{ borderTop: '1px solid var(--color-border)' }}>
            <h4 className="mb-2">Trip Details</h4>
            <div className="text-sm">
              <p className="mb-1 text-secondary">Destination: Mumbai APMC</p>
              <p className="mb-0 text-secondary">ETA: 45 mins</p>
            </div>
          </div>
        )}
      </div>

      {/* Map Area */}
      <div className="flex-1 relative">
        <MapContainer center={[18.5204, 73.8567]} zoom={10} style={{ height: '100%', width: '100%', zIndex: 0 }}>
          <TileLayer 
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
          />
          <AutoFitBounds positions={vehicles} />
          
          {vehicles.map(v => (
            <Marker 
              key={v.id} 
              position={[v.lat, v.lng]} 
              icon={createVehicleIcon(v.status, v.id)}
              eventHandlers={{ click: () => setSelectedVehicle(v) }}
            >
              <Popup>
                <div style={{ color: '#000', padding: '4px' }}>
                  <strong>{v.id}</strong><br/>
                  Driver: {v.driver}<br/>
                  Speed: {v.speed} km/h
                </div>
              </Popup>
            </Marker>
          ))}

          {selectedVehicle && selectedVehicle.id === 'MH-14-CD-5678' && (
            <Polyline positions={MOCK_ROUTE} color="#3b82f6" weight={4} dashArray="8, 8" />
          )}
        </MapContainer>

        {/* Legend */}
        <div className="absolute bottom-6 right-6 p-3 rounded-lg shadow-lg z-[1000] text-xs bg-card" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
          <div className="font-bold mb-2">Status Legend</div>
          <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10b981' }}></span> Available</div>
          <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3b82f6' }}></span> In Transit</div>
          <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f59e0b' }}></span> At Pickup</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ef4444' }}></span> Delayed</div>
        </div>
      </div>
    </div>
  );
};

export default LiveFleetMap;
