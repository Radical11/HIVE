"use client";

import { useEffect, useState } from "react";
import { Trophy, Clock, ChevronRight, Calendar, Flame, Zap } from "lucide-react";
import { battles, leaderboard, users } from "@/lib/data";
import { getMe, ApiUser } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import PageWrapper from "@/components/PageWrapper";

export default function ArenaPage() {
    const { firebaseUser, hiveUser } = useAuth();
    const [profileUser, setProfileUser] = useState<ApiUser | null>(null);

    useEffect(() => {
        if (firebaseUser) {
            getMe().then(setProfileUser).catch(() => null);
        }
    }, [firebaseUser]);

    const isDemo = !profileUser && !hiveUser;

    // Helpers to safely get user data whether it's ApiUser or User
    const getAvatar = () => {
        if (profileUser?.profile?.avatar_url) return profileUser.profile.avatar_url;
        if (firebaseUser?.photoURL) return firebaseUser.photoURL;
        const u = hiveUser || users[0];
        if ('avatar' in u) return u.avatar;
        return `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${u.username}`;
    };

    const getName = () => {
        if (profileUser) return `${profileUser.first_name} ${profileUser.last_name}`.trim() || profileUser.username;
        const u = hiveUser || users[0];
        if ('name' in u) return u.name;
        return u.username;
    };

    const username = profileUser?.username || hiveUser?.username || users[0].username;

    const getStat = (field: 'streak' | 'xp' | 'rank') => {
        if (profileUser?.profile) {
            if (field === 'streak') return profileUser.profile.current_streak;
            if (field === 'xp') return profileUser.profile.total_xp;
            if (field === 'rank') return 125; // Real rank not yet in API
        }
        if (isDemo) {
            if (field === 'streak') return 47;
            if (field === 'xp') return 12450;
            if (field === 'rank') return 4291;
        }
        return 0;
    };

    // Client-side battle timers
    const [timers, setTimers] = useState<Record<string, number>>({});
    useEffect(() => {
        const initial: Record<string, number> = {};
        battles.forEach((b) => { initial[b.id] = b.timeLeft; });
        setTimers(initial);
        const interval = setInterval(() => {
            setTimers((prev) => {
                const next = { ...prev };
                Object.keys(next).forEach((k) => { if (next[k] > 0) next[k]--; });
                return next;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, "0")}`;
    };

    return (
        <PageWrapper theme="amber">
            <div className="max-w-full mx-auto px-8 py-6">
                <div className="flex gap-8">
                    {/* Left Sidebar */}
                    <div className="w-72 shrink-0 hidden lg:block space-y-4">
                        {/* User Stats */}
                        <div className="card p-5 text-center">
                            <img
                                src={getAvatar()}
                                alt={username}
                                className="w-20 h-20 rounded-full border-2 border-border-primary mx-auto mb-3 object-cover"
                            />
                            <h3 className="text-sm font-semibold text-text-primary mb-3">
                                {getName()}
                            </h3>
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] text-text-faint">Global Rank</span>
                                    <span className="text-sm font-bold text-accent font-mono">#{getStat('rank').toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] text-text-faint">Arena XP</span>
                                    <span className="text-sm font-bold text-secondary font-mono">
                                        {getStat('xp').toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] text-text-faint">Daily Streak</span>
                                    <span className="text-sm font-bold text-success font-mono">
                                        {getStat('streak')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Achievements */}
                        <div className="card p-4">
                            <h4 className="text-[10px] font-bold text-text-faint uppercase tracking-widest mb-3">Achievements</h4>
                            <div className="flex gap-2">
                                {["🥇", "🔥", "⚡", "🎯"].map((emoji, i) => (
                                    <div key={`ach-${i}`} className="w-9 h-9 rounded-lg bg-bg-surface-alt border border-border-subtle flex items-center justify-center text-sm hover:border-accent/30 transition-colors cursor-pointer">
                                        {emoji}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upcoming */}
                        <div className="card p-4">
                            <h4 className="text-[10px] font-bold text-text-faint uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                <Calendar size={11} /> Upcoming
                            </h4>
                            <div className="space-y-3">
                                {[
                                    { name: "Rust Foundationals", date: "24", month: "OCT", tag: "IN 3 WEEKS" },
                                    { name: "AI Prompt Battles", date: "28", month: "OCT", tag: "LIVE IN 6HRS" },
                                ].map((sprint, i) => (
                                    <div key={`sprint-${i}`} className="flex items-start gap-3">
                                        <div className="text-center shrink-0">
                                            <div className="text-[9px] text-text-faint font-mono">{sprint.month}</div>
                                            <div className="text-lg font-bold text-text-primary">{sprint.date}</div>
                                        </div>
                                        <div>
                                            <span className="text-xs text-text-secondary">{sprint.name}</span>
                                            <div className="text-[9px] text-accent font-mono font-bold">{sprint.tag}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main */}
                    <div className="flex-1 min-w-0">
                        {/* Live Event Banner */}
                        <div className="card p-6 mb-6 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />
                            <div className="relative">
                                <span className="badge-live inline-flex items-center gap-1.5 mb-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                    LIVE EVENT
                                </span>
                                <h2 className="text-2xl font-black text-accent uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-mono)" }}>
                                    DEVSPACE-CSI
                                </h2>
                                <p className="text-xs text-text-faint mb-4">Sprint Championship Series · 248 participants</p>

                                {/* Podium */}
                                <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
                                    {[
                                        { name: "ALEX", rank: 1, badge: "🥇" },
                                        { name: "JOHN", rank: 2, badge: "🥈" },
                                        { name: "ESHAN", rank: 3, badge: "🥉" },
                                    ].map((p) => (
                                        <div key={`podium-${p.rank}`} className="card-alt p-3 hover:border-accent/30 transition-colors">
                                            <div className="text-lg mb-1">{p.badge}</div>
                                            <div className="text-xs font-bold text-text-primary uppercase">{p.name}</div>
                                            <div className="text-[9px] text-text-faint font-mono">RANK #{p.rank}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Active Battles */}
                        <div className="mb-6">
                            <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                                <Zap size={14} className="text-accent" /> Active Battles
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {battles.map((battle) => (
                                    <div key={`battle-${battle.id}`} className="card p-4 hover:border-accent/30 transition-colors cursor-pointer group">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-text-primary">{battle.title}</span>
                                            <span className={`text-[9px] font-mono font-bold ${(timers[battle.id] || 0) < 600 ? "text-error" : "text-accent"
                                                }`}>
                                                <Clock size={10} className="inline mr-1" />
                                                {formatTime(timers[battle.id] || 0)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent-dim text-accent font-mono">{battle.difficulty}</span>
                                            <span className="text-[9px] text-text-faint">{battle.type}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] text-text-faint">👥 {battle.spectators} watching</span>
                                            <span className="text-[9px] text-accent font-mono">{battle.prize}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Leaderboard */}
                        <div className="card overflow-hidden">
                            <div className="px-5 py-4 border-b border-border-primary flex items-center justify-between">
                                <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                                    <Trophy size={14} className="text-accent" /> Global Rankings
                                </h3>
                                <span className="text-[10px] text-text-faint">Updated 2m ago</span>
                            </div>
                            <div>
                                {leaderboard.map((entry) => (
                                    <div
                                        key={`lb-${entry.id}`}
                                        className="flex items-center gap-4 px-5 py-3 border-b border-border-subtle last:border-0 hover:bg-bg-surface-alt/50 transition-colors group cursor-pointer"
                                    >
                                        <span className={`w-7 text-sm font-bold font-mono ${entry.rank <= 3 ? "text-accent" : "text-text-faint"}`}>
                                            {entry.rank}
                                        </span>
                                        <img
                                            src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${entry.username}`}
                                            alt={entry.username}
                                            className="w-8 h-8 rounded-full border border-border-primary group-hover:border-accent/40 transition-colors"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">@{entry.username}</span>
                                            <span className={`text-[9px] ml-2 px-1.5 py-0.5 rounded-full font-mono font-bold ${entry.tier === "platinum" ? "bg-purple-dim text-purple" :
                                                entry.tier === "gold" ? "bg-warning/10 text-warning" :
                                                    entry.tier === "silver" ? "bg-bg-elevated text-text-muted" :
                                                        "bg-secondary-dim text-secondary"
                                                }`}>
                                                {entry.tier}
                                            </span>
                                        </div>
                                        <span className="text-xs font-mono text-text-primary w-14 text-right">{entry.rating}</span>
                                        <span className="text-xs font-mono text-text-muted w-10 text-right">{entry.solved}</span>
                                        <span className={`text-[10px] font-mono w-8 text-right ${entry.change > 0 ? "text-success" : entry.change < 0 ? "text-error" : "text-text-faint"
                                            }`}>
                                            {entry.change > 0 ? "↑" : entry.change < 0 ? "↓" : "−"}{Math.abs(entry.change)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="px-5 py-3 border-t border-border-primary text-center">
                                <button className="btn-outline text-xs inline-flex items-center gap-1">
                                    VIEW FULL LEADERBOARD <ChevronRight size={12} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}
