"use client";

import { useState } from "react";
import { MapPin, Link2, Edit, Users as UsersIcon, Flame } from "lucide-react";
import { users } from "@/lib/data";
import Heatmap from "@/components/Heatmap";
import RadarChart from "@/components/RadarChart";
import PageWrapper from "@/components/PageWrapper";

export default function ProfilePage() {
    const user = users[0];
    const [yearContributions] = useState(() =>
        Array.from({ length: 365 }, () =>
            Math.random() > 0.3 ? Math.floor(Math.random() * 12) : 0
        )
    );
    const activeCount = yearContributions.filter((v) => v > 0).length;

    const languages = [
        { name: "Rust", pct: 45, color: "#dea584" },
        { name: "TypeScript", pct: 30, color: "#3178c6" },
        { name: "Python", pct: 15, color: "#3572A5" },
        { name: "Go", pct: 10, color: "#00ADD8" },
    ];

    const pinnedProjects = [
        { name: "DL_PyTorch", desc: "Deep Learning using PyTorch", lang: "Jupyter Notebook", langColor: "#DA5B0B" },
        { name: "Machine-Learning", desc: "", lang: "Jupyter Notebook", langColor: "#DA5B0B" },
        { name: "NLP-and-Speech", desc: "Code for various NLP and Speech Task", lang: "Jupyter Notebook", langColor: "#DA5B0B" },
        { name: "Reinforcement-Learning", desc: "", lang: "Jupyter Notebook", langColor: "#DA5B0B" },
        { name: "flag_count", desc: "", lang: "Python", langColor: "#3572A5" },
    ];

    return (
        <PageWrapper theme="crimson">
            <div className="max-w-full mx-auto px-6 py-6">
                <div className="flex gap-10">
                    {/* Left — Avatar & Info */}
                    <div className="w-72 shrink-0">
                        <div className="sticky top-20">
                            <div className="relative mb-4">
                                <img
                                    src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${user.username}`}
                                    alt={user.username}
                                    className="w-48 h-48 rounded-full border-4 border-border-primary mx-auto"
                                />
                                <div className="absolute bottom-2 right-12 w-4 h-4 rounded-full bg-success border-2 border-bg-void online-dot" />
                            </div>

                            <h1 className="text-xl font-bold text-text-primary uppercase tracking-tight">{user.name}</h1>
                            <p className="text-sm text-text-muted font-mono mb-1">{user.username}</p>
                            <p className="text-xs text-text-muted leading-relaxed mb-4">{user.bio}</p>

                            <button className="btn-outline w-full flex items-center justify-center gap-2 mb-4 py-2">
                                <Edit size={13} /> Edit Profile
                            </button>

                            <div className="flex items-center gap-3 mb-3">
                                <UsersIcon size={13} className="text-text-faint" />
                                <span className="text-xs text-text-secondary"><strong>43</strong> followers</span>
                                <span className="text-xs text-text-faint">·</span>
                                <span className="text-xs text-text-secondary"><strong>12</strong> following</span>
                            </div>

                            <div className="space-y-1.5 text-xs text-text-muted">
                                <div className="flex items-center gap-2"><MapPin size={12} className="text-text-faint" /> Addis Ababa, Ethiopia</div>
                                <div className="flex items-center gap-2"><Link2 size={12} className="text-text-faint" /> <a href="#" className="text-accent hover:underline">haileb.com</a></div>
                            </div>
                        </div>
                    </div>

                    {/* Right — Content */}
                    <div className="flex-1 min-w-0">
                        {/* Heatmap */}
                        <div className="card p-5 mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm text-text-secondary">{activeCount} contributions in the last year</h3>
                                <button className="text-[10px] text-text-faint hover:text-accent transition-colors">Contribution settings ↗</button>
                            </div>
                            <div className="overflow-x-auto">
                                <Heatmap contributions={yearContributions} cellSize={11} gap={2} />
                            </div>
                            <div className="flex items-center gap-2 mt-3 justify-end">
                                <span className="text-[9px] text-text-faint">Less</span>
                                {[0.08, 0.2, 0.4, 0.65, 0.9].map((o, i) => (
                                    <div key={`hm-${i}`} className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: `rgba(46, 160, 67, ${o})` }} />
                                ))}
                                <span className="text-[9px] text-text-faint">More</span>
                            </div>
                        </div>

                        {/* Pinned Projects */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-medium text-text-secondary">Pinned Projects</h3>
                                <button className="text-[10px] text-text-faint hover:text-accent transition-colors">Customize your pins</button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {pinnedProjects.map((p, i) => (
                                    <div key={`pin-${i}`} className="card p-4 hover:border-border-hover transition-colors cursor-pointer">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="text-sm font-semibold text-accent">{p.name}</h4>
                                            <span className="text-text-faint text-lg">📋</span>
                                        </div>
                                        {p.desc && <p className="text-xs text-text-faint mb-2">{p.desc}</p>}
                                        <div className="flex items-center gap-1.5 mt-auto">
                                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.langColor }} />
                                            <span className="text-[10px] text-text-muted">{p.lang}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Row */}
                        <div className="grid grid-cols-3 gap-4">
                            {/* Radar */}
                            <div className="card p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider">Performance Radar</h4>
                                    <button className="text-[10px] text-accent hover:underline">View Details</button>
                                </div>
                                <div className="flex justify-center">
                                    <RadarChart data={user.techStack} size={140} />
                                </div>
                                <p className="text-[10px] text-text-faint text-center mt-2">
                                    Performing better than <strong className="text-text-secondary">94%</strong> of Backend Engineers.
                                </p>
                            </div>

                            {/* Languages */}
                            <div className="card p-4">
                                <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-4">Top Languages</h4>
                                <div className="space-y-3">
                                    {languages.map((lang) => (
                                        <div key={`lang-${lang.name}`}>
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lang.color }} />
                                                    <span className="text-xs text-text-secondary">{lang.name}</span>
                                                </div>
                                                <span className="text-[10px] text-text-faint font-mono">{lang.pct}%</span>
                                            </div>
                                            <div className="h-1.5 bg-bg-surface-alt rounded-full overflow-hidden">
                                                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${lang.pct}%`, backgroundColor: lang.color }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Streak */}
                            <div className="card p-4 flex flex-col items-center justify-center text-center relative">
                                <div className="absolute top-3 right-3 text-text-faint">
                                    <Flame size={14} />
                                </div>
                                <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">Current Streak</h4>
                                <div className="text-3xl font-bold text-accent">{user.stats.currentStreak}</div>
                                <div className="text-sm font-medium text-text-secondary">Days</div>
                                <p className="text-[10px] text-text-faint mt-2">About 6 out of 8 days to 50.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}
