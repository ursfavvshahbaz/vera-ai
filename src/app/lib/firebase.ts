import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC2dH0mN2cLJBoW12aOJzgBD-QkFPC5I44", // Aapka jo original hai wahi rehne dena
  authDomain: "vera-ai-1b12a.firebaseapp.com",
  projectId: "vera-ai-1b12a",
  storageBucket: "vera-ai-1b12a.firebasestorage.app",
  messagingSenderId: "365626673216",
  appId: "1:365626673216:web:72354072affe512910b7a5"
};

// Singleton pattern: Check if app is already initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };