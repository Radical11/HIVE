import { initializeApp, getApps } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    type User,
    type UserCredential,
} from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (prevent duplicate init in dev hot-reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

// Providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
// Request additional GitHub scopes for repo/user access
githubProvider.addScope("read:user");
githubProvider.addScope("repo");

// Sign in with Google
export async function signInWithGoogle() {
    return signInWithPopup(auth, googleProvider);
}

// Sign in with GitHub — returns the GitHub OAuth access token alongside the credential
export async function signInWithGithub(): Promise<{ result: UserCredential; githubAccessToken: string }> {
    const result = await signInWithPopup(auth, githubProvider);
    const credential = GithubAuthProvider.credentialFromResult(result);
    const githubAccessToken = credential?.accessToken || "";
    return { result, githubAccessToken };
}

// Sign out
export async function signOut() {
    return firebaseSignOut(auth);
}

export { auth, onAuthStateChanged, GithubAuthProvider, type User };
