// ===== HIVE Mock Data =====

export interface User {
    id: string;
    username: string;
    name: string;
    avatar: string;
    role: string;
    bio: string;
    techStack: { frontend: number; backend: number; devops: number };
    stats: {
        currentStreak: number;
        totalCommits: number;
        reputation: number;
        problemsSolved: number;
    };
    githubData: {
        contributions: number[];
        topRepos: string[];
    };
    codeforcesRating: number;
    ratingHistory: { month: string; rating: number }[];
    isOnline: boolean;
    compatibility?: number;
}

export interface Project {
    id: string;
    name: string;
    slug: string;
    description: string;
    readme: string;
    techStack: string[];
    liveUrl: string;
    stars: number;
    lastUpdated: string;
    permissions: string;
}

export interface FeedItem {
    id: string;
    userId: string;
    username: string;
    type: "github" | "leetcode" | "deploy" | "streak";
    title: string;
    description: string;
    stats?: { time?: string; memory?: string; language?: string };
    repo?: string;
    difficulty?: "Easy" | "Medium" | "Hard";
    contributions?: number[];
    timestamp: string;
}

export interface Battle {
    id: string;
    title: string;
    participants: string[];
    timeLeft: number;
    difficulty: string;
    type: string;
    spectators: number;
    prize: string;
}

export interface LeaderboardEntry {
    id: string;
    rank: number;
    username: string;
    rating: number;
    solved: number;
    tier: "bronze" | "silver" | "gold" | "platinum";
    change: number;
}

export interface TrendingRepo {
    name: string;
    stars: number;
    language: string;
    languageColor: string;
}

// ===== USERS =====
export const users: User[] = [
    {
        id: "u1",
        username: "gaurav_x",
        name: "Gaurav Singh",
        avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=gaurav",
        role: "Full-Stack Architect",
        bio: "Building systems that scale. Ex-FAANG. Open source contributor.",
        techStack: { frontend: 85, backend: 95, devops: 70 },
        stats: { currentStreak: 47, totalCommits: 2847, reputation: 9420, problemsSolved: 612 },
        githubData: {
            contributions: [3, 5, 2, 7, 4, 6, 8, 3, 5, 9, 2, 4, 7, 6, 3, 5, 8, 4, 6, 7, 3, 5, 2, 8, 4, 6, 9, 3, 5, 7, 4, 6, 8, 2, 5, 7, 3, 6, 4, 8, 5, 7, 3, 6, 9, 4, 5, 2, 7, 8, 3, 6],
            topRepos: ["hive-core", "distributed-cache", "neural-search"],
        },
        codeforcesRating: 1847,
        ratingHistory: [
            { month: "Jun", rating: 1520 }, { month: "Jul", rating: 1580 }, { month: "Aug", rating: 1640 },
            { month: "Sep", rating: 1690 }, { month: "Oct", rating: 1720 }, { month: "Nov", rating: 1780 },
            { month: "Dec", rating: 1810 }, { month: "Jan", rating: 1847 },
        ],
        isOnline: true,
    },
    {
        id: "u2",
        username: "aria_dev",
        name: "Aria Chen",
        avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=aria",
        role: "Backend Architect",
        bio: "Distributed systems enthusiast. Rust evangelist. Coffee-driven.",
        techStack: { frontend: 40, backend: 95, devops: 80 },
        stats: { currentStreak: 23, totalCommits: 4120, reputation: 8750, problemsSolved: 489 },
        githubData: {
            contributions: [5, 7, 3, 8, 6, 4, 9, 7, 5, 3, 8, 6, 4, 7, 5, 9, 3, 6, 8, 4, 7, 5, 3, 9, 6, 4, 8, 7, 5, 3, 6, 9, 4, 7, 5, 8, 3, 6, 4, 9, 7, 5, 3, 8, 6, 4, 7, 9, 5, 3, 6, 8],
            topRepos: ["rustgrpc", "kv-store", "load-balancer"],
        },
        codeforcesRating: 2105,
        ratingHistory: [
            { month: "Jun", rating: 1890 }, { month: "Jul", rating: 1920 }, { month: "Aug", rating: 1980 },
            { month: "Sep", rating: 2010 }, { month: "Oct", rating: 2040 }, { month: "Nov", rating: 2070 },
            { month: "Dec", rating: 2090 }, { month: "Jan", rating: 2105 },
        ],
        isOnline: true,
        compatibility: 94,
    },
    {
        id: "u3",
        username: "zk_marcus",
        name: "Marcus Webb",
        avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=marcus",
        role: "DevOps Engineer",
        bio: "Kubernetes whisperer. Infrastructure as code or bust.",
        techStack: { frontend: 30, backend: 65, devops: 95 },
        stats: { currentStreak: 15, totalCommits: 3200, reputation: 7600, problemsSolved: 310 },
        githubData: {
            contributions: [4, 6, 2, 7, 5, 3, 8, 6, 4, 7, 5, 3, 9, 6, 4, 8, 5, 7, 3, 6, 4, 8, 5, 7, 3, 9, 6, 4, 8, 5, 7, 3, 6, 9, 4, 5, 8, 3, 7, 6, 4, 5, 9, 3, 7, 6, 8, 4, 5, 3, 7, 9],
            topRepos: ["k8s-operator", "terraform-modules", "ci-pipeline"],
        },
        codeforcesRating: 1560,
        ratingHistory: [
            { month: "Jun", rating: 1340 }, { month: "Jul", rating: 1380 }, { month: "Aug", rating: 1420 },
            { month: "Sep", rating: 1450 }, { month: "Oct", rating: 1490 }, { month: "Nov", rating: 1510 },
            { month: "Dec", rating: 1540 }, { month: "Jan", rating: 1560 },
        ],
        isOnline: false,
        compatibility: 87,
    },
    {
        id: "u4",
        username: "pixel_nina",
        name: "Nina Patel",
        avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=nina",
        role: "Frontend Engineer",
        bio: "Pixel-perfect UIs. React/Next.js specialist. Design system nerd.",
        techStack: { frontend: 95, backend: 50, devops: 35 },
        stats: { currentStreak: 31, totalCommits: 2100, reputation: 8200, problemsSolved: 420 },
        githubData: {
            contributions: [6, 8, 4, 9, 7, 5, 3, 8, 6, 4, 9, 7, 5, 3, 8, 6, 4, 7, 9, 5, 3, 8, 6, 4, 7, 5, 9, 3, 8, 6, 4, 7, 5, 9, 3, 6, 8, 4, 7, 5, 9, 3, 6, 8, 4, 7, 5, 3, 9, 6, 8, 4],
            topRepos: ["design-system", "motion-ui", "react-hooks-lib"],
        },
        codeforcesRating: 1420,
        ratingHistory: [
            { month: "Jun", rating: 1200 }, { month: "Jul", rating: 1250 }, { month: "Aug", rating: 1290 },
            { month: "Sep", rating: 1320 }, { month: "Oct", rating: 1350 }, { month: "Nov", rating: 1380 },
            { month: "Dec", rating: 1400 }, { month: "Jan", rating: 1420 },
        ],
        isOnline: true,
        compatibility: 91,
    },
    {
        id: "u5",
        username: "0xkraft",
        name: "Alex Kraft",
        avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=alex",
        role: "ML Engineer",
        bio: "Training models, shipping products. PyTorch + CUDA.",
        techStack: { frontend: 25, backend: 80, devops: 55 },
        stats: { currentStreak: 12, totalCommits: 1800, reputation: 7100, problemsSolved: 380 },
        githubData: {
            contributions: [2, 4, 6, 3, 7, 5, 8, 4, 6, 3, 7, 5, 9, 4, 6, 3, 8, 5, 7, 4, 6, 3, 9, 5, 7, 4, 8, 6, 3, 5, 7, 4, 9, 6, 3, 5, 8, 7, 4, 6, 3, 5, 9, 7, 4, 6, 8, 3, 5, 7, 4, 9],
            topRepos: ["llm-finetune", "vision-transformer", "data-pipeline"],
        },
        codeforcesRating: 1680,
        ratingHistory: [
            { month: "Jun", rating: 1450 }, { month: "Jul", rating: 1500 }, { month: "Aug", rating: 1540 },
            { month: "Sep", rating: 1580 }, { month: "Oct", rating: 1610 }, { month: "Nov", rating: 1640 },
            { month: "Dec", rating: 1660 }, { month: "Jan", rating: 1680 },
        ],
        isOnline: false,
        compatibility: 78,
    },
];

// ===== PROJECTS =====
export const projects: Project[] = [
    {
        id: "p1",
        name: "vdoc-app",
        slug: "vdoc",
        description: "Real-time collaborative document editor with AI-powered suggestions and version control.",
        readme: `# VDoc App\n\nA next-generation collaborative document editor.\n\n## Features\n- Real-time multi-user editing via CRDT\n- AI-powered writing suggestions\n- Git-like version control for documents\n- Markdown + Rich Text hybrid mode\n\n## Tech Stack\nNext.js 14 • TypeScript • Yjs • OpenAI API • PostgreSQL\n\n## Status: 🟢 Production`,
        techStack: ["Next.js", "TypeScript", "Yjs", "PostgreSQL", "OpenAI"],
        liveUrl: "https://vdoc.app",
        stars: 342,
        lastUpdated: "2 hours ago",
        permissions: "drwxr-xr-x",
    },
    {
        id: "p2",
        name: "cryptic-hunt-bot",
        slug: "cryptic",
        description: "Discord bot for running cryptic coding hunts with auto-grading and leaderboards.",
        readme: `# Cryptic Hunt Bot\n\nAutomated cryptic coding hunt platform for Discord.\n\n## Features\n- Custom puzzle creation with difficulty tiers\n- Auto-grading engine with partial scoring\n- Real-time leaderboard & streaks\n- Anti-cheat detection system\n\n## Tech Stack\nNode.js • Discord.js • Redis • MongoDB\n\n## Status: 🟡 Beta`,
        techStack: ["Node.js", "Discord.js", "Redis", "MongoDB"],
        liveUrl: "https://cryptic-hunt.dev",
        stars: 128,
        lastUpdated: "1 day ago",
        permissions: "drwxr-xr-x",
    },
    {
        id: "p3",
        name: "neural-search-engine",
        slug: "neural",
        description: "Semantic search engine using vector embeddings for code repositories.",
        readme: `# Neural Search Engine\n\nSemantic code search powered by vector embeddings.\n\n## Features\n- Natural language code search\n- Cross-language semantic matching\n- IDE plugin support (VS Code, JetBrains)\n- Self-hosted deployment option\n\n## Tech Stack\nPython • FastAPI • Pinecone • Transformers • Docker\n\n## Status: 🔴 Alpha`,
        techStack: ["Python", "FastAPI", "Pinecone", "Transformers", "Docker"],
        liveUrl: "https://neural-search.dev",
        stars: 89,
        lastUpdated: "3 days ago",
        permissions: "drwxr-xr-x",
    },
];

// ===== FEED ITEMS =====
export const feedItems: FeedItem[] = [
    {
        id: "f1", userId: "u1", username: "gaurav_x", type: "github",
        title: "feat: implement WebSocket real-time sync",
        description: "Added real-time collaborative editing via WebSocket connections with CRDT conflict resolution.",
        repo: "hive-core", timestamp: "12m ago",
        contributions: [3, 5, 2, 7, 4, 6, 8, 3, 5, 9, 2, 4, 7, 6, 3, 5, 8, 4, 6, 7, 3, 5, 2, 8, 4, 6, 9, 3],
    },
    {
        id: "f2", userId: "u2", username: "aria_dev", type: "leetcode",
        title: "Solved: Median of Two Sorted Arrays",
        description: "Binary search approach with O(log(min(m,n))) complexity.",
        difficulty: "Hard",
        stats: { time: "14ms", memory: "4.2MB", language: "Rust" },
        timestamp: "28m ago",
    },
    {
        id: "f3", userId: "u4", username: "pixel_nina", type: "deploy",
        title: "Deployed design-system v2.4.0",
        description: "New glassmorphism components, dark mode improvements, and motion primitives.",
        repo: "design-system", timestamp: "1h ago",
    },
    {
        id: "f4", userId: "u3", username: "zk_marcus", type: "github",
        title: "fix: resolve k8s pod restart loop",
        description: "Fixed memory limit misconfiguration causing OOMKilled in production pods.",
        repo: "k8s-operator", timestamp: "1h ago",
        contributions: [4, 6, 2, 7, 5, 3, 8, 6, 4, 7, 5, 3, 9, 6, 4, 8, 5, 7, 3, 6, 4, 8, 5, 7, 3, 9, 6, 4],
    },
    {
        id: "f5", userId: "u5", username: "0xkraft", type: "leetcode",
        title: "Solved: LRU Cache Implementation",
        description: "HashMap + Doubly Linked List for O(1) get/put operations.",
        difficulty: "Medium",
        stats: { time: "8ms", memory: "12.1MB", language: "Python" },
        timestamp: "2h ago",
    },
    {
        id: "f6", userId: "u1", username: "gaurav_x", type: "streak",
        title: "🔥 47-Day Streak!",
        description: "Consistently shipping code every single day. The grind never stops.",
        timestamp: "3h ago",
    },
    {
        id: "f7", userId: "u2", username: "aria_dev", type: "github",
        title: "refactor: migrate to async/await pattern",
        description: "Replaced callback-based handlers with async/await across the entire gRPC service layer.",
        repo: "rustgrpc", timestamp: "4h ago",
        contributions: [5, 7, 3, 8, 6, 4, 9, 7, 5, 3, 8, 6, 4, 7, 5, 9, 3, 6, 8, 4, 7, 5, 3, 9, 6, 4, 8, 7],
    },
    {
        id: "f8", userId: "u4", username: "pixel_nina", type: "leetcode",
        title: "Solved: Longest Palindromic Substring",
        description: "Manacher's algorithm implementation achieving O(n) time.",
        difficulty: "Medium",
        stats: { time: "3ms", memory: "6.8MB", language: "TypeScript" },
        timestamp: "5h ago",
    },
    {
        id: "f9", userId: "u3", username: "zk_marcus", type: "deploy",
        title: "Deployed terraform-modules v1.8.0",
        description: "Added multi-region failover support and automated backup verification.",
        repo: "terraform-modules", timestamp: "6h ago",
    },
    {
        id: "f10", userId: "u5", username: "0xkraft", type: "github",
        title: "feat: add attention visualization layer",
        description: "Implemented attention head visualization for model interpretability debugging.",
        repo: "vision-transformer", timestamp: "8h ago",
        contributions: [2, 4, 6, 3, 7, 5, 8, 4, 6, 3, 7, 5, 9, 4, 6, 3, 8, 5, 7, 4, 6, 3, 9, 5, 7, 4, 8, 6],
    },
];

// ===== BATTLES =====
export const battles: Battle[] = [
    { id: "b1", title: "Graph Traversal Sprint", participants: ["aria_dev", "0xkraft"], timeLeft: 2712, difficulty: "Hard", type: "Algorithm", spectators: 124, prize: "500 REP" },
    { id: "b2", title: "System Design: Chat App", participants: ["gaurav_x", "zk_marcus"], timeLeft: 4928, difficulty: "Expert", type: "System Design", spectators: 89, prize: "1000 REP" },
    { id: "b3", title: "SQL Optimization Challenge", participants: ["pixel_nina", "aria_dev"], timeLeft: 933, difficulty: "Medium", type: "Database", spectators: 56, prize: "250 REP" },
    { id: "b4", title: "Regex Gauntlet", participants: ["0xkraft", "gaurav_x", "pixel_nina"], timeLeft: 7200, difficulty: "Easy", type: "Pattern Matching", spectators: 201, prize: "100 REP" },
];

// ===== LEADERBOARD =====
export const leaderboard: LeaderboardEntry[] = [
    { id: "l1", rank: 1, username: "aria_dev", rating: 2105, solved: 489, tier: "platinum", change: 2 },
    { id: "l2", rank: 2, username: "gaurav_x", rating: 1847, solved: 612, tier: "platinum", change: -1 },
    { id: "l3", rank: 3, username: "pixel_nina", rating: 1420, solved: 420, tier: "gold", change: 1 },
    { id: "l4", rank: 4, username: "0xkraft", rating: 1680, solved: 380, tier: "gold", change: 0 },
    { id: "l5", rank: 5, username: "zk_marcus", rating: 1560, solved: 310, tier: "gold", change: 3 },
    { id: "l6", rank: 6, username: "bytecode_sam", rating: 1380, solved: 290, tier: "silver", change: -2 },
    { id: "l7", rank: 7, username: "rust_rider", rating: 1340, solved: 275, tier: "silver", change: 1 },
    { id: "l8", rank: 8, username: "lambda_queen", rating: 1290, solved: 260, tier: "silver", change: -1 },
    { id: "l9", rank: 9, username: "sys_admin_oz", rating: 1220, solved: 240, tier: "bronze", change: 0 },
    { id: "l10", rank: 10, username: "code_w1zard", rating: 1180, solved: 220, tier: "bronze", change: 2 },
];

// ===== TRENDING REPOS =====
export const trendingRepos: TrendingRepo[] = [
    { name: "vercel/next.js", stars: 128400, language: "TypeScript", languageColor: "#3178c6" },
    { name: "denoland/deno", stars: 97200, language: "Rust", languageColor: "#dea584" },
    { name: "tauri-apps/tauri", stars: 82100, language: "Rust", languageColor: "#dea584" },
    { name: "oven-sh/bun", stars: 74600, language: "Zig", languageColor: "#ec915c" },
];

// ===== LIVE FEED EVENTS =====
export const liveFeedEvents: string[] = [
    "aria_dev pushed 3 commits to rustgrpc/main",
    "pixel_nina deployed design-system v2.4.0",
    "0xkraft opened PR #47 on vision-transformer",
    "zk_marcus merged fix/pod-restart into k8s-operator",
    "gaurav_x solved 'Binary Tree Maximum Path Sum' (Hard)",
    "rust_rider pushed to load-balancer/feat/health-check",
    "lambda_queen deployed ml-pipeline v1.2.0",
    "bytecode_sam opened issue #12 on compiler-explorer",
];
