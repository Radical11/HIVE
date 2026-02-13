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
import { useState, useEffect } from "react";
import { apiGet, apiPost } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

/* === TYPES === */
interface Channel {
    id: number;
    name: string;
    description: string;
    slug: string;
    color: string;
    // Mocked for now on frontend or needs backend aggregation
    members?: number;
    unread?: number;
}

interface Thread {
    id: number;
    title: string;
    content: string;
    author: {
        id: number;
        username: string;
    };
    channel: string; // slug
    channel_slug: string;
    channel_color: string;
    created_at: string;
    updated_at: string;
    pinned: boolean;
    views: number;
    tags: string[];
    reply_count: number;
    vote_count: number;
    user_vote: number;
}

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
function FeaturedDiscussion({ thread }: { thread: Thread }) {
    if (!thread) return null;

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
                    <span className="text-2xl font-bold gradient-text">{thread.vote_count}</span>
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
                            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: thread.channel_color }} />
                            <span className="text-xs font-medium" style={{ color: "var(--hive-text-secondary)" }}>#{thread.channel_slug}</span>
                        </div>
                        {thread.vote_count > 10 && (
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: "rgba(239,68,68,0.1)" }}>
                                <Flame className="w-3 h-3" style={{ color: "#ef4444" }} />
                                <span className="text-xs font-bold" style={{ color: "#ef4444" }}>Hot</span>
                            </div>
                        )}
                    </div>

                    <h2 className="text-2xl font-bold mb-3 leading-tight" style={{ color: "var(--hive-text-primary)" }}>
                        {thread.title}
                    </h2>

                    <div className="flex items-center gap-4 mb-4 text-sm" style={{ color: "var(--hive-text-muted)" }}>
                        <span>
                            by <span className="gradient-text font-medium">{thread.author.username}</span>
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" /> {getTimeAgo(thread.created_at)}
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
                            <span className="text-sm font-semibold">{thread.reply_count} replies</span>
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
function ThreadCard({ thread, index }: { thread: Thread; index: number }) {
    const isHot = thread.vote_count > 50;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="glass-card-interactive p-5 relative overflow-hidden"
            style={{
                borderLeft: `3px solid ${thread.channel_color}`,
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
                    <span className="text-base font-bold gradient-text">{thread.vote_count}</span>
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
                            by <span style={{ color: "var(--hive-accent-primary)", fontWeight: 500 }}>{thread.author.username}</span>
                        </span>
                        <span className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: thread.channel_color }} />
                            #{thread.channel_slug}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {getTimeAgo(thread.created_at)}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {thread.tags && thread.tags.map((tag) => (
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
                        <span className="text-xs font-semibold">{thread.reply_count}</span>
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
function ChannelItem({ channel, isActive, onClick }: { channel: Channel; isActive: boolean; onClick: () => void }) {
    return (
        <motion.button
            onClick={onClick}
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
                    #{channel.slug}
                </span>
            </div>
            {(channel.members || channel.unread) && (
                <div className="flex items-center gap-2">
                    {channel.members && (
                        <span className="text-xs" style={{ color: "var(--hive-text-muted)" }}>
                            {channel.members.toLocaleString()}
                        </span>
                    )}
                    {channel.unread ? (
                        <span className="px-1.5 py-0.5 rounded-full text-xs font-bold glow-cyan" style={{ background: "var(--hive-accent-primary)", color: "white", fontSize: "10px" }}>
                            {channel.unread}
                        </span>
                    ) : null}
                </div>
            )}
        </motion.button>
    );
}

/* === MAIN PAGE === */
export default function ForumPage() {
    const { user } = useAuth();
    const [activeFilter, setActiveFilter] = useState("all");
    const [activeChannel, setActiveChannel] = useState<string | null>(null);
    const [channels, setChannels] = useState<Channel[]>([]);
    const [threads, setThreads] = useState<Thread[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchChannels() {
            try {
                const data: any = await apiGet<Channel[]>("/api/forum/channels/");
                const channelList = Array.isArray(data) ? data : (data.results || []);
                setChannels(channelList);
            } catch (error) {
                console.error("Failed to fetch channels:", error);
            }
        }
        fetchChannels();
    }, []);

    useEffect(() => {
        async function fetchThreads() {
            setIsLoading(true);
            try {
                let url = "/api/forum/threads/";
                const params = new URLSearchParams();
                if (activeChannel) {
                    params.append("channel", activeChannel);
                }
                // Add more filters if backend supports them directly, e.g. ordering
                if (activeFilter === "hot") {
                    params.append("ordering", "-votes"); // Assuming backend ordering
                } else if (activeFilter === "new") {
                    params.append("ordering", "-created_at");
                }

                if (params.toString()) {
                    url += `?${params.toString()}`;
                }

                const data: any = await apiGet<Thread[]>(url);
                const threadList = Array.isArray(data) ? data : (data.results || []);
                setThreads(threadList);
            } catch (error) {
                console.error("Failed to fetch threads:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchThreads();
    }, [activeChannel, activeFilter, user]);


    const featuredThread = threads.length > 0 ? threads.reduce((max, thread) => (thread.vote_count > max.vote_count ? thread : max), threads[0]) : null;
    const regularThreads = featuredThread ? threads.filter((t) => t.id !== featuredThread.id) : threads;

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
                                    <motion.button
                                        onClick={() => setActiveChannel(null)}
                                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all relative overflow-hidden"
                                        style={{
                                            background: !activeChannel ? "rgba(0,212,255,0.1)" : "transparent",
                                            border: !activeChannel ? "1px solid var(--hive-accent-primary)" : "1px solid transparent",
                                        }}
                                    >
                                        <span style={{ color: !activeChannel ? "var(--hive-accent-primary)" : "var(--hive-text-secondary)" }}>All Channels</span>
                                    </motion.button>

                                    {channels.map((ch) => (
                                        <ChannelItem
                                            key={ch.slug}
                                            channel={ch}
                                            isActive={activeChannel === ch.slug}
                                            onClick={() => setActiveChannel(ch.slug)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Main Content Area */}
                        <div className="lg:col-span-3 space-y-6">
                            {isLoading ? (
                                <div className="flex justify-center py-20">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
                                </div>
                            ) : (
                                <>
                                    {/* Featured Discussion */}
                                    {featuredThread && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            <FeaturedDiscussion thread={featuredThread} />
                                        </motion.div>
                                    )}

                                    {/* Regular Threads */}
                                    <div className="space-y-4">
                                        {regularThreads.map((thread, index) => (
                                            <ThreadCard key={thread.id} thread={thread} index={index} />
                                        ))}
                                        {threads.length === 0 && (
                                            <div className="text-center py-10 opacity-50">
                                                No threads found. Be the first to start a discussion!
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
