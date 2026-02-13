"use client";

import { motion, useInView } from "framer-motion";
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
    Sparkles,
    Target,
    Zap as Lightning,
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
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

/* === CHALLENGE DATA TYPES === */
interface Challenge {
    id: number;
    title: string;
    description: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    points: number;
    solves?: number; // Optional, might not be in API yet
    timeLimit?: string; // Optional, might not be in API yet
}

/* === LEADERBOARD DATA TYPES === */
interface LeaderboardEntry {
    username: string;
    cf_handle: string;
    cf_rating: number; // mapped from cf_rating
    cf_rank: string; // mapped from cf_rank
    cf_avatar?: string;
    combined_score: number;
    display_name?: string;
}

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

import { Sidebar } from "@/components/Sidebar";

/* === WEEKLY CONTEST BANNER === */
function WeeklyContestBanner() {
    const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 32, seconds: 18 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { days, hours, minutes, seconds } = prev;
                seconds--;
                if (seconds < 0) {
                    seconds = 59;
                    minutes--;
                }
                if (minutes < 0) {
                    minutes = 59;
                    hours--;
                }
                if (hours < 0) {
                    hours = 23;
                    days--;
                }
                return { days, hours, minutes, seconds };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative overflow-hidden glass-card-interactive p-6 border-2"
            style={{ borderColor: "var(--hive-accent-primary)" }}
        >
            <div className="absolute inset-0 grid-bg opacity-20" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-glow-pulse" />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center animate-float" style={{ background: "var(--hive-gradient-primary)" }}>
                        <Lightning className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="w-4 h-4" style={{ color: "var(--hive-accent-primary)" }} />
                            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--hive-accent-primary)" }}>Weekly Contest</span>
                        </div>
                        <h3 className="text-xl font-bold gradient-text-shimmer">Algorithmic Showdown #47</h3>
                        <p className="text-xs mt-1" style={{ color: "var(--hive-text-muted)" }}>5 problems • 2 hours • $500 prize pool</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                        {[
                            { label: "DAYS", value: timeLeft.days },
                            { label: "HRS", value: timeLeft.hours },
                            { label: "MIN", value: timeLeft.minutes },
                            { label: "SEC", value: timeLeft.seconds },
                        ].map((item, i) => (
                            <div key={item.label} className="flex flex-col items-center">
                                <div className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg" style={{ background: "rgba(0,212,255,0.1)", color: "var(--hive-accent-primary)", border: "1px solid rgba(0,212,255,0.3)" }}>
                                    {String(item.value).padStart(2, '0')}
                                </div>
                                <span className="text-[10px] mt-1 font-medium" style={{ color: "var(--hive-text-muted)" }}>{item.label}</span>
                            </div>
                        ))}
                    </div>
                    <button className="btn-primary ml-4 px-6 py-3 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Register
                    </button>
                </div>
            </div>
        </motion.div>
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

/* === RANK TIERS VISUAL LEGEND === */
function RankTiersLegend() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
        >
            <h3 className="font-semibold text-sm mb-5 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" style={{ color: "var(--hive-accent-primary)" }} />
                Codeforces Rank Tiers
            </h3>
            <div className="space-y-3">
                {cfRankTiers.map((tier, index) => {
                    const progress = ((3000 - tier.minRating) / 3000) * 100;
                    return (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 0.1 + index * 0.05 }}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <div style={{ color: tier.color }}>{tier.icon}</div>
                                    <span className="text-xs font-medium" style={{ color: tier.color }}>{tier.name}</span>
                                </div>
                                <span className="text-xs font-mono" style={{ color: "var(--hive-text-muted)" }}>{tier.minRating}+</span>
                            </div>
                            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={isInView ? { width: `${100 - progress}%` } : {}}
                                    transition={{ delay: 0.2 + index * 0.05, duration: 0.6, ease: "easeOut" }}
                                    className="h-full rounded-full"
                                    style={{ background: tier.color, boxShadow: `0 0 10px ${tier.color}40` }}
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

/* === ENHANCED LEADERBOARD === */
function EnhancedLeaderboard({
    leaderboard,
    getRankColor,
    loading,
}: {
    leaderboard: LeaderboardEntry[];
    getRankColor: (rating: number) => string;
    loading: boolean;
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <div ref={ref} className="lg:col-span-2">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Crown className="w-5 h-5 glow-cyan" style={{ color: "#FFD700" }} />
                <span className="gradient-text-warm">Global Leaderboard</span>
            </h2>
            {loading ? (
                <div className="glass-card p-10 flex justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
                </div>
            ) : leaderboard.length === 0 ? (
                <div className="glass-card p-5 text-center text-sm text-gray-400">
                    No ranked players yet. Link your Codeforces account!
                </div>
            ) : (
                <div className="glass-card p-5 space-y-3">
                    {leaderboard.slice(0, 10).map((p, i) => {
                        const isTop3 = i < 3;
                        const isFirst = i === 0;
                        const color = p.cf_rating > 0 ? getRankColor(p.cf_rating) : "#808080";

                        return (
                            <motion.div
                                key={p.username}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                                transition={{ delay: i * 0.1, duration: 0.4 }}
                                className={`relative flex items-center gap-4 p-3 rounded-xl transition-all cursor-pointer group ${isTop3 ? "hover:scale-[1.02]" : "hover:translate-x-1"
                                    }`}
                                style={{
                                    background: isFirst
                                        ? "linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,215,0,0.05))"
                                        : isTop3
                                            ? "rgba(255,255,255,0.05)"
                                            : "rgba(255,255,255,0.02)",
                                    border: isFirst ? "1px solid rgba(255,215,0,0.3)" : "1px solid transparent",
                                }}
                            >
                                {isFirst && (
                                    <>
                                        <div
                                            className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center animate-pulse-glow"
                                            style={{ background: "linear-gradient(135deg, #FFD700, #FFA500)" }}
                                        >
                                            <Crown className="w-4 h-4 text-white" />
                                        </div>
                                        <div
                                            className="absolute inset-0 rounded-xl"
                                            style={{ boxShadow: "0 0 30px rgba(255,215,0,0.2)" }}
                                        />
                                    </>
                                )}

                                <div className="w-10 text-center">
                                    {isTop3 ? (
                                        <div className={isFirst ? "animate-float" : ""}>{rankIcons[i]}</div>
                                    ) : (
                                        <span className="text-sm font-bold" style={{ color: "var(--hive-text-muted)" }}>
                                            #{i + 1}
                                        </span>
                                    )}
                                </div>

                                <div
                                    className="rounded-full flex items-center justify-center text-sm font-bold transition-transform group-hover:scale-110"
                                    style={{
                                        width: isFirst ? "48px" : isTop3 ? "40px" : "32px",
                                        height: isFirst ? "48px" : isTop3 ? "40px" : "32px",
                                        background: isFirst
                                            ? "linear-gradient(135deg, #FFD700, #FFA500)"
                                            : "var(--hive-bg-elevated)",
                                        color: isFirst ? "#000" : "var(--hive-text-primary)",
                                        boxShadow: isTop3
                                            ? `0 0 0 2px ${isFirst
                                                ? "rgba(255,215,0,0.5)"
                                                : i === 1
                                                    ? "rgba(192,192,192,0.5)"
                                                    : "rgba(205,127,50,0.5)"
                                            }`
                                            : "none",
                                    }}
                                >
                                    {p.username[0].toUpperCase()}
                                </div>

                                <div className="flex-1">
                                    <div
                                        className={`font-semibold ${isFirst ? "text-base" : "text-sm"}`}
                                        style={{ color: isFirst ? "#FFD700" : "var(--hive-text-primary)" }}
                                    >
                                        {p.display_name || p.username}
                                    </div>
                                    <div className="text-xs" style={{ color: color }}>
                                        {p.cf_rank || "Unranked"}
                                    </div>
                                </div>

                                <div className="flex flex-col items-end">
                                    <div
                                        className={`font-bold ${isFirst ? "text-lg" : "text-sm"}`}
                                        style={{ color: color }}
                                    >
                                        {p.cf_rating}
                                    </div>
                                    <div className="text-xs" style={{ color: "var(--hive-text-muted)" }}>
                                        Rating
                                    </div>
                                </div>

                                {isTop3 && (
                                    <div
                                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                                        style={{
                                            background: `radial-gradient(circle at center, ${color}10, transparent)`,
                                        }}
                                    />
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

/* === MAIN PAGE === */
export default function ArenaPage() {
    const heroRef = useRef(null);
    const challengesRef = useRef(null);
    const isHeroInView = useInView(heroRef, { once: true });
    const isChallengesInView = useInView(challengesRef, { once: true });

    const { user, loading: authLoading } = useAuth();
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [challengesData, leaderboardData]: [any, any] = await Promise.all([
                    apiGet<Challenge[]>("/api/arena/challenges/"),
                    apiGet<LeaderboardEntry[]>("/api/arena/leaderboard/"),
                ]);

                const challengesList = Array.isArray(challengesData) ? challengesData : (challengesData.results || []);
                const leaderboardList = Array.isArray(leaderboardData) ? leaderboardData : (leaderboardData.results || []);

                setChallenges(challengesList);
                setLeaderboard(leaderboardList);
            } catch (error) {
                console.error("Failed to fetch arena data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Helper to get color for a rank
    const getRankColor = (rating: number) => {
        const tier = cfRankTiers.find((t) => rating >= t.minRating);
        return tier ? tier.color : "#808080";
    };

    return (
        <div className="min-h-screen relative overflow-hidden" style={{ background: "var(--hive-bg-primary)" }}>
            {/* Floating Decorative Orbs */}
            <div className="fixed top-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-glow-pulse pointer-events-none" />
            <div className="fixed bottom-40 left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-glow-pulse pointer-events-none" style={{ animationDelay: "1s" }} />
            <div className="fixed top-1/2 right-1/3 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: "2s" }} />

            <Sidebar />

            <main className="lg:ml-64 min-h-screen">
                {/* Dramatic Hero Section */}
                <div
                    ref={heroRef}
                    className="relative overflow-hidden border-b"
                    style={{ borderColor: "var(--hive-border)" }}
                >
                    <div className="absolute inset-0 grid-bg opacity-30" />
                    <div className="absolute inset-0 dot-grid opacity-20" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/20 rounded-full blur-3xl" />

                    <div className="relative max-w-5xl mx-auto px-6 py-16">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6 }}
                            className="text-center"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                                style={{
                                    background: "rgba(0,212,255,0.1)",
                                    border: "1px solid rgba(0,212,255,0.3)",
                                }}
                            >
                                <Flame className="w-4 h-4 animate-pulse" style={{ color: "var(--hive-accent-warning)" }} />
                                <span
                                    className="text-xs font-semibold uppercase tracking-wider"
                                    style={{ color: "var(--hive-accent-primary)" }}
                                >
                                    Elite Competitive Programming
                                </span>
                            </motion.div>

                            <h1 className="text-5xl md:text-6xl font-black mb-4">
                                Welcome to the{" "}
                                <span className="gradient-text-shimmer block mt-2">ARENA</span>
                            </h1>

                            <p
                                className="text-lg max-w-2xl mx-auto mb-8"
                                style={{ color: "var(--hive-text-secondary)" }}
                            >
                                Prove your craft. Climb the Codeforces ranks. Compete with the world's best.
                                <br />
                                <span className="gradient-text-aurora font-semibold">Your legacy starts here.</span>
                            </p>

                            <div className="flex items-center justify-center gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-2 h-2 rounded-full animate-pulse"
                                        style={{ background: "var(--hive-accent-success)" }}
                                    />
                                    <span style={{ color: "var(--hive-text-muted)" }}>{leaderboard.length + 1200} Active Competitors</span>
                                </div>
                                <div className="w-px h-4" style={{ background: "var(--hive-border)" }} />
                                <div className="flex items-center gap-2">
                                    <Trophy className="w-4 h-4" style={{ color: "var(--hive-accent-warning)" }} />
                                    <span style={{ color: "var(--hive-text-muted)" }}>$2,500 Weekly Prizes</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto p-6 space-y-8">
                    {/* Weekly Contest Banner */}
                    <WeeklyContestBanner />

                    {/* Link CF + Rank Tiers */}
                    <div className="grid lg:grid-cols-2 gap-6">
                        <LinkCodeforcesCard />
                        <RankTiersLegend />
                    </div>

                    <div className="grid lg:grid-cols-5 gap-6">
                        {/* Enhanced Challenges */}
                        <div ref={challengesRef} className="lg:col-span-3 space-y-4">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Code2 className="w-5 h-5" style={{ color: "var(--hive-accent-primary)" }} />
                                <span className="gradient-text">Active Challenges</span>
                            </h2>

                            {loading ? (
                                <div className="flex justify-center p-10">
                                    <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
                                </div>
                            ) : challenges.length === 0 ? (
                                <div className="glass-card p-8 text-center text-gray-400">
                                    No active challenges at the moment.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {challenges.map((c, i) => (
                                        <motion.div
                                            key={c.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={isChallengesInView ? { opacity: 1, x: 0 } : {}}
                                            transition={{ delay: i * 0.08 }}
                                            className="glass-card-interactive relative group cursor-pointer overflow-hidden"
                                        >
                                            {/* Colored Left Border Accent on Hover */}
                                            <motion.div
                                                className="absolute left-0 top-0 bottom-0 w-1"
                                                initial={{ scaleY: 0 }}
                                                whileHover={{ scaleY: 1 }}
                                                transition={{ duration: 0.2 }}
                                                style={{
                                                    background: difficultyColors[c.difficulty],
                                                    transformOrigin: "top",
                                                }}
                                            />

                                            <div className="p-5 flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="font-semibold text-sm group-hover:gradient-text transition-all">
                                                            {c.title}
                                                        </h3>
                                                        <span
                                                            className="text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wide"
                                                            style={{
                                                                background: `color-mix(in srgb, ${difficultyColors[c.difficulty]
                                                                    } 20%, transparent)`,
                                                                color: difficultyColors[c.difficulty],
                                                                border: `1px solid ${difficultyColors[c.difficulty]}40`,
                                                            }}
                                                        >
                                                            {c.difficulty}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-5">
                                                        <span
                                                            className="text-xs flex items-center gap-1.5"
                                                            style={{ color: "var(--hive-text-muted)" }}
                                                        >
                                                            <Trophy className="w-3.5 h-3.5" style={{ color: "var(--hive-accent-warning)" }} />
                                                            <span
                                                                className="font-semibold"
                                                                style={{ color: "var(--hive-accent-warning)" }}
                                                            >
                                                                {c.points}
                                                            </span>{" "}
                                                            pts
                                                        </span>
                                                        <span
                                                            className="text-xs flex items-center gap-1.5"
                                                            style={{ color: "var(--hive-text-muted)" }}
                                                        >
                                                            <Users className="w-3.5 h-3.5" />
                                                            {/* Mock solves if specific field not available */}
                                                            {(c.solves || Math.floor(c.points * 0.8)).toLocaleString()} solves
                                                        </span>
                                                        <span
                                                            className="text-xs flex items-center gap-1.5"
                                                            style={{ color: "var(--hive-text-muted)" }}
                                                        >
                                                            <Clock className="w-3.5 h-3.5" />
                                                            {/* Mock timeLimit for now */}
                                                            {c.timeLimit || "60 min"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <ChevronRight
                                                    className="w-5 h-5 transition-transform group-hover:translate-x-1"
                                                    style={{ color: "var(--hive-text-muted)" }}
                                                />
                                            </div>

                                            {/* Hover Glow Effect */}
                                            <div
                                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                                                style={{
                                                    background: `radial-gradient(circle at right, ${difficultyColors[c.difficulty]
                                                        }08, transparent 70%)`,
                                                }}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Enhanced Leaderboard */}
                        <EnhancedLeaderboard leaderboard={leaderboard} getRankColor={getRankColor} loading={loading} />
                    </div>
                </div>
            </main>
        </div>
    );
}
