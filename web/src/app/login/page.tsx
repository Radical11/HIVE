"use client";

import { motion } from "framer-motion";
import { Zap, Mail, Lock, ArrowRight, Github } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle, signInWithGithub } from "@/lib/firebase";
import { apiPost } from "@/lib/api";

function GoogleIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84Z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" fill="#EA4335" />
        </svg>
    );
}

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleGoogleSignIn() {
        setLoading(true);
        setError("");
        try {
            await signInWithGoogle();
            router.push("/feed");
        } catch (err: any) {
            setError(err.message || "Google sign-in failed");
        } finally {
            setLoading(false);
        }
    }

    async function handleGithubSignIn() {
        setLoading(true);
        setError("");
        try {
            const { result, githubAccessToken } = await signInWithGithub();
            // Auto-link GitHub profile if we got an access token
            if (githubAccessToken) {
                const ghUsername = result.user.providerData.find(
                    (p) => p.providerId === "github.com"
                )?.uid;
                if (ghUsername) {
                    try {
                        await apiPost("/api/github/link/", {
                            username: ghUsername,
                            access_token: githubAccessToken,
                        });
                    } catch {
                        // Non-blocking: profile linking can fail silently
                    }
                }
            }
            router.push("/feed");
        } catch (err: any) {
            setError(err.message || "GitHub sign-in failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
            style={{ background: "var(--hive-bg-primary)" }}
        >
            {/* Ambient glow */}
            <div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-15 blur-[100px] pointer-events-none"
                style={{ background: "var(--hive-gradient-primary)" }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-card p-8 md:p-10 w-full max-w-md relative z-10"
            >
                {/* Logo */}
                <div className="flex items-center gap-2 mb-8">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: "var(--hive-gradient-primary)" }}
                    >
                        <Zap className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold gradient-text">HIVE</span>
                </div>

                <h1 className="text-2xl font-bold mb-2">Welcome back, builder</h1>
                <p className="text-sm mb-8" style={{ color: "var(--hive-text-secondary)" }}>
                    Your streak is waiting. Log in to continue.
                </p>

                {error && (
                    <div className="mb-4 px-4 py-2 rounded-lg text-xs" style={{ background: "rgba(239,68,68,0.1)", color: "var(--hive-accent-danger)", border: "1px solid rgba(239,68,68,0.2)" }}>
                        {error}
                    </div>
                )}

                <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                    {/* Email */}
                    <div>
                        <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--hive-text-secondary)" }}>
                            Email
                        </label>
                        <div
                            className="flex items-center gap-3 px-4 py-3 rounded-xl"
                            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--hive-border)" }}
                        >
                            <Mail className="w-4 h-4" style={{ color: "var(--hive-text-muted)" }} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@domain.com"
                                className="flex-1 bg-transparent outline-none text-sm"
                                style={{ color: "var(--hive-text-primary)" }}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--hive-text-secondary)" }}>
                            Password
                        </label>
                        <div
                            className="flex items-center gap-3 px-4 py-3 rounded-xl"
                            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--hive-border)" }}
                        >
                            <Lock className="w-4 h-4" style={{ color: "var(--hive-text-muted)" }} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="flex-1 bg-transparent outline-none text-sm"
                                style={{ color: "var(--hive-text-primary)" }}
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                        style={{ background: "var(--hive-gradient-primary)", boxShadow: "var(--hive-glow-cyan)" }}
                    >
                        Launch Console <ArrowRight className="w-4 h-4" />
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-2">
                        <div className="flex-1 h-px" style={{ background: "var(--hive-border)" }} />
                        <span className="text-xs" style={{ color: "var(--hive-text-muted)" }}>or</span>
                        <div className="flex-1 h-px" style={{ background: "var(--hive-border)" }} />
                    </div>

                    {/* Google OAuth */}
                    <button
                        type="button"
                        disabled={loading}
                        onClick={handleGoogleSignIn}
                        className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid var(--hive-border)", color: "var(--hive-text-primary)" }}
                    >
                        <GoogleIcon className="w-4 h-4" /> Continue with Google
                    </button>

                    {/* GitHub OAuth */}
                    <button
                        type="button"
                        disabled={loading}
                        onClick={handleGithubSignIn}
                        className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--hive-border)", color: "var(--hive-text-primary)" }}
                    >
                        <Github className="w-4 h-4" /> Continue with GitHub
                    </button>
                </form>

                <p className="text-sm text-center mt-8" style={{ color: "var(--hive-text-muted)" }}>
                    New to the hive?{" "}
                    <Link href="/register" className="font-medium" style={{ color: "var(--hive-accent-primary)" }}>
                        Create your profile
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
