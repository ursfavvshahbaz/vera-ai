"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import styles from './dashboard.module.scss';
import { 
  Globe, Code, LayoutDashboard, Database, BrainCircuit, Shield, Smartphone, 
  Cloud, Terminal, Layout, BarChart, Infinity, LogOut, Layers,
  Zap, Activity, Brain, Bug, HelpCircle, Box, PenTool, Radio, Search, HardDrive, 
  Glasses, Cpu, Share2, Server, Lock as LockIcon, History, TrendingUp, Award, Gamepad2
} from 'lucide-react';
import { auth, db } from '../lib/firebase'; 
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from "firebase/firestore";
import GameModal from '../../components/GameModal';

// --- DATA ---
const categories = [  
  { id: 'dev', name: 'Development', icon: <Code size={20}/> },
  { id: 'data', name: 'Data & AI', icon: <BrainCircuit size={20}/> },
  { id: 'cloud', name: 'Cloud & DevOps', icon: <Cloud size={20}/> },
  { id: 'design', name: 'Design & Product', icon: <Layout size={20}/> },
  { id: 'special', name: 'Specialized Roles', icon: <Layers size={20}/> },
  { id: 'admin', name: 'Admin Custom Roles', icon: <Shield size={20}/> }, 
  { id: 'gaming', name: 'Gaming Arcade', icon: <Gamepad2 size={20}/> }, 
]; 

const roles = [     
  { category: 'dev', id: 'frontend', name: 'Frontend Engineer', icon: <Globe />, desc: 'React, Next.js, and Modern UI/UX.', color: '#3b82f6' },
  { category: 'dev', id: 'backend', name: 'Backend Developer', icon: <Code />, desc: 'Node.js, Go, and SQL Databases.', color: '#10b981' },
  { category: 'dev', id: 'fullstack', name: 'Full Stack Master', icon: <BrainCircuit />, desc: 'End-to-end Architecture & System Design.', color: '#ec4899' },
  { category: 'dev', id: 'mobile', name: 'Mobile App Developer', icon: <Smartphone />, desc: 'React Native, Flutter & Swift iOS.', color: '#f43f5e' },
  { category: 'dev', id: 'game-dev', name: 'Game Developer', icon: <Zap />, desc: 'Unity, Unreal Engine, and C#.', color: '#8b5cf6' },
  { category: 'dev', id: 'api-developer', name: 'API Developer', icon: <Code />, desc: 'REST, GraphQL & API Gateway.', color: '#16a34a' },
  { category: 'data', id: 'datascience', name: 'Data Scientist', icon: <Database />, desc: 'Python, ML, and Statistical Modeling.', color: '#f59e0b' },
  { category: 'data', id: 'ai-ml', name: 'AI/ML Engineer', icon: <BrainCircuit />, desc: 'Neural Networks & Deep Learning.', color: '#06b6d4' },
  { category: 'data', id: 'data-engineer', name: 'Data Engineer', icon: <Layers />, desc: 'ETL Pipelines, Spark & Big Data.', color: '#6366f1' },
  { category: 'data', id: 'data-analyst', name: 'Data Analyst', icon: <BarChart />, desc: 'SQL, Tableau, and Data Visualization.', color: '#14b8a6' },
  { category: 'data', id: 'nlp-engineer', name: 'NLP Specialist', icon: <Radio />, desc: 'LLMs, LangChain, and Text Processing.', color: '#a855f7' },
  { category: 'data', id: 'db-admin', name: 'Database Admin', icon: <HardDrive />, desc: 'Query Optimization & DB Security.', color: '#0284c7' },
  { category: 'cloud', id: 'devops', name: 'DevOps Engineer', icon: <Infinity />, desc: 'Docker, K8s, and CI/CD Pipelines.', color: '#0ea5e9' },
  { category: 'cloud', id: 'cloud-arch', name: 'Cloud Architect', icon: <Cloud />, desc: 'AWS, Azure, and Scalable Infrastructure.', color: '#38bdf8' },
  { category: 'cloud', id: 'sre', name: 'Site Reliability (SRE)', icon: <Activity />, desc: 'System Uptime & Incident Response.', color: '#f97316' },
  { category: 'cloud', id: 'cybersecurity', name: 'Cybersecurity Analyst', icon: <Shield />, desc: 'Pen-testing & Network Security.', color: '#dc2626' },
  { category: 'cloud', id: 'cloud-security', name: 'Cloud Security', icon: <LockIcon />, desc: 'Cloud Compliance & IAM.', color: '#4338ca' },
  { category: 'cloud', id: 'sys-admin', name: 'System Administrator', icon: <Server />, desc: 'Linux, Networking & Server Mgmt.', color: '#475569' },
  { category: 'design', id: 'ui-ux', name: 'UI/UX Designer', icon: <Layout />, desc: 'Figma, Prototyping & User Research.', color: '#d946ef' },
  { category: 'design', id: 'product-mgr', name: 'Product Manager', icon: <Box />, desc: 'Agile, Roadmap & Business Strategy.', color: '#84cc16' },
  { category: 'design', id: 'graphic-designer', name: 'Graphic Designer', icon: <PenTool />, desc: 'Visual Branding & Creative Design.', color: '#fb7185' },
  { category: 'design', id: 'seo-expert', name: 'SEO Specialist', icon: <Share2 />, desc: 'Organic Growth & Search Algorithms.', color: '#fbbf24' },
  { category: 'design', id: 'dev-advocate', name: 'Developer Advocate', icon: <Terminal />, desc: 'Community Growth & Tech Writing.', color: '#ec4899' },
  { category: 'design', id: 'qa-engineer', name: 'QA Automation', icon: <Search />, desc: 'Selenium, Institutional Testing.', color: '#22c55e' },
  { category: 'special', id: 'blockchain', name: 'Blockchain Developer', icon: <LockIcon />, desc: 'Smart Contracts, Solidity & Web3.', color: '#64748b' },
  { category: 'special', id: 'embedded', name: 'Embedded Systems', icon: <Cpu />, desc: 'C/C++, Microcontrollers & IoT.', color: '#ef4444' },
  { category: 'special', id: 'ar-vr', name: 'AR/VR Developer', icon: <Glasses />, desc: 'Metaverse, Oculus & Spatial Computing.', color: '#c026d3' },
  { category: 'special', id: 'web3-architect', name: 'Web3 Architect', icon: <Layers />, desc: 'Decentralized Apps & Governance.', color: '#4f46e5' },
  { category: 'special', id: 'software-arch', name: 'Software Architect', icon: <Box />, desc: 'Design Patterns & Microservices.', color: '#0d9488' },
  { category: 'special', id: 'security-engineer', name: 'Security Engineer', icon: <Shield />, desc: 'Identity Mgmt & Encryption.', color: '#b91c1c' },
];

const arcadeGames = [
  { title: "Word Flux", desc: "Type the exact word fast!", icon: <Zap size={24} /> },
  { title: "Tech Trivia", desc: "Answer technical MCQ style questions.", icon: <Brain size={24} /> },
  { title: "Bug Hunter", desc: "Type 'VALID' or 'INVALID' for code.", icon: <Bug size={24} /> },
  { title: "Logic Riddle", desc: "Solve the brain teaser in one word.", icon: <HelpCircle size={24} /> },
  { title: "System Architect", desc: "Design the perfect tech stack.", icon: <Layers size={24} /> },
  { title: "Code Golf", desc: "Find the most optimized logic path.", icon: <Code size={24} /> }
];

export default function Dashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [dynamicRoles, setDynamicRoles] = useState<any[]>([]);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const ADMIN_EMAIL = "shahbazalam8421@gmail.com";

  useEffect(() => { 
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        fetchDashboardData(user.uid);
      } else {
        const demoData = localStorage.getItem("vera_demo_user");
        if (demoData){
          const fakeUser = JSON.parse(demoData);
          setCurrentUser(fakeUser);
          fetchDashboardData("dummy-user-id-from-db");
        } else {
          router.push('/sign-in');
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const fetchDashboardData = async (uid: string) => {
    try {
      const q = query(
        collection(db, "interview_reports"), 
        where("userId", "==", uid), 
      );
      const querySnapshot = await getDocs(q);
      const fetchedReports = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        displayRole: doc.data().role || doc.data().roleId || "Technical Session"
      }));

      fetchedReports.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setReports(fetchedReports);
      
      const adminSnap = await getDocs(collection(db, "interview_roles"));
      const adminData = adminSnap.docs.map(doc => ({ 
          id: doc.id, 
          name: doc.data().title, 
          desc: doc.data().description, 
          category: 'admin',
          color: '#2c666e',
          icon: <Shield />
      }));
      setDynamicRoles(adminData);
    } catch (err) { 
      console.error("Fetch Error: ", err); 
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/sign-in');
  };    

  const handleGameClick = (title: string) => {
    setSelectedGame(title);
    setIsGameOpen(true);
  };

  const calculateAvg = () => {
    if (reports.length === 0) return 0;
    const sum = reports.reduce((acc, curr) => acc + parseInt(curr.score || 0), 0);
    return Math.round(sum / reports.length);
  };

  const isAdmin = currentUser?.email === ADMIN_EMAIL;

  const filteredStaticRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAdminRoles = dynamicRoles.filter(role => 
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
  return <div className={styles.loader}>Loading Vera AI...</div>;
}

  return (
    <div className={styles.dashboardLayout}>
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>Vera AI</h2>
        <div className={styles.searchContainer}>
          <Search size={18} />
          <input type="text" placeholder="Search roles..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={styles.searchInput} />
        </div>
        <nav className={styles.nav}>
          <div className={styles.navItem} onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}><LayoutDashboard size={20} /> Overview</div>
          {isAdmin && (
            <div className={styles.navItem} onClick={() => router.push('/admin')} style={{color: '#2c666e', fontWeight: 'bold'}}><Shield size={20} /> Admin Panel</div>
          )}
          <div className={styles.sectionTitle}>Categories</div>
          {categories.map((cat) => (
            <div key={cat.id} onClick={() => document.getElementById(cat.id)?.scrollIntoView({behavior:'smooth'})} className={styles.navItem}>
              {cat.icon} {cat.name}
            </div>
          ))}
        </nav>

        <div className={styles.userProfileMini}>
          <div className={styles.avatar}>
            {currentUser?.photoURL ? (
              <img src={currentUser.photoURL} alt="User" />
            ) : (
              <div className={styles.initials}>{currentUser?.displayName?.charAt(0) || "S"}</div>
            )}
          </div>
          <div className={styles.info}>
            <p className={styles.userName}>{currentUser?.displayName || "Saman"}</p>
            <p className={styles.userEmail}>{currentUser?.email}</p>
          </div>
        </div>

        <button onClick={handleLogout} className={styles.logoutBtn}><LogOut size={20}/> Logout</button>
      </aside>

      <main className={styles.content}>
        <header className={styles.header}>
          <div className={styles.userGreet}>
            <h2 className="text-4xl font-bold">Hi, {currentUser?.displayName?.split(' ')[0] || "Saman"}! 👋</h2>
            <p className="opacity-80">AI companion is ready for the session.</p>
          </div>
          <div className={styles.statsRow}>
            <div className={styles.statCard}><TrendingUp size={24} color="#2c666e" /><div><span>Avg. Score</span><h3>{calculateAvg()}%</h3></div></div>
            <div className={styles.statCard}><History size={24} color="#2c666e" /><div><span>Interviews</span><h3>{reports.length}</h3></div></div>
            <div className={styles.statCard}><Award size={24} color="#ffd700" /><div><span>Top Score</span><h3>{reports.length > 0 ? Math.max(...reports.map(r => parseInt(r.score || 0))) : 0}%</h3></div></div>
          </div>
        </header>

        {reports.length > 0 && (
          <section className={styles.recentActivity}>
            <h2 className={styles.catHeading}>Recent History</h2>
            <div className={styles.activityList}>
              {reports.slice(0, 4).map((report) => (
                <div key={report.id} className={styles.activityCard} onClick={() => router.push(`/feedback?id=${report.id}`)}>
                  <div className={styles.activityMain}>
                    <div className={styles.activityIcon}><History size={18} /></div>
                    <div>
                      <h4>{report.userName || "Guest"} - {report.displayRole}</h4>
                      <p>
                        {report.createdAt?.seconds
                          ? new Date(report.createdAt.seconds * 1000).toLocaleDateString()
                          : "Recently"}
                      </p>
                    </div>
                  </div>
                  <div className={styles.activityBadge}>Score: <span>{report.score}%</span></div>
                </div>
              ))}
            </div>
          </section>
        )}

        {filteredAdminRoles.length > 0 && (
          <section id="admin" className={styles.categorySection}>
            <h2 className={styles.catHeading}>Custom Admin Portals</h2>
            <div className={styles.roleGrid}>
              {filteredAdminRoles.map((role) => (
                <div key={role.id} className={styles.roleCard} style={{ '--role-color': role.color } as React.CSSProperties}>
                  <div className={styles.roleIcon}>{role.icon}</div>
                  <h3>{role.name}</h3>
                  <p>{role.desc}</p>
                  <button className={styles.btnPro} onClick={() => router.push(`/interview?roleId=${role.id}`)}>Enter Portal</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {categories.slice(0, 5).map((cat) => {
          const catRoles = filteredStaticRoles.filter(r => r.category === cat.id);
          if (catRoles.length === 0) return null;
          return (
            <section key={cat.id} id={cat.id} className={styles.categorySection}>
              <h2 className={styles.catHeading}>{cat.name}</h2>
              <div className={styles.roleGrid}>
                {catRoles.map((role) => (
                  <div key={role.id} className={styles.roleCard} style={{ '--role-color': role.color } as React.CSSProperties}>
                    <div className={styles.roleImageContainer}>
                      <img 
                        src={`/assets/roles/${role.id.toLowerCase()}.png`} 
                        alt={role.name} 
                        className={styles.roleImg}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/assets/roles/default.png';
                        }}/>
                    </div>

                    <div className={styles.roleIcon} style={{ color: role.color }}>{role.icon}</div>
                    <h3>{role.name}</h3>
                    <p>{role.desc}</p>

                    <div className={styles.levelButtons}>
                      {['beginner', 'intermediate', 'pro'].map((lvl) => (
                        <button key={lvl} onClick={() => router.push(`/interview?role=${role.id}&level=${lvl}`)}>
                          {lvl === 'pro' ? 'PRO' : lvl === 'intermediate' ? 'MID' : 'BEG'}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        <section id="gaming" className={styles.categorySection}>
          <h2 className={styles.catHeading}>Gaming Arcade</h2>
          <div className={styles.roleGrid}>
            {arcadeGames.map((game, i) => (
              <div key={i} className={styles.roleCard} onClick={() => handleGameClick(game.title)} style={{cursor: 'pointer', '--role-color': '#2C666E'} as React.CSSProperties}>
                <div className={styles.roleImageContainer}>
                  <img 
                    src={`/assets/arcade/${game.title.toLowerCase().replace(/\s+/g, '-')}.png`} 
                    alt={game.title} 
                    className={styles.roleImg}
                    onError={(e) => {
                      const imgElement = e.currentTarget; 
                      imgElement.onerror = null;
                      imgElement.src = '/assets/arcade/default-game.png';
                    }}/>
                </div>

                <div className={styles.roleIcon}>{game.icon}</div>
                <h3>{game.title}</h3>
                <p>{game.desc}</p>
                <button className={styles.startBtn}>Enter Arcade</button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <GameModal isOpen={isGameOpen} onClose={() => setIsGameOpen(false)} gameTitle={selectedGame} />
    </div>
  );
}