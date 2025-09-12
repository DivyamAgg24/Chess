import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User } from "../types/user";
import axios from "axios"


export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: () => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode
}
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const checkAuth = async () => {
        try {
            const res = await axios.get<User>(`${import.meta.env.VITE_API_URL}/auth/me`, {
                withCredentials: true, // important for cookies
            });
            setUser(res.data);
        }
        catch (err) {
            setUser(null);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async () => {
        window.location.href = `${import.meta.env.VITE_HTTP_BACKEND_URL}/auth/google`
        console.log(window.location.href)
    }

    const logout = () => {
        setUser(null);
        window.location.href = `${import.meta.env.VITE_HTTP_BACKEND_URL}/auth/logout`;
    };

    const value: AuthContextType = {
        user,
        loading,
        login,
        logout,
        refreshUser: checkAuth,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}