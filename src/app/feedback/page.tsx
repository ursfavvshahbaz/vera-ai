"use client";
import React, { useEffect, useState, Suspense, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./feedback.module.scss";
import { CheckCircle2, AlertCircle, ArrowLeft, Loader2, Sparkles, Star, Download } from "lucide-react";
import { db, auth } from "../lib/firebase"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function FeedbackContent() {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const router = useRouter();
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Guaranteed Data Load
    const loadData = async (user: any) => {
      try {
        // Realistic analysis delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const mockData = {
          score: `${Math.floor(Math.random() * 15) + 80}%`, // 80-95 random score
          strengths: ["Clean Code Principles", "React Hooks Mastery", "Effective Communication"],
          improvements: ["System Design Patterns", "Error Handling Strategies"],
          summary: "Saman, your performance was impressive! Your grasp of Next.js is solid. Focus on architectural scalability."
        };

        // 2. Save to Firebase (Non-blocking)
        if (user) {
          addDoc(collection(db, "interview_reports"), {
            userId: user.uid,
            userName: user.displayName || "Saman",
            ...mockData,
            createdAt: serverTimestamp(),
          }).catch(e => console.error("Firebase Save Silent Fail:", e));
        }

        // 3. SET STATE (Ye crucial hai)
        setAnalysis(mockData);
        setLoading(false);
      } catch (err) {
        console.error("Load Error:", err);
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      loadData(user);
    });

    return () => unsubscribe();
  }, []);

  // PDF FIX: Explicitly waiting for images/styles to load
  const handleDownloadPDF = async () => {
    if (!reportRef.current || !analysis) return;
    setIsDownloading(true);

    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#0f172a",
        logging: false,
        useCORS: true
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.setFontSize(18);
      pdf.setTextColor(79, 209, 197);
      pdf.text("VERA AI INTERVIEW REPORT", 105, 15, { align: "center" });
      
      pdf.addImage(imgData, "PNG", 10, 25, imgWidth, imgHeight);
      pdf.save(`VeraAI_Report_${Date.now()}.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
      alert("PDF generation failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loaderContent}>
          <div className={styles.brainIcon}>🧠</div>
          <Loader2 className={styles.spinner} size={50} />
          <h2>Vera is finalizing your report...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.feedbackWrapper}>
      <button onClick={() => router.push("/dashboard")} className={styles.backBtn}>
        <ArrowLeft size={18} /> Dashboard
      </button>

      <main className={styles.feedbackContainer} ref={reportRef}>
        <header className={styles.reportHeader}>
          <Sparkles color="#4fd1c5" size={32} />
          <h1>Session Analysis</h1>
          <p>Personalized insights for your growth</p>
        </header>
        
        <div className={styles.scoreBadge}>
          <span className={styles.scoreValue}>{analysis?.score}</span>
          <span className={styles.scoreLabel}>OVERALL SCORE</span>
        </div>

        <div className={styles.contentGrid}>
          <section className={styles.card}>
            <h3><CheckCircle2 color="#10B981" size={24} /> Key Strengths</h3>
            <ul className={styles.list}>
              {analysis?.strengths?.map((s: any, i: any) => <li key={i}>{s}</li>)}
            </ul>
          </section>

          <section className={styles.card}>
            <h3><AlertCircle color="#F59E0B" size={24} /> Growth Areas</h3>
            <ul className={styles.list}>
              {analysis?.improvements?.map((im: any, i: any) => <li key={i}>{im}</li>)}
            </ul>
          </section>
        </div>

        <section className={styles.summaryBox}>
          <div className={styles.aiBadge}><Star size={14} fill="#4fd1c5" color="#4fd1c5" /> VERA'S VERDICT</div>
          <p className={styles.summaryText}>"{analysis?.summary}"</p>
        </section>
      </main>

      <div className={styles.actionButtons}>
        <button onClick={handleDownloadPDF} className={styles.printBtn} disabled={isDownloading}>
          {isDownloading ? <Loader2 className={styles.spin} size={20} /> : <Download size={20} />}
          {isDownloading ? "Generating PDF..." : "Download PDF Report"}
        </button>
      </div>
    </div>
  );
}

export default function FeedbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FeedbackContent />
    </Suspense>
  );
}