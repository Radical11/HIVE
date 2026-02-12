"use client";

import { motion } from "framer-motion";
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
} from "lucide-react";
import Link from "next/link";

/* === MOCK DATA === */
const challenges = [
    { id: "1", title: "Binary Tree Width", difficulty: "HARD", points: 500, solves: 234, timeLimit: "45 min" },
    { id: "2", title: "Optimal Cache Eviction", difficulty: "MEDIUM", points: 300, solves: 567, timeLimit: "30 min" },
    { id: "3", title: "Rate Limiter Design", difficulty: "HARD", points: 600, solves: 123, timeLimit: "60 min" },
    { id: "4", title: "Reverse Linked List II", difficulty: "EASY", points: 100, solves: 2341, timeLimit: "15 min" },
    { id: "5", title: "Distributed Lock Manager", difficulty: "HARD", points: 800, solves: 45, timeLimit: "90 min" },
];

const leaderboard = [
    { rank: 1, username: "algo_queen", elo: 2847, streak: 234, solves: 1892 },
    { rank: 2, username: "binary_wizard", elo: 2791, streak: 189, solves: 1654 },
    { rank: 3, username: "dp_master", elo: 2688, streak: 156, solves: 1543 },
    { rank: 4, username: "graph_ninja", elo: 2634, streak: 142, solves: 1432 },
    { rank: 5, username: "bit_flipper", elo: 2567, streak: 98, solves: 1321 },
];

const leagues = [
    { name: "Algo Sprint", members: 3200, color: "var(--hive-accent-primary)", icon: <Swords className="w-5 h-5" /> },
    { name: "System Design", members: 2100, color: "var(--hive-accent-secondary)", icon: <Code2 className="w-5 h-5" /> },
    { name: "Bug Bounty Hunters", members: 890, color: "var(--hive-accent-danger)", icon: <Trophy className="w-5 h-5" /> },
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
                            Prove your craft. Climb the ranks. Earn your place among the best.
                        </p>
                    </motion.div>

                    {/* Leagues */}
                    <div className="grid md:grid-cols-3 gap-4">
                        {leagues.map((l, i) => (
                            <motion.div
                                key={l.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card p-5 hover:scale-[1.02] transition-transform cursor-pointer"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `color-mix(in srgb, ${l.color} 15%, transparent)`, color: l.color }}>
                                        {l.icon}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-sm">{l.name}</div>
                                        <div className="text-xs" style={{ color: "var(--hive-text-muted)" }}>{l.members.toLocaleString()} members</div>
                                    </div>
                                </div>
                                <button className="w-full py-2 rounded-lg text-xs font-medium transition-colors" style={{ background: `color-mix(in srgb, ${l.color} 10%, transparent)`, color: l.color, border: `1px solid color-mix(in srgb, ${l.color} 20%, transparent)` }}>
                                    Join League
                                </button>
                            </motion.div>
                        ))}
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
                                <Crown className="w-5 h-5" style={{ color: "#FFD700" }} /> Leaderboard
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
                                            <div className="text-xs flex items-center gap-2" style={{ color: "var(--hive-text-muted)" }}>
                                                <span>{p.solves} solved</span>
                                                <Flame className="w-3 h-3" style={{ color: "var(--hive-accent-fire)" }} />
                                                <span>{p.streak}d</span>
                                            </div>
                                        </div>
                                        <div className="text-sm font-bold" style={{ color: "var(--hive-accent-warning)" }}>{p.elo}</div>
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
