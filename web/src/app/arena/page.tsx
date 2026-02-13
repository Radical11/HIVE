"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Zap,
    Home,
    Trophy,
    MessageSquare,
    Users,
    User,
    Flame,
    Crown,
    Medal,
    Clock,
    ChevronRight,
    Code2,
    Swords,
    Link2,
    RefreshCw,
    ExternalLink,
    TrendingUp,
    Star,
    Loader2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiPost, apiGet } from "@/lib/api";

/* === CODEFORCES RANK TIERS === */
const cfRankTiers = [
    { name: "Legendary Grandmaster", minRating: 3000, color: "#FF0000", icon: <Crown className="w-5 h-5" /> },
    { name: "International Grandmaster", minRating: 2600, color: "#FF0000", icon: <Star className="w-5 h-5" /> },
    { name: "Grandmaster", minRating: 2400, color: "#FF0000", icon: <Trophy className="w-5 h-5" /> },
    { name: "International Master", minRating: 2300, color: "#FF8C00", icon: <Medal className="w-5 h-5" /> },
    { name: "Master", minRating: 2100, color: "#FF8C00", icon: <Medal className="w-5 h-5" /> },
    { name: "Candidate Master", minRating: 1900, color: "#AA00AA", icon: <Swords className="w-5 h-5" /> },
    { name: "Expert", minRating: 1600, color: "#0000FF", icon: <Code2 className="w-5 h-5" /> },
    { name: "Specialist", minRating: 1400, color: "#03A89E", icon: <TrendingUp className="w-5 h-5" /> },
    { name: "Pupil", minRating: 1200, color: "#008000", icon: <Users className="w-5 h-5" /> },
    { name: "Newbie", minRating: 0, color: "#808080", icon: <User className="w-5 h-5" /> },
];

/* === MOCK CHALLENGE DATA (internal challenges — coming soon) === */
const challenges = [
    { id: "1", title: "Binary Tree Width", difficulty: "HARD", points: 500, solves: 234, timeLimit: "45 min" },
    { id: "2", title: "Optimal Cache Eviction", difficulty: "MEDIUM", points: 300, solves: 567, timeLimit: "30 min" },
    { id: "3", title: "Rate Limiter Design", difficulty: "HARD", points: 600, solves: 123, timeLimit: "60 min" },
    { id: "4", title: "Reverse Linked List II", difficulty: "EASY", points: 100, solves: 2341, timeLimit: "15 min" },
    { id: "5", title: "Distributed Lock Manager", difficulty: "HARD", points: 800, solves: 45, timeLimit: "90 min" },
];

const leaderboard = [
    { rank: 1, username: "tourist", elo: 3825, cfRank: "Legendary Grandmaster", color: "#FF0000" },
    { rank: 2, username: "jiangly", elo: 3697, cfRank: "Legendary Grandmaster", color: "#FF0000" },
    { rank: 3, username: "ksun48", elo: 3474, cfRank: "Legendary Grandmaster", color: "#FF0000" },
    { rank: 4, username: "Benq", elo: 3412, cfRank: "Legendary Grandmaster", color: "#FF0000" },
    { rank: 5, username: "ecnerwala", elo: 3298, cfRank: "International Grandmaster", color: "#FF0000" },
];

const difficultyColors: Record<string, string> = {
    EASY: "var(--hive-accent-success)",
    MEDIUM: "var(--hive-accent-warning)",
    HARD: "var(--hive-accent-danger)",
};

const rankIcons = [
    <Crown key="1" className="w-5 h-5" style={{ color: "#FFD700" }} />,
    <Medal key="2" className="w-5 h-5" style={{ color: "#C0C0C0" }} />,
    <Medal key="3" className="w-5 h-5" style={{ color: "#CD7F32" }} />,
];

/* === SIDEBAR === */
function Sidebar() {
    const navItems = [
        { icon: <Home className="w-5 h-5" />, label: "Feed", href: "/feed", active: false },
        { icon: <Trophy className="w-5 h-5" />, label: "Arena", href: "/arena", active: true },
        { icon: <MessageSquare className="w-5 h-5" />, label: "Forum", href: "/forum", active: false },
        { icon: <Users className="w-5 h-5" />, label: "Squads", href: "/squads", active: false },
        { icon: <User className="w-5 h-5" />, label: "Profile", href: "/profile", active: false },
    ];

    return (
        <aside className="fixed left-0 top-0 h-full w-64 p-6 hidden lg:flex flex-col" style={{ borderRight: "1px solid var(--hive-border)", background: "var(--hive-bg-secondary)" }}>
            <Link href="/" className="flex items-center gap-2 mb-10">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--hive-gradient-primary)" }}>
                    <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">HIVE</span>
            </Link>
            <nav className="flex-1 space-y-1">
                {navItems.map((item) => (
                    <Link key={item.label} href={item.href} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all" style={{ background: item.active ? "rgba(0,212,255,0.1)" : "transparent", color: item.active ? "var(--hive-accent-primary)" : "var(--hive-text-secondary)" }}>
                        {item.icon} {item.label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}

/* === LINK CODEFORCES CARD === */
function LinkCodeforcesCard() {
    const { user } = useAuth();
    const [handle, setHandle] = useState("");
    const [loading, setLoading] = useState(false);
    const [linked, setLinked] = useState<any>(null);
    const [error, setError] = useState("");

    async function handleLink() {
        if (!handle.trim()) return;
        setLoading(true);
        setError("");
        try {
            const data = await apiPost("/api/arena/link-codeforces/", { handle: handle.trim() });
            setLinked(data);
        } catch (err: any) {
            setError(err.message || "Failed to link Codeforces handle");
        } finally {
            setLoading(false);
        }
    }

    async function handleSync() {
        setLoading(true);
        try {
            const data = await apiPost("/api/arena/cf-sync/");
            setLinked(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (!user) {
        return (
            <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,212,255,0.1)", color: "var(--hive-accent-primary)" }}>
                        <Link2 className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm">Link Codeforces</h3>
                        <p className="text-xs" style={{ color: "var(--hive-text-muted)" }}>Sign in to link your CF account</p>
                    </div>
                </div>
                <Link href="/login" className="w-full py-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors" style={{ background: "rgba(0,212,255,0.1)", color: "var(--hive-accent-primary)", border: "1px solid rgba(0,212,255,0.2)" }}>
                    Sign In to Continue
                </Link>
            </div>
        );
    }

    if (linked) {
        const rankTier = cfRankTiers.find(t => (linked.cf_rating || 0) >= t.minRating) || cfRankTiers[cfRankTiers.length - 1];
        return (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${rankTier.color}20`, color: rankTier.color }}>
                            {rankTier.icon}
                        </div>
                        <div>
                            <div className="font-semibold text-sm flex items-center gap-2">
                                {linked.cf_handle}
                                <a href={`https://codeforces.com/profile/${linked.cf_handle}`} target="_blank" rel="noreferrer">
                                    <ExternalLink className="w-3 h-3" style={{ color: "var(--hive-text-muted)" }} />
                                </a>
                            </div>
                            <div className="text-xs font-medium" style={{ color: rankTier.color }}>{linked.cf_rank}</div>
                        </div>
                    </div>
                    <button onClick={handleSync} disabled={loading} className="p-2 rounded-lg transition-colors hover:bg-white/5" style={{ color: "var(--hive-text-muted)" }}>
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                        <div className="text-lg font-bold" style={{ color: rankTier.color }}>{linked.cf_rating}</div>
                        <div className="text-xs" style={{ color: "var(--hive-text-muted)" }}>Rating</div>
                    </div>
                    <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                        <div className="text-lg font-bold" style={{ color: "var(--hive-accent-warning)" }}>{linked.cf_max_rating}</div>
                        <div className="text-xs" style={{ color: "var(--hive-text-muted)" }}>Max Rating</div>
                    </div>
                    <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                        <div className="text-lg font-bold" style={{ color: "var(--hive-accent-success)" }}>{linked.combined_score}</div>
                        <div className="text-xs" style={{ color: "var(--hive-text-muted)" }}>Hive Score</div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,212,255,0.1)", color: "var(--hive-accent-primary)" }}>
                    <Link2 className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-semibold text-sm">Link Codeforces</h3>
                    <p className="text-xs" style={{ color: "var(--hive-text-muted)" }}>Connect your CF handle to track your rating</p>
                </div>
            </div>

            {error && (
                <div className="mb-3 px-3 py-2 rounded-lg text-xs" style={{ background: "rgba(239,68,68,0.1)", color: "var(--hive-accent-danger)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    {error}
                </div>
            )}

            <div className="flex gap-2">
                <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="e.g. tourist"
                    className="flex-1 px-4 py-2.5 rounded-lg text-sm bg-transparent outline-none"
                    style={{ border: "1px solid var(--hive-border)", color: "var(--hive-text-primary)" }}
                    onKeyDown={(e) => e.key === "Enter" && handleLink()}
                />
                <button
                    onClick={handleLink}
                    disabled={loading || !handle.trim()}
                    className="px-5 py-2.5 rounded-lg text-xs font-semibold text-white flex items-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
                    style={{ background: "var(--hive-gradient-primary)" }}
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
                    Link
                </button>
            </div>
        </div>
    );
}

/* === MAIN PAGE === */
export default function ArenaPage() {
    return (
        <div className="min-h-screen" style={{ background: "var(--hive-bg-primary)" }}>
            <Sidebar />
            <main className="lg:ml-64 min-h-screen p-6">
                <div className="max-w-5xl mx-auto space-y-8">

                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-3xl font-bold mb-2">
                            The <span className="gradient-text">Arena</span>
                        </h1>
                        <p className="text-sm" style={{ color: "var(--hive-text-secondary)" }}>
                            Prove your craft. Climb the Codeforces ranks. Earn your place among the best.
                        </p>
                    </motion.div>

                    {/* Link CF + Rank Tiers */}
                    <div className="grid lg:grid-cols-2 gap-6">
                        <LinkCodeforcesCard />

                        {/* Rank Tiers Legend */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-card p-6"
                        >
                            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" style={{ color: "var(--hive-accent-primary)" }} />
                                Codeforces Rank Tiers
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                {cfRankTiers.map((tier) => (
                                    <div key={tier.name} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs" style={{ background: `${tier.color}08` }}>
                                        <div className="w-2 h-2 rounded-full" style={{ background: tier.color }} />
                                        <span className="font-medium" style={{ color: tier.color }}>{tier.name}</span>
                                        <span className="ml-auto" style={{ color: "var(--hive-text-muted)" }}>{tier.minRating}+</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    <div className="grid lg:grid-cols-5 gap-6">
                        {/* Challenges */}
                        <div className="lg:col-span-3 space-y-4">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Code2 className="w-5 h-5" style={{ color: "var(--hive-accent-primary)" }} /> Active Challenges
                            </h2>
                            {challenges.map((c, i) => (
                                <motion.div
                                    key={c.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="glass-card p-5 flex items-center justify-between hover:scale-[1.01] transition-transform cursor-pointer"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-semibold text-sm">{c.title}</h3>
                                            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `color-mix(in srgb, ${difficultyColors[c.difficulty]} 15%, transparent)`, color: difficultyColors[c.difficulty] }}>
                                                {c.difficulty}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs flex items-center gap-1" style={{ color: "var(--hive-text-muted)" }}>
                                                <Trophy className="w-3 h-3" /> {c.points} pts
                                            </span>
                                            <span className="text-xs flex items-center gap-1" style={{ color: "var(--hive-text-muted)" }}>
                                                <Users className="w-3 h-3" /> {c.solves} solves
                                            </span>
                                            <span className="text-xs flex items-center gap-1" style={{ color: "var(--hive-text-muted)" }}>
                                                <Clock className="w-3 h-3" /> {c.timeLimit}
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5" style={{ color: "var(--hive-text-muted)" }} />
                                </motion.div>
                            ))}
                        </div>

                        {/* Leaderboard */}
                        <div className="lg:col-span-2">
                            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                                <Crown className="w-5 h-5" style={{ color: "#FFD700" }} /> Global Leaderboard
                            </h2>
                            <div className="glass-card p-5 space-y-4">
                                {leaderboard.map((p, i) => (
                                    <motion.div
                                        key={p.username}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="w-8 text-center">
                                            {i < 3 ? rankIcons[i] : <span className="text-sm font-bold" style={{ color: "var(--hive-text-muted)" }}>#{p.rank}</span>}
                                        </div>
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "var(--hive-bg-elevated)", color: "var(--hive-text-primary)" }}>
                                            {p.username[0].toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium">{p.username}</div>
                                            <div className="text-xs" style={{ color: p.color }}>{p.cfRank}</div>
                                        </div>
                                        <div className="text-sm font-bold" style={{ color: p.color }}>{p.elo}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
