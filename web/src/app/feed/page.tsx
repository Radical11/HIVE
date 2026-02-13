"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    Github,
    Activity,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { apiGet, apiPost } from "@/lib/api";

/* === TYPES === */
interface PostAuthor {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    profile: {
        headline: string;
        avatar_url: string | null;
        bio?: string;
    };
}

interface Post {
    id: string;
    author: PostAuthor;
    content: string;
    code_snippet: string | null;
    image_url: string | null;
    type: "MANUAL" | "GITHUB_COMMIT" | "CODEFORCES_SOLVE" | "MILESTONE";
    created_at: string;
    reactions: Array<{ id: number; user: string; type: "RESPECT" | "FIRE" | "BUG" }>;
    comments: any[];
    reaction_counts: { RESPECT?: number; FIRE?: number; BUG?: number };
    comment_count: number;
}

interface UserStats {
    streak: number;
    elo: number;
    xp: number;
    github_username?: string;
}

interface GitHubActivity {
    commits: number;
    prs: number;
    stars: number;
}

/* === MOCK DATA === */
const mockPosts: Post[] = [
    {
        id: "mock-1",
        author: {
            id: "1",
            username: "sarah_dev",
            email: "sarah@example.com",
            first_name: "Sarah",
            last_name: "Dev",
            profile: { headline: "Full Stack @ Stripe", avatar_url: null },
        },
        type: "GITHUB_COMMIT",
        content: "Just shipped a major refactor of our payment processing pipeline. Reduced latency by 40% using edge functions",
        code_snippet: `// Before: 240ms avg response
const result = await processPayment(data);

// After: 145ms avg response
const result = await edge.processPayment(data, {
  region: 'auto',
  cache: 'aggressive'
});`,
        image_url: null,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        reactions: [],
        comments: [],
        reaction_counts: { RESPECT: 42, FIRE: 18, BUG: 2 },
        comment_count: 7,
    },
    {
        id: "mock-2",
        author: {
            id: "2",
            username: "algo_master",
            email: "algo@example.com",
            first_name: "Algo",
            last_name: "Master",
            profile: { headline: "CP Specialist | 2400 CF", avatar_url: null },
        },
        type: "CODEFORCES_SOLVE",
        content: "Cracked Codeforces Round #917 Div. 1 E (Hard) - Tree DP with Heavy-Light trick. Used binary lifting + segment tree combo. Took me 3 attempts but the solution is clean",
        code_snippet: null,
        image_url: null,
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        reactions: [],
        comments: [],
        reaction_counts: { RESPECT: 89, FIRE: 34, BUG: 0 },
        comment_count: 12,
    },
    {
        id: "mock-3",
        author: {
            id: "3",
            username: "cyber_ghost",
            email: "cyber@example.com",
            first_name: "Cyber",
            last_name: "Ghost",
            profile: { headline: "Security Researcher", avatar_url: null },
        },
        type: "MILESTONE",
        content: "Just earned my OSCP certification after 4 months of grinding. The exam was 24 hours of pure adrenaline. Never giving up paid off.",
        code_snippet: null,
        image_url: null,
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        reactions: [],
        comments: [],
        reaction_counts: { RESPECT: 234, FIRE: 89, BUG: 1 },
        comment_count: 31,
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
    CODEFORCES_SOLVE: <Code2 className="w-4 h-4" />,
    MILESTONE: <Target className="w-4 h-4" />,
    MANUAL: <Zap className="w-4 h-4" />,
};

const typeColors: Record<string, string> = {
    GITHUB_COMMIT: "var(--hive-accent-success)",
    CODEFORCES_SOLVE: "var(--hive-accent-warning)",
    MILESTONE: "var(--hive-accent-primary)",
    MANUAL: "var(--hive-accent-secondary)",
};

const typeLabels: Record<string, string> = {
    GITHUB_COMMIT: "Commit",
    CODEFORCES_SOLVE: "CF Solved",
    MILESTONE: "Milestone",
    MANUAL: "Post",
};

/* === UTILITIES === */
function getTimeAgo(timestamp: string): string {
    const now = Date.now();
    const diff = now - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}

import { Sidebar } from "@/components/Sidebar";

/* === COMPOSE BOX === */
function ComposeBox({ onPostCreated }: { onPostCreated: () => void }) {
    const { user } = useAuth();
    const [isExpanded, setIsExpanded] = useState(false);
    const [content, setContent] = useState("");
    const [codeSnippet, setCodeSnippet] = useState("");
    const [postType, setPostType] = useState<"MANUAL" | "MILESTONE">("MANUAL");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const displayName = user?.displayName || user?.email?.split("@")[0] || "Builder";
    const avatarLetter = displayName[0]?.toUpperCase() || "?";

    const handleSubmit = async () => {
        if (!content.trim() && !codeSnippet.trim()) return;

        setIsSubmitting(true);
        try {
            await apiPost("/api/feed/", {
                content: content.trim(),
                code_snippet: codeSnippet.trim() || null,
                type: postType,
            });

            setContent("");
            setCodeSnippet("");
            setPostType("MANUAL");
            setIsExpanded(false);
            onPostCreated();
        } catch (error) {
            console.error("Failed to create post:", error);
            alert("Failed to create post. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="glass-card p-5">
            <div className="flex items-start gap-3 mb-4">
                {user?.photoURL ? (
                    <img src={user.photoURL} alt={displayName} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: "var(--hive-gradient-primary)", color: "white" }}>
                        {avatarLetter}
                    </div>
                )}
                <div className="flex-1">
                    <textarea
                        placeholder="Share a win, post a snippet, or drop some knowledge..."
                        className="w-full bg-transparent outline-none text-sm resize-none"
                        style={{ color: "var(--hive-text-primary)", minHeight: isExpanded ? "80px" : "40px" }}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onFocus={() => setIsExpanded(true)}
                        rows={isExpanded ? 3 : 1}
                    />
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Tabs */}
                        <div className="flex items-center gap-2 mb-3">
                            <button
                                onClick={() => setPostType("MANUAL")}
                                className="px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all"
                                style={{
                                    background: postType === "MANUAL" ? "var(--hive-gradient-primary)" : "rgba(255,255,255,0.05)",
                                    color: postType === "MANUAL" ? "white" : "var(--hive-text-secondary)",
                                }}
                            >
                                <Code2 className="w-3.5 h-3.5" /> Code
                            </button>
                            <button
                                onClick={() => setPostType("MILESTONE")}
                                className="px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all"
                                style={{
                                    background: postType === "MILESTONE" ? "var(--hive-gradient-primary)" : "rgba(255,255,255,0.05)",
                                    color: postType === "MILESTONE" ? "white" : "var(--hive-text-secondary)",
                                }}
                            >
                                <Target className="w-3.5 h-3.5" /> Milestone
                            </button>
                        </div>

                        {/* Code Snippet Input */}
                        {postType === "MANUAL" && (
                            <textarea
                                placeholder="Paste your code snippet here (optional)..."
                                className="w-full p-3 rounded-lg text-xs font-mono resize-none mb-3 outline-none"
                                style={{
                                    background: "var(--hive-bg-primary)",
                                    border: "1px solid var(--hive-border)",
                                    color: "var(--hive-text-primary)",
                                    minHeight: "100px",
                                }}
                                value={codeSnippet}
                                onChange={(e) => setCodeSnippet(e.target.value)}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Actions */}
            {isExpanded && (
                <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--hive-border)" }}>
                    <button
                        onClick={() => {
                            setIsExpanded(false);
                            setContent("");
                            setCodeSnippet("");
                        }}
                        className="px-4 py-1.5 rounded-lg text-xs font-medium"
                        style={{ color: "var(--hive-text-secondary)" }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || (!content.trim() && !codeSnippet.trim())}
                        className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 disabled:opacity-50"
                        style={{ background: "var(--hive-gradient-primary)" }}
                    >
                        {isSubmitting ? "Posting..." : <><Plus className="w-3.5 h-3.5" /> Post</>}
                    </button>
                </div>
            )}
        </div>
    );
}

/* === POST CARD === */
function PostCard({ post, onReactionToggle }: { post: Post; onReactionToggle: (postId: string, type: "RESPECT" | "FIRE" | "BUG") => void }) {
    const { user } = useAuth();
    const userReactions = post.reactions.filter((r) => r.user === user?.uid);

    const hasReacted = (type: "RESPECT" | "FIRE" | "BUG") => {
        return userReactions.some((r) => r.type === type);
    };

    const getReactionIcon = (type: "RESPECT" | "FIRE" | "BUG") => {
        const isActive = hasReacted(type);
        const style = {
            color: isActive ? getReactionColor(type) : "var(--hive-text-secondary)",
        };

        switch (type) {
            case "RESPECT":
                return <Heart className="w-4 h-4" style={style} fill={isActive ? "currentColor" : "none"} />;
            case "FIRE":
                return <Flame className="w-4 h-4" style={style} fill={isActive ? "currentColor" : "none"} />;
            case "BUG":
                return <Bug className="w-4 h-4" style={style} fill={isActive ? "currentColor" : "none"} />;
        }
    };

    const getReactionColor = (type: "RESPECT" | "FIRE" | "BUG") => {
        switch (type) {
            case "RESPECT":
                return "var(--hive-accent-danger)";
            case "FIRE":
                return "var(--hive-accent-warning)";
            case "BUG":
                return "var(--hive-accent-primary)";
        }
    };

    const authorName = post.author.username || `${post.author.first_name} ${post.author.last_name}`.trim() || "Anonymous";
    const avatarLetter = authorName[0]?.toUpperCase() || "?";

    return (
        <div className="glass-card-interactive p-6">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    {post.author.profile.avatar_url ? (
                        <img src={post.author.profile.avatar_url} alt={authorName} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                            style={{ background: "var(--hive-bg-elevated)", color: "var(--hive-text-primary)" }}
                        >
                            {avatarLetter}
                        </div>
                    )}
                    <div>
                        <div className="text-sm font-semibold">{authorName}</div>
                        <div className="text-xs" style={{ color: "var(--hive-text-muted)" }}>
                            {post.author.profile.headline} · {getTimeAgo(post.created_at)}
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
            {post.code_snippet && (
                <pre
                    className="text-xs p-4 rounded-xl mb-4 overflow-x-auto font-mono"
                    style={{
                        background: "var(--hive-bg-primary)",
                        border: "1px solid var(--hive-border)",
                        color: "var(--hive-accent-primary)",
                    }}
                >
                    {post.code_snippet}
                </pre>
            )}

            {/* Reactions */}
            <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--hive-border)" }}>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => onReactionToggle(post.id, "RESPECT")}
                        className="flex items-center gap-1.5 text-xs transition-all hover:scale-110"
                    >
                        {getReactionIcon("RESPECT")} {post.reaction_counts.RESPECT || 0}
                    </button>
                    <button
                        onClick={() => onReactionToggle(post.id, "FIRE")}
                        className="flex items-center gap-1.5 text-xs transition-all hover:scale-110"
                    >
                        {getReactionIcon("FIRE")} {post.reaction_counts.FIRE || 0}
                    </button>
                    <button
                        onClick={() => onReactionToggle(post.id, "BUG")}
                        className="flex items-center gap-1.5 text-xs transition-all hover:scale-110"
                    >
                        {getReactionIcon("BUG")} {post.reaction_counts.BUG || 0}
                    </button>
                </div>
                <button className="flex items-center gap-1.5 text-xs" style={{ color: "var(--hive-text-secondary)" }}>
                    <MessageCircle className="w-4 h-4" /> {post.comment_count}
                </button>
            </div>
        </div>
    );
}

/* === RIGHT SIDEBAR === */
function RightSidebar({ userStats, githubActivity }: { userStats: UserStats | null; githubActivity: GitHubActivity | null }) {
    return (
        <aside className="hidden xl:block w-80 space-y-6">
            {/* Stats Card */}
            <div className="glass-card p-5">
                <h3 className="text-sm font-semibold mb-4">Your Stats</h3>
                {userStats ? (
                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                            <div className="text-lg font-bold gradient-text">{userStats.streak}</div>
                            <div className="text-xs" style={{ color: "var(--hive-text-muted)" }}>Streak</div>
                        </div>
                        <div>
                            <div className="text-lg font-bold" style={{ color: "var(--hive-accent-warning)" }}>{userStats.elo}</div>
                            <div className="text-xs" style={{ color: "var(--hive-text-muted)" }}>ELO</div>
                        </div>
                        <div>
                            <div className="text-lg font-bold" style={{ color: "var(--hive-accent-success)" }}>
                                {userStats.xp >= 1000 ? `${(userStats.xp / 1000).toFixed(1)}K` : userStats.xp}
                            </div>
                            <div className="text-xs" style={{ color: "var(--hive-text-muted)" }}>XP</div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-3 text-center animate-pulse">
                        <div>
                            <div className="h-6 rounded" style={{ background: "var(--hive-bg-elevated)" }} />
                            <div className="text-xs mt-1" style={{ color: "var(--hive-text-muted)" }}>Streak</div>
                        </div>
                        <div>
                            <div className="h-6 rounded" style={{ background: "var(--hive-bg-elevated)" }} />
                            <div className="text-xs mt-1" style={{ color: "var(--hive-text-muted)" }}>ELO</div>
                        </div>
                        <div>
                            <div className="h-6 rounded" style={{ background: "var(--hive-bg-elevated)" }} />
                            <div className="text-xs mt-1" style={{ color: "var(--hive-text-muted)" }}>XP</div>
                        </div>
                    </div>
                )}
            </div>

            {/* GitHub Activity */}
            {githubActivity && userStats?.github_username && (
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                        <Github className="w-4 h-4" style={{ color: "var(--hive-accent-primary)" }} />
                        GitHub Activity
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <GitCommit className="w-3.5 h-3.5" style={{ color: "var(--hive-text-muted)" }} />
                                <span className="text-sm" style={{ color: "var(--hive-text-secondary)" }}>Commits</span>
                            </div>
                            <span className="text-sm font-bold" style={{ color: "var(--hive-accent-success)" }}>{githubActivity.commits}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Activity className="w-3.5 h-3.5" style={{ color: "var(--hive-text-muted)" }} />
                                <span className="text-sm" style={{ color: "var(--hive-text-secondary)" }}>Pull Requests</span>
                            </div>
                            <span className="text-sm font-bold" style={{ color: "var(--hive-accent-warning)" }}>{githubActivity.prs}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Heart className="w-3.5 h-3.5" style={{ color: "var(--hive-text-muted)" }} />
                                <span className="text-sm" style={{ color: "var(--hive-text-secondary)" }}>Stars Earned</span>
                            </div>
                            <span className="text-sm font-bold" style={{ color: "var(--hive-accent-primary)" }}>{githubActivity.stars}</span>
                        </div>
                    </div>
                </div>
            )}

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
    );
}

/* === MAIN === */
export default function FeedPage() {
    const { user, loading: authLoading } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [githubActivity, setGithubActivity] = useState<GitHubActivity | null>(null);

    const fetchPosts = async () => {
        try {
            const data: any = await apiGet<Post[]>("/api/feed/");
            const postList = Array.isArray(data) ? data : (data.results || []);
            setPosts(postList);
        } catch (error) {
            console.error("Failed to fetch posts, using mock data:", error);
            setPosts(mockPosts); // Fallback to mocks if fail, but error logs are annoying
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserStats = async () => {
        try {
            const data = await apiGet<any>("/api/users/me/");
            setUserStats({
                streak: data.profile?.streak || 0,
                elo: data.profile?.elo || 0,
                xp: data.profile?.xp || 0,
                github_username: data.profile?.github_username,
            });

            // Fetch real GitHub stats
            if (data.profile?.github_username) {
                try {
                    const ghData = await apiGet<{
                        total_commits: number;
                        total_prs: number;
                        total_stars_received: number;
                    }>("/api/github/profile/");

                    setGithubActivity({
                        commits: ghData.total_commits,
                        prs: ghData.total_prs,
                        stars: ghData.total_stars_received,
                    });
                } catch (e) {
                    console.error("Failed to fetch GitHub profile for stats", e);
                }
            }
        } catch (error) {
            console.error("Failed to fetch user stats:", error);
        }
    };

    useEffect(() => {
        if (authLoading) return;

        if (user) {
            fetchPosts();
            fetchUserStats();
        } else {
            // Not logged in? Show mocks or nothing?
            // If we require auth, we should show "Sign in"
            setIsLoading(false);
        }
    }, [user, authLoading]);

    const handleReactionToggle = async (postId: string, type: "RESPECT" | "FIRE" | "BUG") => {
        try {
            await apiPost(`/api/feed/${postId}/react/`, { type });
            // Refetch posts to update reaction counts
            fetchPosts();
        } catch (error) {
            console.error("Failed to toggle reaction:", error);
        }
    };

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
                        <ComposeBox onPostCreated={fetchPosts} />

                        {/* Loading Skeleton */}
                        {isLoading && (
                            <div className="space-y-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="glass-card p-6 animate-pulse">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full" style={{ background: "var(--hive-bg-elevated)" }} />
                                            <div className="flex-1 space-y-2">
                                                <div className="h-3 rounded" style={{ background: "var(--hive-bg-elevated)", width: "40%" }} />
                                                <div className="h-2 rounded" style={{ background: "var(--hive-bg-elevated)", width: "60%" }} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-3 rounded" style={{ background: "var(--hive-bg-elevated)" }} />
                                            <div className="h-3 rounded" style={{ background: "var(--hive-bg-elevated)", width: "90%" }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Posts */}
                        {!isLoading && posts.map((post, i) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.4 }}
                            >
                                <PostCard post={post} onReactionToggle={handleReactionToggle} />
                            </motion.div>
                        ))}

                        {/* Empty State */}
                        {!isLoading && posts.length === 0 && (
                            <div className="glass-card p-12 text-center">
                                <Zap className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--hive-accent-primary)" }} />
                                <h3 className="text-lg font-bold mb-2">No posts yet</h3>
                                <p className="text-sm" style={{ color: "var(--hive-text-muted)" }}>
                                    Be the first to share something with the community!
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar */}
                    {!isLoading && !user ? (
                        <div className="flex-1 max-w-sm">
                            <div className="glass-card p-8 text-center sticky top-24">
                                <LogIn className="w-10 h-10 mx-auto mb-4" style={{ color: "var(--hive-accent-primary)" }} />
                                <h3 className="text-lg font-bold mb-2">Join the Hive</h3>
                                <p className="text-sm mb-6" style={{ color: "var(--hive-text-secondary)" }}>
                                    Sign in for the full experience.
                                </p>
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white w-full justify-center transition-transform hover:scale-[1.02]"
                                    style={{ background: "var(--hive-gradient-primary)" }}
                                >
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <RightSidebar userStats={userStats} githubActivity={githubActivity} />
                    )}
                </div>
            </main>
        </div>
    );
}
