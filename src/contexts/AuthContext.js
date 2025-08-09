import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { checkAuthorizationFetcher, login as loginApi } from "../services/api"; // اضافه کردن registerApi
import useSwr from 'swr'

// import { checkAuthorizationFetcher, login as loginApi, register as registerApi } from

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem('token');
    });

    console.log(axios.defaults.headers.common['Authorization'] ? 'check_authorization' : null);
    
    const {authorization_error} = useSwr(
        (token ? 'check_authorization' : null), 
        checkAuthorizationFetcher,{
            onError: (err, key, config) => {
                logout()
            },
            refreshInterval : 60000
        }
    )

    if(authorization_error)
        console.log(authorization_error);
        
    useEffect(() => {
        console.log(axios.defaults.headers.common['Authorization']);
        
        if(token)
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        else
            delete axios.defaults.headers.common['Authorization']

        user ? localStorage.setItem('user', JSON.stringify(user)) : localStorage.removeItem('user')
        token ? localStorage.setItem('token', token) : localStorage.removeItem('token')
    }, [token, user])

    const check = () => {
        return user && token;
    }

    const login = async (email, passwd) => {
        const { user, access_token } = await loginApi(email, passwd)

        if (user && access_token) {
            setUser(user)
            setToken(access_token)
        }
    }

    //for register
    // const register = async (username, email, phoneNumber, password) => {
    //     try {
    //         const { user, access_token } = await registerApi(
    //             username,
    //             email,
    //             phoneNumber,
    //             password
    //         );
            
    //         if (user && access_token) {
    //             setUser(user);
    //             setToken(access_token);
    //             return { success: true };
    //         }
    //     } catch (error) {
    //         console.error("Registration error:", error);
    //         return { 
    //             success: false, 
    //             error: error.response?.data?.message || "ثبت نام با خطا مواجه شد" 
    //         };
    //     }
    // }

    const logout = () => {
        setUser(null)
        setToken(null)
    }

    const authorize = (userType) => {
        return user && user.user_type == userType
    }

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            check, 
            login, 
            // register,
            logout, 
            authorize 
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);