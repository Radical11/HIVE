"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Star, Clock } from "lucide-react";
import { projects } from "@/lib/data";
import PageWrapper from "@/components/PageWrapper";

interface TerminalLine {
    id: number;
    type: "prompt" | "output" | "error" | "info";
    content: string;
}

export default function ProjectsPage() {
    const [lines, setLines] = useState<TerminalLine[]>([
        { id: 0, type: "info", content: "Welcome to Hive Terminal v4. Type 'help' to get started." },
    ]);
    const [input, setInput] = useState("");
    const [drawerProject, setDrawerProject] = useState<typeof projects[0] | null>(null);
    const idRef = useRef(1);
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => { inputRef.current?.focus(); }, []);
    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [lines]);

    const pushLines = useCallback((...newLines: Omit<TerminalLine, "id">[]) => {
        const withIds = newLines.map((l) => ({ ...l, id: idRef.current++ }));
        setLines((prev) => [...prev, ...withIds]);
    }, []);

    const handleCommand = useCallback((cmd: string) => {
        const trimmed = cmd.trim();
        if (!trimmed) return;

        const parts = trimmed.split(" ");
        const command = parts[0].toLowerCase();

        switch (command) {
            case "ls":
                pushLines(
                    { type: "prompt", content: trimmed },
                    { type: "output", content: "__PROJECT_GRID__" }
                );
                break;
            case "open": {
                const projectName = parts.slice(1).join(" ");
                const project = projects.find((p) => p.slug === projectName || p.name === projectName);
                if (project) {
                    pushLines(
                        { type: "prompt", content: trimmed },
                        { type: "info", content: `Opening ${project.name}...` }
                    );
                    setTimeout(() => setDrawerProject(project), 300);
                } else {
                    pushLines(
                        { type: "prompt", content: trimmed },
                        { type: "error", content: `Project not found: "${projectName}". Try 'ls' to see available projects.` }
                    );
                }
                break;
            }
            case "clear":
                setLines([]);
                break;
            case "help":
                pushLines(
                    { type: "prompt", content: trimmed },
                    { type: "output", content: "Available commands:" },
                    { type: "output", content: "  ls           List all projects" },
                    { type: "output", content: "  open <name>  Open a project (use slug from ls)" },
                    { type: "output", content: "  clear        Clear screen" },
                    { type: "output", content: "  help         Show this message" }
                );
                break;
            default:
                pushLines(
                    { type: "prompt", content: trimmed },
                    { type: "error", content: `Command not found: ${command}` }
                );
                break;
        }
    }, [pushLines]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") { handleCommand(input); setInput(""); }
    };

    const autoOpen = (slug: string) => {
        setInput(`open ${slug}`);
        setTimeout(() => { handleCommand(`open ${slug}`); setInput(""); }, 200);
    };

    return (
        <PageWrapper theme="cyan">
            <div className="flex items-center justify-center px-4 py-6" style={{ minHeight: "calc(100vh - 56px)" }}>
                <div className="w-full max-w-7xl terminal-reflect">
                    {/* Terminal Window */}
                    <div className="rounded-xl border border-border-primary overflow-hidden shadow-2xl shadow-cyan-500/5">
                        {/* Window Header */}
                        <div className="flex items-center gap-2 px-5 py-3 bg-bg-surface border-b border-border-primary">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-[#FF5F56]/70 hover:bg-[#FF5F56] transition-colors cursor-pointer" />
                                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]/70 hover:bg-[#FFBD2E] transition-colors cursor-pointer" />
                                <div className="w-3 h-3 rounded-full bg-[#27C93F]/70 hover:bg-[#27C93F] transition-colors cursor-pointer" />
                            </div>
                            <span className="text-xs text-text-faint font-mono ml-3">user@hive:~/projects</span>
                            <span className="ml-auto text-[10px] text-text-faint font-mono">v4.0.0</span>
                        </div>

                        {/* Terminal Body */}
                        <div
                            ref={scrollRef}
                            className="bg-bg-void p-6 overflow-y-auto cursor-text"
                            style={{ minHeight: "650px", maxHeight: "750px" }}
                            onClick={() => inputRef.current?.focus()}
                        >
                            <div className="space-y-2.5">
                                {lines.map((line) => (
                                    <div key={`line-${line.id}`} className="text-sm leading-relaxed">
                                        {line.type === "prompt" && (
                                            <div className="flex gap-2">
                                                <span className="text-accent select-none font-mono">❯</span>
                                                <span className="text-text-primary font-mono">{line.content}</span>
                                            </div>
                                        )}
                                        {line.type === "output" && line.content === "__PROJECT_GRID__" && (
                                            <div className="grid grid-cols-3 gap-3 my-3">
                                                {projects.map((p) => (
                                                    <button
                                                        key={`proj-${p.id}`}
                                                        onClick={() => autoOpen(p.slug)}
                                                        className="flex items-center gap-3 px-5 py-4 rounded-lg border border-border-subtle hover:border-accent/40 hover:bg-accent-dim transition-all text-left group"
                                                    >
                                                        <span className="text-accent text-lg">📁</span>
                                                        <div>
                                                            <span className="text-sm text-text-secondary group-hover:text-accent transition-colors font-mono block">{p.slug}/</span>
                                                            <span className="text-[11px] text-text-faint font-mono">{p.permissions}</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        {line.type === "output" && line.content !== "__PROJECT_GRID__" && (
                                            <span className="text-text-muted font-mono">{line.content}</span>
                                        )}
                                        {line.type === "error" && (
                                            <span className="text-error font-mono">{line.content}</span>
                                        )}
                                        {line.type === "info" && (
                                            <span className="text-text-faint italic font-mono">{line.content}</span>
                                        )}
                                    </div>
                                ))}

                                {/* Active prompt */}
                                <div className="flex gap-2 items-center">
                                    <span className="text-accent select-none text-sm font-mono">❯</span>
                                    <input
                                        ref={inputRef}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="flex-1 bg-transparent text-text-primary text-sm font-mono outline-none caret-accent"
                                        spellCheck={false}
                                        autoFocus
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hint */}
                    <div className="text-center mt-5">
                        <p className="text-xs text-text-faint font-mono">
                            Try: <span className="text-accent/60">ls</span> · <span className="text-accent/60">open vdoc</span> · <span className="text-accent/60">help</span> · <span className="text-accent/60">clear</span>
                        </p>
                    </div>
                </div>

                {/* Slide-Over Drawer */}
                <AnimatePresence>
                    {drawerProject && (
                        <>
                            <motion.div
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setDrawerProject(null)}
                            />
                            <motion.div
                                className="fixed top-0 right-0 h-full w-full max-w-lg bg-bg-surface border-l border-border-primary z-50 overflow-y-auto"
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "100%" }}
                                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            >
                                <div className="p-8">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-xl font-semibold text-text-primary tracking-tight">{drawerProject.name}</h2>
                                        <button onClick={() => setDrawerProject(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-text-faint hover:text-text-muted hover:bg-bg-surface-alt transition-colors">
                                            <X size={16} />
                                        </button>
                                    </div>
                                    <p className="text-sm text-text-muted leading-relaxed mb-6">{drawerProject.description}</p>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="flex items-center gap-1.5 text-sm text-text-faint"><Star size={14} /><span>{drawerProject.stars}</span></div>
                                        <div className="flex items-center gap-1.5 text-sm text-text-faint"><Clock size={14} /><span>{drawerProject.lastUpdated}</span></div>
                                    </div>
                                    <div className="mb-6">
                                        <h4 className="text-sm font-medium text-text-muted uppercase tracking-widest mb-3">Tech Stack</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {drawerProject.techStack.map((tech) => (
                                                <span key={`tech-${tech}`} className="px-3 py-1.5 rounded-lg text-sm font-mono bg-accent-dim text-accent border border-accent/10">{tech}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mb-8">
                                        <h4 className="text-sm font-medium text-text-muted uppercase tracking-widest mb-3">README</h4>
                                        <div className="bg-bg-void rounded-lg border border-border-primary p-5 text-sm font-mono text-text-muted leading-relaxed whitespace-pre-wrap">{drawerProject.readme}</div>
                                    </div>
                                    <a href={drawerProject.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center justify-center gap-2 w-full py-3 text-sm">
                                        View Live <ExternalLink size={14} />
                                    </a>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </PageWrapper>
    );
}
