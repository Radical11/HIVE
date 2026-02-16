"use client";

import { useState, useEffect } from "react";
import { Heart, MessageCircle, Rocket, GitCommit, CheckCircle, Flame, Star, ArrowUpRight, Share2, TrendingUp, Bookmark } from "lucide-react";
import { feedItems, trendingRepos, users } from "@/lib/data";
import PageWrapper from "@/components/PageWrapper";

export default function FeedPage() {
    const [activeTab, setActiveTab] = useState("Global");
    const user = users[0];
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());

    const [issueNums, setIssueNums] = useState<Record<string, number>>({});
    useEffect(() => {
        const nums: Record<string, number> = {};
        feedItems.forEach((item) => { nums[item.id] = Math.floor(Math.random() * 500) + 1; });
        setIssueNums(nums);
    }, []);

    const toggleLike = (id: string) => setLikedPosts((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
    });

    const toggleSave = (id: string) => setSavedPosts((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
    });

    const getIcon = (type: string) => {
        switch (type) {
            case "github": return <GitCommit size={16} className="text-accent" />;
            case "leetcode": return <CheckCircle size={16} className="text-accent" />;
            case "deploy": return <Rocket size={16} className="text-accent" />;
            case "streak": return <Flame size={16} className="text-secondary" />;
            default: return null;
        }
    };

    return (
        <PageWrapper theme="emerald">
            <div className="w-full px-8 py-6">
                <div className="flex gap-6">
                    {/* Left Sidebar — Mini Profile */}
                    <div className="w-[280px] shrink-0 hidden lg:block">
                        <div className="card p-6 sticky top-20">
                            <div className="text-center mb-5">
                                <img
                                    src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${user.username}`}
                                    alt={user.username}
                                    className="w-20 h-20 rounded-full border-2 border-border-primary mx-auto mb-3"
                                />
                                <h3 className="text-base font-semibold text-text-primary">{user.name}</h3>
                                <p className="text-sm text-text-muted">{user.role}</p>
                            </div>
                            <div className="space-y-3 border-t border-border-primary pt-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-text-faint">Streak</span>
                                    <span className="text-sm font-bold text-accent">{user.stats.currentStreak}d 🔥</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-text-faint">Commits</span>
                                    <span className="text-sm font-mono text-text-secondary">{user.stats.totalCommits.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-text-faint">Reputation</span>
                                    <span className="text-sm font-mono text-text-secondary">{user.stats.reputation.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-text-faint">Problems</span>
                                    <span className="text-sm font-mono text-text-secondary">{user.stats.problemsSolved}</span>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-border-primary">
                                <h4 className="text-xs font-bold text-text-faint uppercase tracking-wider mb-2">Top Repos</h4>
                                {user.githubData.topRepos.map((repo) => (
                                    <div key={repo} className="text-sm text-accent hover:underline cursor-pointer py-1 active:opacity-70">{repo}</div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Center — Feed (fills available space) */}
                    <div className="flex-1 min-w-0">
                        {/* Tabs */}
                        <div className="flex gap-8 border-b border-border-primary mb-6">
                            {["Global", "Following", "Trending"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-3.5 text-sm font-semibold transition-colors ${activeTab === tab ? "tab-active" : "tab-inactive"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Post Composer */}
                        <div className="card p-5 mb-6">
                            <div className="flex items-start gap-4">
                                <img
                                    src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${user.username}`}
                                    alt="you"
                                    className="w-11 h-11 rounded-full border border-border-primary"
                                />
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Share what you're building..."
                                        className="w-full bg-transparent text-sm text-text-secondary placeholder:text-text-faint outline-none py-2"
                                    />
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-subtle">
                                        <div className="flex gap-3">
                                            <button className="text-sm text-text-faint hover:text-accent transition-colors active:scale-95">📎 Attach</button>
                                            <button className="text-sm text-text-faint hover:text-accent transition-colors active:scale-95">💻 Code</button>
                                            <button className="text-sm text-text-faint hover:text-accent transition-colors active:scale-95">📊 Poll</button>
                                        </div>
                                        <button className="btn-primary text-sm py-2 px-6 active:scale-95">POST</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feed Items */}
                        <div className="space-y-5">
                            {feedItems.map((item) => {
                                const isLiked = likedPosts.has(item.id);
                                const isSaved = savedPosts.has(item.id);
                                return (
                                    <div key={item.id} className="card p-6 hover:border-border-hover transition-colors group">
                                        {/* Header */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <img
                                                src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${item.username}`}
                                                alt={item.username}
                                                className="w-11 h-11 rounded-full border border-border-primary cursor-pointer hover:border-accent transition-colors"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold text-text-primary hover:text-accent cursor-pointer transition-colors">@{item.username}</span>
                                                    {getIcon(item.type)}
                                                    <span className="ml-auto text-text-faint text-sm">{item.timestamp}</span>
                                                </div>
                                                <span className="text-xs text-text-faint capitalize">{item.type}</span>
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-base font-semibold text-text-primary mb-2 cursor-pointer hover:text-accent transition-colors">
                                            {item.title}
                                            {issueNums[item.id] && (
                                                <span className="text-text-faint font-mono text-sm ml-2">#{issueNums[item.id]}</span>
                                            )}
                                        </h3>

                                        {/* Code Block */}
                                        {item.type === "github" && (
                                            <div className="bg-bg-void rounded-lg border border-border-subtle p-4 mb-4">
                                                <div className="flex gap-1.5 mb-2.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/60" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/60" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/60" />
                                                </div>
                                                <code className="text-sm text-text-muted font-mono leading-relaxed">{item.description}</code>
                                            </div>
                                        )}

                                        {/* LeetCode Stats */}
                                        {item.type === "leetcode" && item.stats && (
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${item.difficulty === "Hard" ? "bg-error/10 text-error" : item.difficulty === "Medium" ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
                                                    }`}>
                                                    {item.difficulty}
                                                </span>
                                                <span className="text-xs text-text-faint font-mono">{item.stats.time} · {item.stats.memory} · {item.stats.language}</span>
                                            </div>
                                        )}

                                        {item.type !== "github" && item.type !== "leetcode" && (
                                            <p className="text-sm text-text-muted mb-4">{item.description}</p>
                                        )}

                                        {/* Reactions */}
                                        <div className="flex items-center gap-5 pt-3 border-t border-border-subtle">
                                            <button
                                                onClick={() => toggleLike(item.id)}
                                                className={`flex items-center gap-2 transition-colors active:scale-95 ${isLiked ? "text-error" : "text-text-faint hover:text-error"}`}
                                            >
                                                <Heart size={15} fill={isLiked ? "currentColor" : "none"} />
                                                <span className="text-sm">{isLiked ? "Liked" : "Like"}</span>
                                            </button>
                                            <button className="flex items-center gap-2 text-text-faint hover:text-accent transition-colors active:scale-95">
                                                <MessageCircle size={15} />
                                                <span className="text-sm">Comment</span>
                                            </button>
                                            <button className="flex items-center gap-2 text-text-faint hover:text-accent transition-colors active:scale-95">
                                                <Share2 size={15} />
                                                <span className="text-sm">Share</span>
                                            </button>
                                            <button
                                                onClick={() => toggleSave(item.id)}
                                                className={`flex items-center gap-2 transition-colors active:scale-95 ${isSaved ? "text-warning" : "text-text-faint hover:text-warning"}`}
                                            >
                                                <Bookmark size={15} fill={isSaved ? "currentColor" : "none"} />
                                                <span className="text-sm">{isSaved ? "Saved" : "Save"}</span>
                                            </button>
                                            {item.repo && (
                                                <a href="#" className="flex items-center gap-2 text-text-faint hover:text-accent transition-colors ml-auto active:scale-95">
                                                    <ArrowUpRight size={15} />
                                                    <span className="text-sm font-mono">{item.repo}</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Sidebar — Trending & Stats */}
                    <div className="w-[320px] shrink-0 hidden xl:block">
                        <div className="sticky top-20 space-y-5">
                            {/* Trending Repos */}
                            <div className="card p-6">
                                <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-5 flex items-center gap-2">
                                    <TrendingUp size={14} /> Trending Repos
                                </h3>
                                <div className="space-y-4">
                                    {trendingRepos.map((repo) => (
                                        <div key={repo.name} className="group cursor-pointer hover:bg-bg-surface-alt -mx-3 px-3 py-2 rounded-lg transition-colors active:scale-[0.98]">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-medium text-text-secondary group-hover:text-accent transition-colors">{repo.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: repo.languageColor }} />
                                                <span className="text-xs text-text-faint">{repo.language}</span>
                                                <Star size={12} className="text-text-faint ml-auto" />
                                                <span className="text-xs text-text-faint">{(repo.stars / 1000).toFixed(1)}k</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="card p-5">
                                <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">Today&apos;s Activity</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: "Commits", value: "847", icon: "💻" },
                                        { label: "PRs Merged", value: "124", icon: "🔀" },
                                        { label: "Deploys", value: "36", icon: "🚀" },
                                        { label: "Online", value: "1.2k", icon: "🟢" },
                                    ].map((stat) => (
                                        <div key={stat.label} className="text-center p-3 bg-bg-surface-alt rounded-lg hover:border-border-hover border border-transparent transition-colors cursor-pointer active:scale-95">
                                            <div className="text-lg mb-1">{stat.icon}</div>
                                            <div className="text-base font-bold text-text-primary">{stat.value}</div>
                                            <div className="text-xs text-text-faint">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* People You May Know */}
                            <div className="card p-5">
                                <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">People You May Know</h3>
                                <div className="space-y-3">
                                    {users.slice(1, 5).map((u) => (
                                        <div key={u.id} className="flex items-center gap-3 hover:bg-bg-surface-alt -mx-2 px-2 py-2 rounded-lg transition-colors cursor-pointer">
                                            <img src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${u.username}`} alt={u.username} className="w-10 h-10 rounded-full border border-border-primary" />
                                            <div className="flex-1 min-w-0">
                                                <span className="text-sm font-medium text-text-secondary block">{u.name}</span>
                                                <span className="text-xs text-text-faint">{u.role}</span>
                                            </div>
                                            <button className="text-xs text-accent hover:underline font-medium active:scale-95 transition-transform">Connect</button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Suggested Tags */}
                            <div className="card p-5">
                                <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">Popular Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {["#rust", "#webdev", "#ai", "#devops", "#golang", "#react", "#security", "#cloud", "#typescript", "#python"].map((tag) => (
                                        <button key={tag} className="px-3 py-1.5 rounded-full text-xs font-mono bg-bg-surface-alt text-text-muted border border-border-subtle hover:border-accent hover:text-accent transition-colors active:scale-95">{tag}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}
