import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const ROLE_DASHBOARDS = {
  student: '/student',
  industry: '/industry',
  academician: '/academician',
  institution: '/institution',
  admin: '/admin',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize session on mount: verify existing token with backend /api/auth/me
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const response = await authService.getMe();
        if (isMounted && response.success && response.data?.user) {
          setUser(response.data.user);
          setToken(storedToken);
        }
      } catch (err) {
        console.warn('[Auth] Stored session expired or invalid:', err.message);
        localStorage.removeItem('token');
        if (isMounted) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Log in user with credentials
   */
  const login = async (email, password) => {
    setError(null);
    try {
      const response = await authService.login({ email, password });
      if (response.success && response.data) {
        const { token: receivedToken, user: receivedUser } = response.data;
        localStorage.setItem('token', receivedToken);
        setToken(receivedToken);
        setUser(receivedUser);
        return { success: true, user: receivedUser };
      }
      throw new Error(response.message || 'Login failed');
    } catch (err) {
      const message = err.message || 'Unable to log in. Please check credentials.';
      setError(message);
      return { success: false, message };
    }
  };

  /**
   * Register a new user
   */
  const register = async (userData) => {
    setError(null);
    try {
      const response = await authService.register(userData);
      if (response.success && response.data) {
        const { token: receivedToken, user: receivedUser } = response.data;
        localStorage.setItem('token', receivedToken);
        setToken(receivedToken);
        setUser(receivedUser);
        return { success: true, user: receivedUser };
      }
      throw new Error(response.message || 'Registration failed');
    } catch (err) {
      const message = err.message || 'Registration failed. Please try again.';
      setError(message);
      return { success: false, message };
    }
  };

  /**
   * Log out user
   */
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    setError(null);
  };

  const getDashboardPath = (role) => {
    return ROLE_DASHBOARDS[role?.toLowerCase()] || '/';
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    getDashboardPath,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
