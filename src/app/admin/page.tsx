"use client";

import React, { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy, limit } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Users, PlusCircle, History, Award, CheckCircle } from 'lucide-react';
import styles from "./admin.module.scss";

export default function AdminPanel() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [newRole, setNewRole] = useState({ title: "", description: "", category: "dev" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();

  const ADMIN_EMAIL = "shahbazalam8421@gmail.com";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === ADMIN_EMAIL) {
        setIsAdmin(true);
        fetchReports();
      } else if (user) {
        router.push("/dashboard");
      } else {
        router.push("/sign-in");
      }
      setFetching(false);
    });
    return () => unsubscribe();
  }, [router]);

  const fetchReports = async () => {
    try {
      // Fetching all reports for admin view
      const q = query(collection(db, "interview_reports"), orderBy("createdAt", "desc"), limit(20));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        // Fallbacks for Dummy Users
        userName: doc.data().userName || "Demo User",
        role: doc.data().role || "Software Intern",
        score: doc.data().score || "0"
      }));
      setReports(data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  const injectDummyData = async () => {
  const dummyList = [
    { userName: "Shahbaz Alam", role: "Frontend Developer", score: 85, createdAt: new Date() },
    { userName: "Adnan Khan", role: "AI Specialist", score: 72, createdAt: new Date() },
    { userName: "Zaid Shaikh", role: "Cloud Architect", score: 91, createdAt: new Date() },
    { userName: "Saman", role: "Backend Developer", score: 88, createdAt: new Date() }
  ];

  try{
    for (const user of dummyList) {
      await addDoc(collection(db, "interview_reports"), {
        ...user,
        userId: "dummy_id_" + Math.random(),
        feedback: "Overall good performance with strong technical logic."
    });
  }
  alert("Vera AI: 4 Dummy Records Added to Command Center!");
  window.location.reload();
  } catch (e){
  console.error("Injection failed:", e);
  }
  };

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "interview_roles"), {
        ...newRole,
        createdAt: serverTimestamp(),
      });
      alert("Role deployed successfully!");
      setNewRole({ title: "", description: "", category: "dev" });
    } catch (error) {
      alert("Error adding role: " + error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className={styles.loading}>Authenticating Admin...</div>;
  if (!isAdmin) return null;

  return (
    <div className={styles.adminWrapper}>
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>Vera Admin</h2>
        <nav className={styles.adminNav}>
          <div className={styles.activeNavItem}><LayoutDashboard size={20} /> Control Center</div>
          <div className={styles.navItem} onClick={() => router.push("/dashboard")}><History size={20} /> User View</div>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.adminHeader}>
          <div>
            <h1>Command Center</h1>
            <p>Welcome back, Shahbaz. System is optimal.</p>
          </div>
          <button onClick={() => router.push("/dashboard")} className={styles.backBtn}>Exit Admin</button>
        </header>

        {/* STATS ROW */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <Users color="#3b82f6" />
            <div><span>Total Sessions</span><h3>{reports.length}</h3></div>
          </div>
          <div className={styles.statCard}>
            <Award color="#ffd700" />
            <div><span>Top Performer</span><h3>98%</h3></div>
          </div>
          <div className={styles.statCard}>
            <CheckCircle color="#10b981" />
            <div><span>System Status</span><h3>Active</h3></div>
          </div>
        </div>

        <div className={styles.gridContainer}>
          {/* ADD ROLE FORM */}
          <section className={styles.formCard}>
            <div className={styles.cardHeader}>
              <PlusCircle size={22} />
              <h2>Deploy New Role</h2>
            </div>
            <form onSubmit={handleAddRole} className={styles.adminForm}>
              <input 
                type="text" 
                placeholder="Role Title (e.g. Next.js Developer)" 
                value={newRole.title}
                onChange={(e) => setNewRole({...newRole, title: e.target.value})}
                required 
              />
              <textarea 
                placeholder="Role Description & Requirements..." 
                value={newRole.description}
                onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                required 
              />
              <select 
                value={newRole.category}
                onChange={(e) => setNewRole({...newRole, category: e.target.value})}
              >
                <option value="dev">Development</option>
                <option value="data">Data & AI</option>
                <option value="cloud">Cloud & DevOps</option>
                <option value="design">Design & Product</option>
                <option value="special">Specialized Roles</option>
              </select>
              <button type="submit" disabled={loading} className={styles.submitBtn}>
                {loading ? "Deploying..." : "Add to System"}
              </button>
            </form>
          </section>

          {/* ACTIVITY TABLE */}
          <section className={styles.tableCard}>
            <div className={styles.cardHeader}>
              <History size={22} />
              <h2>Recent Activity</h2>
            </div>
            <div className={styles.tableResponsive}>
              <table className={styles.adminTable}>
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Role</th>
                    <th>Score</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id}>
                      <td>{report.userName}</td>
                      <td>{report.role}</td>
                      <td><span className={styles.scoreBadge}>{report.score}%</span></td>
                      <td>
                        {report.createdAt?.seconds 
                          ? new Date(report.createdAt.seconds * 1000).toLocaleDateString() 
                          : "Today"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}