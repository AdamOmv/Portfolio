import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);
const STORAGE_KEY = 'adomv_admin_token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(STORAGE_KEY)));

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    let active = true;

    api.get('/auth/me', token)
      .then((data) => {
        if (!active) return;
        setUser(data);
      })
      .catch(() => {
        if (!active) return;
        localStorage.removeItem(STORAGE_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  const value = useMemo(() => ({
    token,
    user,
    loading,
    async login(username, password) {
      const response = await api.post('/auth/login', { username, password });
      localStorage.setItem(STORAGE_KEY, response.token);
      setToken(response.token);
      setUser(response.user);
      return response;
    },
    logout() {
      localStorage.removeItem(STORAGE_KEY);
      setToken(null);
      setUser(null);
    },
  }), [token, user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
