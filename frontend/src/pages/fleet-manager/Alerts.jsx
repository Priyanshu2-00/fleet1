import React, { useState } from 'react';
import { useWebSocket } from '../../context/WebSocketContext';

const MOCK_ALERTS = [
  { id: 1, severity: 'CRITICAL', type: 'DELAY', title: 'Major Delay on TRP-502', message: 'Vehicle MH-14-CD-5678 is delayed by 45 mins due to traffic at Hinjawadi. High risk of missing Vashi Market delivery window.', time: '2 mins ago', status: 'ACTIVE' },
  { id: 2, severity: 'HIGH', type: 'TEMPERATURE', title: 'Temp Drop in Reefer', message: 'Temperature in MH-14-CD-5678 dropped below threshold (current: -2°C, required: 4°C). Produce risk.', time: '15 mins ago', status: 'ACTIVE' },
  { id: 3, severity: 'MEDIUM', type: 'CAPACITY', title: 'Overcapacity Risk', message: 'Assigned load for MH-12-AB-1234 exceeds capacity by 0.5T based on revised farmer estimates.', time: '1 hour ago', status: 'ACKNOWLEDGED' },
  { id: 4, severity: 'LOW', type: 'SYSTEM', title: 'Driver Logged In', message: 'Driver Suresh L. has started shift.', time: '2 hours ago', status: 'RESOLVED' }
];

const SEVERITY_COLORS = {
  CRITICAL: 'var(--color-accent-danger)',
  HIGH: 'var(--color-accent-secondary)',
  MEDIUM: '#eab308', // Yellow
  LOW: 'var(--color-accent-info)'
};

const TYPE_ICONS = {
  DELAY: '⏱️',
  TEMPERATURE: '❄️',
  CAPACITY: '⚖️',
  SYSTEM: '⚙️'
};

const Alerts = () => {
  const { latestAlerts } = useWebSocket();
  const [tab, setTab] = useState('ACTIVE');
  
  const displayAlerts = [...latestAlerts, ...MOCK_ALERTS].filter(a => a.status === tab);

  return (
    <div className="flex flex-col h-full animate-fade-in max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2>Alert Center</h2>
        <div className="flex gap-2">
          {['ACTIVE', 'ACKNOWLEDGED', 'RESOLVED'].map(t => (
            <button 
              key={t}
              className={`btn ${tab === t ? 'btn-secondary' : 'btn-ghost'}`}
              onClick={() => setTab(t)}
            >
              {t}
              {t === 'ACTIVE' && <span className="ml-2 px-2 py-0.5 rounded-full bg-danger text-xs bg-red-500/20 text-red-500">2</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 flex-1 overflow-y-auto pb-8">
        {displayAlerts.length === 0 ? (
          <div className="card p-12 text-center text-secondary border-dashed border-2 bg-transparent">
            No alerts in this category — all systems operational ✓
          </div>
        ) : (
          displayAlerts.map(alert => (
            <div 
              key={alert.id} 
              className="card p-0 overflow-hidden flex transition-all hover:shadow-md"
              style={{ borderLeft: `4px solid ${SEVERITY_COLORS[alert.severity]}` }}
            >
              <div className="p-4 flex flex-col justify-center bg-black/20" style={{ minWidth: '60px', alignItems: 'center' }}>
                <span className="text-2xl">{TYPE_ICONS[alert.type] || '🔔'}</span>
              </div>
              
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="m-0">{alert.title}</h4>
                    <span className="text-xs text-tertiary">{alert.time}</span>
                  </div>
                  <p className="text-sm text-secondary mb-3">{alert.message}</p>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <span className="text-xs px-2 py-1 bg-white/5 rounded text-tertiary font-mono">ID: {alert.id}</span>
                  </div>
                  <div className="flex gap-2">
                    {tab === 'ACTIVE' && (
                      <>
                        <button className="btn btn-ghost text-xs py-1 px-3">Dismiss</button>
                        <button className="btn btn-secondary text-xs py-1 px-3">Acknowledge</button>
                        {alert.type === 'DELAY' && <button className="btn btn-primary text-xs py-1 px-3">🔄 Re-optimize</button>}
                      </>
                    )}
                    {tab === 'ACKNOWLEDGED' && (
                      <button className="btn btn-primary text-xs py-1 px-3">Mark Resolved</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Alerts;
