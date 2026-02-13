import { auth } from "@/lib/firebase";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function getAuthHeaders(): Promise<HeadersInit> {
    const user = auth.currentUser;
    if (!user) return { "Content-Type": "application/json" };

    const token = await user.getIdToken();
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

export async function apiGet<T = any>(path: string): Promise<T> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}${path}`, { headers });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || err.detail || `API Error ${res.status}`);
    }
    return res.json();
}

export async function apiPost<T = any>(path: string, body?: unknown): Promise<T> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || err.detail || `API Error ${res.status}`);
    }
    return res.json();
}

export async function apiPatch<T = any>(path: string, body?: unknown): Promise<T> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}${path}`, {
        method: "PATCH",
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || err.detail || `API Error ${res.status}`);
    }
    return res.json();
}
