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
    }, []);    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('jwt');
            const savedRole = localStorage.getItem('userRole');
            
            if (token) {
                ApiService.setToken(token);
                const userData = await ApiService.getUserProfile();
                
                let finalRole = null;
                
                // Ensure we have a consistent role format
                // Priority: localStorage > backend role
                if (savedRole) {
                    console.log('Using role from localStorage:', savedRole);
                    finalRole = savedRole;
                } else if (userData.role !== undefined) {
                    // Map numeric role to string role if needed
                    const stringRole = typeof userData.role === 'number' 
                        ? (userData.role === 1 ? 'SHOP_OWNER' : userData.role === 0 ? 'ROLE_CUSTOMER' : userData.role === 2 ? 'ADMIN' : userData.role)
                        : userData.role;
                    
                    console.log('Using role from backend:', userData.role, '→', stringRole);
                    // Save it for future reference
                    localStorage.setItem('userRole', stringRole);
                    finalRole = stringRole;
                } else {
                    console.log('No role found in userData or localStorage');
                    finalRole = 'ROLE_CUSTOMER'; // Default to customer if no role found
                    localStorage.setItem('userRole', finalRole);
                }
                
                // Replace user's role with the determined role
                userData.role = finalRole;
                setUser(userData);
                setIsAuthenticated(true);
                
                // Debug info
                console.log('User authenticated with final role:', userData.role);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('jwt');
            localStorage.removeItem('userRole');
            ApiService.setToken(null);
        } finally {
            setLoading(false);
        }
    };const login = async (credentials) => {
        try {
            const response = await ApiService.login(credentials);
            const { jwt, role } = response;
            
            // Map numeric role to string role if needed
            const stringRole = typeof role === 'number' 
                ? (role === 1 ? 'SHOP_OWNER' : role === 0 ? 'ROLE_CUSTOMER' : role)
                : role;
            
            // Save both JWT and role to localStorage
            ApiService.setToken(jwt);
            localStorage.setItem('userRole', stringRole);
            
            const userData = await ApiService.getUserProfile();
            setUser({ ...userData, role: stringRole });
            setIsAuthenticated(true);
            
            console.log('User logged in with role:', stringRole);
            
            return { success: true, user: userData, role: stringRole };
        } catch (error) {
            console.error('Login failed:', error);
            return { success: false, error: error.message };
        }
    };    const register = async (userData) => {
        try {
            const response = await ApiService.register(userData);
            const { jwt, role } = response;
            
            // Map numeric role to string role if needed
            const stringRole = typeof role === 'number' 
                ? (role === 1 ? 'SHOP_OWNER' : role === 0 ? 'ROLE_CUSTOMER' : role)
                : role;
                
            // Save both JWT and role to localStorage
            ApiService.setToken(jwt);
            localStorage.setItem('userRole', stringRole);
            
            const userProfile = await ApiService.getUserProfile();
            setUser({ ...userProfile, role: stringRole });
            setIsAuthenticated(true);
            
            console.log('User registered with role:', stringRole);
            
            return { success: true, user: userProfile, role: stringRole };
        } catch (error) {
            console.error('Registration failed:', error);
            return { success: false, error: error.message };
        }
    };const logout = () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('userRole');
        ApiService.setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        console.log('User logged out');
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
