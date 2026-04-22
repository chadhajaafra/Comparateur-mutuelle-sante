import { useState, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from './AuthContext';
import authApi from '../api/authApi';

function getUserFromToken() {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) return null;
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
            localStorage.clear();
            return null;
        }
        return {
            id: decoded.sub,
            email: decoded.email,
            firstName: decoded.firstName,
            role:
                decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
                || decoded.role,
        };
    } catch {
        localStorage.clear();
        return null;
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(getUserFromToken);
    const [loading, setLoading] = useState(false);

    const login = useCallback(async (email, password) => {
        setLoading(true);
        try {
            const { data } = await authApi.login({ email, password });
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            setUser(getUserFromToken());
            return data;
        } finally {
            setLoading(false);
        }
    }, []);

    const register = useCallback(async (formData) => {
        setLoading(true);
        try {
            const { data } = await authApi.register(formData);
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            setUser(getUserFromToken());
            return data;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) await authApi.logout(refreshToken);
        } finally {
            localStorage.clear();
            setUser(null);
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{ user, loading, login, register, logout, isAuthenticated: !!user }}
        >
            {children}
        </AuthContext.Provider>
    );
}