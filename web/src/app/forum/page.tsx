"use client";

import { motion } from "framer-motion";
import {
    Zap,
    Home,
    Trophy,
    MessageSquare,
    Users,
    User,
    Hash,
    Pin,
    ArrowUp,
    MessageCircle,
    Clock,
    Eye,
    Plus,
    Search,
    Flame,
} from "lucide-react";
import Link from "next/link";

/* === MOCK DATA === */
const channels = [
    { name: "systems-engineering", members: 4200, unread: 12, color: "var(--hive-accent-primary)" },
    { name: "react-performance", members: 3800, unread: 5, color: "var(--hive-accent-success)" },
    { name: "ml-research", members: 2100, unread: 0, color: "var(--hive-accent-secondary)" },
    { name: "crypto-security", members: 1800, unread: 3, color: "var(--hive-accent-warning)" },
    { name: "career-growth", members: 5600, unread: 8, color: "var(--hive-accent-fire)" },
    { name: "open-source", members: 3400, unread: 0, color: "var(--hive-accent-success)" },
];

const threads = [
    {
        id: "1",
        title: "What's the best approach for designing a distributed rate limiter?",
        author: "sys_architect",
        channel: "systems-engineering",
        votes: 89,
        replies: 34,
        views: 1200,
        timeAgo: "3h ago",
        pinned: true,
        tags: ["system-design", "distributed-systems"],
    },
    {
        id: "2",
        title: "React Server Components vs Client Components — When to use which?",
        author: "react_guru",
        channel: "react-performance",
        votes: 156,
        replies: 67,
        views: 3400,
        timeAgo: "6h ago",
        pinned: false,
        tags: ["react", "next.js", "performance"],
    },
    {
        id: "3",
        title: "A deep dive into attention mechanisms: from vanilla to multi-query",
        author: "ml_researcher",
        channel: "ml-research",
        votes: 234,
        replies: 45,
        views: 5600,
        timeAgo: "1d ago",
        pinned: false,
        tags: ["machine-learning", "transformers"],
    },
    {
        id: "4",
        title: "Found a critical XSS vulnerability in a popular npm package",
        author: "ethical_hacker",
        channel: "crypto-security",
        votes: 312,
        replies: 89,
        views: 8900,
        timeAgo: "2d ago",
        pinned: true,
        tags: ["security", "vulnerability", "npm"],
    },
    {
        id: "5",
        title: "How I went from junior to staff engineer in 3 years — actionable steps",
        author: "career_hacker",
        channel: "career-growth",
        votes: 567,
        replies: 123,
        views: 12000,
        timeAgo: "3d ago",
        pinned: false,
        tags: ["career", "growth", "tips"],
    },
];

/* === SIDEBAR === */
function Sidebar() {
    const navItems = [
        { icon: <Home className="w-5 h-5" />, label: "Feed", href: "/feed", active: false },
        { icon: <Trophy className="w-5 h-5" />, label: "Arena", href: "/arena", active: false },
        { icon: <MessageSquare className="w-5 h-5" />, label: "Forum", href: "/forum", active: true },
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

export default function ForumPage() {
    return (
        <div className="min-h-screen" style={{ background: "var(--hive-bg-primary)" }}>
            <Sidebar />
            <main className="lg:ml-64 min-h-screen p-6">
                <div className="max-w-5xl mx-auto space-y-8">

                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">
                                Neural <span className="gradient-text">Link</span>
                            </h1>
                            <p className="text-sm" style={{ color: "var(--hive-text-secondary)" }}>
                                Deep technical discourse. Real-time collaboration. Zero noise.
                            </p>
                        </div>
                        <button className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 transition-all hover:scale-105" style={{ background: "var(--hive-gradient-primary)", boxShadow: "var(--hive-glow-cyan)" }}>
                            <Plus className="w-4 h-4" /> New Thread
                        </button>
                    </motion.div>

                    {/* Search */}
                    <div className="glass-card px-5 py-3 flex items-center gap-3">
                        <Search className="w-4 h-4" style={{ color: "var(--hive-text-muted)" }} />
                        <input type="text" placeholder="Search threads, topics, or users..." className="flex-1 bg-transparent outline-none text-sm" style={{ color: "var(--hive-text-primary)" }} />
                    </div>

                    <div className="grid lg:grid-cols-4 gap-6">
                        {/* Channels Sidebar */}
                        <div className="lg:col-span-1">
                            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <Hash className="w-4 h-4" style={{ color: "var(--hive-accent-primary)" }} /> Channels
                            </h2>
                            <div className="space-y-1">
                                {channels.map((ch) => (
                                    <button key={ch.name} className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors hover:bg-white/5">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full" style={{ background: ch.color }} />
                                            <span style={{ color: "var(--hive-text-secondary)" }}>#{ch.name}</span>
                                        </div>
                                        {ch.unread > 0 && (
                                            <span className="px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ background: "var(--hive-accent-primary)", color: "white", fontSize: "10px" }}>
                                                {ch.unread}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Threads */}
                        <div className="lg:col-span-3 space-y-3">
                            {threads.map((t, i) => (
                                <motion.div
                                    key={t.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="glass-card p-5 hover:scale-[1.01] transition-transform cursor-pointer"
                                >
                                    <div className="flex gap-4">
                                        {/* Vote Column */}
                                        <div className="flex flex-col items-center gap-1 shrink-0">
                                            <button className="p-1 rounded transition-colors hover:bg-white/10" style={{ color: "var(--hive-accent-primary)" }}>
                                                <ArrowUp className="w-4 h-4" />
                                            </button>
                                            <span className="text-sm font-bold">{t.votes}</span>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                {t.pinned && <Pin className="w-3 h-3" style={{ color: "var(--hive-accent-warning)" }} />}
                                                <h3 className="font-semibold text-sm leading-tight">{t.title}</h3>
                                            </div>
                                            <div className="flex items-center gap-3 mt-2 flex-wrap">
                                                <span className="text-xs" style={{ color: "var(--hive-text-muted)" }}>
                                                    by <span style={{ color: "var(--hive-accent-primary)" }}>{t.author}</span>
                                                </span>
                                                <span className="text-xs flex items-center gap-1" style={{ color: "var(--hive-text-muted)" }}>
                                                    <Hash className="w-3 h-3" /> {t.channel}
                                                </span>
                                                <span className="text-xs flex items-center gap-1" style={{ color: "var(--hive-text-muted)" }}>
                                                    <Clock className="w-3 h-3" /> {t.timeAgo}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-3">
                                                {t.tags.map((tag) => (
                                                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)", color: "var(--hive-text-secondary)" }}>
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Meta */}
                                        <div className="flex flex-col items-end gap-2 shrink-0">
                                            <span className="text-xs flex items-center gap-1" style={{ color: "var(--hive-text-muted)" }}>
                                                <MessageCircle className="w-3 h-3" /> {t.replies}
                                            </span>
                                            <span className="text-xs flex items-center gap-1" style={{ color: "var(--hive-text-muted)" }}>
                                                <Eye className="w-3 h-3" /> {t.views.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
