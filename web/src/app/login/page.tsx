"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { loginWithGoogle, loginWithGitHub, loginWithEmail } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            await loginWithEmail(email, password);
            router.push("/feed");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Login failed";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogle = async () => {
        setError("");
        setIsLoading(true);
        try {
            await loginWithGoogle();
            router.push("/feed");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Google login failed";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGitHub = () => {
        loginWithGitHub();
    };

    const handleDemo = () => {
        router.push("/feed");
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6"
            style={{ background: "radial-gradient(ellipse at center, #111113 0%, #050505 70%)" }}
        >
            <div className="card w-full max-w-sm p-8">
                <div className="mb-8">
                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-6">
                        <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
                            <circle cx="50" cy="30" r="12" fill="#4ecdc4" />
                            <circle cx="30" cy="42" r="12" fill="#4ecdc4" opacity="0.85" />
                            <circle cx="70" cy="42" r="12" fill="#4ecdc4" opacity="0.85" />
                            <circle cx="50" cy="54" r="12" fill="#4ecdc4" opacity="0.7" />
                            <circle cx="30" cy="66" r="12" fill="#4ecdc4" opacity="0.7" />
                            <circle cx="70" cy="66" r="12" fill="#4ecdc4" opacity="0.7" />
                            <circle cx="50" cy="78" r="12" fill="#4ecdc4" opacity="0.55" />
                        </svg>
                        <span className="text-lg font-extrabold text-accent tracking-tight">HIVE</span>
                    </div>
                    <h1 className="text-xl font-semibold text-text-primary tracking-tight">
                        Welcome back to Hive.
                    </h1>
                    <p className="text-sm text-text-muted mt-1.5">
                        Sign in to your account to continue.
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-xs">
                        {error}
                    </div>
                )}

                {/* Demo Mode */}
                <button
                    onClick={handleDemo}
                    className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 bg-accent text-[#050505] rounded-lg font-bold text-sm hover:bg-accent-hover transition-colors mb-3"
                >
                    🚀 Enter Demo Mode
                </button>

                {/* GitHub */}
                <button
                    onClick={handleGitHub}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 bg-[#24292e] text-white rounded-lg font-medium text-sm hover:bg-[#2f363d] transition-colors mb-3 disabled:opacity-50"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                    Continue with GitHub
                </button>

                {/* Google */}
                <button
                    onClick={handleGoogle}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 bg-white text-zinc-900 rounded-lg font-medium text-sm hover:scale-[1.01] active:scale-[0.99] transition-transform duration-150 disabled:opacity-50"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                </button>

                <div className="flex items-center gap-3 my-6">
                    <div className="flex-1 h-px bg-border-primary" />
                    <span className="text-xs text-text-faint">or</span>
                    <div className="flex-1 h-px bg-border-primary" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" autoComplete="email" />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" autoComplete="current-password" />
                    <button type="submit" disabled={isLoading} className="btn-primary w-full py-2.5 disabled:opacity-50">
                        {isLoading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <p className="text-xs text-text-faint text-center mt-6">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-accent hover:underline">Create one</Link>
                </p>
            </div>
        </div>
    );
}
