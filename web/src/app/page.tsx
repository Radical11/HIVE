"use client";

import { motion, type Variants } from "framer-motion";
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
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "The Pulse Feed",
    description:
      "Your engineering activity, amplified. Auto-generated posts from commits, solves, and milestones.",
    color: "var(--hive-accent-primary)",
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: "The Arena",
    description:
      "Compete in coding challenges, climb ELO rankings, and earn badges that prove your craft.",
    color: "var(--hive-accent-warning)",
  },
  {
    icon: <GitBranch className="w-6 h-6" />,
    title: "Neural Link Forum",
    description:
      "Deep technical discourse with real-time collaboration, integrated IDE, and bounty system.",
    color: "var(--hive-accent-success)",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Squad Finder",
    description:
      "Discover co-founders and mentors matched by complementary skills and shared obsession.",
    color: "var(--hive-accent-secondary)",
  },
];

const categories = [
  { icon: <Code2 className="w-5 h-5" />, label: "Developers", count: "12K+" },
  {
    icon: <Terminal className="w-5 h-5" />,
    label: "Competitive Coders",
    count: "3K+",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    label: "Cybersecurity",
    count: "2K+",
  },
  { icon: <Brain className="w-5 h-5" />, label: "Researchers", count: "1K+" },
  { icon: <Flame className="w-5 h-5" />, label: "Open Source", count: "5K+" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const },
  }),
};

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--hive-bg-primary)" }}>
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 glass-card" style={{ borderRadius: 0, borderTop: "none", borderLeft: "none", borderRight: "none" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "var(--hive-gradient-primary)" }}
            >
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">HIVE</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm" style={{ color: "var(--hive-text-secondary)" }}>
              Features
            </a>
            <a href="#categories" className="text-sm" style={{ color: "var(--hive-text-secondary)" }}>
              Communities
            </a>
            <Link
              href="/login"
              className="text-sm px-5 py-2 rounded-lg font-medium transition-all hover:scale-105"
              style={{
                background: "var(--hive-gradient-primary)",
                color: "white",
              }}
            >
              Launch Console
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Ambient glow */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-20 blur-[120px] pointer-events-none"
          style={{ background: "var(--hive-gradient-primary)" }}
        />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8"
              style={{
                background: "rgba(0,212,255,0.1)",
                border: "1px solid rgba(0,212,255,0.2)",
                color: "var(--hive-accent-primary)",
              }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse-glow" style={{ background: "var(--hive-accent-primary)" }} />
              Now in Early Access
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            The Command Center
            <br />
            <span className="gradient-text">For Your Career</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10"
            style={{ color: "var(--hive-text-secondary)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Transform your solitary engineering grind into a shared, visceral
            journey. Track streaks, compete in arenas, and build with the most
            obsessed builders on the planet.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
              style={{
                background: "var(--hive-gradient-primary)",
                boxShadow: "var(--hive-glow-cyan)",
              }}
            >
              Join the Hive <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold transition-all hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--hive-border)",
                color: "var(--hive-text-primary)",
              }}
            >
              Explore Features
            </Link>
          </motion.div>
        </div>
      </section>

      {/* LIVE STATS BAR */}
      <section className="py-8 px-6" style={{ borderTop: "1px solid var(--hive-border)", borderBottom: "1px solid var(--hive-border)" }}>
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-12">
          {[
            { label: "Active Engineers", value: "24,000+" },
            { label: "Commits Tracked", value: "1.2M" },
            { label: "Challenges Solved", value: "340K" },
            { label: "Lines of Code", value: "89M" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold gradient-text">{stat.value}</div>
              <div className="text-xs mt-1" style={{ color: "var(--hive-text-muted)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for <span className="gradient-text">Serious Builders</span>
            </h2>
            <p style={{ color: "var(--hive-text-secondary)" }}>
              Every feature designed to amplify your engineering journey.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="glass-card p-8 hover:scale-[1.02] transition-transform cursor-pointer"
                style={{
                  borderColor: `${f.color}20`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: `${f.color}15`,
                    color: f.color,
                  }}
                >
                  {f.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--hive-text-primary)" }}>
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--hive-text-secondary)" }}>
                  {f.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="py-24 px-6" style={{ background: "var(--hive-bg-secondary)" }}>
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Find Your <span className="gradient-text">Tribe</span>
          </h2>
          <p className="mb-12" style={{ color: "var(--hive-text-secondary)" }}>
            Specialized communities for every discipline in tech.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((c, i) => (
              <motion.div
                key={c.label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="glass-card px-6 py-4 flex items-center gap-3 hover:scale-105 transition-transform cursor-pointer"
              >
                <div style={{ color: "var(--hive-accent-primary)" }}>{c.icon}</div>
                <div className="text-left">
                  <div className="font-medium text-sm">{c.label}</div>
                  <div className="text-xs" style={{ color: "var(--hive-text-muted)" }}>
                    {c.count} members
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: "var(--hive-gradient-primary)" }}
        />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Consistency is the Only Metric That{" "}
            <span className="gradient-text">Guarantees Survival</span>
          </h2>
          <p className="text-lg mb-10" style={{ color: "var(--hive-text-secondary)" }}>
            Stop building in isolation. Your next co-founder, mentor, or biggest
            breakthrough is one connection away.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl text-lg font-bold text-white transition-all hover:scale-105"
            style={{
              background: "var(--hive-gradient-primary)",
              boxShadow: "var(--hive-glow-cyan)",
            }}
          >
            Enter the Hive <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6" style={{ borderTop: "1px solid var(--hive-border)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{ background: "var(--hive-gradient-primary)" }}
            >
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold gradient-text">HIVE</span>
          </div>
          <p className="text-xs" style={{ color: "var(--hive-text-muted)" }}>
            © 2026 Hive. Built by engineers, for engineers.
          </p>
        </div>
      </footer>
    </div>
  );
}
