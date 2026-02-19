import axios from "axios";
import { auth } from "./firebase";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
});

// Attach Firebase ID token to every request
api.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ========== Feed ==========

export interface ApiPost {
    id: string;
    author: {
        id: string;
        username: string;
        email: string;
        first_name: string;
        last_name: string;
        profile: {
            headline: string;
            bio: string;
            avatar_url: string;
            github_handle: string;
            twitter_handle: string;
            linkedin_handle: string;
            elo_rating: number;
            current_streak: number;
            total_xp: number;
        } | null;
        is_github_connected: boolean;
    };
    content: string;
    code_snippet: string;
    image_url: string;
    type: "MANUAL" | "GITHUB_COMMIT" | "CODEFORCES_SOLVE" | "MILESTONE";
    created_at: string;
    reactions: { id: number; user: string; type: string }[];
    comments: {
        id: number;
        user: { id: string; username: string; first_name: string; last_name: string };
        content: string;
        code_snippet: string;
        created_at: string;
    }[];
    reaction_counts: Record<string, number>;
    comment_count: number;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export async function getFeed(page = 1): Promise<PaginatedResponse<ApiPost>> {
    const { data } = await api.get(`/api/feed/?page=${page}`);
    return data;
}

export async function createPost(content: string, type = "MANUAL", codeSnippet = "") {
    const { data } = await api.post("/api/feed/", {
        content,
        type,
        code_snippet: codeSnippet,
    });
    return data;
}

export async function reactToPost(postId: string, reactionType: string) {
    const { data } = await api.post(`/api/feed/${postId}/react/`, { type: reactionType });
    return data;
}

export async function commentOnPost(postId: string, content: string) {
    const { data } = await api.post(`/api/feed/${postId}/comment/`, { content });
    return data;
}

// ========== Users ==========

export interface ApiUser {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    profile: {
        headline: string;
        bio: string;
        avatar_url: string;
        github_handle: string;
        twitter_handle: string;
        linkedin_handle: string;
        elo_rating: number;
        current_streak: number;
        total_xp: number;
    } | null;
    is_github_connected: boolean;
}

export async function getMe(): Promise<ApiUser> {
    const { data } = await api.get("/api/users/me/");
    return data;
}

export async function updateProfile(fields: Record<string, string>) {
    const { data } = await api.patch("/api/users/me/", fields);
    return data;
}

// ========== GitHub Auth ==========

export async function exchangeGitHubCode(code: string) {
    const { data } = await api.post("/api/users/auth/github/", { code });
    return data as { token: string; user: ApiUser };
}

// ========== Repositories ==========

export interface ApiRepository {
    id: number;
    github_repo_id: string;
    full_name: string;
    html_url: string;
    is_active: boolean;
    default_description: string;
}

export async function getRepositories(): Promise<ApiRepository[]> {
    const { data } = await api.get("/api/users/repositories/");
    return data;
}

export async function toggleRepository(id: number, isActive: boolean) {
    const { data } = await api.post("/api/users/repositories/", { id, is_active: isActive });
    return data;
}

// ========== GitHub Public API (no auth needed) ==========

export interface GitHubRepo {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    updated_at: string;
}

export interface GitHubProfile {
    login: string;
    name: string | null;
    avatar_url: string;
    bio: string | null;
    public_repos: number;
    followers: number;
    following: number;
    html_url: string;
}

export async function getGitHubProfile(handle: string): Promise<GitHubProfile> {
    const { data } = await axios.get(`https://api.github.com/users/${handle}`);
    return data;
}

export async function getGitHubRepos(handle: string, sort: "updated" | "stars" = "updated"): Promise<GitHubRepo[]> {
    const { data } = await axios.get(
        `https://api.github.com/users/${handle}/repos?sort=${sort}&per_page=6`
    );
    return data;
}

export interface GitHubEvent {
    id: string;
    type: string;
    actor: {
        id: number;
        login: string;
        avatar_url: string;
    };
    repo: {
        id: number;
        name: string;
        url: string;
    };
    payload: any;
    public: boolean;
    created_at: string;
}

export async function getGitHubEvents(handle: string): Promise<GitHubEvent[]> {
    const { data } = await axios.get(
        `https://api.github.com/users/${handle}/events/public?per_page=10`
    );
    return data;
}

// Language color mapping for common languages
export const LANG_COLORS: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    Python: "#3572A5",
    Rust: "#dea584",
    Go: "#00ADD8",
    Java: "#b07219",
    "C++": "#f34b7d",
    C: "#555555",
    Ruby: "#701516",
    PHP: "#4F5D95",
    Swift: "#F05138",
    Kotlin: "#A97BFF",
    Dart: "#00B4AB",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Shell: "#89e051",
    "Jupyter Notebook": "#DA5B0B",
};

export default api;
