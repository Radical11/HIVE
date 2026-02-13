"use client";

import { motion, useMotionValue, useTransform, useInView } from "framer-motion";
import {
  Zap,
  GitBranch,
  Trophy,
  Users,
  Code2,
  ArrowRight,
  Terminal,
  Flame,
  Shield,
  Brain,
  Activity,
  Sparkles,
  ChevronRight,
  Globe,
  Star,
  GitPullRequest,
  Eye,
  Cpu,
  Layers,
  BarChart3,
  Github,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";

/* === ANIMATED COUNTER === */
function AnimatedCounter({ target, suffix = "" }: { target: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState("0");

  useEffect(() => {
    if (!isInView) return;
    const numericPart = target.replace(/[^0-9.]/g, "");
    const suffixPart = target.replace(/[0-9.]/g, "");
    const end = parseFloat(numericPart);
    const duration = 2000;
    const start = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = end * eased;

      if (end >= 100) {
        setCount(Math.floor(current).toLocaleString() + suffixPart);
      } else {
        setCount(current.toFixed(1) + suffixPart);
      }

      if (progress >= 1) clearInterval(timer);
    }, 30);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* === TERMINAL CODE BLOCK === */
function HeroTerminal() {
  const lines = [
    { tokens: [{ type: "comment", text: "// Your engineering journey, amplified." }] },
    { tokens: [
      { type: "keyword", text: "const " },
      { type: "variable", text: "hive" },
      { type: "operator", text: " = " },
      { type: "keyword", text: "await " },
      { type: "function", text: "connect" },
      { type: "plain", text: "({" },
    ]},
    { tokens: [
      { type: "plain", text: "  " },
      { type: "variable", text: "github" },
      { type: "operator", text: ": " },
      { type: "string", text: "'linked'" },
      { type: "plain", text: "," },
    ]},
    { tokens: [
      { type: "plain", text: "  " },
      { type: "variable", text: "streak" },
      { type: "operator", text: ": " },
      { type: "number", text: "47" },
      { type: "plain", text: "," },
    ]},
    { tokens: [
      { type: "plain", text: "  " },
      { type: "variable", text: "elo" },
      { type: "operator", text: ": " },
      { type: "number", text: "1842" },
      { type: "plain", text: "," },
    ]},
    { tokens: [
      { type: "plain", text: "  " },
      { type: "variable", text: "squad" },
      { type: "operator", text: ": " },
      { type: "string", text: "'NightOwls'" },
      { type: "plain", text: "," },
    ]},
    { tokens: [{ type: "plain", text: "});" }] },
    { tokens: [] },
    { tokens: [
      { type: "keyword", text: "await " },
      { type: "variable", text: "hive" },
      { type: "plain", text: "." },
      { type: "function", text: "ship" },
      { type: "plain", text: "(" },
      { type: "string", text: "'v1.0'" },
      { type: "plain", text: ");" },
    ]},
    { tokens: [
      { type: "comment", text: "// → 🚀 Milestone posted • +250 XP • Streak: 48 days" },
    ]},
  ];

  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= lines.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="terminal w-full max-w-lg mx-auto" style={{ boxShadow: "0 25px 80px rgba(0,0,0,0.5), 0 0 60px rgba(0,212,255,0.05)" }}>
      <div className="terminal-header">
        <div className="terminal-dot" style={{ background: "#ff5f57" }} />
        <div className="terminal-dot" style={{ background: "#febc2e" }} />
        <div className="terminal-dot" style={{ background: "#28c840" }} />
        <span className="ml-3 text-xs" style={{ color: "var(--hive-text-muted)" }}>hive.ts</span>
      </div>
      <div className="terminal-body">
        {lines.slice(0, visibleLines).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {line.tokens.length === 0 ? (
              <br />
            ) : (
              line.tokens.map((token, j) => (
                <span key={j} className={`token-${token.type}`}>{token.text}</span>
              ))
            )}
          </motion.div>
        ))}
        {visibleLines < lines.length && (
          <span className="animate-blink" style={{ color: "var(--hive-accent-primary)" }}>▊</span>
        )}
      </div>
    </div>
  );
}

/* === FEATURE CARDS === */
const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "The Pulse Feed",
    description: "Auto-generated posts from GitHub commits, Codeforces solves, and milestones. Your engineering activity, amplified.",
    color: "#00d4ff",
    gradient: "linear-gradient(135deg, rgba(0,212,255,0.12) 0%, rgba(0,212,255,0.02) 100%)",
    stats: "1.2M+ commits tracked",
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: "The Arena",
    description: "Compete in coding challenges, climb ELO rankings, and earn badges. Codeforces integration built in.",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(245,158,11,0.02) 100%)",
    stats: "340K challenges solved",
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Neural Link Forum",
    description: "Deep technical discourse with real-time collaboration. Topic channels for every discipline.",
    color: "#10b981",
    gradient: "linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.02) 100%)",
    stats: "50K+ discussions",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Squad Finder",
    description: "Find co-founders and mentors matched by complementary skills. Build your tribe.",
    color: "#7c3aed",
    gradient: "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(124,58,237,0.02) 100%)",
    stats: "8K squads formed",
  },
];

/* === HOW IT WORKS === */
const steps = [
  {
    icon: <Github className="w-5 h-5" />,
    title: "Connect Your Stack",
    description: "Link GitHub, Codeforces, and more. Your activity syncs automatically.",
  },
  {
    icon: <Activity className="w-5 h-5" />,
    title: "Build Your Record",
    description: "Every commit, every solve, every milestone builds your engineering identity.",
  },
  {
    icon: <Flame className="w-5 h-5" />,
    title: "Compete & Collaborate",
    description: "Join arenas, maintain streaks, find your squad. Rise through the ranks.",
  },
];

const categories = [
  { icon: <Code2 className="w-5 h-5" />, label: "Full Stack", count: "12K+", color: "#00d4ff" },
  { icon: <Terminal className="w-5 h-5" />, label: "Competitive Coding", count: "3.2K+", color: "#f59e0b" },
  { icon: <Shield className="w-5 h-5" />, label: "Cybersecurity", count: "2.1K+", color: "#ef4444" },
  { icon: <Brain className="w-5 h-5" />, label: "ML/AI Research", count: "1.8K+", color: "#7c3aed" },
  { icon: <Flame className="w-5 h-5" />, label: "Open Source", count: "5.4K+", color: "#f97316" },
  { icon: <Layers className="w-5 h-5" />, label: "DevOps", count: "2.8K+", color: "#10b981" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export default function LandingPage() {
  return (
    <div className="min-h-screen noise-overlay" style={{ background: "var(--hive-bg-primary)" }}>

      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 glass-card" style={{ borderRadius: 0, borderTop: "none", borderLeft: "none", borderRight: "none" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center glow-cyan" style={{ background: "var(--hive-gradient-primary)" }}>
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text tracking-tight">HIVE</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm transition-colors hover:text-white" style={{ color: "var(--hive-text-secondary)" }}>Features</a>
            <a href="#how-it-works" className="text-sm transition-colors hover:text-white" style={{ color: "var(--hive-text-secondary)" }}>How It Works</a>
            <a href="#communities" className="text-sm transition-colors hover:text-white" style={{ color: "var(--hive-text-secondary)" }}>Communities</a>
            <Link href="/login" className="text-sm px-5 py-2 rounded-lg font-medium btn-primary flex items-center gap-1.5">
              Launch Console <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-28 pb-24 px-6 overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 grid-bg" />

        {/* Floating orbs */}
        <div className="absolute top-20 left-[15%] w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none animate-glow-pulse" style={{ background: "rgba(0,212,255,0.08)" }} />
        <div className="absolute top-40 right-[10%] w-[350px] h-[350px] rounded-full blur-[120px] pointer-events-none animate-glow-pulse" style={{ background: "rgba(124,58,237,0.06)", animationDelay: "2s" }} />
        <div className="absolute bottom-0 left-[40%] w-[500px] h-[300px] rounded-full blur-[120px] pointer-events-none animate-glow-pulse" style={{ background: "rgba(16,185,129,0.04)", animationDelay: "4s" }} />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8" style={{ background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.15)", color: "var(--hive-accent-primary)" }}>
                  <span className="w-2 h-2 rounded-full animate-pulse-glow" style={{ background: "var(--hive-accent-primary)" }} />
                  Now in Early Access
                </div>
              </motion.div>

              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                The Command
                <br />
                Center{" "}
                <span className="gradient-text-shimmer">For Your Career</span>
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl max-w-lg mb-10 leading-relaxed"
                style={{ color: "var(--hive-text-secondary)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Transform the solitary engineering grind into a shared, visceral journey.
                Track streaks. Compete in arenas. Ship with the most obsessed builders on the planet.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Link href="/register" className="btn-primary inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-semibold">
                  Join the Hive <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="#features" className="btn-ghost inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base">
                  <Eye className="w-4 h-4" /> Explore Features
                </Link>
              </motion.div>

              {/* Social proof */}
              <motion.div
                className="flex items-center gap-4 mt-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex -space-x-2">
                  {["#00d4ff", "#7c3aed", "#f59e0b", "#10b981", "#ec4899"].map((c, i) => (
                    <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: c, border: "2px solid var(--hive-bg-primary)", zIndex: 5 - i }}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-sm font-medium">24,000+ engineers</div>
                  <div className="text-xs" style={{ color: "var(--hive-text-muted)" }}>building in the open</div>
                </div>
              </motion.div>
            </div>

            {/* Right: Terminal */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Glow behind terminal */}
                <div className="absolute -inset-4 rounded-2xl blur-2xl opacity-40" style={{ background: "var(--hive-gradient-primary)" }} />
                <div className="relative">
                  <HeroTerminal />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="py-10 px-6 relative" style={{ borderTop: "1px solid var(--hive-border)", borderBottom: "1px solid var(--hive-border)" }}>
        <div className="absolute inset-0" style={{ background: "var(--hive-gradient-mesh)" }} />
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between gap-8 relative z-10">
          {[
            { label: "Active Engineers", value: "24,000", suffix: "+" },
            { label: "Commits Tracked", value: "1.2", suffix: "M" },
            { label: "Challenges Solved", value: "340", suffix: "K" },
            { label: "Lines Shipped", value: "89", suffix: "M" },
          ].map((stat) => (
            <div key={stat.label} className="text-center flex-1 min-w-[120px]">
              <div className="text-3xl md:text-4xl font-bold gradient-text">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs mt-1.5 font-medium" style={{ color: "var(--hive-text-muted)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-28 px-6 relative section-glow-top">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="tag mx-auto mb-4 w-fit">
              <Sparkles className="w-3 h-3" style={{ color: "var(--hive-accent-primary)" }} />
              Core Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-5 tracking-tight">
              Built for <span className="gradient-text">Serious Builders</span>
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--hive-text-secondary)" }}>
              Every feature designed to amplify your engineering journey and turn consistency into career capital.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                className="glass-card-interactive p-8 group relative overflow-hidden"
              >
                {/* Gradient accent top */}
                <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(90deg, transparent, ${f.color}, transparent)` }} />

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110" style={{ background: f.gradient, color: f.color }}>
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--hive-text-secondary)" }}>{f.description}</p>
                    <div className="flex items-center gap-2 text-xs font-medium" style={{ color: f.color }}>
                      <BarChart3 className="w-3.5 h-3.5" />
                      {f.stats}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GLOW DIVIDER */}
      <div className="glow-line max-w-4xl mx-auto" />

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-5 tracking-tight">
              Three Steps to{" "}
              <span className="gradient-text-warm">Liftoff</span>
            </h2>
            <p className="text-lg" style={{ color: "var(--hive-text-secondary)" }}>
              From zero to fully connected in under 60 seconds.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <div className="stat-card text-center p-8">
                  <div className="text-5xl font-bold mb-4 gradient-text" style={{ opacity: 0.2 }}>
                    0{i + 1}
                  </div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(0,212,255,0.08)", color: "var(--hive-accent-primary)" }}>
                    {step.icon}
                  </div>
                  <h3 className="text-base font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--hive-text-secondary)" }}>{step.description}</p>
                </div>

                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px" style={{ background: "var(--hive-border)" }}>
                    <ChevronRight className="w-3 h-3 absolute -right-1 -top-1.5" style={{ color: "var(--hive-text-muted)" }} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITIES */}
      <section id="communities" className="py-28 px-6 relative" style={{ background: "var(--hive-bg-secondary)" }}>
        <div className="absolute inset-0 dot-grid opacity-50" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-5 tracking-tight">
              Find Your <span className="gradient-text-aurora">Tribe</span>
            </h2>
            <p className="text-lg mb-14" style={{ color: "var(--hive-text-secondary)" }}>
              Specialized communities for every discipline in tech.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {categories.map((c, i) => (
              <motion.div
                key={c.label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="glass-card-interactive p-5 flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110" style={{ background: `${c.color}12`, color: c.color }}>
                  {c.icon}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm">{c.label}</div>
                  <div className="text-xs" style={{ color: "var(--hive-text-muted)" }}>{c.count} members</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg" />
        {/* Orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none animate-glow-pulse" style={{ background: "rgba(0,212,255,0.06)" }} />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none animate-glow-pulse" style={{ background: "rgba(124,58,237,0.04)", animationDelay: "2s" }} />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight">
              Consistency Is the Only Metric That{" "}
              <span className="gradient-text-shimmer">Guarantees Survival</span>
            </h2>
            <p className="text-lg md:text-xl mb-12 leading-relaxed" style={{ color: "var(--hive-text-secondary)" }}>
              Stop building in isolation. Your next co-founder, mentor, or biggest breakthrough is one connection away.
            </p>
            <Link href="/register" className="btn-primary inline-flex items-center gap-3 px-10 py-4.5 text-lg font-bold glow-cyan-intense">
              Enter the Hive <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-xs mt-6" style={{ color: "var(--hive-text-muted)" }}>
              Free forever for individual developers. No credit card required.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6" style={{ borderTop: "1px solid var(--hive-border)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--hive-gradient-primary)" }}>
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold gradient-text">HIVE</span>
            </div>
            <div className="flex items-center gap-8">
              <Link href="/feed" className="text-xs transition-colors hover:text-white" style={{ color: "var(--hive-text-muted)" }}>Feed</Link>
              <Link href="/arena" className="text-xs transition-colors hover:text-white" style={{ color: "var(--hive-text-muted)" }}>Arena</Link>
              <Link href="/forum" className="text-xs transition-colors hover:text-white" style={{ color: "var(--hive-text-muted)" }}>Forum</Link>
              <a href="https://github.com/Radical11/HIVE" target="_blank" rel="noreferrer" className="text-xs transition-colors hover:text-white flex items-center gap-1" style={{ color: "var(--hive-text-muted)" }}>
                <Github className="w-3 h-3" /> GitHub
              </a>
            </div>
            <p className="text-xs" style={{ color: "var(--hive-text-muted)" }}>
              &copy; 2026 Hive. Built by engineers, for engineers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
