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
    ArrowDown,
    MessageCircle,
    Clock,
    Eye,
    Plus,
    Search,
    Flame,
    TrendingUp,
    Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

/* === MOCK DATA === */
const channels = [
    { name: "systems-engineering", members: 4200, unread: 12, color: "var(--hive-accent-primary)" },
    { name: "react-performance", members: 3800, unread: 5, color: "var(--hive-accent-success)" },
    { name: "ml-research", members: 2100, unread: 0, color: "var(--hive-accent-secondary)" },
    { name: "crypto-security", members: 1800, unread: 3, color: "var(--hive-accent-warning)" },
    { name: "career-growth", members: 5600, unread: 8, color: "#ef4444" },
    { name: "open-source", members: 3400, unread: 0, color: "var(--hive-accent-success)" },
];

const threads = [
    {
        id: "1",
        title: "What's the best approach for designing a distributed rate limiter?",
        author: "sys_architect",
        channel: "systems-engineering",
        channelColor: "var(--hive-accent-primary)",
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
        channelColor: "var(--hive-accent-success)",
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
        channelColor: "var(--hive-accent-secondary)",
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
        channelColor: "var(--hive-accent-warning)",
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
        channelColor: "#ef4444",
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

/* === FLOATING ORBS === */
function FloatingOrbs() {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
            <motion.div
                className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
                style={{ background: "var(--hive-gradient-primary)", top: "10%", left: "20%" }}
                animate={{
                    x: [0, 30, 0],
                    y: [0, -40, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute w-80 h-80 rounded-full opacity-15 blur-3xl"
                style={{ background: "var(--hive-accent-secondary)", bottom: "20%", right: "15%" }}
                animate={{
                    x: [0, -40, 0],
                    y: [0, 30, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute w-64 h-64 rounded-full opacity-10 blur-3xl"
                style={{ background: "var(--hive-accent-warning)", top: "50%", left: "50%" }}
                animate={{
                    x: [0, 20, 0],
                    y: [0, -20, 0],
                    scale: [1, 1.15, 1],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>
    );
}

/* === CATEGORY FILTERS === */
function CategoryFilters({ activeFilter, setActiveFilter }: { activeFilter: string; setActiveFilter: (filter: string) => void }) {
    const filters = [
        { id: "all", label: "All Threads", icon: <MessageSquare className="w-4 h-4" /> },
        { id: "hot", label: "Hot", icon: <Flame className="w-4 h-4" /> },
        { id: "new", label: "New", icon: <Sparkles className="w-4 h-4" /> },
        { id: "unanswered", label: "Unanswered", icon: <MessageCircle className="w-4 h-4" /> },
    ];

    return (
        <div className="flex gap-2 overflow-x-auto pb-2">
            {filters.map((filter) => (
                <motion.button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-all"
                    style={{
                        background: activeFilter === filter.id ? "var(--hive-gradient-primary)" : "rgba(255,255,255,0.03)",
                        color: activeFilter === filter.id ? "white" : "var(--hive-text-secondary)",
                        border: activeFilter === filter.id ? "1px solid var(--hive-accent-primary)" : "1px solid transparent",
                        boxShadow: activeFilter === filter.id ? "var(--hive-glow-cyan)" : "none",
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {filter.icon}
                    {filter.label}
                </motion.button>
            ))}
        </div>
    );
}

/* === FEATURED DISCUSSION === */
function FeaturedDiscussion({ thread }: { thread: typeof threads[0] }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card-interactive p-6 relative overflow-hidden"
            style={{
                borderImage: "var(--hive-gradient-aurora) 1",
                borderWidth: "2px",
                borderStyle: "solid",
            }}
        >
            {/* Gradient Border Glow */}
            <div className="absolute inset-0 opacity-50 blur-xl" style={{ background: "var(--hive-gradient-aurora)", zIndex: -1 }} />

            <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5" style={{ color: "var(--hive-accent-warning)" }} />
                <span className="text-sm font-bold gradient-text-warm">Featured Discussion</span>
            </div>

            <div className="flex gap-6">
                {/* Vote Section */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                    <motion.button
                        className="p-2 rounded-lg transition-all glow-cyan"
                        style={{ background: "rgba(0,212,255,0.1)", color: "var(--hive-accent-primary)" }}
                        whileHover={{ scale: 1.1 }}
                    >
                        <ArrowUp className="w-6 h-6" />
                    </motion.button>
                    <span className="text-2xl font-bold gradient-text">{thread.votes}</span>
                    <motion.button
                        className="p-2 rounded-lg transition-all"
                        style={{ background: "rgba(255,255,255,0.05)", color: "var(--hive-text-muted)" }}
                        whileHover={{ scale: 1.1 }}
                    >
                        <ArrowDown className="w-6 h-6" />
                    </motion.button>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                        {thread.pinned && <Pin className="w-4 h-4" style={{ color: "var(--hive-accent-warning)" }} />}
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: thread.channelColor }} />
                            <span className="text-xs font-medium" style={{ color: "var(--hive-text-secondary)" }}>#{thread.channel}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: "rgba(239,68,68,0.1)" }}>
                            <Flame className="w-3 h-3" style={{ color: "#ef4444" }} />
                            <span className="text-xs font-bold" style={{ color: "#ef4444" }}>Hot</span>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold mb-3 leading-tight" style={{ color: "var(--hive-text-primary)" }}>
                        {thread.title}
                    </h2>

                    <div className="flex items-center gap-4 mb-4 text-sm" style={{ color: "var(--hive-text-muted)" }}>
                        <span>
                            by <span className="gradient-text font-medium">{thread.author}</span>
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" /> {thread.timeAgo}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                        {thread.tags.map((tag) => (
                            <span
                                key={tag}
                                className="tag px-3 py-1.5 text-xs font-medium rounded-lg"
                                style={{
                                    background: "rgba(0,212,255,0.1)",
                                    color: "var(--hive-accent-primary)",
                                    border: "1px solid rgba(0,212,255,0.2)",
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4">
                        <div className="stat-card flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                            <MessageCircle className="w-4 h-4" style={{ color: "var(--hive-accent-primary)" }} />
                            <span className="text-sm font-semibold">{thread.replies} replies</span>
                        </div>
                        <div className="stat-card flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                            <Eye className="w-4 h-4" style={{ color: "var(--hive-accent-secondary)" }} />
                            <span className="text-sm font-semibold">{thread.views.toLocaleString()} views</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

/* === THREAD CARD === */
function ThreadCard({ thread, index }: { thread: typeof threads[0]; index: number }) {
    const isHot = thread.votes > 200;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="glass-card-interactive p-5 relative overflow-hidden"
            style={{
                borderLeft: `3px solid ${thread.channelColor}`,
            }}
        >
            <div className="flex gap-4">
                {/* Vote Column */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                    <motion.button
                        className="p-1.5 rounded-lg transition-all"
                        style={{ color: "var(--hive-accent-primary)" }}
                        whileHover={{
                            scale: 1.1,
                            boxShadow: "var(--hive-glow-cyan)",
                            background: "rgba(0,212,255,0.1)",
                        }}
                    >
                        <ArrowUp className="w-5 h-5" />
                    </motion.button>
                    <span className="text-base font-bold gradient-text">{thread.votes}</span>
                    <motion.button
                        className="p-1.5 rounded-lg transition-all"
                        style={{ color: "var(--hive-text-muted)" }}
                        whileHover={{
                            scale: 1.1,
                            background: "rgba(255,255,255,0.05)",
                        }}
                    >
                        <ArrowDown className="w-5 h-5" />
                    </motion.button>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {thread.pinned && (
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md" style={{ background: "rgba(245,158,11,0.1)" }}>
                                <Pin className="w-3 h-3" style={{ color: "var(--hive-accent-warning)" }} />
                                <span className="text-xs font-medium" style={{ color: "var(--hive-accent-warning)" }}>Pinned</span>
                            </div>
                        )}
                        {isHot && (
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md animate-pulse" style={{ background: "rgba(239,68,68,0.1)" }}>
                                <Flame className="w-3 h-3" style={{ color: "#ef4444" }} />
                                <span className="text-xs font-bold" style={{ color: "#ef4444" }}>Hot</span>
                            </div>
                        )}
                    </div>

                    <h3 className="font-semibold text-base leading-tight mb-2 hover:text-cyan-400 transition-colors cursor-pointer" style={{ color: "var(--hive-text-primary)" }}>
                        {thread.title}
                    </h3>

                    <div className="flex items-center gap-3 mb-3 flex-wrap text-xs" style={{ color: "var(--hive-text-muted)" }}>
                        <span>
                            by <span style={{ color: "var(--hive-accent-primary)", fontWeight: 500 }}>{thread.author}</span>
                        </span>
                        <span className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: thread.channelColor }} />
                            #{thread.channel}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {thread.timeAgo}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {thread.tags.map((tag) => (
                            <span
                                key={tag}
                                className="tag text-xs px-2.5 py-1 rounded-md"
                                style={{
                                    background: "rgba(124,58,237,0.1)",
                                    color: "var(--hive-accent-secondary)",
                                    border: "1px solid rgba(124,58,237,0.2)",
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Meta Stats */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="stat-card flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                        <MessageCircle className="w-3.5 h-3.5" style={{ color: "var(--hive-accent-primary)" }} />
                        <span className="text-xs font-semibold">{thread.replies}</span>
                    </div>
                    <div className="stat-card flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                        <Eye className="w-3.5 h-3.5" style={{ color: "var(--hive-text-muted)" }} />
                        <span className="text-xs font-semibold">{thread.views.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

/* === CHANNEL ITEM === */
function ChannelItem({ channel, isActive }: { channel: typeof channels[0]; isActive: boolean }) {
    return (
        <motion.button
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all relative overflow-hidden"
            style={{
                background: isActive ? "rgba(0,212,255,0.1)" : "transparent",
                border: isActive ? "1px solid var(--hive-accent-primary)" : "1px solid transparent",
                boxShadow: isActive ? "var(--hive-glow-cyan)" : "none",
            }}
            whileHover={{
                background: isActive ? "rgba(0,212,255,0.15)" : "rgba(255,255,255,0.05)",
                borderColor: isActive ? "var(--hive-accent-primary)" : "var(--hive-border-accent)",
            }}
        >
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: channel.color }} />
                <span style={{ color: isActive ? "var(--hive-accent-primary)" : "var(--hive-text-secondary)", fontWeight: isActive ? 600 : 400 }}>
                    #{channel.name}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: "var(--hive-text-muted)" }}>
                    {channel.members.toLocaleString()}
                </span>
                {channel.unread > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-xs font-bold glow-cyan" style={{ background: "var(--hive-accent-primary)", color: "white", fontSize: "10px" }}>
                        {channel.unread}
                    </span>
                )}
            </div>
        </motion.button>
    );
}

/* === MAIN PAGE === */
export default function ForumPage() {
    const [activeFilter, setActiveFilter] = useState("all");
    const [activeChannel, setActiveChannel] = useState<string | null>(null);

    const featuredThread = threads.reduce((max, thread) => (thread.votes > max.votes ? thread : max), threads[0]);
    const regularThreads = threads.filter((t) => t.id !== featuredThread.id);

    return (
        <div className="min-h-screen relative" style={{ background: "var(--hive-bg-primary)" }}>
            <FloatingOrbs />
            <Sidebar />

            <main className="lg:ml-64 min-h-screen p-6 relative" style={{ zIndex: 1 }}>
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Header Section with Ambient Glow */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 blur-3xl opacity-30" style={{ background: "var(--hive-gradient-primary)", zIndex: -1 }} />
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h1 className="text-4xl font-bold mb-3 flex items-center gap-3">
                                    Neural <span className="gradient-text-aurora">Link</span>
                                    <Sparkles className="w-8 h-8 animate-pulse" style={{ color: "var(--hive-accent-primary)" }} />
                                </h1>
                                <p className="text-base" style={{ color: "var(--hive-text-secondary)" }}>
                                    Deep technical discourse. Real-time collaboration. Zero noise.
                                </p>
                            </div>
                            <motion.button
                                className="px-6 py-3 rounded-xl text-sm font-semibold text-white flex items-center gap-2 glow-cyan-intense"
                                style={{ background: "var(--hive-gradient-primary)" }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Plus className="w-5 h-5" /> New Thread
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card px-5 py-4 flex items-center gap-3"
                    >
                        <Search className="w-5 h-5 glow-cyan" style={{ color: "var(--hive-accent-primary)" }} />
                        <input
                            type="text"
                            placeholder="Search threads, topics, or users..."
                            className="flex-1 bg-transparent outline-none text-sm"
                            style={{ color: "var(--hive-text-primary)" }}
                        />
                    </motion.div>

                    {/* Category Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <CategoryFilters activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
                    </motion.div>

                    <div className="grid lg:grid-cols-4 gap-6">
                        {/* Channels Sidebar */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="lg:col-span-1"
                        >
                            <div className="glass-card p-4 sticky top-6">
                                <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                                    <Hash className="w-4 h-4 glow-cyan" style={{ color: "var(--hive-accent-primary)" }} /> Channels
                                </h2>
                                <div className="space-y-1.5">
                                    {channels.map((ch) => (
                                        <ChannelItem
                                            key={ch.name}
                                            channel={ch}
                                            isActive={activeChannel === ch.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Main Content Area */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Featured Discussion */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <FeaturedDiscussion thread={featuredThread} />
                            </motion.div>

                            {/* Regular Threads */}
                            <div className="space-y-4">
                                {regularThreads.map((thread, index) => (
                                    <ThreadCard key={thread.id} thread={thread} index={index} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
