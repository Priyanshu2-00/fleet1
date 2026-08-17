import React from 'react';
import StatusBadge from '../../components/StatusBadge/StatusBadge';

const MOCK_TRIPS = [
  {
    id: 'TRP-501',
    vehicle: 'MH-12-AB-1234',
    driver: 'Ramesh K.',
    status: 'IN_PROGRESS',
    progress: { completed: 2, total: 4 },
    nextStop: 'Farm B (Chinchwad)',
    eta: '09:10 AM',
    load: { current: 4, capacity: 10 },
    timeElapsed: '1h 15m',
    totalEstimated: '3h 45m'
  },
  {
    id: 'TRP-502',
    vehicle: 'MH-14-CD-5678',
    driver: 'Suresh L.',
    status: 'DELAYED',
    progress: { completed: 1, total: 3 },
    nextStop: 'Farm C (Hinjawadi)',
    eta: '09:45 AM (Delayed)',
    load: { current: 5, capacity: 5 },
    timeElapsed: '1h 30m',
    totalEstimated: '3h 00m'
  }
];

const ActiveTrips = () => {
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2>Active Trips</h2>
        <div className="text-sm text-secondary flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
          Live updating
        </div>
      </div>

      {MOCK_TRIPS.length === 0 ? (
        <div className="card p-12 text-center text-secondary border-dashed border-2 bg-transparent">
          No active trips. Assign vehicles and start trips from Load Allocation.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {MOCK_TRIPS.map(trip => {
            const pct = (trip.progress.completed / trip.progress.total) * 100;
            return (
              <div key={trip.id} className="card flex flex-col gap-4 transition-transform hover:scale-[1.01] cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="m-0 mb-1">{trip.vehicle}</h3>
                    <div className="text-sm text-secondary">👨‍✈️ {trip.driver} • {trip.id}</div>
                  </div>
                  <StatusBadge status={trip.status} />
                </div>

                <div className="flex gap-4 p-3 rounded-md border border-border bg-black/20">
                  <div className="flex-1">
                    <div className="text-xs text-secondary mb-1">Next Stop</div>
                    <div className="font-bold text-sm">{trip.nextStop}</div>
                    <div className={trip.status === 'DELAYED' ? 'text-xs text-danger mt-1' : 'text-xs text-accent mt-1'}>
                      ETA: {trip.eta}
                    </div>
                  </div>
                  <div className="w-px bg-border"></div>
                  <div className="flex-1">
                    <div className="text-xs text-secondary mb-1">Load Status</div>
                    <div className="font-bold text-sm">{trip.load.current} / {trip.load.capacity} Tons</div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${(trip.load.current/trip.load.capacity)*100}%` }}></div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-secondary mb-2">
                    <span>Progress: {trip.progress.completed}/{trip.progress.total} Stops</span>
                    <span>{pct.toFixed(0)}%</span>
                  </div>
                  <div className="relative w-full h-2 rounded-full bg-white/10">
                    <div className="absolute top-0 left-0 h-full rounded-full bg-accent transition-all duration-1000" style={{ width: `${pct}%` }}></div>
                    {/* Stop markers */}
                    {Array.from({ length: trip.progress.total }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-card ${i < trip.progress.completed ? 'bg-accent' : 'bg-tertiary'}`}
                        style={{ left: `${(i / (trip.progress.total - 1)) * 100}%`, transform: 'translate(-50%, -50%)' }}
                      ></div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between text-xs text-tertiary pt-2 border-t border-border">
                  <span>Elapsed: {trip.timeElapsed}</span>
                  <span>Est. Total: {trip.totalEstimated}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActiveTrips;
