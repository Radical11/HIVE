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
    GitBranch,
    Star,
    MapPin,
    Calendar,
    ExternalLink,
    Code2,
    Target,
    Award,
    TrendingUp,
} from "lucide-react";
import Link from "next/link";

/* === MOCK DATA === */
const profile = {
    username: "codewizard42",
    headline: "Full Stack Engineer @ Vercel",
    bio: "Building at the edge. Systems obsessed. Open source contributor. I ship fast and break nothing.",
    location: "San Francisco, CA",
    joined: "Jan 2024",
    github: "codewizard42",
    streak: 47,
    longestStreak: 128,
    xp: 12400,
    elo: 1842,
    followers: 1234,
    following: 567,
    posts: 89,
    challengesSolved: 342,
};

const skills = [
    { name: "TypeScript", level: 92 },
    { name: "React/Next.js", level: 88 },
    { name: "System Design", level: 76 },
    { name: "Go", level: 65 },
    { name: "PostgreSQL", level: 70 },
    { name: "DevOps", level: 58 },
];

const badges = [
    { icon: <Flame className="w-5 h-5" />, title: "100-Day Streak", color: "var(--hive-accent-fire)" },
    { icon: <Star className="w-5 h-5" />, title: "OSS Contributor", color: "var(--hive-accent-warning)" },
    { icon: <Code2 className="w-5 h-5" />, title: "Code Reviewer", color: "var(--hive-accent-primary)" },
    { icon: <Trophy className="w-5 h-5" />, title: "Arena Champion", color: "var(--hive-accent-secondary)" },
    { icon: <Target className="w-5 h-5" />, title: "Bug Hunter", color: "var(--hive-accent-danger)" },
];

const recentActivity = [
    { type: "commit", text: "Pushed 3 commits to edge-cache-layer", time: "2h ago" },
    { type: "solve", text: "Solved 'Binary Tree Max Path Sum' (Hard)", time: "5h ago" },
    { type: "post", text: "Shared insights on WebSocket scaling", time: "1d ago" },
    { type: "badge", text: "Earned 'Night Owl' badge", time: "2d ago" },
];

/* === HEATMAP === */
function ContributionHeatmap() {
    const weeks = 20;
    const days = 7;
    const cells = Array.from({ length: weeks * days }, () => Math.random());

    return (
        <div className="flex gap-[3px] flex-wrap" style={{ maxWidth: `${weeks * 15}px` }}>
            {cells.map((val, i) => {
                let bg = "rgba(255,255,255,0.03)";
                if (val > 0.2) bg = "rgba(0,212,255,0.15)";
                if (val > 0.4) bg = "rgba(0,212,255,0.3)";
                if (val > 0.6) bg = "rgba(0,212,255,0.5)";
                if (val > 0.8) bg = "rgba(0,212,255,0.8)";
                return <div key={i} className="heatmap-cell" style={{ background: bg }} />;
            })}
        </div>
    );
}

/* === SIDEBAR === */
function Sidebar() {
    const navItems = [
        { icon: <Home className="w-5 h-5" />, label: "Feed", href: "/feed", active: false },
        { icon: <Trophy className="w-5 h-5" />, label: "Arena", href: "/arena", active: false },
        { icon: <MessageSquare className="w-5 h-5" />, label: "Forum", href: "/forum", active: false },
        { icon: <Users className="w-5 h-5" />, label: "Squads", href: "/squads", active: false },
        { icon: <User className="w-5 h-5" />, label: "Profile", href: "/profile", active: true },
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
        </aside>
    );
}

/* === MAIN === */
export default function ProfilePage() {
    return (
        <div className="min-h-screen" style={{ background: "var(--hive-bg-primary)" }}>
            <Sidebar />
            <main className="lg:ml-64 min-h-screen p-6">
                <div className="max-w-4xl mx-auto space-y-6">

                    {/* Profile Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-8"
                    >
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Avatar */}
                            <div
                                className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold shrink-0"
                                style={{ background: "var(--hive-gradient-primary)", color: "white" }}
                            >
                                {profile.username[0].toUpperCase()}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h1 className="text-2xl font-bold">{profile.username}</h1>
                                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: "rgba(0,212,255,0.1)", color: "var(--hive-accent-primary)" }}>
                                        <Flame className="w-3 h-3" /> {profile.streak} day streak
                                    </div>
                                </div>
                                <p className="text-sm mt-1" style={{ color: "var(--hive-text-secondary)" }}>{profile.headline}</p>
                                <p className="text-sm mt-2" style={{ color: "var(--hive-text-secondary)" }}>{profile.bio}</p>
                                <div className="flex items-center gap-4 mt-3 flex-wrap">
                                    <span className="flex items-center gap-1 text-xs" style={{ color: "var(--hive-text-muted)" }}>
                                        <MapPin className="w-3 h-3" /> {profile.location}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs" style={{ color: "var(--hive-text-muted)" }}>
                                        <Calendar className="w-3 h-3" /> Joined {profile.joined}
                                    </span>
                                    <a href={`https://github.com/${profile.github}`} className="flex items-center gap-1 text-xs" style={{ color: "var(--hive-accent-primary)" }}>
                                        <GitBranch className="w-3 h-3" /> {profile.github} <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>

                                {/* Social Stats */}
                                <div className="flex items-center gap-6 mt-4">
                                    <span className="text-sm"><strong>{profile.followers}</strong> <span style={{ color: "var(--hive-text-muted)" }}>followers</span></span>
                                    <span className="text-sm"><strong>{profile.following}</strong> <span style={{ color: "var(--hive-text-muted)" }}>following</span></span>
                                    <span className="text-sm"><strong>{profile.posts}</strong> <span style={{ color: "var(--hive-text-muted)" }}>posts</span></span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Left Column */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Contribution Heatmap */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
                                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" style={{ color: "var(--hive-accent-primary)" }} /> Activity Heatmap
                                </h3>
                                <ContributionHeatmap />
                                <div className="flex items-center justify-between mt-3">
                                    <span className="text-xs" style={{ color: "var(--hive-text-muted)" }}>Longest streak: {profile.longestStreak} days</span>
                                    <div className="flex items-center gap-1 text-xs" style={{ color: "var(--hive-text-muted)" }}>
                                        Less
                                        {[0.1, 0.3, 0.5, 0.7, 0.9].map((v) => (
                                            <div key={v} className="w-3 h-3 rounded-sm" style={{ background: `rgba(0,212,255,${v})` }} />
                                        ))}
                                        More
                                    </div>
                                </div>
                            </motion.div>

                            {/* Skills Radar */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
                                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                                    <Award className="w-4 h-4" style={{ color: "var(--hive-accent-secondary)" }} /> Skill Matrix
                                </h3>
                                <div className="space-y-3">
                                    {skills.map((s) => (
                                        <div key={s.name}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-medium">{s.name}</span>
                                                <span className="text-xs" style={{ color: "var(--hive-text-muted)" }}>{s.level}%</span>
                                            </div>
                                            <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                                                <motion.div
                                                    className="h-full rounded-full"
                                                    style={{ background: "var(--hive-gradient-primary)" }}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${s.level}%` }}
                                                    transition={{ duration: 1, delay: 0.3 }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Stats */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5">
                                <h3 className="text-sm font-semibold mb-4">Quick Stats</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs" style={{ color: "var(--hive-text-muted)" }}>ELO Rating</span>
                                        <span className="text-sm font-bold" style={{ color: "var(--hive-accent-warning)" }}>{profile.elo}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs" style={{ color: "var(--hive-text-muted)" }}>Total XP</span>
                                        <span className="text-sm font-bold gradient-text">{(profile.xp / 1000).toFixed(1)}K</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs" style={{ color: "var(--hive-text-muted)" }}>Challenges</span>
                                        <span className="text-sm font-bold" style={{ color: "var(--hive-accent-success)" }}>{profile.challengesSolved}</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Badges */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-5">
                                <h3 className="text-sm font-semibold mb-4">Badges</h3>
                                <div className="flex flex-wrap gap-2">
                                    {badges.map((b) => (
                                        <div
                                            key={b.title}
                                            className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                                            style={{ background: `color-mix(in srgb, ${b.color} 15%, transparent)`, color: b.color }}
                                            title={b.title}
                                        >
                                            {b.icon}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Recent Activity */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-5">
                                <h3 className="text-sm font-semibold mb-4">Recent Activity</h3>
                                <div className="space-y-3">
                                    {recentActivity.map((a, i) => (
                                        <div key={i} className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "var(--hive-accent-primary)" }} />
                                            <div>
                                                <span className="text-xs" style={{ color: "var(--hive-text-secondary)" }}>{a.text}</span>
                                                <span className="text-xs ml-2" style={{ color: "var(--hive-text-muted)" }}>{a.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
