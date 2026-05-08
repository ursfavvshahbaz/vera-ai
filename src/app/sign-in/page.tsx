"use client";

import React, { useState, useEffect } from 'react';
import styles from './signin.module.scss';
import { Mail, Lock, Chrome, Loader2 } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);
  useEffect(() => {
    if (!isMounted) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) { window.location.assign('/dashboard'); }
    });
    return () => unsubscribe();
  }, [isMounted]);

  const handleManualSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // --- DUMMY ID LOGIC FOR COLLEGE DEMO ---
    const dummyUsers = [ "admin@vera.ai", "test@vera.ai", "student@vera.ai",
      "guest@vera.ai", "demo@vera.ai", "johndoe20@example.com", "user1@vera.ai",
      "user2@vera.ai", "faculty@vera.ai", "expert@vera.ai"
    ];

    if (dummyUsers.includes(email.toLowerCase())) {
      const fakeUser = {
        uid: "dummy-123",
        email: email.toLowerCase(),
        displayName: email.split('@')[0].toUpperCase(),
        isDemo: true
      };
      localStorage.setItem("vera_demo_user", JSON.stringify(fakeUser));
      console.log("Demo Access Granted for:", email);
      // Chhota sa delay demo feeling ke liye
      setTimeout(() => { window.location.assign('/dashboard'); }, 1000);
      return;
    }
    // REAL FIREBASE AUTH (Baaki unknown emails ke liye)
    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.removeItem("vera_demo_user");
    } catch (error: any) { alert("Error: " + error.message);
      setLoading(false);
    }
  };
  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        await setDoc(doc(db, "users", result.user.uid), {
          name: result.user.displayName,
          email: result.user.email,
          lastLogin: new Date(),
        }, { merge: true });
      }
    } catch (error) { console.error(error); setLoading(false); }
  };

  if (!isMounted) return null;
  return (
    <div className={styles.container}>
      {/* Background Blobs for that cool look you have in SCSS */}
      <div className={styles.blob1}></div>
      <div className={styles.blob2}></div>

      <div className={styles.glassCard}>
        <h1 className={styles.logoText}>Vera AI</h1>
        <p className={styles.subtitle}>Elevate your career with AI interviews.</p>

        <form onSubmit={handleManualSignIn} className={styles.form}>
          <div className={styles.inputWrapper}>
            <Mail size={18} className={styles.icon} />
            <input type="email"  placeholder="Email" value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required/></div>
          <div className={styles.inputWrapper}>
            <Lock size={18} className={styles.icon} />
            <input type="password" placeholder="Password" value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required/></div>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign In"}
          </button>
        </form>

        <div className={styles.divider}><span>OR</span></div>
        <button 
          onClick={handleGoogleSignIn} className={styles.googleBtn} 
          type="button" disabled={loading}>
          <Chrome size={20} /> Continue with Google
        </button>
      </div>
    </div>
  );
}