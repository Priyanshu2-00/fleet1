import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import StatusBadge from '../../components/StatusBadge/StatusBadge';

const MOCK_SHIPMENT = {
  id: 'SHP-2038',
  produce: 'Wheat',
  qty: '12 tons',
  status: 'IN_TRANSIT',
  pickup: 'Farm 2 (Pune)',
  dest: 'Pune Market',
  date: 'Oct 14, 2024',
  vehicle: { id: 'MH-12-AB-1234', driver: 'Ramesh K.', phone: '+91 98765 43210' },
  eta: 'Today, 4:30 PM',
  currentLocation: [18.5204, 73.8567],
  destLocation: [18.5590, 73.7868],
  timeline: [
    { status: 'REQUESTED', time: 'Oct 14, 10:00 AM', completed: true },
    { status: 'ASSIGNED_TO_VEHICLE', time: 'Oct 14, 02:30 PM', completed: true },
    { status: 'PICKED_UP', time: 'Oct 15, 08:40 AM', completed: true },
    { status: 'IN_TRANSIT', time: 'Started 08:45 AM', current: true },
    { status: 'DELIVERED', time: 'Est. 4:30 PM', upcoming: true }
  ]
};

const truckIcon = L.divIcon({ html: '🚚', className: 'text-2xl', iconAnchor: [12, 12] });
const destIcon = L.divIcon({ html: '🏁', className: 'text-2xl', iconAnchor: [12, 12] });

const ShipmentTracking = () => {
  const { id } = useParams();
  const data = MOCK_SHIPMENT; // normally fetch using id

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link to="/farmer/shipments" className="text-secondary hover:text-primary text-sm mb-2 inline-block">← Back to Shipments</Link>
          <h2 className="m-0 flex items-center gap-4">
            Track {data.id} 
            <StatusBadge status={data.status} />
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 flex flex-col gap-6">
          <div className="card shadow-sm">
            <h3 className="mb-4 text-base">Shipment Details</h3>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary">Produce</span>
                <span className="font-bold">{data.produce}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Quantity</span>
                <span className="font-bold">{data.qty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Pickup</span>
                <span className="font-bold text-right w-1/2">{data.pickup}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Destination</span>
                <span className="font-bold text-right w-1/2">{data.dest}</span>
              </div>
            </div>
          </div>

          <div className="card shadow-sm">
            <h3 className="mb-4 text-base">Status Timeline</h3>
            <div className="relative pl-6 border-l-2 border-border ml-2">
              {data.timeline.map((step, idx) => (
                <div key={idx} className={`mb-6 relative ${step.upcoming ? 'opacity-50' : ''}`}>
                  <div 
                    className={`absolute w-4 h-4 rounded-full border-2 ${step.current ? 'animate-pulse' : ''}`}
                    style={{ 
                      left: '-33px', top: '2px', 
                      backgroundColor: step.completed ? 'var(--color-accent-primary)' : step.current ? 'var(--color-accent-info)' : 'var(--color-bg-base)',
                      borderColor: step.completed ? 'var(--color-accent-primary)' : step.current ? 'var(--color-text-inverse)' : 'var(--color-text-tertiary)',
                      boxShadow: step.current ? '0 0 0 4px rgba(59, 130, 246, 0.2)' : 'none'
                    }} 
                  >
                    {step.completed && <span className="absolute inset-0 flex items-center justify-center text-[8px] text-white">✓</span>}
                  </div>
                  
                  <div className={`font-bold text-sm ${step.current ? 'text-info' : ''}`}>{step.status.replace(/_/g, ' ')}</div>
                  <div className="text-xs text-secondary mt-1">{step.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-2 flex flex-col gap-6">
          {data.vehicle ? (
            <>
              <div className="card bg-accent-transparent border-accent shadow-sm" style={{ backgroundColor: 'var(--color-accent-info-transparent)', borderColor: 'var(--color-accent-info)' }}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xs text-info font-bold mb-1" style={{ color: 'var(--color-accent-info)' }}>ESTIMATED ARRIVAL</div>
                    <div className="text-2xl font-bold">{data.eta}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{data.vehicle.id}</div>
                    <div className="text-xs text-secondary">Driver: {data.vehicle.driver}</div>
                    <div className="text-xs text-secondary">{data.vehicle.phone}</div>
                  </div>
                </div>
              </div>

              <div className="card p-0 overflow-hidden h-96 relative border-border">
                <MapContainer center={data.currentLocation} zoom={12} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                  <Polyline positions={[data.currentLocation, data.destLocation]} color="#3b82f6" weight={3} dashArray="5,10" />
                  <Marker position={data.currentLocation} icon={truckIcon} />
                  <Marker position={data.destLocation} icon={destIcon} />
                </MapContainer>
              </div>
            </>
          ) : (
            <div className="card h-full flex flex-col items-center justify-center text-center p-12 text-secondary border-dashed border-2 bg-transparent">
              <span className="text-4xl mb-4">⏳</span>
              <h3>Awaiting Vehicle Assignment</h3>
              <p>Your shipment request has been received. We will notify you as soon as a vehicle is assigned to pick up your produce.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShipmentTracking;
