import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { checkAuthorizationFetcher, login as loginApi, register as registerApi } from "../services/api";
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

  const { error: authorization_error } = useSwr(
    token ? 'check_authorization' : null,
    checkAuthorizationFetcher,
    {
      onError: () => logout(),
      refreshInterval: 60000,
    }
  );

  useEffect(() => {
    if (token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else
      delete axios.defaults.headers.common['Authorization'];

    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');

    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token, user]);

  const check = () => !!user && !!token;

  const login = async (email, passwd) => {
    const response = await loginApi(email, passwd);
    if (response.user && response.access_token) {
      setUser(response.user);
      setToken(response.access_token);
    } else {
      throw new Error("ورود به سیستم موفق نبود");
    }
  };

  const register = async ({ first_name, last_name, phone, email, password }) => {
    try {
      const response = await registerApi({ first_name, last_name, email, password, phone });
      if (response.user && response.access_token) {
        setUser(response.user);
        setToken(response.access_token);
        return { success: true };
      }
      return { success: false, error: "خطا در ثبت نام" };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: error.message || "خطا در ثبت نام" };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const authorize = (userType) => user && user.user_type === userType;

  return (
    <AuthContext.Provider value={{ user, token, check, login, register, logout, authorize }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
