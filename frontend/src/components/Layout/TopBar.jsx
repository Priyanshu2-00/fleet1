import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TopBar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const pathName = location.pathname.split('/').pop();
  const title = pathName ? pathName.charAt(0).toUpperCase() + pathName.slice(1).replace('-', ' ') : 'Dashboard';

  return (
    <header style={{
      height: '64px',
      backgroundColor: 'rgba(15, 20, 33, 0.85)',
      backdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--color-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 var(--spacing-6)',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      <div className="flex items-center gap-3">
        <h2 style={{ fontSize: 'var(--text-lg)', margin: 0, fontWeight: 700 }}>{title}</h2>
        <span className="badge badge-success text-xs" style={{ fontSize: '10px' }}>🟢 Live Telematics Active</span>
      </div>
      
      <div className="flex items-center gap-3">
        <Link to="/" className="btn btn-ghost text-xs" style={{ padding: '0.4rem 0.75rem' }}>
          🏠 View Landing Page
        </Link>
        <Link to="/fleet/alerts" className="btn btn-ghost" style={{ padding: 'var(--spacing-2)' }} title="View Alerts">
          🔔
        </Link>
        <div style={{
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-accent-primary)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: 'var(--text-sm)',
          boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)'
        }} title={user?.email || 'Active User'}>
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
