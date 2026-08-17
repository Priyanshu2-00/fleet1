import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AgriFleetLogo from '../AgriFleetLogo';

const NAV_ITEMS = {
  FLEET_MANAGER: [
    { path: '/fleet/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/fleet/map', label: 'Live Map', icon: '🗺️' },
    { path: '/fleet/allocation', label: 'Load Allocation', icon: '⚡' },
    { path: '/fleet/routes', label: 'Route Optimizer', icon: '🛣️' },
    { path: '/fleet/trips', label: 'Active Trips', icon: '🚚' },
    { path: '/fleet/alerts', label: 'Alerts', icon: '⚠️' },
    { path: '/fleet/analytics', label: 'Analytics', icon: '📈' },
    { path: '/fleet/vehicles', label: 'Vehicles', icon: '🚛' },
    { path: '/fleet/shipments', label: 'Shipments', icon: '📦' },
  ],
  FARMER: [
    { path: '/farmer/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/farmer/new-pickup', label: 'New Pickup', icon: '➕' },
    { path: '/farmer/shipments', label: 'My Shipments', icon: '📦' },
    { path: '/farmer/tracking/SHP-2038', label: 'Track Shipment', icon: '🔍' },
  ],
  DRIVER: [
    { path: '/driver/trips', label: 'Todays Trips', icon: '📋' },
    { path: '/driver/trip/TRP-801', label: 'Active Trip', icon: '🚚' },
  ],
  ADMIN: [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/vehicles', label: 'Vehicles', icon: '🚛' },
    { path: '/admin/locations', label: 'Locations', icon: '📍' },
  ]
};

const Sidebar = ({ collapsed, toggleCollapse }) => {
  const { user, logout } = useAuth();
  const navLinks = user?.role ? NAV_ITEMS[user.role] || [] : [];

  return (
    <aside style={{
      width: collapsed ? '80px' : '260px',
      backgroundColor: 'var(--color-bg-card)',
      borderRight: '1px solid var(--color-border)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width var(--transition-normal)',
      height: '100vh',
      position: 'sticky',
      top: 0,
      zIndex: 20
    }}>
      <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          {!collapsed ? (
            <AgriFleetLogo size="sm" showSubtitle={false} theme="dark" animated={true} />
          ) : (
            <AgriFleetLogo size="sm" showText={false} theme="dark" animated={true} />
          )}
        </Link>
      </div>

      <nav style={{ flex: 1, padding: 'var(--spacing-4) 0', overflowY: 'auto' }}>
        <ul className="flex flex-col gap-1 p-3">
          {/* Quick link to Landing / Home */}
          <li>
            <NavLink 
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: 'var(--spacing-2) var(--spacing-3)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-tertiary)',
                gap: 'var(--spacing-3)',
                fontSize: 'var(--text-xs)',
                marginBottom: '0.5rem',
                border: '1px dashed var(--color-border)'
              }}
            >
              <span>🏠</span>
              {!collapsed && <span>Landing Page</span>}
            </NavLink>
          </li>

          {navLinks.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  padding: 'var(--spacing-3) var(--spacing-4)',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
                  backgroundColor: isActive ? 'var(--color-accent-primary-transparent)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--color-accent-primary)' : '3px solid transparent',
                  gap: 'var(--spacing-3)',
                  fontWeight: isActive ? 600 : 500
                })}
              >
                <span>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4" style={{ borderTop: '1px solid var(--color-border)' }}>
        {!collapsed && (
          <div className="mb-4">
            <div className="text-sm font-medium text-primary">{user?.name}</div>
            <div className="text-xs text-accent font-semibold">{user?.role}</div>
          </div>
        )}
        <button className="btn btn-secondary w-full" onClick={logout} style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <span>🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
