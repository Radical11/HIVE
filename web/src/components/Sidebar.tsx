"use client";

import { Home, Trophy, MessageSquare, Users, User, Zap, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    const navItems = [
        { icon: <Home className="w-5 h-5" />, label: "Feed", href: "/feed" },
        { icon: <Trophy className="w-5 h-5" />, label: "Arena", href: "/arena" },
        { icon: <MessageSquare className="w-5 h-5" />, label: "Forum", href: "/forum" },
        { icon: <Users className="w-5 h-5" />, label: "Squads", href: "/squads" },
        { icon: <User className="w-5 h-5" />, label: "Profile", href: "/profile" },
    ];

    return (
        <aside className="fixed left-0 top-0 h-full w-64 p-6 hidden lg:flex flex-col" style={{ borderRight: "1px solid var(--hive-border)", background: "var(--hive-bg-secondary)", zIndex: 10 }}>
            <Link href="/" className="flex items-center gap-2 mb-10">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--hive-gradient-primary)" }}>
                    <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">HIVE</span>
            </Link>
            <nav className="flex-1 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                            style={{
                                background: isActive ? "rgba(0,212,255,0.1)" : "transparent",
                                color: isActive ? "var(--hive-accent-primary)" : "var(--hive-text-secondary)",
                            }}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <button
                onClick={logout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:bg-red-500/10 hover:text-red-500 text-gray-400 mt-auto"
            >
                <LogOut className="w-5 h-5" />
                Sign Out
            </button>
        </aside>
    );
}
