"use client";
import React, { useState } from "react";
import Link from "next/link";
import styles from "./welcome.module.scss";
// Naya component import karein
import HowItWorksModal from "../components/HowItWorksModal"; 

export default function WelcomePage() {
  // Modal control karne ke liye state
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className={styles.container}>
      <nav className={styles.navbar}>
        <h1 className={styles.logo}>Vera AI</h1>
      </nav>

      <section className={styles.hero}>
        <div className={styles.glassCard}>
          <span className={styles.badge}>Next-Gen AI Interviewer</span>
          <h2 className={styles.title}>
            Master Your Interview <br />
            <span>In Your Language</span>
          </h2>
          <p className={styles.subtitle}>
            Experience real-time technical interviews with Vera. 
            Speak in <strong>English</strong> or <strong>Roman Urdu</strong>.
          </p>
          
          <div className={styles.ctaGroup}>
            <Link href="/sign-up" className={styles.primaryBtn}>
              Get Started Now
            </Link>
            {/* Scroll ki jagah ab modal open hoga */}
            <button 
              onClick={() => setIsModalOpen(true)} 
              className={styles.secondaryBtn}
            >
              How it Works
            </button>
          </div>

          <div className={styles.extraLinkWrapper}>
            <p className={styles.extraLinkText}>
              already have an account?{" "}
              <Link href="/sign-in" className={styles.extraLink}>Sign in</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Glassmorphism Blobs */}
      <div className={styles.blob1}></div>
      <div className={styles.blob2}></div>

      {/* Step 2: Modal Logic */}
      {isModalOpen && (
        <HowItWorksModal onClose={() => setIsModalOpen(false)} />
      )}
    </main>
  );
}