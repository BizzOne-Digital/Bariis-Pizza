import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../services/api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('bariis_token');
    if (token) {
      getMe()
        .then(res => setUser(res.data.user))
        .catch(() => localStorage.removeItem('bariis_token'))
        .finally(() => setLoading(false));
    } else setLoading(false);
  }, []);

  const loginUser = (token, userData) => {
    localStorage.setItem('bariis_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('bariis_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logout, isAdmin: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
