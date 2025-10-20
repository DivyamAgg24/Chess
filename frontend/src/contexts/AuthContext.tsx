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
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        console.log(user)
    }, [user])
    const checkAuth = async () => {
        try {
            setLoading(true)
            const res = await axios.get<User>(`/api/auth/me`, {
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

    const logout = async () => {
        try {
            await axios.post(
                `${import.meta.env.VITE_HTTP_BACKEND_URL}/auth/logout`,
                {},
                { withCredentials: true }
            );
            setUser(null);
            window.location.href = "/"; // redirect to homepage
        } catch (err) {
            console.error("Logout failed:", err);
        }
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