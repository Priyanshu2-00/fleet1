import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MOCK_TRIPS = [
  { id: 'TRP-801', vehicle: 'MH-12-AB-1234', stops: 4, start: '08:00 AM', dist: '145 km', dur: '3h 45m', status: 'IN_PROGRESS' },
  { id: 'TRP-805', vehicle: 'MH-12-AB-1234', stops: 2, start: '02:00 PM', dist: '40 km', dur: '1h 15m', status: 'ASSIGNED' }
];

const TodaysTrips = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="max-w-md mx-auto animate-fade-in pb-10">
      <div className="mb-6">
        <h2 className="mb-1">Hello, {user?.name || 'Driver'}</h2>
        <p className="text-secondary text-sm m-0">{dateStr}</p>
      </div>

      <div className="flex flex-col gap-4">
        {MOCK_TRIPS.length === 0 ? (
          <div className="card p-8 text-center text-secondary border-dashed border-2">
            No trips assigned for today. Stand by for assignments.
          </div>
        ) : (
          MOCK_TRIPS.map(trip => (
            <div key={trip.id} className="card p-0 overflow-hidden shadow-md">
              <div className={`p-3 text-white font-bold flex justify-between ${trip.status === 'IN_PROGRESS' ? 'bg-blue-600' : 'bg-gray-700'}`} style={{ backgroundColor: trip.status === 'IN_PROGRESS' ? 'var(--color-accent-info)' : 'var(--color-bg-card-hover)' }}>
                <span>{trip.id}</span>
                <span className="text-xs px-2 py-1 bg-black/20 rounded">{trip.status.replace('_', ' ')}</span>
              </div>
              
              <div className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-secondary">Vehicle</span>
                  <span className="font-bold border border-border px-2 py-1 rounded bg-black/20">{trip.vehicle}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                  <div className="bg-black/10 p-2 rounded text-center">
                    <div className="text-xs text-secondary mb-1">Stops</div>
                    <div className="font-bold">{trip.stops}</div>
                  </div>
                  <div className="bg-black/10 p-2 rounded text-center">
                    <div className="text-xs text-secondary mb-1">Start Time</div>
                    <div className="font-bold">{trip.start}</div>
                  </div>
                  <div className="bg-black/10 p-2 rounded text-center">
                    <div className="text-xs text-secondary mb-1">Distance</div>
                    <div className="font-bold">{trip.dist}</div>
                  </div>
                  <div className="bg-black/10 p-2 rounded text-center">
                    <div className="text-xs text-secondary mb-1">Duration</div>
                    <div className="font-bold">{trip.dur}</div>
                  </div>
                </div>

                <button 
                  className={`btn mt-2 py-3 text-lg font-bold w-full justify-center ${trip.status === 'IN_PROGRESS' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => navigate(`/driver/trip/${trip.id}`)}
                >
                  {trip.status === 'IN_PROGRESS' ? '📍 Continue Trip' : '🚀 Start Trip'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodaysTrips;
