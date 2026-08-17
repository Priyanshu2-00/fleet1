import React, { useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const MOCK_ROUTES = [
  {
    id: 'MH-12-AB-1234',
    color: COLORS[0],
    stops: [
      { id: 'depot', type: 'depot', name: 'Pune Depot', coords: [18.5204, 73.8567], seq: 0, eta: '08:00 AM' },
      { id: 'stop1', type: 'pickup', name: 'Farm A (Pimpri)', coords: [18.6279, 73.8055], seq: 1, eta: '08:35 AM' },
      { id: 'stop2', type: 'pickup', name: 'Farm B (Chinchwad)', coords: [18.6298, 73.7997], seq: 2, eta: '09:10 AM' },
      { id: 'dest', type: 'dest', name: 'Mumbai APMC', coords: [19.0760, 72.8777], seq: 3, eta: '11:45 AM' }
    ],
    stats: { distance: '145 km', duration: '3h 45m', util: '80%' }
  },
  {
    id: 'MH-14-CD-5678',
    color: COLORS[1],
    stops: [
      { id: 'depot', type: 'depot', name: 'Pune Depot', coords: [18.5204, 73.8567], seq: 0, eta: '08:30 AM' },
      { id: 'stop3', type: 'pickup', name: 'Farm C (Hinjawadi)', coords: [18.5913, 73.7389], seq: 1, eta: '09:15 AM' },
      { id: 'dest2', type: 'dest', name: 'Vashi Market', coords: [19.0720, 72.9995], seq: 2, eta: '11:30 AM' }
    ],
    stats: { distance: '130 km', duration: '3h 00m', util: '100%' }
  }
];

const createMarkerIcon = (type, seq, color) => {
  let content = seq;
  let bg = color;
  let shape = 'border-radius: 50%;';
  
  if (type === 'depot') { content = '⭐'; shape = 'border-radius: 4px;'; bg = '#1f2937'; }
  if (type === 'dest') { content = '🏁'; shape = 'border-radius: 4px;'; bg = '#1f2937'; }

  const html = `
    <div style="
      background-color: ${bg};
      color: white;
      width: 24px;
      height: 24px;
      ${shape}
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    ">${content}</div>
  `;
  return L.divIcon({ html, className: '', iconAnchor: [12, 12] });
};

const RouteOptimizer = () => {
  const [activeRoute, setActiveRoute] = useState(MOCK_ROUTES[0].id);

  return (
    <div className="flex flex-col h-[calc(100vh-112px)] animate-fade-in">
      {/* Top Bar */}
      <div className="card mb-6 py-3 px-6 flex justify-between items-center rounded-lg border-border">
        <div className="flex items-center gap-6">
          <h2 className="m-0">Route Optimizer</h2>
          <div className="text-xs px-3 py-1 bg-white/5 rounded-full border border-border">
            Algorithm: <span className="text-accent font-mono">CVRP-GA v2.1</span>
          </div>
          <div className="text-xs px-3 py-1 bg-white/5 rounded-full border border-border">
            Solve Time: <span className="text-primary font-mono">1.24s</span>
          </div>
        </div>
        <button className="btn btn-primary">⚡ Re-Optimize</button>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Map */}
        <div className="flex-1 card p-0 overflow-hidden relative border-border">
          <MapContainer center={[18.8, 73.4]} zoom={9} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
            
            {MOCK_ROUTES.map(route => {
              const positions = route.stops.map(s => s.coords);
              const isActive = activeRoute === route.id;
              
              return (
                <React.Fragment key={route.id}>
                  <Polyline 
                    positions={positions} 
                    color={route.color} 
                    weight={isActive ? 5 : 3} 
                    opacity={isActive ? 1 : 0.4}
                    dashArray={isActive ? null : "10, 10"}
                  />
                  {route.stops.map(stop => (
                    <Marker 
                      key={stop.id} 
                      position={stop.coords} 
                      icon={createMarkerIcon(stop.type, stop.seq, route.color)}
                      zIndexOffset={isActive ? 1000 : 0}
                    >
                      <Popup>{stop.name}<br/>ETA: {stop.eta}</Popup>
                    </Marker>
                  ))}
                </React.Fragment>
              );
            })}
          </MapContainer>
        </div>

        {/* Sidebar */}
        <div className="w-96 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {MOCK_ROUTES.map(route => (
              <button
                key={route.id}
                onClick={() => setActiveRoute(route.id)}
                className={`text-left p-4 rounded-lg transition-all border ${activeRoute === route.id ? 'border-border bg-card' : 'border-transparent hover:bg-white/5'}`}
                style={{ 
                  backgroundColor: activeRoute === route.id ? 'var(--color-bg-card)' : 'transparent',
                  borderLeft: activeRoute === route.id ? `4px solid ${route.color}` : '4px solid transparent',
                  boxShadow: activeRoute === route.id ? 'var(--shadow-md)' : 'none'
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg">{route.id}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/10">{route.stats.util} Util</span>
                </div>
                <div className="flex justify-between text-sm text-secondary">
                  <span>🗺️ {route.stats.distance}</span>
                  <span>⏱️ {route.stats.duration}</span>
                  <span>📍 {route.stops.length - 2} Pickups</span>
                </div>
              </button>
            ))}
          </div>

          {activeRoute && (
            <div className="card flex-1 overflow-y-auto">
              <h3 className="mb-4">Stop Sequence</h3>
              <div className="relative pl-6 border-l-2" style={{ borderColor: 'var(--color-border)' }}>
                {MOCK_ROUTES.find(r => r.id === activeRoute).stops.map((stop, idx, arr) => (
                  <div key={stop.id} className="mb-6 relative">
                    <div 
                      className="absolute w-4 h-4 rounded-full border-4" 
                      style={{ 
                        left: '-33px', 
                        top: '2px', 
                        backgroundColor: 'var(--color-bg-card)',
                        borderColor: MOCK_ROUTES.find(r => r.id === activeRoute).color 
                      }} 
                    />
                    <div className="text-xs text-accent font-bold mb-1">STOP {stop.seq} • {stop.eta}</div>
                    <div className="font-medium text-sm">{stop.name}</div>
                    {stop.type === 'pickup' && <div className="text-xs text-secondary mt-1">📦 Pickup scheduled</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteOptimizer;
