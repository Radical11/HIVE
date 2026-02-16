"use client";

import { useState, useEffect } from "react";
import {
    GitCommit, Star, GitFork, ExternalLink, Calendar, Layout, Trophy, Flame, MapPin, Globe,
} from "lucide-react";
import {
    getMe, getGitHubProfile, getGitHubRepos, LANG_COLORS,
    ApiUser, GitHubProfile, GitHubRepo,
} from "@/lib/api";
import { users as mockUsers } from "@/lib/data";
import { useAuth } from "@/contexts/AuthContext";
import PageWrapper from "@/components/PageWrapper";

export default function ProfilePage() {
    const { firebaseUser, hiveUser } = useAuth();
    const isAuthenticated = !!firebaseUser;

    const [profileUser, setProfileUser] = useState<ApiUser | null>(null);
    const [ghProfile, setGhProfile] = useState<GitHubProfile | null>(null);
    const [ghRepos, setGhRepos] = useState<GitHubRepo[]>([]);
    const [loading, setLoading] = useState(true);

    // Mock user for demo mode
    const demoUser = mockUsers[0];

    useEffect(() => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }

        (async () => {
            try {
                const me = await getMe();
                setProfileUser(me);

                // If user has a GitHub handle, fetch stats from GitHub API
                if (me.profile?.github_handle) {
                    const [profile, repos] = await Promise.all([
                        getGitHubProfile(me.profile.github_handle).catch(() => null),
                        getGitHubRepos(me.profile.github_handle).catch(() => []),
                    ]);
                    if (profile) setGhProfile(profile);
                    setGhRepos(repos);
                }
            } catch {
                // Fall back to demo mode
            } finally {
                setLoading(false);
            }
        })();
    }, [isAuthenticated]);

    // Compute language stats from repos
    const langStats: Record<string, number> = {};
    ghRepos.forEach((repo) => {
        if (repo.language) {
            langStats[repo.language] = (langStats[repo.language] || 0) + 1;
        }
    });
    const topLanguages = Object.entries(langStats)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);
    const totalLangRepos = topLanguages.reduce((s, [, c]) => s + c, 0);

    // Values for display (real or mock)
    const displayName = profileUser
        ? `${profileUser.first_name} ${profileUser.last_name}`.trim() || profileUser.username
        : demoUser.name;
    const displayHandle = profileUser?.profile?.github_handle || profileUser?.username || demoUser.username;
    const displayHeadline = profileUser?.profile?.headline || demoUser.role;
    const displayBio = profileUser?.profile?.bio || "Building the future with code. Full-stack developer passionate about clean architecture and open source.";
    const displayAvatar = profileUser?.profile?.avatar_url || firebaseUser?.photoURL || `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${demoUser.username}`;

    return (
        <PageWrapper theme="crimson">
            <div className="w-full px-8 py-6">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
                    </div>
                ) : (
                    <div className="flex gap-6">
                        {/* Left — Profile Card */}
                        <div className="w-[300px] shrink-0 hidden lg:block">
                            <div className="card p-6 sticky top-20">
                                <div className="text-center mb-5">
                                    <img
                                        src={displayAvatar}
                                        alt={displayName}
                                        className="w-24 h-24 rounded-full border-2 border-border-primary mx-auto mb-3 object-cover"
                                    />
                                    <h2 className="text-lg font-bold text-text-primary">{displayName}</h2>
                                    <p className="text-sm text-accent">@{displayHandle}</p>
                                    <p className="text-xs text-text-muted mt-2">{displayHeadline}</p>
                                </div>
                                <p className="text-sm text-text-muted mb-5 text-center">{displayBio}</p>

                                {/* Quick stats */}
                                <div className="grid grid-cols-2 gap-2 mb-5">
                                    <div className="p-3 bg-bg-surface-alt rounded-lg text-center">
                                        <div className="text-lg font-bold text-text-primary">
                                            {profileUser?.profile?.current_streak ?? demoUser.stats.currentStreak}
                                        </div>
                                        <div className="text-xs text-text-faint flex items-center justify-center gap-1">
                                            <Flame size={12} /> Streak
                                        </div>
                                    </div>
                                    <div className="p-3 bg-bg-surface-alt rounded-lg text-center">
                                        <div className="text-lg font-bold text-text-primary">
                                            {profileUser?.profile?.elo_rating ?? demoUser.stats.reputation}
                                        </div>
                                        <div className="text-xs text-text-faint flex items-center justify-center gap-1">
                                            <Trophy size={12} /> ELO
                                        </div>
                                    </div>
                                    <div className="p-3 bg-bg-surface-alt rounded-lg text-center">
                                        <div className="text-lg font-bold text-text-primary">
                                            {profileUser?.profile?.total_xp ?? demoUser.stats.totalCommits}
                                        </div>
                                        <div className="text-xs text-text-faint flex items-center justify-center gap-1">
                                            <Star size={12} /> XP
                                        </div>
                                    </div>
                                    <div className="p-3 bg-bg-surface-alt rounded-lg text-center">
                                        <div className="text-lg font-bold text-text-primary">
                                            {ghProfile?.public_repos ?? demoUser.stats.problemsSolved}
                                        </div>
                                        <div className="text-xs text-text-faint flex items-center justify-center gap-1">
                                            <Layout size={12} /> Repos
                                        </div>
                                    </div>
                                </div>

                                {/* GitHub links */}
                                {ghProfile && (
                                    <div className="border-t border-border-primary pt-4 space-y-2">
                                        <div className="flex items-center gap-2 text-text-muted text-sm">
                                            <Globe size={14} />
                                            <a href={ghProfile.html_url} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                                                {ghProfile.html_url}
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-4 text-text-faint text-sm">
                                            <span><strong className="text-text-secondary">{ghProfile.followers}</strong> followers</span>
                                            <span><strong className="text-text-secondary">{ghProfile.following}</strong> following</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Center — Content */}
                        <div className="flex-1 min-w-0 space-y-6">
                            {/* Contribution Heatmap placeholder */}
                            <div className="card p-6">
                                <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Calendar size={14} /> Contribution Activity
                                </h3>
                                <div className="bg-bg-surface-alt rounded-lg p-4">
                                    <div className="grid grid-cols-[repeat(52,1fr)] gap-[3px]">
                                        {Array.from({ length: 364 }).map((_, i) => {
                                            const random = Math.random();
                                            const level = random < 0.4 ? 0 : random < 0.65 ? 1 : random < 0.8 ? 2 : random < 0.92 ? 3 : 4;
                                            const colors = ["bg-[#161b22]", "bg-accent/20", "bg-accent/40", "bg-accent/60", "bg-accent/80"];
                                            return <div key={i} className={`aspect-square rounded-[2px] ${colors[level]}`} />;
                                        })}
                                    </div>
                                    <div className="flex items-center justify-end gap-2 mt-3">
                                        <span className="text-[10px] text-text-faint">Less</span>
                                        {["bg-[#161b22]", "bg-accent/20", "bg-accent/40", "bg-accent/60", "bg-accent/80"].map((c, i) => (
                                            <div key={i} className={`w-3 h-3 rounded-[2px] ${c}`} />
                                        ))}
                                        <span className="text-[10px] text-text-faint">More</span>
                                    </div>
                                </div>
                            </div>

                            {/* Pinned / Top Repos */}
                            <div className="card p-6">
                                <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <GitFork size={14} /> {ghRepos.length > 0 ? "Recent Repositories" : "Pinned Projects"}
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {(ghRepos.length > 0 ? ghRepos : demoUser.githubData.topRepos.map((repoName: string, idx: number) => ({
                                        id: idx,
                                        name: repoName,
                                        full_name: repoName,
                                        description: "Open source project",
                                        html_url: "#",
                                        language: ["TypeScript", "Python", "Rust"][idx % 3],
                                        stargazers_count: Math.floor(Math.random() * 500),
                                        forks_count: Math.floor(Math.random() * 100),
                                        updated_at: "",
                                    }))).map((repo: { id: number | string; name: string; full_name: string; description: string | null; html_url: string; language: string | null; stargazers_count: number; forks_count: number; updated_at: string }) => (
                                        <a
                                            key={repo.id}
                                            href={repo.html_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-4 bg-bg-surface-alt rounded-lg border border-border-subtle hover:border-accent transition-colors group"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <span className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors truncate">
                                                    {repo.name}
                                                </span>
                                                <ExternalLink size={12} className="text-text-faint opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                                            </div>
                                            <p className="text-xs text-text-muted mb-3 line-clamp-2">
                                                {repo.description || "No description"}
                                            </p>
                                            <div className="flex items-center gap-3">
                                                {repo.language && (
                                                    <div className="flex items-center gap-1">
                                                        <span
                                                            className="w-2.5 h-2.5 rounded-full"
                                                            style={{ backgroundColor: LANG_COLORS[repo.language] || "#666" }}
                                                        />
                                                        <span className="text-xs text-text-faint">{repo.language}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1 text-text-faint">
                                                    <Star size={11} />
                                                    <span className="text-xs">{repo.stargazers_count}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-text-faint">
                                                    <GitFork size={11} />
                                                    <span className="text-xs">{repo.forks_count}</span>
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right — Languages + More */}
                        <div className="w-[280px] shrink-0 hidden xl:block">
                            <div className="sticky top-20 space-y-5">
                                {/* Top Languages */}
                                <div className="card p-6">
                                    <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">Top Languages</h3>
                                    {topLanguages.length > 0 ? (
                                        <>
                                            {/* Bar */}
                                            <div className="h-3 rounded-full overflow-hidden flex mb-4">
                                                {topLanguages.map(([lang, count]) => (
                                                    <div
                                                        key={lang}
                                                        style={{
                                                            width: `${(count / totalLangRepos) * 100}%`,
                                                            backgroundColor: LANG_COLORS[lang] || "#666",
                                                        }}
                                                        title={`${lang}: ${count} repos`}
                                                    />
                                                ))}
                                            </div>
                                            <div className="space-y-2">
                                                {topLanguages.map(([lang, count]) => (
                                                    <div key={lang} className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span
                                                                className="w-3 h-3 rounded-full"
                                                                style={{ backgroundColor: LANG_COLORS[lang] || "#666" }}
                                                            />
                                                            <span className="text-sm text-text-secondary">{lang}</span>
                                                        </div>
                                                        <span className="text-sm text-text-faint font-mono">
                                                            {((count / totalLangRepos) * 100).toFixed(1)}%
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="h-3 rounded-full overflow-hidden flex mb-4">
                                                {[
                                                    { pct: 42, color: "#3178c6" },
                                                    { pct: 28, color: "#3572A5" },
                                                    { pct: 18, color: "#dea584" },
                                                    { pct: 12, color: "#00ADD8" },
                                                ].map((l, i) => (
                                                    <div key={i} style={{ width: `${l.pct}%`, backgroundColor: l.color }} />
                                                ))}
                                            </div>
                                            <div className="space-y-2">
                                                {[
                                                    { lang: "TypeScript", pct: 42 },
                                                    { lang: "Python", pct: 28 },
                                                    { lang: "Rust", pct: 18 },
                                                    { lang: "Go", pct: 12 },
                                                ].map((l) => (
                                                    <div key={l.lang} className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: LANG_COLORS[l.lang] }} />
                                                            <span className="text-sm text-text-secondary">{l.lang}</span>
                                                        </div>
                                                        <span className="text-sm text-text-faint font-mono">{l.pct}%</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Badges */}
                                <div className="card p-6">
                                    <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">Achievements</h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        {["🔥", "🏆", "⚡", "🎯", "💎", "🌟"].map((badge, i) => (
                                            <div
                                                key={i}
                                                className="aspect-square rounded-xl bg-bg-surface-alt flex items-center justify-center text-2xl border border-border-subtle hover:border-accent transition-colors cursor-pointer hover:scale-105 active:scale-95"
                                            >
                                                {badge}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* GitHub Connect button for users without GitHub */}
                                {isAuthenticated && !profileUser?.profile?.github_handle && (
                                    <div className="card p-6 text-center">
                                        <p className="text-sm text-text-muted mb-3">Connect your GitHub to see real stats</p>
                                        <button
                                            onClick={() => {
                                                const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
                                                const redirectUri = `${window.location.origin}/api/auth/callback/github`;
                                                window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`;
                                            }}
                                            className="btn-primary py-2 px-5 text-sm"
                                        >
                                            Connect GitHub
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageWrapper>
    );
}
