import React from 'react';

const STATUS_CONFIG = {
  // Shipments
  PENDING: { color: 'var(--color-accent-secondary)', bg: 'var(--color-accent-secondary-transparent)', icon: '⏳' },
  IN_TRANSIT: { color: 'var(--color-accent-info)', bg: 'var(--color-accent-info-transparent)', icon: '🚚' },
  DELIVERED: { color: 'var(--color-accent-primary)', bg: 'var(--color-accent-primary-transparent)', icon: '✅' },
  CANCELLED: { color: 'var(--color-accent-danger)', bg: 'var(--color-accent-danger-transparent)', icon: '❌' },
  
  // Vehicles
  AVAILABLE: { color: 'var(--color-accent-primary)', bg: 'var(--color-accent-primary-transparent)', icon: '🟢' },
  IN_USE: { color: 'var(--color-accent-info)', bg: 'var(--color-accent-info-transparent)', icon: '🔵' },
  MAINTENANCE: { color: 'var(--color-accent-secondary)', bg: 'var(--color-accent-secondary-transparent)', icon: '🔧' },
  
  // Priority
  NORMAL: { color: 'var(--color-text-secondary)', bg: 'rgba(255,255,255,0.1)', icon: '⚪' },
  HIGH: { color: 'var(--color-accent-secondary)', bg: 'var(--color-accent-secondary-transparent)', icon: '⭐' },
  URGENT: { color: 'var(--color-accent-danger)', bg: 'var(--color-accent-danger-transparent)', icon: '🔥' },
};

const DEFAULT_CONFIG = { color: 'var(--color-text-secondary)', bg: 'rgba(255,255,255,0.1)', icon: '🔹' };

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status.toUpperCase()] || DEFAULT_CONFIG;
  
  return (
    <span className="badge" style={{ color: config.color, backgroundColor: config.bg }}>
      <span>{config.icon}</span>
      {status.replace('_', ' ')}
    </span>
  );
};

export default StatusBadge;
