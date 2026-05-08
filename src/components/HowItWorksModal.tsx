import React from 'react';
import { X, Lightbulb, Mic, BrainCircuit, Rocket } from 'lucide-react';
import styles from './HowItWorksModal.module.scss';

export default function HowItWorksModal({ onClose }: { onClose: () => void }) {
  const steps = [
    { icon: <Lightbulb />, title: "Select Role", desc: "Choose your dream job role from our dashboard." },
    { icon: <Mic />, title: "Real-time Voice", desc: "Talk to Vera just like a real human interviewer." },
    { icon: <BrainCircuit />, title: "AI Analysis", desc: "Get instant feedback based on your technical answers." },
    { icon: <Rocket />, title: "Improve", desc: "Track your progress and crack your real interviews." }
  ];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}><X /></button>
        
        <h2 className={styles.title}>How <span className={styles.highlight}>Vera</span> Works</h2>
        
        <div className={styles.grid}>
          {steps.map((step, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.icon}>{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}