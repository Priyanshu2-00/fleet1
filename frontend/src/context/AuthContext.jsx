import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/endpoints';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        try {
          // In a real app, this would hit the backend
          // const res = await authApi.getProfile();
          // setUser(res.data);
          
          // MOCK for now since backend might not be ready
          const mockUser = JSON.parse(localStorage.getItem('mock_user') || '{"role":"FLEET_MANAGER","name":"Demo User"}');
          setUser(mockUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Token validation failed', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setLoading(false);
    };

    validateToken();
  }, [token]);

  const login = async (email, password, role) => {
    try {
      // Mock login for demo purposes
      // In real app: const res = await authApi.login(email, password);
      
      const mockToken = 'mock_jwt_token_12345';
      const mockUser = {
        id: 1,
        email,
        name: email.split('@')[0],
        role: role || 'FLEET_MANAGER'
      };

      localStorage.setItem('token', mockToken);
      localStorage.setItem('mock_user', JSON.stringify(mockUser));
      
      setToken(mockToken);
      setUser(mockUser);
      setIsAuthenticated(true);
      
      return { success: true, user: mockUser };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('mock_user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
