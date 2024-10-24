import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface AuthContextType {
    token: string | null;
    user: any | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [user, setUser] = useState<any | null>(null);

    useEffect(() => {
        if (token) {
            // Fetch user data when token is available
            fetchUserData();
        }
    }, [token]);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
            logout()
        }
    };

    const login = async (username: string, password: string) => {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        let body = formData.toString(); // Encode the form data
        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // Update headers for form data
            },
        };

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, body, config); // Pass headers as config
         
            const { access_token } = response.data;
         
            setToken(access_token);
            localStorage.setItem('token', access_token)
        } catch (error) {
           
            throw error;
        }
    };


    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const value = {
        token,
        user,
        login,
        logout,
        isAuthenticated: !!token
    };



    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};