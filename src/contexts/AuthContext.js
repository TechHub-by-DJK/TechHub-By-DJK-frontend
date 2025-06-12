import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/api';

const AuthContext = createContext();

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
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('jwt');
            if (token) {
                ApiService.setToken(token);
                const userData = await ApiService.getUserProfile();
                setUser(userData);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('jwt');
            ApiService.setToken(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            const response = await ApiService.login(credentials);
            const { jwt, role } = response;
            
            ApiService.setToken(jwt);
            const userData = await ApiService.getUserProfile();
            setUser({ ...userData, role });
            setIsAuthenticated(true);
            
            return { success: true, user: userData, role };
        } catch (error) {
            console.error('Login failed:', error);
            return { success: false, error: error.message };
        }
    };

    const register = async (userData) => {
        try {
            const response = await ApiService.register(userData);
            const { jwt, role } = response;
            
            ApiService.setToken(jwt);
            const userProfile = await ApiService.getUserProfile();
            setUser({ ...userProfile, role });
            setIsAuthenticated(true);
            
            return { success: true, user: userProfile, role };
        } catch (error) {
            console.error('Registration failed:', error);
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('jwt');
        ApiService.setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        checkAuthStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
