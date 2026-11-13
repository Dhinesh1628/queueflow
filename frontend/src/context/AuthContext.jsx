import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [manager, setManager] = useState(() => {
    const saved = localStorage.getItem('queueflow_manager');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('queueflow_token'));
  const [loading, setLoading] = useState(true);

  // Initialize auth check on reload
  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('queueflow_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.success && res.manager) {
            setManager(res.manager);
            localStorage.setItem('queueflow_manager', JSON.stringify(res.manager));
          }
        } catch (error) {
          console.warn('Session verification failed:', error.message);
          localStorage.removeItem('queueflow_token');
          localStorage.removeItem('queueflow_manager');
          setToken(null);
          setManager(null);
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.success) {
      setToken(res.token);
      setManager(res.manager);
      localStorage.setItem('queueflow_token', res.token);
      localStorage.setItem('queueflow_manager', JSON.stringify(res.manager));
    }
    return res;
  };

  const register = async (name, email, password) => {
    const res = await authService.register(name, email, password);
    if (res.success) {
      setToken(res.token);
      setManager(res.manager);
      localStorage.setItem('queueflow_token', res.token);
      localStorage.setItem('queueflow_manager', JSON.stringify(res.manager));
    }
    return res;
  };

  const logout = useCallback(() => {
    localStorage.removeItem('queueflow_token');
    localStorage.removeItem('queueflow_manager');
    setToken(null);
    setManager(null);
  }, []);

  const updateProfile = async (data) => {
    const res = await authService.updateProfile(data);
    if (res.success && res.manager) {
      setManager(res.manager);
      localStorage.setItem('queueflow_manager', JSON.stringify(res.manager));
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        manager,
        token,
        isAuthenticated: !!token && !!manager,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
