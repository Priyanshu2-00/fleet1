import React from 'react';

const MetricCard = ({ title, value, subtitle, icon, trend, accentColor = 'var(--color-accent-primary)' }) => {
  return (
    <div className="card" style={{ borderLeft: `4px solid ${accentColor}`, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
      <div className="flex justify-between items-center text-secondary">
        <span className="text-sm font-medium">{title}</span>
        <span style={{ fontSize: '1.2rem' }}>{icon}</span>
      </div>
      <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
        {value}
      </div>
      {subtitle && (
        <div className="flex items-center gap-2 text-xs">
          {trend && (
            <span style={{ 
              color: trend === 'up' ? 'var(--color-accent-primary)' : trend === 'down' ? 'var(--color-accent-danger)' : 'var(--color-text-tertiary)' 
            }}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
            </span>
          )}
          <span className="text-tertiary">{subtitle}</span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
