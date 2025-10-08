import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import {
  checkAuthorizationFetcher,
  login as loginApi,
  register as registerApi,
  formatAxiosError,
} from '../services/api';
import useSwr from 'swr';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('khan-user-info');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(localStorage.getItem('khan-access-token'));

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
      localStorage.setItem('khan-access-token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('khan-access-token');
    }

    if (user) {
      localStorage.setItem('khan-user-info', JSON.stringify(user));
    } else {
      localStorage.removeItem('khan-user-info');
    }
  }, [token, user]);

  const check = () => !!user && !!token;

  const login = async (email, password) => {
    try {
      const res = await loginApi(email, password);

      if ((res && res.success) || (res.user && res.token)) {
        const receivedToken =
          res.data?.access_token ?? res.data?.token ?? res.token ?? null;

        const serverUser = res.data?.user ?? res.data?.data ?? res.user ?? null;

        const completeUser = {
          ...(serverUser || {}),
          first_name:
            (serverUser &&
              (serverUser.first_name ?? serverUser.name?.split?.(' ')?.[0])) ??
            '',
          last_name:
            (serverUser &&
              (serverUser.last_name ??
                (() => {
                  if (serverUser && serverUser.name) {
                    const parts = serverUser.name.trim().split(/\s+/);
                    parts.shift();
                    return parts.join(' ');
                  }
                  return '';
                })())) ??
            '',
          phone: serverUser?.phone ?? '',
        };

        setUser(completeUser);
        if (receivedToken) setToken(receivedToken);

        return { success: true };
      }

      return {
        success: false,
        error: res?.error ?? null,
        fieldErrors: res?.fieldErrors ?? {},
      };
    } catch (error) {
      if (error && error.raw) {
        return {
          success: false,
          error: error.message ?? null,
          fieldErrors: error.raw.errors ?? {},
        };
      }
      const apiErr = formatAxiosError(error);
      return {
        success: false,
        error: apiErr.userMessage,
        fieldErrors: apiErr.fieldErrors,
      };
    }
  };

  const register = async (formData) => {
    try {
      if (
        !formData.password ||
        !formData.repeat_password ||
        formData.password !== formData.repeat_password
      ) {
        return {
          success: false,
          error: 'کلمه‌های عبور الزامی است و باید یکسان باشند',
        };
      }

      const nameFromFields =
        `${(formData.first_name ?? '').trim()} ${(formData.last_name ?? '').trim()}`.trim();
      const name = (formData.name ?? '').trim() || nameFromFields;

      // Validation: همه فیلدها اجباری
      if (!name) {
        return { success: false, error: 'نام و نام خانوادگی الزامی است' };
      }
      if (!formData.email || typeof formData.email !== 'string') {
        return { success: false, error: 'ایمیل الزامی است' };
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        return { success: false, error: 'ایمیل نامعتبر است' };
      }
      if (!formData.password || formData.password.length < 8) {
        return { success: false, error: 'رمز عبور باید حداقل ۸ کاراکتر باشد' };
      }
      if (!formData.phone || !String(formData.phone).trim()) {
        return { success: false, error: 'شماره تلفن الزامی است' };
      }

      const payload = {
        name,
        email: formData.email.trim(),
        password: formData.password,
        password_confirmation: formData.repeat_password,
        phone: String(formData.phone).trim(),
      };

      const res = await registerApi(payload);

      if (res && res.success) {
        const receivedToken = res.data?.access_token ?? res.data?.token ?? null;
        const serverUser = res.data?.user ?? res.data?.data ?? null;

        let first_name = '';
        let last_name = '';

        const serverName = serverUser?.name ?? name;
        const parts = serverName.trim().split(/\s+/);
        first_name = parts.shift() || '';
        last_name = parts.join(' ') || '';

        const completeUser = {
          ...(serverUser || {}),
          first_name,
          last_name,
          phone: serverUser?.phone ?? payload.phone,
        };

        setUser(completeUser);
        if (receivedToken) setToken(receivedToken);

        return { success: true };
      }

      return {
        success: false,
        error: res?.error ?? 'خطا در ثبت نام',
        fieldErrors: res?.fieldErrors ?? {},
      };
    } catch (error) {
      if (error && error.raw) {
        return {
          success: false,
          error: error.message ?? null,
          fieldErrors: error.raw.errors ?? {},
        };
      }
      const apiErr = formatAxiosError(error);
      return {
        success: false,
        error: apiErr.userMessage,
        fieldErrors: apiErr.fieldErrors,
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('khan-user-info');
    localStorage.removeItem('khan-access-token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const authorize = (userType) => user && user.user_type === userType;

  const updateUser = (updates) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updates };
      localStorage.setItem('khan-user-info', JSON.stringify(newUser));
      return newUser;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        setToken,
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
