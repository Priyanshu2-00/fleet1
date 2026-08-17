import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { AppLayout } from './components/Layout';

// Public Landing Page
import LandingPage from './pages/landing/LandingPage';

// Auth
import Login from './pages/auth/Login';

// Fleet Manager
import FleetDashboard from './pages/fleet-manager/Dashboard';
import Vehicles from './pages/fleet-manager/Vehicles';
import Shipments from './pages/fleet-manager/Shipments';
import LiveFleetMap from './pages/fleet-manager/LiveFleetMap';
import LoadAllocation from './pages/fleet-manager/LoadAllocation';
import RouteOptimizer from './pages/fleet-manager/RouteOptimizer';
import ActiveTrips from './pages/fleet-manager/ActiveTrips';
import Alerts from './pages/fleet-manager/Alerts';
import Analytics from './pages/fleet-manager/Analytics';

// Farmer
import FarmerDashboard from './pages/farmer/Dashboard';
import CreatePickup from './pages/farmer/CreatePickup';
import MyShipments from './pages/farmer/MyShipments';
import ShipmentTracking from './pages/farmer/ShipmentTracking';

// Driver
import TodaysTrips from './pages/driver/TodaysTrips';
import TripDetails from './pages/driver/TripDetails';
import PickupConfirmation from './pages/driver/PickupConfirmation';

// Admin
import AdminDashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import AdminVehicles from './pages/admin/Vehicles';
import Locations from './pages/admin/Locations';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const RoleBasedRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  
  if (!user) return <Navigate to="/login" replace />;
  
  switch(user.role) {
    case 'FLEET_MANAGER': return <Navigate to="/fleet/dashboard" replace />;
    case 'FARMER': return <Navigate to="/farmer/dashboard" replace />;
    case 'DRIVER': return <Navigate to="/driver/trips" replace />;
    case 'ADMIN': return <Navigate to="/admin/dashboard" replace />;
    default: return <Navigate to="/login" replace />;
  }
};

const App = () => {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/landing" element={<LandingPage />} />

            {/* Authentication */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected App Shell for Role Portals */}
            <Route path="/app" element={<ProtectedRoute><RoleBasedRedirect /></ProtectedRoute>} />
            
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              {/* Fleet Manager Routes */}
              <Route path="fleet/dashboard" element={<ProtectedRoute allowedRoles={['FLEET_MANAGER']}><FleetDashboard /></ProtectedRoute>} />
              <Route path="fleet/map" element={<ProtectedRoute allowedRoles={['FLEET_MANAGER']}><LiveFleetMap /></ProtectedRoute>} />
              <Route path="fleet/allocation" element={<ProtectedRoute allowedRoles={['FLEET_MANAGER']}><LoadAllocation /></ProtectedRoute>} />
              <Route path="fleet/routes" element={<ProtectedRoute allowedRoles={['FLEET_MANAGER']}><RouteOptimizer /></ProtectedRoute>} />
              <Route path="fleet/trips" element={<ProtectedRoute allowedRoles={['FLEET_MANAGER']}><ActiveTrips /></ProtectedRoute>} />
              <Route path="fleet/alerts" element={<ProtectedRoute allowedRoles={['FLEET_MANAGER']}><Alerts /></ProtectedRoute>} />
              <Route path="fleet/analytics" element={<ProtectedRoute allowedRoles={['FLEET_MANAGER']}><Analytics /></ProtectedRoute>} />
              <Route path="fleet/vehicles" element={<ProtectedRoute allowedRoles={['FLEET_MANAGER']}><Vehicles /></ProtectedRoute>} />
              <Route path="fleet/shipments" element={<ProtectedRoute allowedRoles={['FLEET_MANAGER']}><Shipments /></ProtectedRoute>} />
              
              {/* Driver Routes */}
              <Route path="driver/trips" element={<ProtectedRoute allowedRoles={['DRIVER']}><TodaysTrips /></ProtectedRoute>} />
              <Route path="driver/trip/:id" element={<ProtectedRoute allowedRoles={['DRIVER']}><TripDetails /></ProtectedRoute>} />
              <Route path="driver/pickup/:tripId/:stopId" element={<ProtectedRoute allowedRoles={['DRIVER']}><PickupConfirmation /></ProtectedRoute>} />
              
              {/* Farmer Routes */}
              <Route path="farmer/dashboard" element={<ProtectedRoute allowedRoles={['FARMER']}><FarmerDashboard /></ProtectedRoute>} />
              <Route path="farmer/new-pickup" element={<ProtectedRoute allowedRoles={['FARMER']}><CreatePickup /></ProtectedRoute>} />
              <Route path="farmer/shipments" element={<ProtectedRoute allowedRoles={['FARMER']}><MyShipments /></ProtectedRoute>} />
              <Route path="farmer/tracking/:id" element={<ProtectedRoute allowedRoles={['FARMER']}><ShipmentTracking /></ProtectedRoute>} />
              
              {/* Admin Routes */}
              <Route path="admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><Users /></ProtectedRoute>} />
              <Route path="admin/vehicles" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminVehicles /></ProtectedRoute>} />
              <Route path="admin/locations" element={<ProtectedRoute allowedRoles={['ADMIN']}><Locations /></ProtectedRoute>} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </WebSocketProvider>
    </AuthProvider>
  );
};

export default App;
