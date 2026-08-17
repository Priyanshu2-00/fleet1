import React, { useState } from 'react';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import MetricCard from '../../components/MetricCard/MetricCard';

const PENDING_SHIPMENTS = [
  { id: 'SHP-101', farmer: 'Ramesh P.', produce: 'Onions', qty: 4, origin: 'Nashik', priority: 'HIGH' },
  { id: 'SHP-102', farmer: 'Suresh K.', produce: 'Tomatoes', qty: 2.5, origin: 'Pune', priority: 'URGENT' },
  { id: 'SHP-103', farmer: 'Anita D.', produce: 'Potatoes', qty: 8, origin: 'Satara', priority: 'NORMAL' },
  { id: 'SHP-104', farmer: 'Vikram S.', produce: 'Wheat', qty: 5, origin: 'Ahmednagar', priority: 'NORMAL' },
  { id: 'SHP-105', farmer: 'Pooja M.', produce: 'Grapes', qty: 1.5, origin: 'Nashik', priority: 'HIGH' }
];

const AVAILABLE_FLEET = [
  { id: 'MH-12-AB-1234', type: 'Truck', capacity: 10, currentLoad: 0, location: 'Pune Depot' },
  { id: 'MH-14-CD-5678', type: 'Reefer', capacity: 5, currentLoad: 0, location: 'Pune Depot' },
  { id: 'MH-09-EF-9012', type: 'Pickup', capacity: 2, currentLoad: 0, location: 'Nashik' },
];

const LoadAllocation = () => {
  const [selectedShipments, setSelectedShipments] = useState(PENDING_SHIPMENTS.map(s => s.id));
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [result, setResult] = useState(null);

  const toggleShipment = (id) => {
    setSelectedShipments(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleOptimize = () => {
    setIsOptimizing(true);
    // Simulate API call
    setTimeout(() => {
      setResult({
        assignments: [
          {
            vehicle: AVAILABLE_FLEET[0],
            shipments: [PENDING_SHIPMENTS[2]],
            totalLoad: 8,
            distance: '120 km',
            duration: '2.5 hrs',
            utilization: 80
          },
          {
            vehicle: AVAILABLE_FLEET[1],
            shipments: [PENDING_SHIPMENTS[1], PENDING_SHIPMENTS[4]],
            totalLoad: 4,
            distance: '85 km',
            duration: '1.8 hrs',
            utilization: 80
          },
          {
            vehicle: AVAILABLE_FLEET[2],
            shipments: [PENDING_SHIPMENTS[0]], // Partial load logic simplified for demo
            totalLoad: 2,
            distance: '15 km',
            duration: '45 mins',
            utilization: 100
          }
        ],
        metrics: { vehiclesUsed: 3, avgUtilization: 86, totalDistance: 220, unassigned: 1 }
      });
      setIsOptimizing(false);
    }, 2000);
  };

  const selectedData = PENDING_SHIPMENTS.filter(s => selectedShipments.includes(s.id));
  const totalQty = selectedData.reduce((sum, s) => sum + s.qty, 0);

  return (
    <div className="flex flex-col gap-6 h-full animate-fade-in">
      <div className="flex justify-between items-center">
        <h2>Intelligent Load Allocation</h2>
        <button 
          className="btn btn-primary" 
          disabled={selectedShipments.length === 0 || isOptimizing}
          onClick={handleOptimize}
        >
          {isOptimizing ? '🔄 Running AI Optimizer...' : '⚡ Run Optimization'}
        </button>
      </div>

      {!result && (
        <div className="flex gap-6 flex-1">
          {/* Left Panel - Shipments */}
          <div className="card w-1/2 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3>Pending Shipments ({selectedShipments.length})</h3>
              <span className="text-sm text-accent font-bold">Total: {totalQty.toFixed(1)} Tons</span>
            </div>
            
            <div className="flex flex-col gap-3 overflow-y-auto">
              {PENDING_SHIPMENTS.map(s => (
                <div key={s.id} className="p-3 rounded-md border border-border flex items-center gap-4" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedShipments.includes(s.id)}
                    onChange={() => toggleShipment(s.id)}
                    className="w-5 h-5 accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold">{s.produce} <span className="text-tertiary text-sm ml-1">({s.qty}T)</span></span>
                      <StatusBadge status={s.priority} />
                    </div>
                    <div className="text-xs text-secondary">
                      {s.farmer} • {s.origin}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Fleet */}
          <div className="card w-1/2 flex flex-col">
            <h3 className="mb-4">Available Fleet ({AVAILABLE_FLEET.length})</h3>
            <div className="flex flex-col gap-3 overflow-y-auto">
              {AVAILABLE_FLEET.map(v => (
                <div key={v.id} className="p-4 rounded-md border border-border" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">{v.id}</span>
                    <span className="text-xs px-2 py-1 bg-white/10 rounded-full">{v.type}</span>
                  </div>
                  <div className="text-xs text-secondary mb-2">📍 {v.location}</div>
                  
                  <div className="flex justify-between text-xs mb-1">
                    <span>Capacity</span>
                    <span>{v.currentLoad} / {v.capacity} T</span>
                  </div>
                  <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: `${(v.currentLoad/v.capacity)*100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Result Panel */}
      {result && (
        <div className="flex flex-col gap-6 animate-slide-up">
          <div className="grid grid-cols-4 gap-6">
            <MetricCard title="Vehicles Used" value={`${result.metrics.vehiclesUsed} / ${AVAILABLE_FLEET.length}`} icon="🚚" />
            <MetricCard title="Avg Utilization" value={`${result.metrics.avgUtilization}%`} trend="up" icon="📊" />
            <MetricCard title="Total Distance" value={`${result.metrics.totalDistance} km`} trend="down" icon="🗺️" />
            <MetricCard title="Unassigned" value={result.metrics.unassigned} icon="⚠️" accentColor={result.metrics.unassigned > 0 ? "var(--color-accent-danger)" : "var(--color-accent-primary)"} />
          </div>

          <div className="grid grid-cols-3 gap-6">
            {result.assignments.map((a, i) => (
              <div key={i} className="card relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 bg-accent/10 rounded-bl-lg text-accent font-bold text-xl" style={{ backgroundColor: 'var(--color-accent-primary-transparent)' }}>
                  {a.utilization}%
                </div>
                
                <h4 className="mb-1">{a.vehicle.id}</h4>
                <div className="text-xs text-tertiary mb-4">{a.vehicle.type} • {a.distance} • {a.duration}</div>
                
                <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden mb-4">
                  <div className="h-full" style={{ width: `${a.utilization}%`, backgroundColor: a.utilization > 90 ? 'var(--color-accent-danger)' : 'var(--color-accent-primary)' }}></div>
                </div>

                <div className="font-bold text-sm mb-2 text-secondary">Assigned Shipments:</div>
                <ul className="text-sm flex flex-col gap-2">
                  {a.shipments.map(s => (
                    <li key={s.id} className="flex justify-between border-b border-border pb-1">
                      <span>{s.produce} ({s.origin})</span>
                      <span className="text-accent">{s.qty}T</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <button className="btn btn-secondary" onClick={() => setResult(null)}>🔄 Re-run Optimizer</button>
            <button className="btn btn-primary" onClick={() => alert('Trips generated successfully!')}>✅ Accept & Create Trips</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadAllocation;
