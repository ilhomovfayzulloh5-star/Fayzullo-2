import React, { useState, useEffect, useCallback, useRef } from 'react';

// Simulated subjects question pool
const onlineSubjectQuestions = [
  { q: "How many letters are there in the English alphabet?", a: "26", o: ["24", "27", "26", "25"] },
  { q: "What is the opposite of 'hot'?", a: "cold", o: ["warm", "cold", "boiling", "ice"] },
  { q: "What is the capital of the UK?", a: "London", o: ["Paris", "London", "New York", "Rome"] },
  { q: "\"Okul\" so'zi nimani bildiradi?", a: "Maktab", o: ["Bog'cha", "Maktab", "Do'kon", "Universitet"] },
  { q: "\"Merhaba\" so'zining ma'nosi nima?", a: "Salom", o: ["Kechirasiz", "Xayr", "Salom", "Rahmat"] },
  { q: "Yer sayyorasidagi eng katta okean qaysi?", a: "Tinch okeani", o: ["Atlantika okeani", "Hind okeani", "Tinch okeani", "Shimoliy muz okeani"] },
  { q: "Dunyoning eng baland cho'qqisi qaysi?", a: "Everest (Jomolungma)", o: ["K2", "Everest (Jomolungma)", "Monblan", "Elbrus"] },
  { q: "HTML nimani anglatadi?", a: "HyperText Markup Language", o: ["HighText Machine Language", "HyperText Markup Language", "HyperTransfer Markup Language", "Hyperlink Text Multi Language"] },
  { q: "Alisher Navoiy qaysi asarni yozgan?", a: "Xamsa", o: ["Mehrobdan chayon", "Ufq", "Xamsa", "O'tkan kunlar"] },
  { q: "Kompyuterning asosiy xotirasi qaysi?", a: "RAM", o: ["HDD", "RAM", "ROM", "SSD"] }
];

const getNextQuestionIndex = (ref, poolLength) => {
  if (ref.current.length === 0) {
    const arr = Array.from({ length: poolLength }, (_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    ref.current = arr;
  }
  return ref.current.pop();
};

const OnlineGameScreen = ({ onQuit }) => {
  // Navigation states: 'lobby', 'setup', 'game'
  const [step, setStep] = useState('lobby');

  // Setup Form States
  const [username, setUsername] = useState('');
  const [gameType, setGameType] = useState('math'); // 'math', 'subject'
  const [operations, setOperations] = useState(['addition']); // 'addition', 'subtraction', 'multiplication', 'division'
  const [difficulty, setDifficulty] = useState('easy'); // 'easy', 'medium', 'hard'
  const [timeLimit, setTimeLimit] = useState(60); // 60, 180, 300 (seconds)

  // Game Play States
  const [roomCode, setRoomCode] = useState('');
  const [opponentName, setOpponentName] = useState('Foydalanuvchi');
  const [opponentOnline, setOpponentOnline] = useState(false);
  
  // Game Play loop states
  const [timeLeft, setTimeLeft] = useState(60);
  const [ropePosition, setRopePosition] = useState(50);
  const [blueScore, setBlueScore] = useState(0);
  const [redScore, setRedScore] = useState(0);
  const [gameState, setGameState] = useState('waiting'); // 'waiting', 'countdown', 'playing', 'finished'
  const [winner, setWinner] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [isMuted, setIsMuted] = useState(false);

  // Question States
  const [playerQuestion, setPlayerQuestion] = useState(null);
  const [playerInput, setPlayerInput] = useState('0');
  const [playerFeedback, setPlayerFeedback] = useState(null); // null or { selected: string, isCorrect: boolean }
  const [opponentFeedback, setOpponentFeedback] = useState(null); // null or { isCorrect: boolean }

  // Refs for tracking question indexes
  const playerUnusedRef = useRef([]);
  const playerLastMathQuestionsRef = useRef([]);

  // Generate math or subject question
  const generateQuestion = useCallback(() => {
    if (gameType === 'subject') {
      const qIndex = getNextQuestionIndex(playerUnusedRef, onlineSubjectQuestions.length);
      const chosenQ = onlineSubjectQuestions[qIndex];
      const optionsWithLetters = chosenQ.o.map((opt, i) => ({
        letter: String.fromCharCode(65 + i),
        text: opt
      }));
      setPlayerQuestion({
        text: chosenQ.q,
        answer: chosenQ.a,
        options: optionsWithLetters
      });
    } else {
      // Generate Math Question
      const randomOp = operations[Math.floor(Math.random() * operations.length)] || 'addition';
      let num1, num2, opSymbol, correctAnswer;
      let attempts = 0;
      let questionText = '';

      do {
        if (difficulty === 'easy') {
          if (randomOp === 'addition') {
            num1 = Math.floor(Math.random() * 15) + 1;
            num2 = Math.floor(Math.random() * 15) + 1;
            opSymbol = '+';
            correctAnswer = num1 + num2;
          } else if (randomOp === 'subtraction') {
            num1 = Math.floor(Math.random() * 15) + 5;
            num2 = Math.floor(Math.random() * num1);
            opSymbol = '-';
            correctAnswer = num1 - num2;
          } else if (randomOp === 'multiplication') {
            num1 = Math.floor(Math.random() * 5) + 2;
            num2 = Math.floor(Math.random() * 5) + 2;
            opSymbol = '×';
            correctAnswer = num1 * num2;
          } else {
            num2 = Math.floor(Math.random() * 4) + 2;
            correctAnswer = Math.floor(Math.random() * 4) + 2;
            num1 = num2 * correctAnswer;
            opSymbol = '÷';
          }
        } else if (difficulty === 'medium') {
          if (randomOp === 'addition') {
            num1 = Math.floor(Math.random() * 40) + 10;
            num2 = Math.floor(Math.random() * 40) + 10;
            opSymbol = '+';
            correctAnswer = num1 + num2;
          } else if (randomOp === 'subtraction') {
            num1 = Math.floor(Math.random() * 50) + 15;
            num2 = Math.floor(Math.random() * 30) + 5;
            opSymbol = '-';
            correctAnswer = num1 - num2;
          } else if (randomOp === 'multiplication') {
            num1 = Math.floor(Math.random() * 9) + 2;
            num2 = Math.floor(Math.random() * 9) + 2;
            opSymbol = '×';
            correctAnswer = num1 * num2;
          } else {
            num2 = Math.floor(Math.random() * 8) + 2;
            correctAnswer = Math.floor(Math.random() * 8) + 2;
            num1 = num2 * correctAnswer;
            opSymbol = '÷';
          }
        } else {
          if (randomOp === 'addition') {
            num1 = Math.floor(Math.random() * 90) + 20;
            num2 = Math.floor(Math.random() * 90) + 20;
            opSymbol = '+';
            correctAnswer = num1 + num2;
          } else if (randomOp === 'subtraction') {
            num1 = Math.floor(Math.random() * 100) + 50;
            num2 = Math.floor(Math.random() * 50) + 10;
            opSymbol = '-';
            correctAnswer = num1 - num2;
          } else if (randomOp === 'multiplication') {
            num1 = Math.floor(Math.random() * 12) + 4;
            num2 = Math.floor(Math.random() * 12) + 4;
            opSymbol = '×';
            correctAnswer = num1 * num2;
          } else {
            num2 = Math.floor(Math.random() * 10) + 3;
            correctAnswer = Math.floor(Math.random() * 12) + 3;
            num1 = num2 * correctAnswer;
            opSymbol = '÷';
          }
        }
        questionText = `${num1} ${opSymbol} ${num2} = ?`;
        attempts++;
      } while (playerLastMathQuestionsRef.current.includes(questionText) && attempts < 20);

      playerLastMathQuestionsRef.current.push(questionText);
      if (playerLastMathQuestionsRef.current.length > 5) {
        playerLastMathQuestionsRef.current.shift();
      }

      setPlayerQuestion({
        text: questionText,
        answer: correctAnswer
      });
      setPlayerInput('0');
    }
  }, [gameType, operations, difficulty]);

  // Handle Playback of background music in online game
  useEffect(() => {
    if (step !== 'game' || isMuted) return;
    const audio = new Audio(`${import.meta.env.BASE_URL}uzbek_bg.mp3`);
    audio.loop = true;
    audio.volume = 0.25;

    const playAudio = () => {
      audio.play().catch(err => console.log('Autoplay prevented: ', err));
    };

    playAudio();

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [step, isMuted]);

  // Opponent matching simulation
  useEffect(() => {
    if (step !== 'game') return;
    
    // Simulate opponent joining after 4 seconds
    const opponentJoinTimer = setTimeout(() => {
      const namesPool = ["Temur", "Kamola", "Bekzod", "Shaxzoda", "Javohir", "Nozima", "Sardor", "Malika"];
      const randomName = namesPool[Math.floor(Math.random() * namesPool.length)];
      setOpponentName(randomName);
      setOpponentOnline(true);
      setGameState('countdown');
    }, 4000);

    return () => clearTimeout(opponentJoinTimer);
  }, [step]);

  // Countdown timer phase
  useEffect(() => {
    if (gameState !== 'countdown') return;

    const timer = setTimeout(() => {
      if (countdown === 3) {
        setCountdown(2);
      } else if (countdown === 2) {
        setCountdown(1);
      } else if (countdown === 1) {
        setCountdown('start');
      } else if (countdown === 'start') {
        setCountdown(null);
        setGameState('playing');
        generateQuestion();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [gameState, countdown, generateQuestion]);

  // Main game play timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('finished');
          if (ropePosition < 50) {
            setWinner('blue');
          } else if (ropePosition > 50) {
            setWinner('red');
          } else {
            setWinner('draw');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, ropePosition]);

  // Simulated Opponent Play logic: answers questions periodically
  useEffect(() => {
    if (gameState !== 'playing') return;

    const opponentInterval = setInterval(() => {
      // 75% chance of correct answer, 25% incorrect
      const isCorrect = Math.random() < 0.75;
      setOpponentFeedback({ isCorrect });

      setTimeout(() => {
        setOpponentFeedback(null);
        if (isCorrect) {
          setRedScore(prev => prev + 1);
          setRopePosition(prev => {
            const next = Math.min(90, prev + 8); // pull red (right)
            if (next >= 90) {
              setGameState('finished');
              setWinner('red');
            }
            return next;
          });
        } else {
          // Opponent mistake pulls towards Blue (left)
          setRopePosition(prev => {
            const next = Math.max(10, prev - 8);
            if (next <= 10) {
              setGameState('finished');
              setWinner('blue');
            }
            return next;
          });
        }
      }, 1000);
    }, Math.floor(Math.random() * 4000) + 4000); // every 4-8 seconds

    return () => clearInterval(opponentInterval);
  }, [gameState]);

  // Format Time
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
  };

  // Toggle operations
  const toggleOperation = (op) => {
    if (operations.includes(op)) {
      if (operations.length > 1) {
        setOperations(operations.filter(item => item !== op));
      }
    } else {
      setOperations([...operations, op]);
    }
  };

  // Create room and go to setup / game
  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    const generatedCode = String(Math.floor(Math.random() * 900000) + 100000);
    setRoomCode(generatedCode);
    setTimeLeft(timeLimit);
    setRopePosition(50);
    setBlueScore(0);
    setRedScore(0);
    setOpponentOnline(false);
    setOpponentName('Foydalanuvchi');
    setWinner(null);
    setCountdown(3);
    setGameState('waiting');
    setStep('game');
  };

  // Local user gameplay submit handlers
  const handleDigitPress = (digit) => {
    setPlayerInput(prev => (prev === '0' ? String(digit) : prev + digit));
  };

  const handleClear = () => {
    setPlayerInput('0');
  };

  const handleMathSubmit = () => {
    if (playerFeedback) return;
    const isCorrect = Number(playerInput) === playerQuestion.answer;
    setPlayerFeedback({ selected: playerInput, isCorrect });

    setTimeout(() => {
      setPlayerFeedback(null);
      if (isCorrect) {
        setBlueScore(prev => prev + 1);
        setRopePosition(prev => {
          const next = Math.max(10, prev - 8); // pull blue (left)
          if (next <= 10) {
            setGameState('finished');
            setWinner('blue');
          }
          return next;
        });
      } else {
        setRopePosition(prev => {
          const next = Math.min(90, prev + 8); // pull red (right)
          if (next >= 90) {
            setGameState('finished');
            setWinner('red');
          }
          return next;
        });
      }
      generateQuestion();
    }, 1200);
  };

  const handleChoiceSubmit = (choiceText) => {
    if (playerFeedback) return;
    const isCorrect = choiceText === playerQuestion.answer;
    setPlayerFeedback({ selected: choiceText, isCorrect });

    setTimeout(() => {
      setPlayerFeedback(null);
      if (isCorrect) {
        setBlueScore(prev => prev + 1);
        setRopePosition(prev => {
          const next = Math.max(10, prev - 8);
          if (next <= 10) {
            setGameState('finished');
            setWinner('blue');
          }
          return next;
        });
      } else {
        setRopePosition(prev => {
          const next = Math.min(90, prev + 8);
          if (next >= 90) {
            setGameState('finished');
            setWinner('red');
          }
          return next;
        });
      }
      generateQuestion();
    }, 1200);
  };

  const handleRestart = () => {
    setCountdown(3);
    setRopePosition(50);
    setBlueScore(0);
    setRedScore(0);
    setTimeLeft(timeLimit);
    setOpponentOnline(false);
    setOpponentName('Foydalanuvchi');
    setGameState('waiting');
    
    // Simulate opponent joining again
    setTimeout(() => {
      setOpponentOnline(true);
      setOpponentName(opponentName);
      setGameState('countdown');
    }, 3000);
  };

  const ropeOffset = 20 + ((ropePosition - 10) / 80) * 360;

  // RENDER STEP 1: LOBBY
  if (step === 'lobby') {
    return (
      <div className="online-lobby-root" style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
        <div className="online-lobby-header" style={{ marginBottom: '24px', background: '#f8fafc', padding: '16px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>Online o'ynash</h2>
          <button 
            type="button" 
            onClick={onQuit}
            style={{
              padding: '8px 16px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '700',
              color: '#475569',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ← Bosh sahifa
          </button>
        </div>

        <div className="online-lobby-card" style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', padding: '16px', borderRadius: '50%' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="2" />
                <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" />
              </svg>
            </div>
          </div>

          <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '0 0 12px' }}>Online o'yinga xush kelibsiz!</h3>
          <p style={{ color: '#64748b', fontSize: '15px', maxWidth: '500px', margin: '0 auto 32px', lineHeight: '1.5' }}>
            Room yarating yoki mavjud roomga kod yordamida ulanib, do'stlaringiz bilan real vaqtda kuch sinashing.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '440px', margin: '0 auto' }}>
            {/* Create Room Button */}
            <button 
              type="button" 
              onClick={() => setStep('setup')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 24px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
              className="online-action-row"
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </span>
                <span>
                  <strong style={{ display: 'block', fontSize: '16px', color: '#0f172a' }}>Yangi room yaratish</strong>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Mavzu yoki matematik rejimni tanlang</span>
                </span>
              </span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Enter Room Button */}
            <button 
              type="button" 
              onClick={() => {
                const code = prompt("Ulanish uchun 6 xonali xona kodini kiriting:");
                if (code) {
                  setRoomCode(code);
                  setUsername("Foydalanuvchi-2");
                  setOpponentName("Host_User");
                  setOpponentOnline(true);
                  setTimeLeft(60);
                  setRopePosition(50);
                  setBlueScore(0);
                  setRedScore(0);
                  setWinner(null);
                  setCountdown(3);
                  setGameState('countdown');
                  setStep('game');
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 24px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
              className="online-action-row"
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                </span>
                <span>
                  <strong style={{ display: 'block', fontSize: '16px', color: '#0f172a' }}>Roomga kirish</strong>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Kod bilan mavjud roomga ulaning</span>
                </span>
              </span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // RENDER STEP 2: SETUP MODAL
  if (step === 'setup') {
    return (
      <div className="math-setup-backdrop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,0.6)', padding: '20px', zIndex: 1060 }}>
        <div className="math-setup-modal" style={{ maxWidth: '500px', width: '100%', borderRadius: '16px', overflow: 'hidden', padding: 0 }}>
          <div className="math-setup-modal-header" style={{ background: '#2563eb', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ffffff' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Yangi room yaratish</h3>
            <button type="button" onClick={() => setStep('lobby')} style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '20px', cursor: 'pointer' }}>✕</button>
          </div>

          <form onSubmit={handleCreateRoom} style={{ padding: '20px', background: '#ffffff', maxHeight: '80vh', overflowY: 'auto' }}>
            {/* Warning box */}
            <div style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#b45309', padding: '12px 16px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>⚠️ Host bo'lish uchun login talab qilinadi.</span>
              <a href="#login" style={{ color: '#2563eb', fontWeight: '800', textDecoration: 'none' }}>Login ➜</a>
            </div>

            {/* Username Input */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Foydalanuvchi nomi</label>
              <input 
                type="text" 
                required 
                placeholder="Ismingizni kiriting" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
              />
            </div>

            {/* Game Type Toggle */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>O'yin turi</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button 
                  type="button" 
                  onClick={() => setGameType('math')}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: gameType === 'math' ? '#2563eb' : '#f8fafc',
                    color: gameType === 'math' ? '#ffffff' : '#475569',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  🧮 Matematik
                </button>
                <button 
                  type="button" 
                  onClick={() => setGameType('subject')}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: gameType === 'subject' ? '#2563eb' : '#f8fafc',
                    color: gameType === 'subject' ? '#ffffff' : '#475569',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  📖 Mavzu
                </button>
              </div>
            </div>

            {/* Math specific setup */}
            {gameType === 'math' && (
              <>
                {/* Operations */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Amallar</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {[
                      { id: 'addition', label: '+ Qo\'shish' },
                      { id: 'subtraction', label: '- Ayirish' },
                      { id: 'multiplication', label: '× Ko\'paytirish' },
                      { id: 'division', label: '÷ Bo\'lish' }
                    ].map(op => (
                      <button 
                        key={op.id}
                        type="button"
                        onClick={() => toggleOperation(op.id)}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          background: operations.includes(op.id) ? '#2563eb' : '#ffffff',
                          color: operations.includes(op.id) ? '#ffffff' : '#475569',
                          fontWeight: '700',
                          fontSize: '13px',
                          cursor: 'pointer'
                        }}
                      >
                        {op.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Qiyinlik</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                    {['easy', 'medium', 'hard'].map(diff => (
                      <button 
                        key={diff}
                        type="button"
                        onClick={() => setDifficulty(diff)}
                        style={{
                          padding: '8px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          background: difficulty === diff ? '#2563eb' : '#ffffff',
                          color: difficulty === diff ? '#ffffff' : '#475569',
                          fontWeight: '700',
                          fontSize: '13px',
                          cursor: 'pointer',
                          textTransform: 'capitalize'
                        }}
                      >
                        {diff === 'easy' ? 'Oson' : (diff === 'medium' ? 'O\'rtacha' : 'Qiyin')}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Time Limit */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Vaqt</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                {[60, 180, 300].map(secs => (
                  <button 
                    key={secs}
                    type="button"
                    onClick={() => setTimeLimit(secs)}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      background: timeLimit === secs ? '#2563eb' : '#ffffff',
                      color: timeLimit === secs ? '#ffffff' : '#475569',
                      fontWeight: '700',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    {secs / 60} daq
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
              <button 
                type="button" 
                onClick={() => setStep('lobby')} 
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: '700', cursor: 'pointer' }}
              >
                Bekor qilish
              </button>
              <button 
                type="submit" 
                style={{ padding: '10px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#ffffff', fontWeight: '700', cursor: 'pointer' }}
              >
                Yaratish
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // RENDER STEP 3: GAMEPLAY ARENA
  const isCountdownActive = countdown !== null;
  return (
    <div className="math-game-root online-play-root" style={{ padding: '16px' }}>
      {/* Top Header Controls */}
      <div className="game-screen-header" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button" className="game-home-btn" onClick={() => setStep('lobby')} style={{ color: '#ef4444', borderColor: '#fca5a5' }}>
            🚪 Chiqish
          </button>
          <div style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Room: <span style={{ color: '#2563eb' }}>{roomCode}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Share icon */}
          <button type="button" onClick={() => alert(`Room link: https://ilhomovfayzulloh5-star.github.io/Fayzullo-2/#room=${roomCode}`)} style={{ border: '1px solid #cbd5e1', background: '#ffffff', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }} title="Ulashish">
            🔗
          </button>
          {/* QR Code icon */}
          <button type="button" onClick={() => alert("Telefoningiz orqali ulanish uchun QR Kod")} style={{ border: '1px solid #cbd5e1', background: '#ffffff', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }} title="QR Kod">
            📱
          </button>
          {/* Mute icon */}
          <button type="button" onClick={() => setIsMuted(!isMuted)} style={{ border: '1px solid #cbd5e1', background: isMuted ? '#fee2e2' : '#ffffff', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}>
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>

      {/* Grid Layout: Left Panel, Center Arena, Right Panel */}
      <div className="game-split-arena">
        {/* Left Column: Owner Team (Blue) */}
        <div className="team-math-panel blue">
          <div className="team-math-header" style={{ background: 'rgba(37,99,235,0.08)', borderBottom: '1px solid rgba(37,99,235,0.15)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="team-name-title" style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{username}</span>
              <span style={{ fontSize: '11px', background: '#86efac', color: '#14532d', padding: '2px 6px', borderRadius: '10px', fontWeight: '800' }}>online</span>
            </span>
            <div className="team-score-badge" style={{ background: '#2563eb' }}>{blueScore}</div>
          </div>

          <div 
            className={`team-question-box ${
              playerFeedback ? (playerFeedback.isCorrect ? 'feedback-correct' : 'feedback-incorrect') : ''
            }`}
            style={(gameType === 'subject') ? { fontSize: '18px', padding: '16px' } : {}}
          >
            {isCountdownActive ? 'Savol...' : (gameState === 'waiting' ? 'Raqib kutilmoqda...' : (playerQuestion ? playerQuestion.text : '...'))}
          </div>

          {/* Option list or keypad */}
          {gameState === 'waiting' ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '220px', color: '#64748b', fontSize: '14px' }}>
              Raqib ulanishini kuting...
            </div>
          ) : (
            gameType === 'subject' ? (
              <div className="team-options-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {isCountdownActive ? (
                  ['A', 'B', 'C', 'D'].map((letter) => (
                    <button key={`blue-opt-placeholder-${letter}`} type="button" className="choice-card faded-choice" disabled>
                      <span className="choice-letter-box blue">{letter}</span>
                      <span className="choice-text-val">...</span>
                    </button>
                  ))
                ) : (
                  playerQuestion && playerQuestion.options.map(opt => {
                    let btnClass = "choice-card";
                    let ltrClass = "choice-letter-box blue";
                    if (playerFeedback) {
                      if (opt.text === playerFeedback.selected) {
                        if (playerFeedback.isCorrect) {
                          btnClass += " correct-choice";
                          ltrClass += " correct-choice";
                        } else {
                          btnClass += " incorrect-choice";
                          ltrClass += " incorrect-choice";
                        }
                      } else {
                        btnClass += " faded-choice";
                      }
                    }
                    return (
                      <button 
                        key={`blue-opt-${opt.letter}`}
                        type="button" 
                        className={btnClass}
                        onClick={() => handleChoiceSubmit(opt.text)}
                        disabled={!!playerFeedback}
                      >
                        <span className={ltrClass}>{opt.letter}</span>
                        <span className="choice-text-val">{opt.text}</span>
                      </button>
                    );
                  })
                )}
              </div>
            ) : (
              <>
                <div className="team-input-display">
                  {isCountdownActive ? '—' : playerInput}
                </div>

                <div className="team-keypad-grid" style={isCountdownActive ? { opacity: 0.3, pointerEvents: 'none' } : {}}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button 
                      key={`blue-key-${num}`} 
                      type="button" 
                      className="keypad-btn"
                      onClick={() => handleDigitPress(num)}
                      disabled={!!playerFeedback || isCountdownActive}
                    >
                      {num}
                    </button>
                  ))}
                  <button 
                    type="button" 
                    className="keypad-btn clear"
                    onClick={handleClear}
                    disabled={!!playerFeedback || isCountdownActive}
                  >
                    ❌
                  </button>
                  <button 
                    type="button" 
                    className="keypad-btn"
                    onClick={() => handleDigitPress(0)}
                    disabled={!!playerFeedback || isCountdownActive}
                  >
                    0
                  </button>
                  <button 
                    type="button" 
                    className="keypad-btn submit"
                    onClick={handleMathSubmit}
                    disabled={!!playerFeedback || isCountdownActive}
                  >
                    ✔️
                  </button>
                </div>
              </>
            )
          )}
        </div>

        {/* Center Arena panel */}
        <div className="game-center-arena">
          <div className="arena-card">
            {/* Arena Header */}
            <div className="arena-card-header">
              <div className="arena-header-team blue">
                <span className="team-lbl" style={{ maxWidth: '80px', overflow: 'hidden' }}>{username}</span>
                <span className="team-score-val">{blueScore}</span>
              </div>
              <div className="arena-header-timer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#2563eb' }}>
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="timer-val">{isCountdownActive || gameState === 'waiting' ? '00:00' : formatTime(timeLeft)}</span>
              </div>
              <div className="arena-header-team red">
                <span className="team-lbl" style={{ maxWidth: '80px', overflow: 'hidden' }}>{opponentName}</span>
                <span className="team-score-val">{redScore}</span>
              </div>
            </div>

            {/* Animation Arena Body */}
            <div className="arena-card-body">
              {gameState !== 'finished' ? (
                <>
                  <svg width="100%" height="100%" viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
                    {/* Dotted center line */}
                    <line x1="200" y1="0" x2="200" y2="240" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6 6" />

                    {/* Black rope */}
                    <line x1="20" y1="130" x2="380" y2="130" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />

                    {/* Red marker on the rope */}
                    <polygon 
                      points={`${ropeOffset},120 ${ropeOffset - 6},110 ${ropeOffset + 6},110`} 
                      fill="#ef4444" 
                    />
                    <line x1={ropeOffset} y1="110" x2={ropeOffset} y2="140" stroke="#ef4444" strokeWidth="3" />

                    {/* Left Team (Blue) characters: pulling rope */}
                    <g transform={`translate(${ropeOffset - 200}, 0)`}>
                      {/* Character 1 */}
                      <g transform="translate(130, 80)">
                        <g className="char-animate-left char-delay-1">
                          <path d="M 5 62 L -15 88 L -5 90 L 10 65 Z" fill="#0f172a" />
                          <path d="M -15 88 L -23 92 L -18 94 L -11 90 Z" fill="#2563eb" /> 
                          <path d="M -23 92 L -21 94 L -18 94 Z" fill="#ffffff" /> 

                          <path d="M 22 62 Q 30 75, 20 88 L 28 90 Q 38 75, 28 62 Z" fill="#0f172a" />
                          <path d="M 20 88 L 16 93 L 24 95 L 28 90 Z" fill="#2563eb" /> 
                          <path d="M 16 93 L 18 95 L 24 95 Z" fill="#ffffff" /> 

                          <path d="M 5 30 L 25 30 L 22 65 L 5 62 Z" fill="#2563eb" />
                          
                          <path d="M 8 32 Q 13 45, 10 60" stroke="#facc15" strokeWidth="2.5" fill="none" />
                          <path d="M 13 32 Q 18 45, 15 60" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeDasharray="3 3" />
                          <path d="M 18 32 Q 23 45, 20 60" stroke="#60a5fa" strokeWidth="2.5" fill="none" />

                          <rect x="11" y="24" width="6" height="8" fill="#fed7aa" transform="rotate(-10 14 28)" />

                          <g transform="translate(4, 4)">
                            <path d="M12 12 Q14 20, 19 20 L21 21 Q14 21, 10 13 Z" fill="#fed7aa" />
                            <circle cx="12" cy="12" r="7" fill="#fed7aa" />
                            <path d="M7 11 C 7 11, 12 7, 17 11 Z" fill="#0f172a" />
                            <circle cx="14" cy="12" r="1" fill="#000000" />
                            <path d="M11 15 Q13 17, 15 15" stroke="#000000" strokeWidth="1" fill="none" />
                            <path d="M10 14 C 10 7, 21 7, 21 14 Z" fill="#0f172a" />
                            <path d="M12 12 Q 14 10, 16 12" stroke="#ffffff" strokeWidth="1" fill="none" />
                            <path d="M16 12 Q 18 10, 20 12" stroke="#ffffff" strokeWidth="1" fill="none" />
                            <circle cx="14" cy="9.5" r="0.6" fill="#ffffff" />
                            <circle cx="18" cy="9.5" r="0.6" fill="#ffffff" />
                          </g>

                          <path d="M 25 35 Q 5 45, -10 48" stroke="#1d4ed8" strokeWidth="6" fill="none" strokeLinecap="round" />
                          <circle cx="-10" cy="48" r="4" fill="#fed7aa" />
                        </g>
                      </g>
                    </g>

                    {/* Right Team (Red) characters: pulling rope */}
                    <g transform={`translate(${ropeOffset - 200}, 0)`}>
                      {/* Character 1 */}
                      <g transform="translate(210, 80)">
                        <g className="char-animate-right char-delay-1">
                          <path d="M -5 62 L 15 88 L 5 90 L -10 65 Z" fill="#0f172a" />
                          <path d="M 15 88 L 23 92 L 18 94 L 11 90 Z" fill="#dc2626" /> 
                          <path d="M 23 92 L 21 94 L 18 94 Z" fill="#ffffff" /> 

                          <path d="M -22 62 Q -30 75, -20 88 L -28 90 Q -38 75, -28 62 Z" fill="#0f172a" />
                          <path d="M -20 88 L -16 93 L -24 95 L -28 90 Z" fill="#dc2626" /> 
                          <path d="M -16 93 L -18 95 L -24 95 Z" fill="#ffffff" /> 

                          <path d="M -5 30 L -25 30 L -22 65 L -5 62 Z" fill="#dc2626" />
                          
                          <path d="M -8 32 Q -13 45, -10 60" stroke="#facc15" strokeWidth="2.5" fill="none" />
                          <path d="M -13 32 Q -18 45, -15 60" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeDasharray="3 3" />
                          <path d="M -18 32 Q -23 45, -20 60" stroke="#fca5a5" strokeWidth="2.5" fill="none" />

                          <rect x="-17" y="24" width="6" height="8" fill="#fed7aa" transform="rotate(10 -14 28)" />

                          <g transform="translate(-25, 4)">
                            <path d="M9 12 Q7 20, 2 20 L0 21 Q7 21, 11 13 Z" fill="#fed7aa" />
                            <circle cx="9" cy="12" r="7" fill="#fed7aa" />
                            <path d="M14 11 C 14 11, 9 7, 4 11 Z" fill="#0f172a" />
                            <circle cx="7" cy="12" r="1" fill="#000000" />
                            <path d="M10 15 Q8 17, 6 15" stroke="#000000" strokeWidth="1" fill="none" />
                            <path d="M11 14 C 11 7, 0 7, 0 14 Z" fill="#0f172a" />
                            <path d="M9 12 Q 7 10, 5 12" stroke="#ffffff" strokeWidth="1" fill="none" />
                            <path d="M5 12 Q 3 10, 1 12" stroke="#ffffff" strokeWidth="1" fill="none" />
                            <circle cx="7" cy="9.5" r="0.6" fill="#ffffff" />
                            <circle cx="3" cy="9.5" r="0.6" fill="#ffffff" />
                          </g>

                          <path d="M -20 35 Q -40 45, -55 48" stroke="#dc2626" strokeWidth="6" fill="none" strokeLinecap="round" />
                          <circle cx="-55" cy="48" r="4" fill="#fed7aa" />
                        </g>
                      </g>
                    </g>
                  </svg>

                  {/* Raqib kutilmoqda overlay */}
                  {gameState === 'waiting' && (
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(1.5px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 5, borderRadius: '8px' }}>
                      <div className="lds-ring" style={{ width: '40px', height: '40px', display: 'inline-block', border: '4px solid #2563eb', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                      <span style={{ fontSize: '15px', fontWeight: '800', color: '#1e293b', marginTop: '12px' }}>Raqib kutilmoqda...</span>
                      <span style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Do'stingizga xona kodini ulashing</span>
                    </div>
                  )}
                </>
              ) : (
                /* Winner victory display */
                <div className="arena-victory-splash" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <div className="victory-crown">👑</div>
                  <h3 className="victory-text">G'ALABA!</h3>
                  <span className={`victory-winner-name ${winner}`}>
                    {winner === 'draw' ? "DURANG!" : (winner === 'blue' ? username : opponentName)}
                  </span>
                  <p className="victory-desc">
                    {winner === 'draw' ? "O'yin durang natija bilan tugadi." : "Raqib arqonini to'liq tortib oldi!"}
                  </p>
                  <div className="victory-actions" style={{ display: 'flex', gap: '10px' }}>
                    <button type="button" className="setup-btn next" onClick={handleRestart}>♻️ Qayta o'ynash</button>
                    <button type="button" className="setup-btn back" onClick={() => setStep('lobby')}>🚪 Chiqish</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Player 2 (Red) - Simulated Opponent */}
        <div className="team-math-panel red">
          <div className="team-math-header" style={{ background: 'rgba(220,38,38,0.08)', borderBottom: '1px solid rgba(220,38,38,0.15)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="team-name-title" style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{opponentName}</span>
              <span style={{ fontSize: '11px', background: opponentOnline ? '#86efac' : '#cbd5e1', color: opponentOnline ? '#14532d' : '#475569', padding: '2px 6px', borderRadius: '10px', fontWeight: '800' }}>
                {opponentOnline ? 'online' : 'offline'}
              </span>
            </span>
            <div className="team-score-badge" style={{ background: '#dc2626' }}>{redScore}</div>
          </div>

          <div 
            className={`team-question-box ${
              opponentFeedback ? (opponentFeedback.isCorrect ? 'feedback-correct' : 'feedback-incorrect') : ''
            }`}
            style={{ fontSize: '18px', padding: '16px' }}
          >
            {isCountdownActive ? 'Savol...' : (gameState === 'waiting' ? 'Raqib kutilmoqda...' : 'Raqib savolga javob bermoqda...')}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '220px', position: 'relative' }}>
            {gameState === 'waiting' ? (
              <span style={{ color: '#64748b', fontSize: '14px' }}>Raqib kutilmoqda...</span>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div style={{ position: 'relative', width: '40px', height: '40px' }}>
                  <div style={{ width: '40px', height: '40px', border: '4px solid #dc2626', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1.2s linear infinite' }}></div>
                </div>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Raqib o'ylamoqda...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full-screen Countdown overlay */}
      {isCountdownActive && (
        <div className={`arena-countdown-overlay ${countdown === 'start' ? 'countdown-start' : 'countdown-number'}`}>
          {countdown === 'start' ? 'BOSHLANDI!' : countdown}
        </div>
      )}

      {/* Spinning animation rule */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default OnlineGameScreen;
