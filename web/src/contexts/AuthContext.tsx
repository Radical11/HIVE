"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
    onAuthStateChanged,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    User as FirebaseUser,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { getMe, exchangeGitHubCode, ApiUser } from "@/lib/api";

interface AuthContextType {
    firebaseUser: FirebaseUser | null;
    hiveUser: ApiUser | null;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    loginWithGitHub: () => void;
    loginWithEmail: (email: string, password: string) => Promise<void>;
    registerWithEmail: (email: string, password: string) => Promise<void>;
    handleGitHubCallback: (code: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [hiveUser, setHiveUser] = useState<ApiUser | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch HIVE user profile once Firebase auth is confirmed
    const fetchHiveUser = useCallback(async () => {
        try {
            const user = await getMe();
            setHiveUser(user);
        } catch {
            // User not found on backend yet (will be JIT created on next request)
            setHiveUser(null);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setFirebaseUser(user);
            if (user) {
                await fetchHiveUser();
            } else {
                setHiveUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [fetchHiveUser]);

    const loginWithGoogle = async () => {
        await signInWithPopup(auth, googleProvider);
        // onAuthStateChanged will handle the rest
    };

    const loginWithGitHub = () => {
        const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
        const redirectUri = `${window.location.origin}/api/auth/callback/github`;
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`;
        window.location.href = githubAuthUrl;
    };

    const handleGitHubCallback = async (code: string) => {
        const result = await exchangeGitHubCode(code);
        const { firebaseEmail, firebasePassword } = result as {
            firebaseEmail?: string;
            firebasePassword?: string;
        };

        if (firebaseEmail && firebasePassword) {
            // Sign in to Firebase using the credentials created by the backend
            await signInWithEmailAndPassword(auth, firebaseEmail, firebasePassword);
            // Force refresh of HIVE user to get the new connection status immediately
            await fetchHiveUser();
        }
    };

    const loginWithEmail = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const registerWithEmail = async (email: string, password: string) => {
        await createUserWithEmailAndPassword(auth, email, password);
    };

    const logout = async () => {
        await signOut(auth);
        setHiveUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                firebaseUser,
                hiveUser,
                loading,
                loginWithGoogle,
                loginWithGitHub,
                loginWithEmail,
                registerWithEmail,
                handleGitHubCallback,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
