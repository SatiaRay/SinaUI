import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import {
  checkAuthorizationFetcher,
  login as loginApi,
  register as registerApi,
} from '../services/api';
import useSwr from 'swr';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token');
  });

  // Revalidate authorization every minute
  const { error: authorization_error } = useSwr(
    token ? 'check_authorization' : null,
    checkAuthorizationFetcher,
    {
      onError: () => logout(),
      refreshInterval: 60000,
    }
  );

  // Keep axios + localStorage synced
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [token, user]);

  const check = () => !!user && !!token;

  const login = async (email, password) => {
    const response = await loginApi(email, password);

    if (response.user && response.access_token) {
      // Merge fallback values if backend sends null
      const completeUser = {
        ...response.user,
        first_name: response.user.first_name ?? '',
        last_name: response.user.last_name ?? '',
        phone: response.user.phone ?? '',
      };

      setUser(completeUser);
      setToken(response.access_token);
    } else {
      throw new Error('ورود به سیستم موفق نبود');
    }
  };

  const register = async (formData) => {
    try {
      const response = await registerApi(formData);

      if (response.user && response.access_token) {
        const completeUser = {
          ...response.user,
          first_name: response.user.first_name ?? formData.first_name,
          last_name: response.user.last_name ?? formData.last_name,
          phone: response.user.phone ?? formData.phone,
        };

        setUser(completeUser);
        setToken(response.access_token);

        return { success: true };
      }

      return { success: false, error: 'خطا در ثبت نام' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message || 'خطا در ثبت نام' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const authorize = (userType) => user && user.user_type === userType;

  const updateUser = (updates) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updates };
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        check,
        login,
        register,
        logout,
        authorize,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
