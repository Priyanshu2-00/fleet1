import client from './client';

export const authApi = {
  login: (email, password) => client.post('/auth/login', { email, password }),
  register: (data) => client.post('/auth/register', data),
  getProfile: () => client.get('/auth/me'),
};

export const shipmentsApi = {
  createShipment: (data) => client.post('/shipments', data),
  getShipments: (params) => client.get('/shipments', { params }),
  getShipment: (id) => client.get(`/shipments/${id}`),
  updateShipmentStatus: (id, status) => client.patch(`/shipments/${id}/status`, { status }),
  getPendingShipments: () => client.get('/shipments/pending'),
};

export const vehiclesApi = {
  getVehicles: () => client.get('/vehicles'),
  getAvailableVehicles: () => client.get('/vehicles/available'),
  getVehicle: (id) => client.get(`/vehicles/${id}`),
  updateVehicle: (id, data) => client.patch(`/vehicles/${id}`, data),
  createVehicle: (data) => client.post('/vehicles', data),
};

export const tripsApi = {
  getTrips: () => client.get('/trips'),
  getTrip: (id) => client.get(`/trips/${id}`),
  startTrip: (id) => client.post(`/trips/${id}/start`),
  arriveAtStop: (tripId, stopId) => client.post(`/trips/${tripId}/stops/${stopId}/arrive`),
  confirmPickup: (tripId, stopId) => client.post(`/trips/${tripId}/stops/${stopId}/pickup`),
  completeTrip: (id) => client.post(`/trips/${id}/complete`),
};

export const optimizationApi = {
  runOptimization: (data) => client.post('/optimization/run', data),
  getOptimizationResult: (id) => client.get(`/optimization/result/${id}`),
};

export const trackingApi = {
  getFleetPositions: () => client.get('/tracking/fleet'),
  getVehicleHistory: (id) => client.get(`/tracking/history/${id}`),
};

export const alertsApi = {
  getAlerts: () => client.get('/alerts'),
  acknowledgeAlert: (id) => client.post(`/alerts/${id}/acknowledge`),
  resolveAlert: (id) => client.post(`/alerts/${id}/resolve`),
};

export const analyticsApi = {
  getFleetAnalytics: () => client.get('/analytics/fleet'),
  getTripPerformance: () => client.get('/analytics/performance'),
  getComparison: () => client.get('/analytics/comparison'),
};

export const locationsApi = {
  getLocations: (params) => client.get('/locations', { params }),
  createLocation: (data) => client.post('/locations', data),
};
