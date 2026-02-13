"use client";

import { motion } from "framer-motion";
import {
    Zap,
    Home,
    Trophy,
    MessageSquare,
    Users,
    User,
    Bell,
    Search,
    Plus,
    Heart,
    Flame,
    Bug,
    MessageCircle,
    GitCommit,
    Code2,
    Target,
    TrendingUp,
    Settings,
    LogIn,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

/* === MOCK DATA === */
const posts = [
    {
        id: "1",
        author: { username: "sarah_dev", headline: "Full Stack @ Stripe" },
        type: "GITHUB_COMMIT",
        content: "Just shipped a major refactor of our payment processing pipeline. Reduced latency by 40% using edge functions 🚀",
        codeSnippet: `// Before: 240ms avg response
const result = await processPayment(data);

// After: 145ms avg response  
const result = await edge.processPayment(data, {
  region: 'auto',
  cache: 'aggressive'
});`,
        reactions: { respect: 42, fire: 18, bug: 2 },
        comments: 7,
        timeAgo: "2h ago",
    },
    {
        id: "2",
        author: { username: "algo_master", headline: "CP Specialist | 2400 CF" },
        type: "LEETCODE_SOLVE",
        content: "Cracked LeetCode #2867 (Hard) - Count Valid Paths in a Tree. Used sieve + DFS combo. Took me 3 attempts but the solution is clean 💪",
        codeSnippet: null,
        reactions: { respect: 89, fire: 34, bug: 0 },
        comments: 12,
        timeAgo: "4h ago",
    },
    {
        id: "3",
        author: { username: "cyber_ghost", headline: "Security Researcher" },
        type: "MILESTONE",
        content: "🏆 Just earned my OSCP certification after 4 months of grinding. The exam was 24 hours of pure adrenaline. Never giving up paid off.",
        codeSnippet: null,
        reactions: { respect: 234, fire: 89, bug: 1 },
        comments: 31,
        timeAgo: "6h ago",
    },
];

const trendingTopics = [
    { tag: "#rust-rewrite", posts: 342 },
    { tag: "#ai-agents", posts: 891 },
    { tag: "#system-design", posts: 567 },
    { tag: "#bug-bounty", posts: 234 },
];

const typeIcons: Record<string, React.ReactNode> = {
    GITHUB_COMMIT: <GitCommit className="w-4 h-4" />,
    LEETCODE_SOLVE: <Code2 className="w-4 h-4" />,
    MILESTONE: <Target className="w-4 h-4" />,
    MANUAL: <Zap className="w-4 h-4" />,
};

const typeColors: Record<string, string> = {
    GITHUB_COMMIT: "var(--hive-accent-success)",
    LEETCODE_SOLVE: "var(--hive-accent-warning)",
    MILESTONE: "var(--hive-accent-primary)",
    MANUAL: "var(--hive-accent-secondary)",
};

const typeLabels: Record<string, string> = {
    GITHUB_COMMIT: "Commit",
    LEETCODE_SOLVE: "Challenge Solved",
    MILESTONE: "Milestone",
    MANUAL: "Post",
};

/* === SIDEBAR NAV === */
function Sidebar() {
    const { user, loading } = useAuth();

    const navItems = [
        { icon: <Home className="w-5 h-5" />, label: "Feed", href: "/feed", active: true },
        { icon: <Trophy className="w-5 h-5" />, label: "Arena", href: "/arena", active: false },
        { icon: <MessageSquare className="w-5 h-5" />, label: "Forum", href: "/forum", active: false },
        { icon: <Users className="w-5 h-5" />, label: "Squads", href: "/squads", active: false },
        { icon: <User className="w-5 h-5" />, label: "Profile", href: "/profile", active: false },
    ];

    const displayName = user?.displayName || user?.email?.split("@")[0] || "Anonymous";
    const avatarLetter = displayName[0]?.toUpperCase() || "?";

    return (
        <aside className="fixed left-0 top-0 h-full w-64 p-6 hidden lg:flex flex-col" style={{ borderRight: "1px solid var(--hive-border)", background: "var(--hive-bg-secondary)" }}>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 mb-10">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--hive-gradient-primary)" }}>
                    <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">HIVE</span>
            </Link>

            {/* Nav */}
            <nav className="flex-1 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                        style={{
                            background: item.active ? "rgba(0,212,255,0.1)" : "transparent",
                            color: item.active ? "var(--hive-accent-primary)" : "var(--hive-text-secondary)",
                        }}
                    >
                        {item.icon}
                        {item.label}
                    </Link>
                ))}
            </nav>

            {/* User Card */}
            {loading ? (
                <div className="glass-card p-4 animate-pulse">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full" style={{ background: "var(--hive-bg-elevated)" }} />
                        <div className="space-y-2 flex-1">
                            <div className="h-3 rounded" style={{ background: "var(--hive-bg-elevated)", width: "60%" }} />
                            <div className="h-2 rounded" style={{ background: "var(--hive-bg-elevated)", width: "40%" }} />
                        </div>
                    </div>
                </div>
            ) : user ? (
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        {user.photoURL ? (
                            <img src={user.photoURL} alt={displayName} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                                style={{ background: "var(--hive-gradient-primary)", color: "white" }}
                            >
                                {avatarLetter}
                            </div>
                        )}
                        <div>
                            <div className="text-sm font-medium">{displayName}</div>
                            <div className="text-xs flex items-center gap-1" style={{ color: "var(--hive-accent-primary)" }}>
                                <Flame className="w-3 h-3" /> Active
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <Link href="/login" className="glass-card p-4 flex items-center gap-3 hover:scale-[1.02] transition-transform">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(0,212,255,0.1)", color: "var(--hive-accent-primary)" }}>
                        <LogIn className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-sm font-medium" style={{ color: "var(--hive-accent-primary)" }}>Sign In</div>
                        <div className="text-xs" style={{ color: "var(--hive-text-muted)" }}>Start your journey</div>
                    </div>
                </Link>
            )}
        </aside>
    );
}

/* === MAIN === */
export default function FeedPage() {
    const { user } = useAuth();
    const displayName = user?.displayName || user?.email?.split("@")[0] || "Builder";
    const avatarLetter = displayName[0]?.toUpperCase() || "?";

    return (
        <div className="min-h-screen" style={{ background: "var(--hive-bg-primary)" }}>
            <Sidebar />

            {/* Main Content */}
            <main className="lg:ml-64 min-h-screen">
                {/* Top Bar */}
                <header className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between glass-card" style={{ borderRadius: 0, borderTop: "none", borderLeft: "none", borderRight: "none" }}>
                    <div className="flex items-center gap-3 flex-1 max-w-md">
                        <Search className="w-4 h-4" style={{ color: "var(--hive-text-muted)" }} />
                        <input
                            type="text"
                            placeholder="Search engineers, topics, challenges..."
                            className="flex-1 bg-transparent outline-none text-sm"
                            style={{ color: "var(--hive-text-primary)" }}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 rounded-lg transition-colors" style={{ color: "var(--hive-text-secondary)" }}>
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: "var(--hive-accent-danger)" }} />
                        </button>
                        <button className="p-2 rounded-lg" style={{ color: "var(--hive-text-secondary)" }}>
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                <div className="flex gap-6 p-6">
                    {/* Feed Column */}
                    <div className="flex-1 max-w-2xl space-y-6">
                        {/* Compose */}
                        <div className="glass-card p-5">
                            <div className="flex items-center gap-3 mb-4">
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt={displayName} className="w-10 h-10 rounded-full object-cover" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: "var(--hive-gradient-primary)", color: "white" }}>
                                        {avatarLetter}
                                    </div>
                                )}
                                <input
                                    type="text"
                                    placeholder="Share a win, post a snippet, or drop some knowledge..."
                                    className="flex-1 bg-transparent outline-none text-sm"
                                    style={{ color: "var(--hive-text-primary)" }}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <button className="px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors" style={{ background: "rgba(255,255,255,0.05)", color: "var(--hive-text-secondary)" }}>
                                        <Code2 className="w-3.5 h-3.5" /> Code
                                    </button>
                                    <button className="px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors" style={{ background: "rgba(255,255,255,0.05)", color: "var(--hive-text-secondary)" }}>
                                        <Target className="w-3.5 h-3.5" /> Milestone
                                    </button>
                                </div>
                                <button className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5" style={{ background: "var(--hive-gradient-primary)" }}>
                                    <Plus className="w-3.5 h-3.5" /> Post
                                </button>
                            </div>
                        </div>

                        {/* Posts */}
                        {posts.map((post, i) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.4 }}
                                className="glass-card p-6"
                            >
                                {/* Post Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                                            style={{ background: "var(--hive-bg-elevated)", color: "var(--hive-text-primary)" }}
                                        >
                                            {post.author.username[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold">{post.author.username}</div>
                                            <div className="text-xs" style={{ color: "var(--hive-text-muted)" }}>
                                                {post.author.headline} · {post.timeAgo}
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                                        style={{
                                            background: `color-mix(in srgb, ${typeColors[post.type]} 15%, transparent)`,
                                            color: typeColors[post.type],
                                        }}
                                    >
                                        {typeIcons[post.type]}
                                        {typeLabels[post.type]}
                                    </div>
                                </div>

                                {/* Content */}
                                <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--hive-text-primary)" }}>
                                    {post.content}
                                </p>

                                {/* Code Snippet */}
                                {post.codeSnippet && (
                                    <pre
                                        className="text-xs p-4 rounded-xl mb-4 overflow-x-auto font-mono"
                                        style={{
                                            background: "var(--hive-bg-primary)",
                                            border: "1px solid var(--hive-border)",
                                            color: "var(--hive-accent-primary)",
                                        }}
                                    >
                                        {post.codeSnippet}
                                    </pre>
                                )}

                                {/* Reactions */}
                                <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--hive-border)" }}>
                                    <div className="flex items-center gap-4">
                                        <button className="flex items-center gap-1.5 text-xs transition-colors" style={{ color: "var(--hive-text-secondary)" }}>
                                            <Heart className="w-4 h-4" /> {post.reactions.respect}
                                        </button>
                                        <button className="flex items-center gap-1.5 text-xs transition-colors" style={{ color: "var(--hive-text-secondary)" }}>
                                            <Flame className="w-4 h-4" /> {post.reactions.fire}
                                        </button>
                                        <button className="flex items-center gap-1.5 text-xs transition-colors" style={{ color: "var(--hive-text-secondary)" }}>
                                            <Bug className="w-4 h-4" /> {post.reactions.bug}
                                        </button>
                                    </div>
                                    <button className="flex items-center gap-1.5 text-xs" style={{ color: "var(--hive-text-secondary)" }}>
                                        <MessageCircle className="w-4 h-4" /> {post.comments}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Right Sidebar */}
                    <aside className="hidden xl:block w-80 space-y-6">
                        {/* Stats Card */}
                        <div className="glass-card p-5">
                            <h3 className="text-sm font-semibold mb-4">Your Stats</h3>
                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div>
                                    <div className="text-lg font-bold gradient-text">47</div>
                                    <div className="text-xs" style={{ color: "var(--hive-text-muted)" }}>Streak</div>
                                </div>
                                <div>
                                    <div className="text-lg font-bold" style={{ color: "var(--hive-accent-warning)" }}>1842</div>
                                    <div className="text-xs" style={{ color: "var(--hive-text-muted)" }}>ELO</div>
                                </div>
                                <div>
                                    <div className="text-lg font-bold" style={{ color: "var(--hive-accent-success)" }}>12.4K</div>
                                    <div className="text-xs" style={{ color: "var(--hive-text-muted)" }}>XP</div>
                                </div>
                            </div>
                        </div>

                        {/* Trending */}
                        <div className="glass-card p-5">
                            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" style={{ color: "var(--hive-accent-primary)" }} />
                                Trending Topics
                            </h3>
                            <div className="space-y-3">
                                {trendingTopics.map((t) => (
                                    <div key={t.tag} className="flex items-center justify-between">
                                        <span className="text-sm font-medium" style={{ color: "var(--hive-accent-primary)" }}>{t.tag}</span>
                                        <span className="text-xs" style={{ color: "var(--hive-text-muted)" }}>{t.posts} posts</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
