"use client";
import React, { useState, useEffect, useRef } from 'react';
import styles from './GameModal.module.scss';
import { X, Trophy, Target, Gamepad2, Timer, RotateCcw, CheckCircle2, AlertCircle, Code, Cpu, Lightbulb, Keyboard } from 'lucide-react';

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameTitle: string | null;
}

export default function GameModal({ isOpen, onClose, gameTitle }: GameModalProps) {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- Games Data ---
  const gameData: any = {
    "Word Flux": [
      { word: "TypeScript", p: 10 }, { word: "middleware", p: 10 }, { word: "Hydration", p: 10 },
      { word: "Component", p: 10 }, { word: "Asynchronous", p: 10 }
    ],
    "Tech Trivia": [
      { q: "React creates what type of DOM?", a: "Virtual", opts: ["Real", "Virtual", "Shadow"] },
      { q: "Which tool helps with SSR?", a: "Next.js", opts: ["Vite", "WebPack", "Next.js"] }
    ],
    "Bug Hunter": [
      { code: "const x = 5;\nx = 10;", s: "INVALID" },
      { code: "console.log('Vera!')", s: "VALID" }
    ],
    "Logic Riddle": [
      { q: "You use me to type and enter commands. Who am I?", a: "Keyboard" }
    ],
    "System Architect": [
      { q: "Real-time user status database?", a: "Firebase", opts: ["MySQL", "Firebase", "SQLite"] }
    ],
    "Code Golf": [
      { q: "Fastest way to get the first item of an array?", a: "arr[0]", opts: ["arr.head()", "arr[0]", "arr.shift()"] }
    ]
  };

  useEffect(() => {
    let timer: any;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setGameState('finished');
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // Focus for text-input games
  useEffect(() => {
    if (gameState === 'playing' && (gameTitle === "Word Flux" || gameTitle === "Logic Riddle")) {
      inputRef.current?.focus();
    }
  }, [gameState, gameTitle, currentQuestion]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(30);
    setCurrentQuestion(0);
    setUserInput("");
  };

  const handleAnswer = (answer: string) => {
    const currentSet = gameData[gameTitle || ""];
    const data = currentSet[currentQuestion];
    
    let isCorrect = false;
    if (gameTitle === "Word Flux") isCorrect = answer.toLowerCase() === data.word.toLowerCase();
    else if (gameTitle === "Bug Hunter") isCorrect = answer === data.s;
    else if (gameTitle === "Logic Riddle") isCorrect = answer.toLowerCase() === data.a.toLowerCase();
    else isCorrect = answer === data.a;

    if (isCorrect) {
      setScore(prev => prev + 10);
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      setUserInput("");
      if (currentQuestion < currentSet.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameState('finished');
      }
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        
        {/* Modern Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerTitle}>
            <div className={styles.iconCircle}><Gamepad2 size={18}/></div>
            <h2>Vera Arcade / <span>{gameTitle}</span></h2>
          </div>
          <div className={styles.actionRow}>
            {gameState === 'playing' && (
              <>
                <div className={`${styles.badge} ${timeLeft <= 5 ? styles.timerWarning : ''}`}>
                  <Timer size={16}/> {timeLeft}s
                </div>
                <div className={styles.badge}><Trophy size={16}/> {score}</div>
              </>
            )}
            <button className={styles.closeBtn} onClick={onClose}><X size={20}/></button>
          </div>
        </div>

        {/* Dynamic Game Body */}
        <div className={`${styles.gameBody} ${feedback ? styles[feedback] : ''}`}>
          
          {gameState === 'idle' && (
            <div className={styles.introScreen}>
              <div className={styles.visualStack}>
                <Code size={50} className={styles.float1} />
                <Keyboard size={60} className={styles.float2} />
                <Cpu size={50} className={styles.float3} />
              </div>
              <h1>Mission: {gameTitle}</h1>
              <p>Initialize protocol. Complete all parameters within 30s.</p>
              <button onClick={startGame} className={styles.mainStartBtn}>Execute Mission</button>
            </div>
          )}

          {gameState === 'playing' && (
            <div className={styles.playingArea}>
              
              {/* INTERACTIVE Word Flux */}
              {gameTitle === "Word Flux" && (
                <div className={styles.wordFlux}>
                  <p>System Protocol: Retype this command string.</p>
                  <h1 className={styles.targetWord}>{gameData[gameTitle][currentQuestion].word}</h1>
                  <input 
                    ref={inputRef}
                    value={userInput}
                    onChange={(e) => {
                      setUserInput(e.target.value);
                      if(e.target.value.toLowerCase() === gameData[gameTitle][currentQuestion].word.toLowerCase()) {
                        handleAnswer(e.target.value);
                      }
                    }}
                    className={styles.neonInput}
                    placeholder="Type Go! Go! Go!..."
                  />
                </div>
              )}

              {/* INTERACTIVE Bug Hunter */}
              {gameTitle === "Bug Hunter" && (
                <div className={styles.bugHunter}>
                  <div className={styles.codeTerminal}>
                    <pre><code>{gameData[gameTitle][currentQuestion].code}</code></pre>
                  </div>
                  <div className={styles.splitBtns}>
                    <button onClick={() => handleAnswer("VALID")} className={styles.validBtn}>System OK</button>
                    <button onClick={() => handleAnswer("INVALID")} className={styles.invalidBtn}>System CORRUPT</button>
                  </div>
                </div>
              )}

              {/* Generic Quiz/Riddle style for others */}
              {(gameTitle !== "Word Flux" && gameTitle !== "Bug Hunter") && (
                <div className={styles.triviaGame}>
                  <div className={styles.qCard}>
                     <p>{gameData[gameTitle || ""][currentQuestion].q}</p>
                  </div>
                  
                  {gameData[gameTitle || ""][currentQuestion].opts ? (
                    <div className={styles.optGrid}>
                      {gameData[gameTitle || ""][currentQuestion].opts.map((opt: string) => (
                        <button key={opt} onClick={() => handleAnswer(opt)} className={styles.optBtn}>{opt}</button>
                      ))}
                    </div>
                  ) : (
                    <input 
                      ref={inputRef}
                      value={userInput}
                      onKeyDown={(e) => e.key === 'Enter' && handleAnswer(userInput)}
                      onChange={(e) => setUserInput(e.target.value)}
                      className={styles.neonInput}
                      placeholder="Press Enter to Submit..."
                    />
                  )}
                </div>
              )}

              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${((currentQuestion + 1) / gameData[gameTitle || ""].length) * 100}%` }}></div>
              </div>
            </div>
          )}

          {gameState === 'finished' && (
            <div className={styles.resultScreen}>
              <Trophy size={100} className={styles.trophyGlow} />
              <h2>Mission Complete!</h2>
              <div className={styles.finalData}>Final XP Earned: <span>{score}</span></div>
              <p>Vera AI has registered your results.</p>
              <div className={styles.endActions}>
                <button onClick={startGame} className={styles.retryBtn}><RotateCcw size={18}/> Start Again</button>
                <button onClick={onClose} className={styles.exitBtn}>Dashboard</button>
              </div>
            </div>
          )}
        </div>

        {/* Visual Overlays for Correct/Wrong */}
        {feedback === 'correct' && <div className={styles.correctOverlay}><CheckCircle2 /> SUCCESS</div>}
        {feedback === 'wrong' && <div className={styles.wrongOverlay}><AlertCircle /> ERROR</div>}

      </div>
    </div>
  );
}