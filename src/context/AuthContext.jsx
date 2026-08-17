import React, { createContext, useContext, useState } from 'react';
import { loginAdmin } from '../services/adminApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('userInfo');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      localStorage.removeItem('userInfo');
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      const saved = localStorage.getItem('userInfo');
      const parsed = saved ? JSON.parse(saved) : null;
      return parsed ? parsed.token : null;
    } catch (error) {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await loginAdmin(email, password);
      const userData = response.data;
      
      setUser(userData);
      setToken(userData.token);
      localStorage.setItem('userInfo', JSON.stringify(userData));
      
      return { success: true };
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('userInfo');
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAdmin: !!user && user.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
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