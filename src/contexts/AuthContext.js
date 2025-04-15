import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/axios';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const response = await axios.get('/api/guard-logs');
                // If we can access a protected endpoint, we're authenticated
                setUser(JSON.parse(localStorage.getItem('user')));
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
        }
        setLoading(false);
    };

    const login = async (credentials) => {
        const response = await axios.post('/api/login', credentials);
        const { token, user: userData } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
        return response;
    };

    const logout = async () => {
        try {
            await axios.post('/api/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext; 