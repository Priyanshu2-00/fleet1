import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';

const MOCK_TRIP = {
  id: 'TRP-801', vehicle: 'MH-12-AB-1234',
  load: { current: 6, capacity: 10 },
  stops: [
    { id: 's1', seq: 1, type: 'pickup', name: 'Farm A (Pimpri)', farmer: 'Ramesh P.', produce: 'Onions', qty: 4, status: 'COMPLETED', time: '08:40 AM' },
    { id: 's2', seq: 2, type: 'pickup', name: 'Farm B (Chinchwad)', farmer: 'Suresh K.', produce: 'Tomatoes', qty: 2, status: 'CURRENT', eta: '09:15 AM' },
    { id: 's3', seq: 3, type: 'pickup', name: 'Farm D (Baner)', farmer: 'Anita D.', produce: 'Potatoes', qty: 3, status: 'UPCOMING', eta: '10:00 AM' },
    { id: 's4', seq: 4, type: 'dest', name: 'Mumbai APMC', farmer: '-', produce: 'Mixed', qty: 9, status: 'UPCOMING', eta: '12:30 PM' }
  ],
  route: [[18.6279, 73.8055], [18.6298, 73.7997], [18.5590, 73.7868], [19.0760, 72.8777]]
};

const customIcon = L.divIcon({ html: '<div style="background:#3b82f6;width:12px;height:12px;border-radius:50%;border:2px solid white;"></div>', className: '' });

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const trip = MOCK_TRIP; // Use ID to fetch in real app

  const currentStop = trip.stops.find(s => s.status === 'CURRENT') || trip.stops[trip.stops.length - 1];

  return (
    <div className="max-w-md mx-auto flex flex-col h-[calc(100vh-80px)] animate-fade-in relative pb-20">
      <div className="flex justify-between items-center mb-4 px-2">
        <div>
          <h2 className="m-0 text-xl">{trip.id}</h2>
          <div className="text-xs text-secondary">{trip.vehicle}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-secondary mb-1">Current Load</div>
          <div className="font-bold text-sm bg-black/20 px-2 py-1 rounded border border-border">{trip.load.current} / {trip.load.capacity} T</div>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden h-48 mb-4 flex-shrink-0 border border-border relative z-0">
        <MapContainer center={trip.route[1]} zoom={11} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
          <Polyline positions={trip.route} color="#3b82f6" weight={4} />
          <Marker position={trip.route[1]} icon={customIcon} />
        </MapContainer>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        <div className="relative pl-6 border-l-2 border-border ml-2">
          {trip.stops.map((stop, idx) => (
            <div key={stop.id} className={`mb-6 relative ${stop.status === 'UPCOMING' ? 'opacity-50' : ''}`}>
              <div 
                className="absolute w-4 h-4 rounded-full border-2" 
                style={{ 
                  left: '-33px', top: '0', 
                  backgroundColor: stop.status === 'COMPLETED' ? 'var(--color-accent-primary)' : stop.status === 'CURRENT' ? 'var(--color-accent-info)' : 'var(--color-bg-base)',
                  borderColor: stop.status === 'COMPLETED' ? 'var(--color-accent-primary)' : stop.status === 'CURRENT' ? 'var(--color-text-inverse)' : 'var(--color-text-tertiary)',
                  boxShadow: stop.status === 'CURRENT' ? '0 0 0 4px rgba(59, 130, 246, 0.2)' : 'none'
                }} 
              >
                {stop.status === 'COMPLETED' && <span className="absolute inset-0 flex items-center justify-center text-[8px] text-white">✓</span>}
              </div>
              
              <div className="card p-3 shadow-sm border border-border/50">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-sm">{stop.seq}. {stop.name}</div>
                  <div className="text-xs font-mono bg-black/20 px-2 py-0.5 rounded">{stop.status === 'COMPLETED' ? stop.time : `ETA: ${stop.eta}`}</div>
                </div>
                
                {stop.type === 'pickup' ? (
                  <div className="text-xs flex justify-between items-center text-secondary">
                    <span>👨‍🌾 {stop.farmer}</span>
                    <span className="font-bold text-primary">📦 {stop.qty}T {stop.produce}</span>
                  </div>
                ) : (
                  <div className="text-xs text-secondary">🏁 Final Destination</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border z-10 flex justify-center max-w-md mx-auto w-full pb-8">
        {currentStop.type === 'pickup' ? (
          <button 
            className="btn btn-primary w-full py-4 text-lg font-bold shadow-lg"
            onClick={() => navigate(`/driver/pickup/${trip.id}/${currentStop.id}`)}
          >
            📍 I've Arrived at Pickup {currentStop.seq}
          </button>
        ) : (
          <button 
            className="btn btn-primary w-full py-4 text-lg font-bold shadow-lg bg-emerald-600 hover:bg-emerald-700"
            style={{ backgroundColor: 'var(--color-accent-primary)' }}
            onClick={() => alert('Trip Completed!')}
          >
            ✅ Complete Final Delivery
          </button>
        )}
      </div>
    </div>
  );
};

export default TripDetails;
