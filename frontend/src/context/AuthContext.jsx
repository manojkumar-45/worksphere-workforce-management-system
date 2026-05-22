import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

const storedUser = () => {
  const raw = localStorage.getItem('wms_user');
  return raw ? JSON.parse(raw) : null;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(storedUser);
  const [token, setToken] = useState(() => localStorage.getItem('wms_token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('wms_token', token);
    } else {
      localStorage.removeItem('wms_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('wms_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('wms_user');
    }
  }, [user]);

  const login = async (payload) => {
    const response = await api.post('/api/auth/login', payload);
    const data = response.data.data;
    setToken(data.token);
    setUser(data);
    return data;
  };

  const register = async (payload) => {
    const response = await api.post('/auth/register', payload);
    const data = response.data.data;
    setToken(data.token);
    setUser(data);
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: Boolean(token),
  }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

