import React, { createContext, useContext, useEffect, useState } from 'react';
import { wsManager } from '../api/websocket';
import { useAuth } from './AuthContext';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [fleetPositions, setFleetPositions] = useState({});
  const [latestAlerts, setLatestAlerts] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    if (user.role === 'FLEET_MANAGER' || user.role === 'ADMIN') {
      const channel = 'fleet-updates';
      const cleanupConnect = wsManager.connect(channel);
      
      const unsubscribe = wsManager.onMessage(channel, (data) => {
        if (data.type === 'connected') {
          setIsConnected(true);
        } else if (data.type === 'position_update') {
          setFleetPositions(prev => ({
            ...prev,
            [data.vehicleId]: data.position
          }));
        } else if (data.type === 'alert') {
          setLatestAlerts(prev => [data.alert, ...prev].slice(0, 50));
        }
      });

      return () => {
        unsubscribe();
        cleanupConnect();
      };
    }
  }, [isAuthenticated, user]);

  return (
    <WebSocketContext.Provider value={{ fleetPositions, latestAlerts, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
