"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    User, Bell, Shield, Palette, Globe, Code, Moon, Monitor,
    ChevronRight, LogOut, ToggleLeft, ToggleRight
} from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import { users } from "@/lib/data";

const sections = [
    { id: "profile", icon: User, label: "Profile" },
    { id: "notifications", icon: Bell, label: "Notifications" },
    { id: "privacy", icon: Shield, label: "Privacy & Security" },
    { id: "appearance", icon: Palette, label: "Appearance" },
    { id: "language", icon: Globe, label: "Language & Region" },
    { id: "integrations", icon: Code, label: "Integrations" },
];

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState("profile");
    const [theme, setTheme] = useState("dark");
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        mentions: true,
        weeklyDigest: false,
    });
    const router = useRouter();
    const user = users[0];

    const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
        <button onClick={onToggle} className="transition-colors">
            {on ? <ToggleRight size={28} className="text-accent" /> : <ToggleLeft size={28} className="text-text-faint" />}
        </button>
    );

    return (
        <PageWrapper theme="emerald">
            <div className="max-w-full mx-auto px-8 py-6">
                <div className="flex gap-8">
                    {/* Sidebar */}
                    <div className="w-72 shrink-0">
                        <div className="card p-5 sticky top-20">
                            {/* User Info */}
                            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-border-primary">
                                <img
                                    src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${user.username}`}
                                    alt={user.username}
                                    className="w-14 h-14 rounded-full border border-border-primary"
                                />
                                <div>
                                    <h3 className="text-sm font-bold text-text-primary">{user.name}</h3>
                                    <p className="text-xs text-text-muted">@{user.username}</p>
                                </div>
                            </div>

                            {/* Nav */}
                            <div className="space-y-1">
                                {sections.map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => setActiveSection(s.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeSection === s.id
                                                ? "bg-accent-dim text-accent"
                                                : "text-text-muted hover:bg-bg-surface-alt hover:text-text-secondary"
                                            }`}
                                    >
                                        <s.icon size={18} strokeWidth={1.5} />
                                        <span className="text-sm font-medium">{s.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Logout */}
                            <div className="mt-6 pt-5 border-t border-border-primary">
                                <button
                                    onClick={() => router.push("/login")}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-error hover:bg-error/10 transition-colors"
                                >
                                    <LogOut size={18} strokeWidth={1.5} />
                                    <span className="text-sm font-medium">Log Out</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {/* Profile Section */}
                        {activeSection === "profile" && (
                            <div>
                                <h1 className="text-2xl font-bold text-text-primary mb-1">Profile Settings</h1>
                                <p className="text-sm text-text-muted mb-8">Manage how you appear on Hive</p>

                                <div className="card p-8 mb-6">
                                    <h3 className="text-sm font-bold text-text-primary mb-6">Personal Information</h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs text-text-muted font-medium block mb-2">Display Name</label>
                                            <input defaultValue={user.name} className="input-field" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-text-muted font-medium block mb-2">Username</label>
                                            <input defaultValue={user.username} className="input-field" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-xs text-text-muted font-medium block mb-2">Bio</label>
                                            <textarea defaultValue={user.bio} rows={3} className="input-field resize-none" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-text-muted font-medium block mb-2">Role</label>
                                            <input defaultValue={user.role} className="input-field" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-text-muted font-medium block mb-2">Location</label>
                                            <input defaultValue="Addis Ababa, Ethiopia" className="input-field" />
                                        </div>
                                    </div>
                                    <button className="btn-primary mt-6 py-2.5 px-8">Save Changes</button>
                                </div>

                                <div className="card p-8">
                                    <h3 className="text-sm font-bold text-text-primary mb-6">Social Links</h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs text-text-muted font-medium block mb-2">GitHub</label>
                                            <input defaultValue={`github.com/${user.username}`} className="input-field" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-text-muted font-medium block mb-2">LinkedIn</label>
                                            <input defaultValue="" placeholder="linkedin.com/in/username" className="input-field" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-text-muted font-medium block mb-2">Website</label>
                                            <input defaultValue="haileb.com" className="input-field" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-text-muted font-medium block mb-2">Twitter / X</label>
                                            <input defaultValue="" placeholder="@username" className="input-field" />
                                        </div>
                                    </div>
                                    <button className="btn-primary mt-6 py-2.5 px-8">Save Links</button>
                                </div>
                            </div>
                        )}

                        {/* Notifications Section */}
                        {activeSection === "notifications" && (
                            <div>
                                <h1 className="text-2xl font-bold text-text-primary mb-1">Notifications</h1>
                                <p className="text-sm text-text-muted mb-8">Configure how you receive updates</p>

                                <div className="card p-8">
                                    <div className="space-y-6">
                                        {([
                                            { key: "email" as const, title: "Email Notifications", desc: "Receive updates via email" },
                                            { key: "push" as const, title: "Push Notifications", desc: "Browser push notifications" },
                                            { key: "mentions" as const, title: "Mention Alerts", desc: "Notify when someone @mentions you" },
                                            { key: "weeklyDigest" as const, title: "Weekly Digest", desc: "Summary of activity every Monday" },
                                        ]).map((item) => (
                                            <div key={item.key} className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0">
                                                <div>
                                                    <h4 className="text-sm font-medium text-text-primary">{item.title}</h4>
                                                    <p className="text-xs text-text-muted">{item.desc}</p>
                                                </div>
                                                <Toggle on={notifications[item.key]} onToggle={() => setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key] }))} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Privacy Section */}
                        {activeSection === "privacy" && (
                            <div>
                                <h1 className="text-2xl font-bold text-text-primary mb-1">Privacy & Security</h1>
                                <p className="text-sm text-text-muted mb-8">Control your data and account security</p>

                                <div className="card p-8 mb-6">
                                    <h3 className="text-sm font-bold text-text-primary mb-6">Password</h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs text-text-muted font-medium block mb-2">Current Password</label>
                                            <input type="password" placeholder="••••••••" className="input-field" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-text-muted font-medium block mb-2">New Password</label>
                                            <input type="password" placeholder="••••••••" className="input-field" />
                                        </div>
                                    </div>
                                    <button className="btn-primary mt-6 py-2.5 px-8">Update Password</button>
                                </div>

                                <div className="card p-8">
                                    <h3 className="text-sm font-bold text-text-primary mb-4">Profile Visibility</h3>
                                    <div className="space-y-4">
                                        {[
                                            { title: "Show activity on profile", on: true },
                                            { title: "Show in search results", on: true },
                                            { title: "Allow connection requests", on: true },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <span className="text-sm text-text-secondary">{item.title}</span>
                                                <Toggle on={item.on} onToggle={() => { }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Appearance Section */}
                        {activeSection === "appearance" && (
                            <div>
                                <h1 className="text-2xl font-bold text-text-primary mb-1">Appearance</h1>
                                <p className="text-sm text-text-muted mb-8">Customize the look and feel</p>

                                <div className="card p-8">
                                    <h3 className="text-sm font-bold text-text-primary mb-6">Theme</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { id: "dark", label: "Dark", icon: Moon, desc: "Default dark theme" },
                                            { id: "system", label: "System", icon: Monitor, desc: "Follow OS preference" },
                                            { id: "void", label: "Void", icon: Moon, desc: "True black AMOLED" },
                                        ].map((t) => (
                                            <button
                                                key={t.id}
                                                onClick={() => setTheme(t.id)}
                                                className={`card p-5 text-left transition-all ${theme === t.id ? "border-accent bg-accent-dim" : "hover:border-border-hover"}`}
                                            >
                                                <t.icon size={20} className={theme === t.id ? "text-accent mb-2" : "text-text-faint mb-2"} />
                                                <h4 className="text-sm font-semibold text-text-primary">{t.label}</h4>
                                                <p className="text-xs text-text-muted">{t.desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Language Section */}
                        {activeSection === "language" && (
                            <div>
                                <h1 className="text-2xl font-bold text-text-primary mb-1">Language & Region</h1>
                                <p className="text-sm text-text-muted mb-8">Set your language and time preferences</p>

                                <div className="card p-8">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs text-text-muted font-medium block mb-2">Language</label>
                                            <select className="input-field">
                                                <option>English</option>
                                                <option>Spanish</option>
                                                <option>French</option>
                                                <option>German</option>
                                                <option>Japanese</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs text-text-muted font-medium block mb-2">Timezone</label>
                                            <select className="input-field">
                                                <option>Asia/Kolkata (IST)</option>
                                                <option>America/New_York (EST)</option>
                                                <option>Europe/London (GMT)</option>
                                                <option>Asia/Tokyo (JST)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Integrations Section */}
                        {activeSection === "integrations" && (
                            <div>
                                <h1 className="text-2xl font-bold text-text-primary mb-1">Integrations</h1>
                                <p className="text-sm text-text-muted mb-8">Connect third-party services</p>

                                <div className="space-y-4">
                                    {[
                                        { name: "GitHub", desc: "Sync repos and contributions", connected: true, icon: "🐙" },
                                        { name: "LeetCode", desc: "Import problem solving stats", connected: true, icon: "⚡" },
                                        { name: "Codeforces", desc: "Competitive programming ratings", connected: false, icon: "🏆" },
                                        { name: "Discord", desc: "Receive notifications on Discord", connected: false, icon: "💬" },
                                        { name: "Slack", desc: "Team notifications and updates", connected: false, icon: "📣" },
                                    ].map((integration) => (
                                        <div key={integration.name} className="card p-6 flex items-center gap-5">
                                            <span className="text-2xl">{integration.icon}</span>
                                            <div className="flex-1">
                                                <h4 className="text-base font-semibold text-text-primary">{integration.name}</h4>
                                                <p className="text-sm text-text-muted">{integration.desc}</p>
                                            </div>
                                            <button className={`text-sm py-2 px-6 rounded-lg font-medium transition-colors ${integration.connected
                                                    ? "bg-success/10 text-success border border-success/20"
                                                    : "btn-primary"
                                                }`}>
                                                {integration.connected ? "Connected" : "Connect"}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}
