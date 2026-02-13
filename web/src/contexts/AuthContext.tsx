"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { auth, onAuthStateChanged, type User } from "@/lib/firebase";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    token: string | null;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    token: null,
    logout: async () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                const idToken = await firebaseUser.getIdToken();
                setToken(idToken);
            } else {
                setToken(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const logout = async () => {
        try {
            await auth.signOut();
            setToken(null);
            setUser(null);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, token, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
