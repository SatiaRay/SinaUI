import axios from 'axios';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authEndpoints, formatAxiosError } from '../utils/apis';
import useSwr from 'swr';
import { useGoogleLogin } from '@react-oauth/google';

export const AuthContext = createContext(null);

const USER_KEY = 'khan-user-info';
const TOKEN_KEY = 'khan-access-token';

const extractAuthPayload = (res) => {
  const receivedToken =
    res?.data?.access_token ??
    res?.data?.token ??
    res?.token ??
    res?.access_token ??
    null;

  const serverUser =
    res?.data?.user ??
    res?.data?.data ??
    res?.user ??
    res?.data ??
    null;

  return { receivedToken, serverUser };
};

const buildCompleteUser = (serverUser) => {
  if (!serverUser) return null;

  const fullName = serverUser?.name ? String(serverUser.name).trim() : '';
  const parts = fullName ? fullName.split(/\s+/) : [];

  const firstFromName = parts[0] || '';
  const lastFromName = parts.slice(1).join(' ') || '';

  return {
    ...(serverUser || {}),
    first_name: serverUser.first_name ?? firstFromName ?? '',
    last_name: serverUser.last_name ?? lastFromName ?? '',
    phone: serverUser?.phone ?? '',
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user]);

  useSwr(token ? 'check_authorization' : null, authEndpoints.checkAuthorizationFetcher, {
    onError: () => logout(),
    refreshInterval: 60000,
  });

  const check = () => !!user && !!token;

  const applyAuth = (serverUser, receivedToken) => {
    const completeUser = buildCompleteUser(serverUser);
    if (completeUser) setUser(completeUser);
    if (receivedToken) setToken(receivedToken);
  };

  const googleLoginRunner = useGoogleLogin({
    scope: 'openid email profile',
    onSuccess: async (tokenResponse) => {
      try {
        const { data: profile } = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        setUser({
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          picture: profile.picture,
          first_name: profile.given_name || profile.name?.split?.(' ')?.[0] || '',
          last_name: profile.family_name || '',
          oauth_provider: 'google',
        });

        localStorage.setItem('khan-google-access-token', tokenResponse.access_token);
      } catch (e) {
        console.error('Google userinfo failed:', e);
        throw e;
      }
    },
    onError: () => {
      throw new Error('Google OAuth failed');
    },
  });

  const loginWithGoogle = async () => {
    googleLoginRunner();
  };

  const loginWithGithub = async () => {
    throw new Error('GitHub OAuth needs backend (code exchange). UI is ready.');
  };

  const login = async (email, password) => {
    try {
      const res = await authEndpoints.login(email, password);

      if ((res && res.success) || (res.user && res.token) || res?.data?.access_token) {
        const { receivedToken, serverUser } = extractAuthPayload(res);
        applyAuth(serverUser, receivedToken);
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
      if (!formData.password || !formData.repeat_password || formData.password !== formData.repeat_password) {
        return {
          success: false,
          error: 'کلمه‌های عبور الزامی است و باید یکسان باشند',
        };
      }

      const nameFromFields = `${(formData.first_name ?? '').trim()} ${(formData.last_name ?? '').trim()}`.trim();
      const name = (formData.name ?? '').trim() || nameFromFields;

      if (!name) return { success: false, error: 'نام و نام خانوادگی الزامی است' };
      if (!formData.email || typeof formData.email !== 'string') return { success: false, error: 'ایمیل الزامی است' };
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) return { success: false, error: 'ایمیل نامعتبر است' };
      if (!formData.password || formData.password.length < 8) return { success: false, error: 'رمز عبور باید حداقل ۸ کاراکتر باشد' };
      if (!formData.phone || !String(formData.phone).trim()) return { success: false, error: 'شماره تلفن الزامی است' };

      const payload = {
        name,
        email: formData.email.trim(),
        password: formData.password,
        password_confirmation: formData.repeat_password,
        phone: String(formData.phone).trim(),
      };

      const res = await authEndpoints.register(payload);

      if (res && res.success) {
        const { receivedToken, serverUser } = extractAuthPayload(res);
        applyAuth(serverUser, receivedToken);
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
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('khan-google-access-token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const authorize = (userType) => user && user.user_type === userType;

  const updateUser = (updates) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updates };
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      return newUser;
    });
  };

  const value = useMemo(
    () => ({
      user,
      token,
      setToken,
      check,
      login,
      register,
      logout,
      authorize,
      updateUser,
      loginWithGoogle,
      loginWithGithub,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);