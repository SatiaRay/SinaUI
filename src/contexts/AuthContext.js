import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { login as loginApi } from "../services/api";

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem('token');
    });

    useEffect(() => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        user ? localStorage.setItem('user', JSON.stringify(user)) : localStorage.clear('user')
        token ? localStorage.setItem('token', token) : localStorage.clear('token')
    }, [token, user])

    const login = async (email, passwd) => {
        const { user, access_token } = await loginApi(email, passwd)

        if (user && access_token) {
            setUser(user)
            setToken(access_token)
        }
    }

    const logout = () => {
        setUser(null)
        setToken(null)
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);