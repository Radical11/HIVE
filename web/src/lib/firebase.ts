import { initializeApp, getApps } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    type User,
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

// Sign in with Google
export async function signInWithGoogle() {
    return signInWithPopup(auth, googleProvider);
}

// Sign in with GitHub
export async function signInWithGithub() {
    return signInWithPopup(auth, githubProvider);
}

// Sign out
export async function signOut() {
    return firebaseSignOut(auth);
}

export { auth, onAuthStateChanged, type User };
