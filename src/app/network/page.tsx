"use client";

import { useState } from "react";
import { Users, Mail, UsersRound, FolderOpen, FileText, Hash } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";

interface ConnectionRequest {
    id: string;
    name: string;
    role: string;
    mutual: number;
    avatar: string;
    message: string;
}

const connectionRequests: ConnectionRequest[] = [
    { id: "r1", name: "Brandon Wilson", role: "Senior UX Designer", mutual: 14, avatar: "brandon", message: "Hey, I love your work, I like it! Can we do something together? Or maybe your next project for UX at the company?" },
    { id: "r2", name: "Theresa Steward", role: "iOS Developer", mutual: 8, avatar: "theresa", message: "" },
    { id: "r3", name: "Marcus Chen", role: "Backend Architect", mutual: 23, avatar: "marcus_chen", message: "Saw your distributed systems talk. Would love to connect!" },
    { id: "r4", name: "Priya Sharma", role: "ML Engineer", mutual: 31, avatar: "priya_ml", message: "Your neural search project looks amazing. Let's collaborate!" },
];

const recentConnections = [
    { name: "amanda_j", role: "Product Manager", date: "yesterday, 14:02", avatar: "amanda" },
    { name: "dev_priya", role: "DevOps Lead", date: "yesterday, 12:02", avatar: "priya" },
    { name: "0x_kevin", role: "Smart Contract Dev", date: "24 Aug, Monday", avatar: "kevin" },
    { name: "julia_code", role: "Data Scientist", date: "24 Aug, Sunday", avatar: "julia" },
    { name: "sam_rust", role: "Systems Programmer", date: "23 Aug, Saturday", avatar: "sam" },
    { name: "neo_zhao", role: "Cloud Architect", date: "22 Aug, Friday", avatar: "neo" },
];

const sidebarItems = [
    { icon: Users, label: "Connections", count: "1,034" },
    { icon: Mail, label: "Invitations", count: "7" },
    { icon: UsersRound, label: "Teammates", count: null },
    { icon: FolderOpen, label: "Groups", count: "9" },
    { icon: FileText, label: "Pages", count: "28" },
    { icon: Hash, label: "Hashtags", count: "8" },
];

export default function NetworkPage() {
    const [activeTab, setActiveTab] = useState<"received" | "sent">("received");
    const [dismissed, setDismissed] = useState<Set<string>>(new Set());
    const [accepted, setAccepted] = useState<Set<string>>(new Set());

    const handleAccept = (id: string) => setAccepted((prev) => new Set(prev).add(id));
    const handleDecline = (id: string) => setDismissed((prev) => new Set(prev).add(id));

    const visibleRequests = connectionRequests.filter(
        (r) => !dismissed.has(r.id) && !accepted.has(r.id)
    );

    return (
        <PageWrapper theme="violet">
            <div className="max-w-full mx-auto px-8 py-6">
                <div className="flex gap-8">
                    {/* Left Sidebar */}
                    <div className="w-72 shrink-0 hidden lg:block">
                        <div className="card p-5 sticky top-20">
                            <h3 className="text-sm font-bold text-text-primary mb-4">Manage My Network</h3>
                            <div className="space-y-1">
                                {sidebarItems.map((item, i) => (
                                    <button
                                        key={`nav-${item.label}`}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${i === 0
                                                ? "bg-accent-dim text-accent"
                                                : i === 1
                                                    ? "text-text-secondary hover:bg-bg-surface-alt"
                                                    : "text-text-muted hover:bg-bg-surface-alt"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon size={18} strokeWidth={1.5} />
                                            <span className="text-sm font-medium">{item.label}</span>
                                        </div>
                                        {item.count && (
                                            <span className={`text-xs font-mono ${i === 1 ? "bg-purple text-white px-2 py-0.5 rounded-full" : "text-text-faint"}`}>
                                                {item.count}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main */}
                    <div className="flex-1 min-w-0">
                        {/* Tabs */}
                        <div className="flex border-b border-border-primary mb-5">
                            {(["received", "sent"] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-8 py-3.5 text-sm font-semibold uppercase transition-colors ${activeTab === tab ? "tab-active" : "tab-inactive"}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Banner */}
                        <div className="bg-gradient-to-r from-accent/10 to-transparent border border-accent/20 rounded-xl px-6 py-3 mb-6">
                            <p className="text-sm text-center font-semibold tracking-wide text-accent">
                                YOU HAVE {visibleRequests.length} NEW FOLLOWERS
                            </p>
                        </div>

                        {/* Connection Requests */}
                        <div className="space-y-4 mb-10">
                            {visibleRequests.map((req) => (
                                <div key={`conn-${req.id}`} className="card p-6 flex items-center gap-5 hover:border-border-hover transition-colors">
                                    <img
                                        src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${req.avatar}`}
                                        alt={req.name}
                                        className="w-16 h-16 rounded-full border border-border-primary shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-base font-semibold text-text-primary">{req.name}</h4>
                                        <p className="text-sm text-text-muted">{req.role}</p>
                                        <p className="text-xs text-text-faint mt-0.5">{req.mutual} mutual connections</p>
                                        {req.message && (
                                            <div className="mt-2.5 bg-bg-surface-alt rounded-lg px-4 py-2.5 text-sm text-text-muted leading-relaxed border border-border-subtle">
                                                {req.message}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-3 shrink-0" suppressHydrationWarning>
                                        <button onClick={() => handleAccept(req.id)} className="btn-primary text-sm py-2 px-6" suppressHydrationWarning>ACCEPT</button>
                                        <button onClick={() => handleDecline(req.id)} className="btn-outline text-sm py-2 px-6" suppressHydrationWarning>DECLINE</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Connections */}
                        <div className="mb-6">
                            <div className="flex items-center gap-4 mb-5">
                                <div className="flex-1 h-px bg-border-primary" />
                                <span className="text-sm font-semibold text-text-muted uppercase tracking-widest">Recent Connections</span>
                                <div className="flex-1 h-px bg-border-primary" />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {recentConnections.map((conn) => (
                                    <div key={`recent-${conn.avatar}`} className="card p-5 flex items-center gap-4 hover:border-border-hover transition-colors cursor-pointer">
                                        <img
                                            src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${conn.avatar}`}
                                            alt={conn.name}
                                            className="w-14 h-14 rounded-full border border-border-primary"
                                        />
                                        <div>
                                            <p className="text-sm font-semibold text-text-secondary">{conn.name}</p>
                                            <p className="text-xs text-text-muted">{conn.role}</p>
                                            <p className="text-[11px] text-text-faint mt-0.5">{conn.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}
