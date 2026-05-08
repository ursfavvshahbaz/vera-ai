"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { vapi, VERA_ID } from "../lib/vapi"; 
import styles from "./InterviewRoom.module.scss";
import { Mic, Loader2, LogOut, AlertCircle } from "lucide-react";
import { auth } from "../lib/firebase"; 

function InterviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const roleTitle = searchParams.get("role") || "Software Engineer";
  const level = searchParams.get("level") || "Intermediate";

  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState("Vera is ready for your session...");
  const [errorStatus, setErrorStatus] = useState(false);

  useEffect(() => {
    if (!vapi) return;

    vapi.on("call-start", () => {
      setIsLive(true);
      setIsLoading(false);
      setErrorStatus(false);
      setTranscript("Vera is listening... Start speaking.");
    });

    vapi.on("call-end", () => {
      setIsLive(false);
      setIsLoading(false);
      router.push(`/feedback?role=${roleTitle}&level=${level}`);
    });

    vapi.on("message", (msg: any) => {
      if (msg.type === "transcript" && msg.transcriptType === "partial") {
        setTranscript(msg.transcript); 
      }
    });

    vapi.on("error", (e: any) => {
      console.error("Vapi Error Event:", e);
      setIsLoading(false);
      setIsLive(false);
      setErrorStatus(true);
      setTranscript("Connection failed. Check your API Keys or Dashboard.");
    });

    return () => {
      vapi.stop();
      vapi.removeAllListeners();
    };
  }, [router, roleTitle, level]);

  const toggleInterview = async () => {
    if (isLive) {
      vapi?.stop();
      return;
    }

    setIsLoading(true);
    setErrorStatus(false);
    setTranscript("Connecting to Vera...");
    
    try {
      const user = auth.currentUser;

      // --- THE ULTIMATE FIX ---
      // Method: .start(assistantId, assistantOverrides)
      // Humne pehle error kiya tha ki humne overrides ko galat jagah nest kiya tha
      
      const assistantOverrides = {
        variableValues: {
          role: roleTitle,
          level: level
        }
      };

      // Vapi expects two separate arguments here
      await (vapi as any).start(VERA_ID, assistantOverrides);

    } catch (err: any) {
      console.error("Handshake Failed:", err);
      setIsLoading(false);
      setErrorStatus(true);
      setTranscript(`Error: ${err.message || "400 Bad Request"}`);
    }
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navPanel}>
        <button onClick={() => router.push('/dashboard')} className={styles.exitBtn}><LogOut size={16} /> Exit</button>
        <div className={styles.badgeGroup}>
          <span className={styles.roleLabel}>{roleTitle}</span>
          <span className={styles.levelLabel}>{level.toUpperCase()}</span>
        </div>
      </nav>

      <main className={styles.mainArea}>
        <div className={styles.orbWrapper}>
          <div className={`${styles.glowingOrb} ${isLive ? styles.activeOrb : ""} ${errorStatus ? styles.errorOrb : ""}`}>
            {isLoading ? <Loader2 className={styles.spinLoader} size={48} /> : 
             errorStatus ? <AlertCircle size={48} color="#ef4444" /> : <Mic size={48} />}
          </div>
        </div>

        <section className={styles.promptPanel}>
          <p className={styles.promptText}>{transcript}</p>
        </section>

        <button onClick={toggleInterview} className={`${styles.actionBtn} ${isLive ? styles.stop : styles.start}`} disabled={isLoading}>
          {isLoading ? "Connecting..." : isLive ? "Stop Session" : "Start Interview"}
        </button>
      </main>
    </div>
  );
}

export default function InterviewPage() {
  return (
    <Suspense fallback={<div>Loading Vera...</div>}>
      <InterviewContent />
    </Suspense>
  );
}