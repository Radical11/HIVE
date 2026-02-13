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
    Github,
    GitPullRequest,
    AlertCircle,
    BookOpen,
    RefreshCw,
    Link2,
    Loader2,
    GitFork,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { apiGet, apiPost } from "@/lib/api";
import { useState, useEffect } from "react";

/* === TYPES === */
interface UserProfile {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    profile: {
        headline: string;
        bio: string;
        avatar_url: string;
        github_handle: string;
        twitter_handle: string;
        linkedin_handle: string;
        elo_rating: number;
        current_streak: number;
        total_xp: number;
    };
}

interface GitHubProfileData {
    github_username: string;
    avatar_url: string;
    html_url: string;
    bio: string;
    company: string;
    location: string;
    blog: string;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    total_contributions: number;
    total_commits: number;
    total_prs: number;
    total_issues: number;
    total_stars_received: number;
    top_languages: { name: string; percentage: number; bytes: number }[];
    top_repos: {
        name: string;
        full_name: string;
        description: string;
        html_url: string;
        language: string;
        stargazers_count: number;
        forks_count: number;
        updated_at: string;
        fork: boolean;
    }[];
    last_synced: string;
    github_created_at: string;
}

interface GitHubActivity {
    type: string;
    repo: string;
    message: string;
    detail: string;
    created_at: string;
}

/* === LANGUAGE COLORS === */
const langColors: Record<string, string> = {
    TypeScript: "#3178C6",
    JavaScript: "#F7DF1E",
    Python: "#3776AB",
    Go: "#00ADD8",
    Rust: "#DEA584",
    Java: "#B07219",
    "C++": "#F34B7D",
    C: "#555555",
    Ruby: "#CC342D",
    Swift: "#F05138",
    Kotlin: "#A97BFF",
    Dart: "#00B4AB",
    PHP: "#4F5D95",
    HTML: "#E34C26",
    CSS: "#563D7C",
    Shell: "#89E051",
    Lua: "#000080",
    Vim: "#199F4B",
};

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

/* === LINK GITHUB CARD === */
function LinkGitHubCard({ onLinked }: { onLinked: (data: GitHubProfileData) => void }) {
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleLink() {
        if (!username.trim()) return;
        setLoading(true);
        setError("");
        try {
            const data = await apiPost<GitHubProfileData>("/api/github/link/", {
                username: username.trim(),
            });
            onLinked(data);
        } catch (err: any) {
            setError(err.message || "Failed to link GitHub account");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,212,255,0.1)", color: "var(--hive-accent-primary)" }}>
                    <Github className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-semibold text-sm">Link GitHub</h3>
                    <p className="text-xs" style={{ color: "var(--hive-text-muted)" }}>Connect your GitHub to show stats & repos</p>
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
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. octocat"
                    className="flex-1 px-4 py-2.5 rounded-lg text-sm bg-transparent outline-none"
                    style={{ border: "1px solid var(--hive-border)", color: "var(--hive-text-primary)" }}
                    onKeyDown={(e) => e.key === "Enter" && handleLink()}
                />
                <button
                    onClick={handleLink}
                    disabled={loading || !username.trim()}
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

/* === GITHUB STATS CARD === */
function GitHubStatsCard({ gh, onSync }: { gh: GitHubProfileData; onSync: () => void }) {
    const [syncing, setSyncing] = useState(false);

    async function handleSync() {
        setSyncing(true);
        try {
            onSync();
        } finally {
            setSyncing(false);
        }
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,212,255,0.1)", color: "var(--hive-accent-primary)" }}>
                        <Github className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="font-semibold text-sm flex items-center gap-2">
                            {gh.github_username}
                            <a href={gh.html_url} target="_blank" rel="noreferrer">
                                <ExternalLink className="w-3 h-3" style={{ color: "var(--hive-text-muted)" }} />
                            </a>
                        </div>
                        <div className="text-xs" style={{ color: "var(--hive-text-muted)" }}>
                            {gh.company || "GitHub Developer"}
                        </div>
                    </div>
                </div>
                <button onClick={handleSync} disabled={syncing} className="p-2 rounded-lg transition-colors hover:bg-white/5" style={{ color: "var(--hive-text-muted)" }}>
                    <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
                </button>
            </div>

            <div className="grid grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div className="text-lg font-bold" style={{ color: "var(--hive-accent-primary)" }}>{gh.public_repos}</div>
                    <div className="text-xs" style={{ color: "var(--hive-text-muted)" }}>Repos</div>
                </div>
                <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div className="text-lg font-bold" style={{ color: "var(--hive-accent-warning)" }}>{gh.total_stars_received}</div>
                    <div className="text-xs" style={{ color: "var(--hive-text-muted)" }}>Stars</div>
                </div>
                <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div className="text-lg font-bold" style={{ color: "var(--hive-accent-success)" }}>{gh.followers}</div>
                    <div className="text-xs" style={{ color: "var(--hive-text-muted)" }}>Followers</div>
                </div>
                <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div className="text-lg font-bold" style={{ color: "var(--hive-accent-secondary)" }}>{gh.following}</div>
                    <div className="text-xs" style={{ color: "var(--hive-text-muted)" }}>Following</div>
                </div>
            </div>

            {/* Contribution Stats */}
            <div className="grid grid-cols-3 gap-3 mt-3 text-center">
                <div className="flex items-center justify-center gap-1.5 p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <GitBranch className="w-3 h-3" style={{ color: "var(--hive-accent-success)" }} />
                    <span className="text-xs font-medium">{gh.total_commits}</span>
                    <span className="text-xs" style={{ color: "var(--hive-text-muted)" }}>commits</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <GitPullRequest className="w-3 h-3" style={{ color: "var(--hive-accent-primary)" }} />
                    <span className="text-xs font-medium">{gh.total_prs}</span>
                    <span className="text-xs" style={{ color: "var(--hive-text-muted)" }}>PRs</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <AlertCircle className="w-3 h-3" style={{ color: "var(--hive-accent-warning)" }} />
                    <span className="text-xs font-medium">{gh.total_issues}</span>
                    <span className="text-xs" style={{ color: "var(--hive-text-muted)" }}>issues</span>
                </div>
            </div>
        </motion.div>
    );
}

/* === TOP LANGUAGES === */
function LanguagesCard({ languages }: { languages: GitHubProfileData["top_languages"] }) {
    if (!languages || languages.length === 0) return null;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Code2 className="w-4 h-4" style={{ color: "var(--hive-accent-primary)" }} /> Top Languages
            </h3>
            {/* Language bar */}
            <div className="flex h-3 rounded-full overflow-hidden mb-3">
                {languages.slice(0, 6).map((lang) => (
                    <div
                        key={lang.name}
                        style={{
                            width: `${lang.percentage}%`,
                            background: langColors[lang.name] || "var(--hive-accent-primary)",
                            minWidth: "4px",
                        }}
                    />
                ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
                {languages.slice(0, 6).map((lang) => (
                    <div key={lang.name} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: langColors[lang.name] || "var(--hive-accent-primary)" }} />
                        <span className="text-xs font-medium">{lang.name}</span>
                        <span className="text-xs" style={{ color: "var(--hive-text-muted)" }}>{lang.percentage}%</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

/* === TOP REPOS === */
function TopReposCard({ repos }: { repos: GitHubProfileData["top_repos"] }) {
    if (!repos || repos.length === 0) return null;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4" style={{ color: "var(--hive-accent-secondary)" }} /> Top Repositories
            </h3>
            <div className="space-y-3">
                {repos.slice(0, 4).map((repo) => (
                    <a
                        key={repo.name}
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="block p-3 rounded-xl transition-all hover:scale-[1.01]"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--hive-border)" }}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium" style={{ color: "var(--hive-accent-primary)" }}>{repo.name}</span>
                            <ExternalLink className="w-3 h-3" style={{ color: "var(--hive-text-muted)" }} />
                        </div>
                        {repo.description && (
                            <p className="text-xs mb-2 line-clamp-2" style={{ color: "var(--hive-text-secondary)" }}>{repo.description}</p>
                        )}
                        <div className="flex items-center gap-3">
                            {repo.language && (
                                <span className="flex items-center gap-1 text-xs" style={{ color: "var(--hive-text-muted)" }}>
                                    <div className="w-2 h-2 rounded-full" style={{ background: langColors[repo.language] || "#888" }} />
                                    {repo.language}
                                </span>
                            )}
                            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--hive-text-muted)" }}>
                                <Star className="w-3 h-3" /> {repo.stargazers_count}
                            </span>
                            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--hive-text-muted)" }}>
                                <GitFork className="w-3 h-3" /> {repo.forks_count}
                            </span>
                        </div>
                    </a>
                ))}
            </div>
        </motion.div>
    );
}

/* === GITHUB ACTIVITY === */
function GitHubActivityCard({ activities }: { activities: GitHubActivity[] }) {
    if (!activities || activities.length === 0) return null;

    const activityIcons: Record<string, React.ReactNode> = {
        push: <GitBranch className="w-3 h-3" style={{ color: "var(--hive-accent-success)" }} />,
        pull_request: <GitPullRequest className="w-3 h-3" style={{ color: "var(--hive-accent-primary)" }} />,
        issue: <AlertCircle className="w-3 h-3" style={{ color: "var(--hive-accent-warning)" }} />,
        create: <Code2 className="w-3 h-3" style={{ color: "var(--hive-accent-secondary)" }} />,
        star: <Star className="w-3 h-3" style={{ color: "#FFD700" }} />,
        fork: <GitFork className="w-3 h-3" style={{ color: "var(--hive-text-secondary)" }} />,
    };

    function timeAgo(dateStr: string) {
        const date = new Date(dateStr);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (seconds < 60) return "just now";
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Github className="w-4 h-4" style={{ color: "var(--hive-accent-primary)" }} /> Recent GitHub Activity
            </h3>
            <div className="space-y-3">
                {activities.slice(0, 8).map((a, i) => (
                    <div key={i} className="flex items-start gap-2">
                        <div className="mt-0.5 shrink-0">{activityIcons[a.type] || <div className="w-3 h-3" />}</div>
                        <div className="flex-1 min-w-0">
                            <span className="text-xs block truncate" style={{ color: "var(--hive-text-secondary)" }}>{a.message}</span>
                            <span className="text-xs" style={{ color: "var(--hive-text-muted)" }}>{timeAgo(a.created_at)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

/* === MAIN === */
export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [ghProfile, setGhProfile] = useState<GitHubProfileData | null>(null);
    const [ghActivities, setGhActivities] = useState<GitHubActivity[]>([]);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [ghNotLinked, setGhNotLinked] = useState(false);

    useEffect(() => {
        if (authLoading || !user) return;

        async function load() {
            setLoadingProfile(true);
            try {
                // Fetch user profile and GitHub profile in parallel
                const [userRes, ghRes] = await Promise.allSettled([
                    apiGet<UserProfile>("/api/users/me/"),
                    apiGet<GitHubProfileData>("/api/github/profile/"),
                ]);

                if (userRes.status === "fulfilled") setProfile(userRes.value);
                if (ghRes.status === "fulfilled") {
                    setGhProfile(ghRes.value);
                    // Also fetch GitHub events
                    try {
                        const eventsRes = await apiGet<{ activities: GitHubActivity[] }>("/api/github/events/");
                        setGhActivities(eventsRes.activities);
                    } catch {}
                } else {
                    setGhNotLinked(true);
                }
            } catch {}
            setLoadingProfile(false);
        }
        load();
    }, [user, authLoading]);

    async function handleGhSync() {
        try {
            const data = await apiPost<GitHubProfileData>("/api/github/sync/");
            setGhProfile(data);
            // Refresh events
            try {
                const eventsRes = await apiGet<{ activities: GitHubActivity[] }>("/api/github/events/");
                setGhActivities(eventsRes.activities);
            } catch {}
        } catch {}
    }

    // Derived display values
    const displayName = profile
        ? `${profile.first_name} ${profile.last_name}`.trim() || profile.username
        : user?.displayName || user?.email?.split("@")[0] || "Builder";
    const avatarUrl = ghProfile?.avatar_url || profile?.profile?.avatar_url || user?.photoURL || "";
    const avatarLetter = displayName[0]?.toUpperCase() || "?";
    const headline = profile?.profile?.headline || "";
    const bio = profile?.profile?.bio || ghProfile?.bio || "";
    const location = ghProfile?.location || "";
    const githubHandle = ghProfile?.github_username || profile?.profile?.github_handle || "";
    const streak = profile?.profile?.current_streak || 0;
    const elo = profile?.profile?.elo_rating || 1000;
    const xp = profile?.profile?.total_xp || 0;

    if (authLoading || loadingProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--hive-bg-primary)" }}>
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--hive-accent-primary)" }} />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen" style={{ background: "var(--hive-bg-primary)" }}>
                <Sidebar />
                <main className="lg:ml-64 min-h-screen p-6 flex items-center justify-center">
                    <div className="glass-card p-10 text-center max-w-md">
                        <User className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--hive-text-muted)" }} />
                        <h2 className="text-xl font-bold mb-2">Sign in to view your profile</h2>
                        <p className="text-sm mb-6" style={{ color: "var(--hive-text-secondary)" }}>
                            Your engineering identity awaits. Sign in to get started.
                        </p>
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
                            style={{ background: "var(--hive-gradient-primary)" }}
                        >
                            Sign In <ExternalLink className="w-4 h-4" />
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

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
                            {avatarUrl ? (
                                <img src={avatarUrl} alt={displayName} className="w-24 h-24 rounded-2xl object-cover shrink-0" />
                            ) : (
                                <div
                                    className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold shrink-0"
                                    style={{ background: "var(--hive-gradient-primary)", color: "white" }}
                                >
                                    {avatarLetter}
                                </div>
                            )}

                            <div className="flex-1">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h1 className="text-2xl font-bold">{displayName}</h1>
                                    {streak > 0 && (
                                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: "rgba(0,212,255,0.1)", color: "var(--hive-accent-primary)" }}>
                                            <Flame className="w-3 h-3" /> {streak} day streak
                                        </div>
                                    )}
                                </div>
                                {headline && <p className="text-sm mt-1" style={{ color: "var(--hive-text-secondary)" }}>{headline}</p>}
                                {bio && <p className="text-sm mt-2" style={{ color: "var(--hive-text-secondary)" }}>{bio}</p>}
                                <div className="flex items-center gap-4 mt-3 flex-wrap">
                                    {location && (
                                        <span className="flex items-center gap-1 text-xs" style={{ color: "var(--hive-text-muted)" }}>
                                            <MapPin className="w-3 h-3" /> {location}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1 text-xs" style={{ color: "var(--hive-text-muted)" }}>
                                        <Calendar className="w-3 h-3" /> Joined {ghProfile?.github_created_at ? new Date(ghProfile.github_created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Hive"}
                                    </span>
                                    {githubHandle && (
                                        <a href={`https://github.com/${githubHandle}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs" style={{ color: "var(--hive-accent-primary)" }}>
                                            <Github className="w-3 h-3" /> {githubHandle} <ExternalLink className="w-3 h-3" />
                                        </a>
                                    )}
                                </div>

                                {/* Social Stats */}
                                {ghProfile && (
                                    <div className="flex items-center gap-6 mt-4">
                                        <span className="text-sm"><strong>{ghProfile.followers}</strong> <span style={{ color: "var(--hive-text-muted)" }}>followers</span></span>
                                        <span className="text-sm"><strong>{ghProfile.following}</strong> <span style={{ color: "var(--hive-text-muted)" }}>following</span></span>
                                        <span className="text-sm"><strong>{ghProfile.public_repos}</strong> <span style={{ color: "var(--hive-text-muted)" }}>repos</span></span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* GitHub Link or Stats */}
                    {ghNotLinked && !ghProfile ? (
                        <LinkGitHubCard onLinked={(data) => { setGhProfile(data); setGhNotLinked(false); }} />
                    ) : ghProfile ? (
                        <GitHubStatsCard gh={ghProfile} onSync={handleGhSync} />
                    ) : null}

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Left Column */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Top Languages */}
                            {ghProfile && <LanguagesCard languages={ghProfile.top_languages} />}

                            {/* Top Repos */}
                            {ghProfile && <TopReposCard repos={ghProfile.top_repos} />}
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Quick Stats */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5">
                                <h3 className="text-sm font-semibold mb-4">Hive Stats</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs" style={{ color: "var(--hive-text-muted)" }}>ELO Rating</span>
                                        <span className="text-sm font-bold" style={{ color: "var(--hive-accent-warning)" }}>{elo}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs" style={{ color: "var(--hive-text-muted)" }}>Total XP</span>
                                        <span className="text-sm font-bold gradient-text">{xp >= 1000 ? `${(xp / 1000).toFixed(1)}K` : xp}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs" style={{ color: "var(--hive-text-muted)" }}>Streak</span>
                                        <span className="text-sm font-bold" style={{ color: "var(--hive-accent-success)" }}>{streak} days</span>
                                    </div>
                                    {ghProfile && (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs" style={{ color: "var(--hive-text-muted)" }}>GitHub Stars</span>
                                                <span className="text-sm font-bold" style={{ color: "#FFD700" }}>{ghProfile.total_stars_received}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs" style={{ color: "var(--hive-text-muted)" }}>Public Repos</span>
                                                <span className="text-sm font-bold" style={{ color: "var(--hive-accent-primary)" }}>{ghProfile.public_repos}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </motion.div>

                            {/* GitHub Activity */}
                            {ghActivities.length > 0 && (
                                <GitHubActivityCard activities={ghActivities} />
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
