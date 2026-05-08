import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC2dH0mN2cLJBoW12aOJzgBD-QkFPC5I44", 
  authDomain: "vera-ai-1b12a.firebaseapp.com",
  projectId: "vera-ai-1b12a",
  storageBucket: "vera-ai-1b12a.firebasestorage.app",
  messagingSenderId: "365626673216",
  appId: "1:365626673216:web:72354072affe512910b7a5"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Google Provider ki settings (optional but good)
googleProvider.setCustomParameters({
  prompt: 'select_account' 
});