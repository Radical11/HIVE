"use client";

import { motion } from "framer-motion";
import { Zap, Mail, Lock, ArrowRight, Github } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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

                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="space-y-5"
                >
                    {/* Email */}
                    <div>
                        <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--hive-text-secondary)" }}>
                            Email
                        </label>
                        <div
                            className="flex items-center gap-3 px-4 py-3 rounded-xl"
                            style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid var(--hive-border)",
                            }}
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
                            style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid var(--hive-border)",
                            }}
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
                        style={{
                            background: "var(--hive-gradient-primary)",
                            boxShadow: "var(--hive-glow-cyan)",
                        }}
                    >
                        Launch Console <ArrowRight className="w-4 h-4" />
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-2">
                        <div className="flex-1 h-px" style={{ background: "var(--hive-border)" }} />
                        <span className="text-xs" style={{ color: "var(--hive-text-muted)" }}>or</span>
                        <div className="flex-1 h-px" style={{ background: "var(--hive-border)" }} />
                    </div>

                    {/* GitHub OAuth */}
                    <button
                        type="button"
                        className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                        style={{
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid var(--hive-border)",
                            color: "var(--hive-text-primary)",
                        }}
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
