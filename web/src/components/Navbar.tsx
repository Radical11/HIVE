"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
    Rss, Users, FolderCode, Swords, User, Search, MoreHorizontal, Bell, LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

/* 
 * Each nav item has its OWN theme color so the active state
 * matches the page's PageWrapper accent.
 */
const navItems = [
    { href: "/feed", icon: Rss, label: "FEED", color: "#10b981", dim: "rgba(16,185,129,0.12)" },
    { href: "/network", icon: Users, label: "NETWORK", color: "#8b5cf6", dim: "rgba(139,92,246,0.12)" },
    { href: "/projects", icon: FolderCode, label: "PROJECTS", color: "#06b6d4", dim: "rgba(6,182,212,0.12)" },
    { href: "/arena", icon: Swords, label: "ARENA", color: "#f59e0b", dim: "rgba(245,158,11,0.12)" },
    { href: "/profile", icon: User, label: "PROFILE", color: "#ef4444", dim: "rgba(239,68,68,0.12)" },
];

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { firebaseUser, hiveUser, logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");

    // Hide navbar on auth pages
    if (pathname === "/login" || pathname === "/register" || pathname.startsWith("/api/auth")) return null;

    const displayName = hiveUser
        ? `${hiveUser.first_name || ""} ${hiveUser.last_name || ""}`.trim() || hiveUser.username
        : firebaseUser?.displayName || "User";

    const avatarUrl = hiveUser?.profile?.avatar_url
        || firebaseUser?.photoURL
        || `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${hiveUser?.username || "default"}`;

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-14 bg-bg-surface border-b border-border-primary z-50 flex items-center px-6">
            {/* Logo */}
            <Link href="/feed" className="flex items-center gap-2.5 mr-10 shrink-0 group">
                <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="30" r="12" fill="#4ecdc4" />
                    <circle cx="30" cy="42" r="12" fill="#4ecdc4" opacity="0.85" />
                    <circle cx="70" cy="42" r="12" fill="#4ecdc4" opacity="0.85" />
                    <circle cx="50" cy="54" r="12" fill="#4ecdc4" opacity="0.7" />
                    <circle cx="30" cy="66" r="12" fill="#4ecdc4" opacity="0.7" />
                    <circle cx="70" cy="66" r="12" fill="#4ecdc4" opacity="0.7" />
                    <circle cx="50" cy="78" r="12" fill="#4ecdc4" opacity="0.55" />
                </svg>
                <span className="text-lg font-extrabold tracking-tight" style={{ color: "#4ecdc4" }}>HIVE</span>
            </Link>

            {/* Nav Items — each glows its own theme color */}
            <nav className="flex items-center gap-1.5">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                            style={
                                isActive
                                    ? { color: item.color, backgroundColor: item.dim }
                                    : {}
                            }
                        >
                            <span className={isActive ? "" : "text-text-muted hover:text-text-secondary"}>
                                <item.icon size={16} strokeWidth={1.8} />
                            </span>
                            <span className={`hidden sm:inline ${isActive ? "" : "text-text-muted"}`}>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Search */}
            <div className="flex-1 flex justify-center mx-6">
                <div className="relative w-full max-w-sm">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
                    <input
                        type="text"
                        placeholder="Search Hive..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-bg-surface-alt border border-border-primary rounded-lg py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-faint outline-none focus:border-[#4ecdc4] transition-colors"
                    />
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3 shrink-0">
                {/* Notifications bell */}
                <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-text-muted hover:bg-bg-surface-alt hover:text-text-secondary transition-colors active:scale-95">
                    <Bell size={16} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error" />
                </button>

                {/* User */}
                <Link href="/profile" className="flex items-center gap-2.5 hover:bg-bg-surface-alt rounded-lg px-2 py-1.5 transition-colors">
                    <img
                        src={avatarUrl}
                        alt={displayName}
                        className="w-8 h-8 rounded-full border border-border-primary object-cover"
                    />
                    <div className="hidden md:block">
                        <div className="text-xs font-semibold text-text-primary leading-tight">{displayName.toUpperCase()}</div>
                        <div className="text-[10px] text-text-faint">
                            {hiveUser?.profile?.current_streak ? `Streak · ${hiveUser.profile.current_streak}d 🔥` : "Welcome!"}
                        </div>
                    </div>
                </Link>

                {/* Logout */}
                {firebaseUser && (
                    <button
                        onClick={handleLogout}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-text-muted hover:bg-bg-surface-alt hover:text-error transition-colors active:scale-95"
                        title="Logout"
                    >
                        <LogOut size={16} />
                    </button>
                )}

                {/* Settings */}
                <Link href="/settings" className="w-9 h-9 rounded-lg flex items-center justify-center text-text-muted hover:bg-bg-surface-alt hover:text-[#4ecdc4] transition-colors active:scale-95">
                    <MoreHorizontal size={16} />
                </Link>
            </div>
        </header>
    );
}
