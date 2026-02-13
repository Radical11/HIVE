"use client";

import { useEffect, useState } from "react";
import { Users, Search, Code, Github, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { apiGet } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface UserProfile {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    profile: {
        headline: string;
        avatar_url: string;
        current_streak: number;
        total_xp: number;
        elo_rating: number;
        github_handle: string;
    }
}

import { Sidebar } from "@/components/Sidebar";

export default function SquadsPage() {
    const { user, loading: authLoading } = useAuth();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            setLoading(false);
            return;
        }

        async function fetchUsers() {
            try {
                const data: any = await apiGet<UserProfile[]>("/api/users/");
                // Handle pagination if present
                const userList = Array.isArray(data) ? data : (data.results || []);
                setUsers(userList);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, [user, authLoading]);

    const filteredUsers = users.filter(u =>
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.first_name + " " + u.last_name).toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.profile?.headline?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen relative" style={{ background: "var(--hive-bg-primary)" }}>
            <Sidebar />

            <main className="lg:ml-64 p-6 md:p-10">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Find Your Squad</h1>
                        <p style={{ color: "var(--hive-text-secondary)" }}>Connect with builders, form teams, and ship projects.</p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by name, skill, or role..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-1 focus:ring-cyan-500"
                            style={{ background: "var(--hive-bg-secondary)", border: "1px solid var(--hive-border)", color: "white" }}
                        />
                    </div>
                </header>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-64 rounded-xl animate-pulse" style={{ background: "var(--hive-bg-secondary)" }} />
                        ))}
                    </div>
                ) : !user ? (
                    <div className="glass-card p-12 text-center">
                        <Users className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--hive-text-muted)" }} />
                        <h3 className="text-lg font-bold mb-2">Sign in to find your squad</h3>
                        <p className="text-sm mb-6" style={{ color: "var(--hive-text-secondary)" }}>
                            Join the community to connect with other builders.
                        </p>
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
                            style={{ background: "var(--hive-gradient-primary)" }}
                        >
                            Sign In
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredUsers.map((profile, i) => (
                            <motion.div
                                key={profile.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="glass-card p-6 flex flex-col relative group hover:border-[var(--hive-accent-primary)] transition-colors"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
                                            <img
                                                src={profile.profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`}
                                                alt={profile.username}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white">
                                                {profile.first_name ? `${profile.first_name} ${profile.last_name}` : profile.username}
                                            </h3>
                                            <p className="text-xs" style={{ color: "var(--hive-text-secondary)" }}>
                                                {profile.profile?.headline || "Builder @ Hive"}
                                            </p>
                                        </div>
                                    </div>
                                    {profile.profile?.elo_rating > 0 && (
                                        <div className="px-2 py-1 rounded text-xs font-mono font-bold" style={{ background: "rgba(255,215,0,0.1)", color: "#FFD700" }}>
                                            {profile.profile.elo_rating} ELO
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-4 text-xs" style={{ color: "var(--hive-text-muted)" }}>
                                        <div className="flex items-center gap-1">
                                            <Terminal className="w-3 h-3" />
                                            <span>{profile.profile?.total_xp || 0} XP</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Github className="w-3 h-3" />
                                            <span>{profile.profile?.github_handle || "No GitHub"}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className="w-full mt-6 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90 active:scale-95"
                                    style={{ background: "var(--hive-bg-secondary)", border: "1px solid var(--hive-border)", color: "white" }}
                                >
                                    View Profile
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
