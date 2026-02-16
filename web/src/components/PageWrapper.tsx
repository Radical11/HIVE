"use client";

import { usePathname } from "next/navigation";

type Theme = "emerald" | "violet" | "amber" | "cyan" | "crimson";

const themeAccents: Record<Theme, { accent: string; hover: string; dim: string }> = {
    emerald: { accent: "#10b981", hover: "#34d399", dim: "rgba(16,185,129,0.08)" },
    violet: { accent: "#8b5cf6", hover: "#a78bfa", dim: "rgba(139,92,246,0.08)" },
    amber: { accent: "#f59e0b", hover: "#fbbf24", dim: "rgba(245,158,11,0.08)" },
    cyan: { accent: "#06b6d4", hover: "#22d3ee", dim: "rgba(6,182,212,0.08)" },
    crimson: { accent: "#ef4444", hover: "#f87171", dim: "rgba(239,68,68,0.08)" },
};

interface PageWrapperProps {
    theme: Theme;
    children: React.ReactNode;
    className?: string;
}

export default function PageWrapper({ theme, children, className = "" }: PageWrapperProps) {
    const colors = themeAccents[theme];

    return (
        <div
            className={`theme-glow min-h-[calc(100vh-56px)] relative ${className}`}
            data-theme={theme}
            style={{
                // Override CSS custom properties for this page's accent
                "--accent": colors.accent,
                "--accent-hover": colors.hover,
                "--accent-dim": colors.dim,
                "--accent-glow": `${colors.accent}08`,
            } as React.CSSProperties}
        >
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}

/**
 * Auto-detect theme from pathname
 */
export function usePageTheme(): Theme {
    const pathname = usePathname();
    if (pathname.startsWith("/feed")) return "emerald";
    if (pathname.startsWith("/network")) return "violet";
    if (pathname.startsWith("/arena")) return "amber";
    if (pathname.startsWith("/projects")) return "cyan";
    if (pathname.startsWith("/profile")) return "crimson";
    return "emerald";
}
