"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Suspense } from "react";

function GitHubCallbackContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { handleGitHubCallback } = useAuth();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const code = searchParams.get("code");
        if (!code) {
            setError("No authorization code received from GitHub.");
            return;
        }

        handleGitHubCallback(code)
            .then(() => {
                router.replace("/feed");
            })
            .catch((err) => {
                console.error("GitHub callback error:", err);
                setError("Failed to authenticate with GitHub. Please try again.");
            });
    }, [searchParams, handleGitHubCallback, router]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6"
                style={{ background: "radial-gradient(ellipse at center, #111113 0%, #050505 70%)" }}
            >
                <div className="card p-8 text-center max-w-sm">
                    <p className="text-error mb-4">{error}</p>
                    <button
                        onClick={() => router.push("/login")}
                        className="btn-primary px-6 py-2"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6"
            style={{ background: "radial-gradient(ellipse at center, #111113 0%, #050505 70%)" }}
        >
            <div className="card p-8 text-center max-w-sm">
                <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-text-muted text-sm">Connecting your GitHub account...</p>
            </div>
        </div>
    );
}

export default function GitHubCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center p-6"
                style={{ background: "radial-gradient(ellipse at center, #111113 0%, #050505 70%)" }}
            >
                <div className="card p-8 text-center max-w-sm">
                    <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-text-muted text-sm">Loading...</p>
                </div>
            </div>
        }>
            <GitHubCallbackContent />
        </Suspense>
    );
}
