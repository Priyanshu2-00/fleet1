import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import AgriFleetLogo from '../../components/AgriFleetLogo';

const Login = () => {
  const { login, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('FLEET_MANAGER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated && user) {
    if (user.role === 'FLEET_MANAGER') return <Navigate to="/fleet/dashboard" replace />;
    if (user.role === 'FARMER') return <Navigate to="/farmer/dashboard" replace />;
    if (user.role === 'DRIVER') return <Navigate to="/driver/trips" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const res = await login(email, password, role);
    if (!res.success) {
      setError(res.error);
      setLoading(false);
    }
  };

  const handleDemoPreset = (presetRole, presetEmail) => {
    setRole(presetRole);
    setEmail(presetEmail);
    setPassword('demo123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in" style={{
      background: 'radial-gradient(circle at center, var(--color-bg-card) 0%, var(--color-bg-base) 100%)',
      position: 'relative'
    }}>
      <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem' }}>
        <Link to="/" className="btn btn-ghost text-sm flex items-center gap-1">
          ← Back to Landing Page
        </Link>
      </div>

      <div className="card animate-slide-up" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
        <div className="text-center mb-6 flex flex-col items-center">
          <AgriFleetLogo size="lg" theme="dark" animated={true} />
          <p className="text-xs text-secondary mt-3">Autonomous & Multi-Role Agricultural Logistics</p>
        </div>

        {error && (
          <div className="p-3 mb-4 text-sm rounded-md" style={{ backgroundColor: 'var(--color-accent-danger-transparent)', color: 'var(--color-accent-danger)', border: '1px solid var(--color-accent-danger)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-group mb-0">
            <label className="form-label text-xs">Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="manager@agrifleet.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-0">
            <label className="form-label text-xs">Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-0">
            <label className="form-label text-xs">Select Role Persona</label>
            <select 
              className="input-field"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="FLEET_MANAGER">🖥️ Fleet Manager</option>
              <option value="FARMER">🧑‍🌾 Farmer / Producer</option>
              <option value="DRIVER">🚚 Transit Driver</option>
              <option value="ADMIN">⚙️ Enterprise Admin</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary mt-2 w-full justify-center py-3 font-bold" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In to Portal 🚀'}
          </button>
        </form>

        <div className="mt-6 pt-4 text-center" style={{ borderTop: '1px solid var(--color-border)' }}>
          <p className="text-xs text-tertiary mb-2 font-semibold uppercase tracking-wider">Instant 1-Click Demo Logins:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button 
              type="button" 
              className="btn btn-secondary text-xs py-1"
              onClick={() => handleDemoPreset('FLEET_MANAGER', 'manager@agrifleet.com')}
            >
              Fleet Manager
            </button>
            <button 
              type="button" 
              className="btn btn-secondary text-xs py-1"
              onClick={() => handleDemoPreset('FARMER', 'farmer@agrifleet.com')}
            >
              Farmer
            </button>
            <button 
              type="button" 
              className="btn btn-secondary text-xs py-1"
              onClick={() => handleDemoPreset('DRIVER', 'driver@agrifleet.com')}
            >
              Driver
            </button>
            <button 
              type="button" 
              className="btn btn-secondary text-xs py-1"
              onClick={() => handleDemoPreset('ADMIN', 'admin@agrifleet.com')}
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
