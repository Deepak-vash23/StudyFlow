import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored user on mount
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Failed to parse stored user", error);
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                return { success: false, error: data.message || 'Login failed' };
            }

            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
            return { success: true };
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, error: 'Network error. Please try again.' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const register = async (name, email, password) => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                return { success: false, error: data.message || 'Registration failed' };
            }

            // Optional: Auto-login after registration
            // setUser(data.user);
            // localStorage.setItem('user', JSON.stringify(data.user));

            return { success: true };
        } catch (error) {
            console.error("Registration error:", error);
            return { success: false, error: 'Network error. Please try again.' };
        }
    };

    const value = {
        user,
        login,
        logout,
        register,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
