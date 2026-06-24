import React, { useState, useEffect, useCallback, useRef } from 'react';

// Country flag list drawn dynamically via SVG for 100% network-independent rendering
const countryFlags = [
  {
    name: "O'zbekiston",
    code: "UZ",
    render: () => (
      <svg width="180" height="120" viewBox="0 0 500 300" style={{ borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <rect width="500" height="95" fill="#0099B5" />
        <rect y="95" width="500" height="5" fill="#E81D23" />
        <rect y="100" width="500" height="100" fill="#FFFFFF" />
        <rect y="200" width="500" height="5" fill="#E81D23" />
        <rect y="205" width="500" height="95" fill="#1EB53A" />
        <circle cx="65" cy="50" r="28" fill="#FFFFFF" />
        <circle cx="75" cy="50" r="28" fill="#0099B5" />
        {/* Stars */}
        <circle cx="115" cy="30" r="3" fill="#FFFFFF" />
        <circle cx="130" cy="30" r="3" fill="#FFFFFF" />
        <circle cx="145" cy="30" r="3" fill="#FFFFFF" />
        <circle cx="100" cy="50" r="3" fill="#FFFFFF" />
        <circle cx="115" cy="50" r="3" fill="#FFFFFF" />
        <circle cx="130" cy="50" r="3" fill="#FFFFFF" />
        <circle cx="145" cy="50" r="3" fill="#FFFFFF" />
        <circle cx="85" cy="70" r="3" fill="#FFFFFF" />
        <circle cx="100" cy="70" r="3" fill="#FFFFFF" />
        <circle cx="115" cy="70" r="3" fill="#FFFFFF" />
        <circle cx="130" cy="70" r="3" fill="#FFFFFF" />
        <circle cx="145" cy="70" r="3" fill="#FFFFFF" />
      </svg>
    )
  },
  {
    name: "Turkiya",
    code: "TR",
    render: () => (
      <svg width="180" height="120" viewBox="0 0 450 300" style={{ borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <rect width="450" height="300" fill="#E30A17" />
        <circle cx="150" cy="150" r="75" fill="#FFFFFF" />
        <circle cx="168" cy="150" r="60" fill="#E30A17" />
        <polygon points="210,150 235,158 220,135 220,165 235,142" fill="#FFFFFF" />
      </svg>
    )
  },
  {
    name: "Rossiya",
    code: "RU",
    render: () => (
      <svg width="180" height="120" viewBox="0 0 300 200" style={{ borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <rect width="300" height="66.6" fill="#FFFFFF" />
        <rect y="66.6" width="300" height="66.6" fill="#0039A6" />
        <rect y="133.2" width="300" height="66.8" fill="#D52B1E" />
      </svg>
    )
  },
  {
    name: "Germaniya",
    code: "DE",
    render: () => (
      <svg width="180" height="120" viewBox="0 0 500 300" style={{ borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <rect width="500" height="100" fill="#000000" />
        <rect y="100" width="500" height="100" fill="#DD0000" />
        <rect y="200" width="500" height="100" fill="#FFCC00" />
      </svg>
    )
  },
  {
    name: "Fransiya",
    code: "FR",
    render: () => (
      <svg width="180" height="120" viewBox="0 0 300 200" style={{ borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <rect width="100" height="200" fill="#00209F" />
        <rect x="100" width="100" height="200" fill="#FFFFFF" />
        <rect x="200" width="100" height="200" fill="#F31830" />
      </svg>
    )
  },
  {
    name: "Italiya",
    code: "IT",
    render: () => (
      <svg width="180" height="120" viewBox="0 0 300 200" style={{ borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <rect width="100" height="200" fill="#009246" />
        <rect x="100" width="100" height="200" fill="#F1F2F1" />
        <rect x="200" width="100" height="200" fill="#CE2B37" />
      </svg>
    )
  },
  {
    name: "Yaponiya",
    code: "JP",
    render: () => (
      <svg width="180" height="120" viewBox="0 0 300 200" style={{ borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', stroke: '#cbd5e1', strokeWidth: 1 }}>
        <rect width="300" height="200" fill="#FFFFFF" />
        <circle cx="150" cy="100" r="60" fill="#BC002D" />
      </svg>
    )
  },
  {
    name: "AQSH",
    code: "US",
    render: () => (
      <svg width="180" height="120" viewBox="0 0 380 200" style={{ borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <rect width="380" height="200" fill="#FFFFFF" />
        {/* Stripes */}
        <rect y="0" width="380" height="15.4" fill="#B22234" />
        <rect y="30.8" width="380" height="15.4" fill="#B22234" />
        <rect y="61.6" width="380" height="15.4" fill="#B22234" />
        <rect y="92.4" width="380" height="15.4" fill="#B22234" />
        <rect y="123.2" width="380" height="15.4" fill="#B22234" />
        <rect y="154" width="380" height="15.4" fill="#B22234" />
        <rect y="184.8" width="380" height="15.4" fill="#B22234" />
        {/* Canton */}
        <rect width="152" height="107.6" fill="#3C3B6E" />
        <circle cx="20" cy="15" r="2.5" fill="#FFFFFF" />
        <circle cx="40" cy="15" r="2.5" fill="#FFFFFF" />
        <circle cx="60" cy="15" r="2.5" fill="#FFFFFF" />
        <circle cx="80" cy="15" r="2.5" fill="#FFFFFF" />
        <circle cx="100" cy="15" r="2.5" fill="#FFFFFF" />
        <circle cx="120" cy="15" r="2.5" fill="#FFFFFF" />
        <circle cx="20" cy="35" r="2.5" fill="#FFFFFF" />
        <circle cx="40" cy="35" r="2.5" fill="#FFFFFF" />
        <circle cx="60" cy="35" r="2.5" fill="#FFFFFF" />
        <circle cx="80" cy="35" r="2.5" fill="#FFFFFF" />
        <circle cx="100" cy="35" r="2.5" fill="#FFFFFF" />
        <circle cx="120" cy="35" r="2.5" fill="#FFFFFF" />
        <circle cx="20" cy="55" r="2.5" fill="#FFFFFF" />
        <circle cx="40" cy="55" r="2.5" fill="#FFFFFF" />
        <circle cx="60" cy="55" r="2.5" fill="#FFFFFF" />
        <circle cx="80" cy="55" r="2.5" fill="#FFFFFF" />
        <circle cx="100" cy="55" r="2.5" fill="#FFFFFF" />
        <circle cx="120" cy="55" r="2.5" fill="#FFFFFF" />
      </svg>
    )
  },
  {
    name: "Buyuk Britaniya",
    code: "GB",
    render: () => (
      <svg width="180" height="120" viewBox="0 0 300 200" style={{ borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <rect width="300" height="200" fill="#012169" />
        <line x1="0" y1="0" x2="300" y2="200" stroke="#FFFFFF" strokeWidth="20" />
        <line x1="300" y1="0" x2="0" y2="200" stroke="#FFFFFF" strokeWidth="20" />
        <line x1="0" y1="0" x2="300" y2="200" stroke="#C8102E" strokeWidth="12" />
        <line x1="300" y1="0" x2="0" y2="200" stroke="#C8102E" strokeWidth="12" />
        <rect x="120" width="60" height="200" fill="#FFFFFF" />
        <rect y="80" width="300" height="40" fill="#FFFFFF" />
        <rect x="130" width="40" height="200" fill="#C8102E" />
        <rect y="90" width="300" height="20" fill="#C8102E" />
      </svg>
    )
  },
  {
    name: "Braziliya",
    code: "BR",
    render: () => (
      <svg width="180" height="120" viewBox="0 0 290 200" style={{ borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <rect width="290" height="200" fill="#009C3B" />
        <polygon points="145,16 268,100 145,184 22,100" fill="#FFDF00" />
        <circle cx="145" cy="100" r="47" fill="#002776" />
        <path d="M102,110 Q145,75 188,110" stroke="#FFFFFF" strokeWidth="6" fill="none" />
      </svg>
    )
  },
  {
    name: "Ukraina",
    code: "UA",
    render: () => (
      <svg width="180" height="120" viewBox="0 0 300 200" style={{ borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <rect width="300" height="100" fill="#0057B7" />
        <rect y="100" width="300" height="100" fill="#FFDD00" />
      </svg>
    )
  },
  {
    name: "Polsha",
    code: "PL",
    render: () => (
      <svg width="180" height="120" viewBox="0 0 300 200" style={{ borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', stroke: '#cbd5e1', strokeWidth: 1 }}>
        <rect width="300" height="100" fill="#FFFFFF" />
        <rect y="100" width="300" height="100" fill="#DC143C" />
      </svg>
    )
  },
  {
    name: "Shvetsiya",
    code: "SE",
    render: () => (
      <svg width="180" height="120" viewBox="0 0 320 200" style={{ borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <rect width="320" height="200" fill="#006AA7" />
        <rect x="100" width="40" height="200" fill="#FECC00" />
        <rect y="80" width="320" height="40" fill="#FECC00" />
      </svg>
    )
  },
  {
    name: "Hindiston",
    code: "IN",
    render: () => (
      <svg width="180" height="120" viewBox="0 0 300 200" style={{ borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <rect width="300" height="66.6" fill="#FF9933" />
        <rect y="66.6" width="300" height="66.6" fill="#FFFFFF" />
        <rect y="133.2" width="300" height="66.8" fill="#128807" />
        <circle cx="150" cy="100" r="24" stroke="#000080" strokeWidth="2.5" fill="none" />
        <circle cx="150" cy="100" r="4" fill="#000080" />
      </svg>
    )
  },
  {
    name: "Kanada",
    code: "CA",
    render: () => (
      <svg width="180" height="120" viewBox="0 0 400 200" style={{ borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <rect width="100" height="200" fill="#FF0000" />
        <rect x="100" width="200" height="200" fill="#FFFFFF" />
        <rect x="300" width="100" height="200" fill="#FF0000" />
        <polygon points="200,50 210,75 225,70 220,85 240,90 225,100 235,120 215,115 200,135 185,115 165,120 175,100 160,90 180,85 175,70 190,75" fill="#FF0000" />
        <rect x="197" y="130" width="6" height="25" fill="#FF0000" />
      </svg>
    )
  }
];

// Leaderboard items matching the screenshot
const flagLeaderboard = [
  { rank: 1, name: "Red", count: 100, time: "238s" },
  { rank: 2, name: "y", count: 100, time: "241s" },
  { rank: 3, name: "Sh. Shohjahon flag king", count: 100, time: "252s" },
  { rank: 4, name: "GRISHA", count: 100, time: "267s" },
  { rank: 5, name: "Azizbek", count: 100, time: "269s" }
];

const FlagGameScreen = ({ onQuit }) => {
  const [step, setStep] = useState('lobby'); // 'lobby', 'countdown', 'game', 'finished'
  const [totalQuestions, setTotalQuestions] = useState(20); // 20, 30, 50, 200
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [record, setRecord] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Active game states
  const [gameQuestions, setGameQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  // Timers
  const [timeLeft, setTimeLeft] = useState(15); // 15 seconds per question
  const [gameTimer, setGameTimer] = useState(0); // overall elapsed seconds
  const [countdown, setCountdown] = useState(3);

  const questionTimerRef = useRef(null);
  const globalTimerRef = useRef(null);

  // Generate question deck
  const generateGameDeck = useCallback((count) => {
    // Shuffling flag list
    const deck = [];
    const availableFlags = [...countryFlags];
    
    for (let i = 0; i < count; i++) {
      // Loop over flag list and duplicate if we need 200 questions, shuffling each time
      const flagSource = availableFlags[i % availableFlags.length];
      
      // Make 4 choices
      const otherCountries = countryFlags
        .filter(f => f.name !== flagSource.name)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(f => f.name);
        
      const choices = [flagSource.name, ...otherCountries].sort(() => 0.5 - Math.random());
      
      deck.push({
        flag: flagSource,
        choices,
        correct: flagSource.name
      });
    }
    
    setGameQuestions(deck);
    setCurrentIdx(0);
    setScore(0);
    setGameTimer(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
  }, []);

  // Handle Playback of background music
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

  // Start countdown phase
  const handleStartGame = (qCount) => {
    setTotalQuestions(qCount);
    generateGameDeck(qCount);
    setCountdown(3);
    setStep('countdown');
  };

  // Countdown timer phase effect
  useEffect(() => {
    if (step !== 'countdown') return;

    const timer = setTimeout(() => {
      if (countdown === 3) {
        setCountdown(2);
      } else if (countdown === 2) {
        setCountdown(1);
      } else if (countdown === 1) {
        setCountdown('start');
      } else if (countdown === 'start') {
        setCountdown(null);
        setStep('game');
        setTimeLeft(15);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [step, countdown]);

  // Set the current question
  useEffect(() => {
    if (step === 'game' && gameQuestions.length > 0) {
      setCurrentQuestion(gameQuestions[currentIdx]);
      setTimeLeft(15);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  }, [step, gameQuestions, currentIdx]);

  // Answer Select handler
  const handleAnswerSelect = useCallback((choice) => {
    if (isAnswered || !currentQuestion) return;
    clearInterval(questionTimerRef.current);
    
    setSelectedAnswer(choice);
    setIsAnswered(true);
    
    const isCorrect = choice === currentQuestion.correct;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    // Auto advance to next question after 1.5 seconds feedback
    setTimeout(() => {
      if (currentIdx + 1 < totalQuestions) {
        setCurrentIdx(prev => prev + 1);
      } else {
        // Game completed!
        clearInterval(globalTimerRef.current);
        setRecord(prev => Math.max(prev, isCorrect ? score + 1 : score));
        setStep('finished');
      }
    }, 1500);
  }, [isAnswered, currentQuestion, currentIdx, totalQuestions, score]);

  // Level countdown timer & global time tracker
  useEffect(() => {
    if (step !== 'game') return;

    // Single Question Countdown
    questionTimerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time out is treated as wrong answer, auto-move forward
          handleAnswerSelect(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Global Time Elapsed Tracker
    globalTimerRef.current = setInterval(() => {
      setGameTimer(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(questionTimerRef.current);
      clearInterval(globalTimerRef.current);
    };
  }, [step, handleAnswerSelect]);

  // RENDER STEP 1: LOBBY
  if (step === 'lobby') {
    return (
      <div className="flags-lobby-root" style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto', fontFamily: "'Manrope', sans-serif" }}>
        
        {/* Two column grid layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '24px' }} className="flags-lobby-grid-layout">
          
          {/* Left panel: Info & Choice */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', position: 'relative' }}>
            
            {/* Back Button left */}
            <button 
              type="button" 
              onClick={onQuit}
              style={{
                position: 'absolute',
                top: '24px',
                left: '24px',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b',
                transition: 'all 0.2s',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
              className="flags-back-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Header info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '36px', marginBottom: '24px' }}>
              <div style={{ background: '#2563eb', color: '#ffffff', width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>Bayroqlarni top!</h3>
                <span style={{ fontSize: '13px', color: '#64748b', display: 'block', marginTop: '2px' }}>
                  Davlatlar bayroqlarini qanchalik yaxshi bilasiz? Savollar sonini tanlang va boshlang!
                </span>
              </div>
            </div>

            {/* Record tag */}
            <div style={{ marginBottom: '32px' }}>
              <span style={{ background: '#fffbeb', border: '1px solid #fef3c7', color: '#d97706', padding: '6px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: '700' }}>
                🏆 Rekord: {record}
              </span>
            </div>

            {/* Separator line */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.1em' }}>🗳️ SAVOLLAR SONI</span>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            </div>

            {/* 4 buttons grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <button 
                type="button" 
                onClick={() => handleStartGame(20)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s'
                }}
                className="flags-choice-btn"
              >
                <strong style={{ fontSize: '22px', color: '#0f172a', display: 'block', marginBottom: '4px' }}>20</strong>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Tez o'yin</span>
              </button>

              <button 
                type="button" 
                onClick={() => handleStartGame(30)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s'
                }}
                className="flags-choice-btn"
              >
                <strong style={{ fontSize: '22px', color: '#0f172a', display: 'block', marginBottom: '4px' }}>30</strong>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>O'rtacha</span>
              </button>

              <button 
                type="button" 
                onClick={() => handleStartGame(50)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s'
                }}
                className="flags-choice-btn"
              >
                <strong style={{ fontSize: '22px', color: '#0f172a', display: 'block', marginBottom: '4px' }}>50</strong>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Kengaytirilgan</span>
              </button>

              <button 
                type="button" 
                onClick={() => handleStartGame(200)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s'
                }}
                className="flags-choice-btn"
              >
                <strong style={{ fontSize: '22px', color: '#0f172a', display: 'block', marginBottom: '4px' }}>200</strong>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Marafon</span>
              </button>
            </div>
          </div>

          {/* Right panel: Rankings */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🏆 Global reyting
                </h3>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Eng ko'p topgan va eng tez topganlar (Top 10)</span>
              </div>
              <button type="button" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '4px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: '700', color: '#475569', cursor: 'default' }}>
                Top 10
              </button>
            </div>

            {/* Ranking list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {flagLeaderboard.map((user, i) => {
                const isTop3 = user.rank <= 3;
                return (
                  <div 
                    key={i} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '12px 16px', 
                      background: '#f8fafc', 
                      borderRadius: '10px', 
                      border: '1px solid #e2e8f0' 
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ 
                        width: '26px', 
                        height: '26px', 
                        borderRadius: '50%', 
                        background: isTop3 ? '#fef3c7' : '#e2e8f0', 
                        color: isTop3 ? '#d97706' : '#475569', 
                        fontSize: '12px', 
                        fontWeight: '800', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        border: isTop3 ? '1px solid #fde68a' : 'none'
                      }}>
                        {isTop3 ? user.rank : `# ${user.rank}`}
                      </span>
                      <div>
                        <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block' }}>{user.name}</strong>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>{user.count} ta topgan</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <strong style={{ fontSize: '14px', color: '#2563eb', display: 'block' }}>100</strong>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>{user.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom card: SEO paragraphs */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 16px' }}>
            Bayroqlar o'yini: geografiyani oson o'rganish
          </h2>
          <p style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.6', margin: '0 0 16px' }}>
            Ushbu sahifa bolalar va o'quvchilar uchun yaratilgan amaliy <strong>flag quiz game</strong> bo'lib, mamlakatlarni bayroqlari orqali tez va qiziqarli usulda o'rgatadi. O'yin davomida foydalanuvchi har bir savolda to'g'ri davlatni topadi, vaqt bilan ishlaydi va natijani global reytingda ko'radi. Shu yondashuv <strong>country flag quiz</strong> va <strong>guess the flag game</strong> formatlarini birlashtirib, darsdan tashqari mashg'ulotlar uchun ham foydali bo'ladi. Savollar sonini 20, 30, 50 yoki 200 qilib tanlash mumkinligi esa platformani boshlovchi va tajribali foydalanuvchilar uchun birdek qulay qiladi.
          </p>
          <p style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.6', margin: '0 0 16px' }}>
            Bayroqlar sahifasi faqat o'yin emas, balki to'liq <strong>world flags quiz game</strong> tajribasidir: diqqat, tez fikrlash va geografik xotira bir vaqtning o'zida rivojlanadi. Shu sababli u <strong>geography games for kids</strong> va <strong>online games for studying geography</strong> kategoriyalarida ayniqsa samarali. O'qituvchilar bu sahifadan sinf mashg'ulotida mini test sifatida foydalanishi, ota-onalar esa uyda farzandlar bilan birga mashq qilishi mumkin. Natijada bolalar bayroqlarni yodlab qoladi, davlat nomlarini tezroq ajratadi va <strong>educational quiz games for kids</strong> hamda <strong>interactive quiz game</strong> yondashuvi orqali geografiya faniga qiziqishi ortadi.
          </p>
          <p style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.6', margin: 0 }}>
            SEO va foydalanuvchi niyatiga mos kontent sababli bu sahifa <strong>geography quiz games online</strong>, <strong>country flag quiz</strong>, <strong>guess the flag game</strong> hamda <strong>world flags quiz game</strong> kabi qidiruvlarda ham yaxshi moslik beradi. 200 ta marafon rejimi va rekord tizimi o'quvchini uzoqroq ushlab turadi, bu esa qayta kirish ko'rsatkichini oshiradi. Natijada sahifa geografiyani qiziqarli o'rgatadigan amaliy va barqaror o'quv vositasiga aylanadi.
          </p>
        </div>

        {/* CSS overrides for styling */}
        <style>{`
          @media (min-width: 768px) {
            .flags-lobby-grid-layout {
              grid-template-columns: 1.25fr 0.75fr !important;
            }
          }
          .flags-choice-btn {
            box-shadow: 0 1px 2px rgba(0,0,0,0.02);
          }
          .flags-choice-btn:hover {
            border-color: #2563eb !important;
            background: #eff6ff !important;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(37,99,235,0.08);
          }
          .flags-lobby-root button {
            transition: all 0.2s ease;
          }
          .flags-back-btn:hover {
            background: #f8fafc !important;
            color: #2563eb !important;
          }
        `}</style>
      </div>
    );
  }

  // RENDER STEP 2: COUNTDOWN TIMER OVERLAY
  if (step === 'countdown') {
    return (
      <div 
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontFamily: "'Outfit', sans-serif"
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '20px', fontWeight: '700', textTransform: 'uppercase', tracking: '0.1em', opacity: 0.8, display: 'block', marginBottom: '16px' }}>
            Bayroqlar o'yini boshlanmoqda...
          </span>
          <div style={{ fontSize: '80px', fontWeight: '900', textShadow: '0 0 20px rgba(255,255,255,0.4)', animation: 'countdownZoom 1s infinite' }}>
            {countdown === 'start' ? 'BOSHLANDI!' : countdown}
          </div>
        </div>
        <style>{`
          @keyframes countdownZoom {
            0% { transform: scale(0.6); opacity: 0.4; }
            50% { transform: scale(1.15); opacity: 1; }
            100% { transform: scale(1); opacity: 0.8; }
          }
        `}</style>
      </div>
    );
  }

  // RENDER STEP 3: PLAYING ARENA
  if (step === 'game' && currentQuestion) {
    const { flag, choices, correct } = currentQuestion;
    return (
      <div className="flags-game-arena-root" style={{ padding: '16px', maxWidth: '800px', margin: '0 auto', fontFamily: "'Manrope', sans-serif" }}>
        
        {/* Header bar controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: '#ffffff', border: '1px solid #e2e8f0', padding: '12px 20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              type="button" 
              onClick={() => setStep('lobby')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid #fca5a5',
                background: '#ffffff',
                color: '#ef4444',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              🚪 Chiqish
            </button>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#64748b' }}>
              Savol: <span style={{ color: '#2563eb', fontSize: '16px', fontWeight: '800' }}>{currentIdx + 1} / {totalQuestions}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#64748b' }}>
              To'g'ri: <span style={{ color: '#16a34a', fontSize: '16px', fontWeight: '800' }}>{score}</span>
            </div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              ⏱️ <span style={{ color: timeLeft < 5 ? '#ef4444' : '#0f172a', fontSize: '16px', fontWeight: '800', width: '30px', display: 'inline-block' }}>{timeLeft}s</span>
            </div>
            <button 
              type="button" 
              onClick={() => setIsMuted(!isMuted)} 
              style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
          </div>
        </div>

        {/* Flag Render card */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          {flag.render()}
        </div>

        {/* 4 Choices buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="flags-choices-grid">
          {choices.map((choice, i) => {
            let btnStyle = {
              background: '#ffffff',
              border: '2px solid #cbd5e1',
              color: '#334155'
            };

            if (isAnswered) {
              if (choice === correct) {
                // Correct answer glows green
                btnStyle = {
                  background: '#dcfce7',
                  border: '2px solid #22c55e',
                  color: '#15803d',
                  fontWeight: '700'
                };
              } else if (choice === selectedAnswer) {
                // Incorrect chosen answer glows red
                btnStyle = {
                  background: '#fee2e2',
                  border: '2px solid #ef4444',
                  color: '#b91c1c',
                  fontWeight: '700'
                };
              } else {
                // Others fade out
                btnStyle = {
                  background: '#f8fafc',
                  border: '2px solid #e2e8f0',
                  color: '#94a3b8',
                  opacity: 0.6
                };
              }
            }

            return (
              <button
                key={i}
                type="button"
                disabled={isAnswered}
                onClick={() => handleAnswerSelect(choice)}
                style={{
                  padding: '16px 20px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: isAnswered ? 'default' : 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s',
                  outline: 'none',
                  ...btnStyle
                }}
                className="flags-choice-option"
              >
                {choice}
              </button>
            );
          })}
        </div>

        <style>{`
          @media (max-width: 540px) {
            .flags-choices-grid {
              grid-template-columns: 1fr !important;
            }
          }
          .flags-choice-option:hover {
            ${!isAnswered ? 'border-color: #2563eb; background: #f0f7ff; transform: scale(1.01);' : ''}
          }
        `}</style>
      </div>
    );
  }

  // RENDER STEP 4: GAME END RESULT
  if (step === 'finished') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', fontFamily: "'Manrope', sans-serif" }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '36px', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🏆</div>
          
          <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 10px' }}>
            O'yin yakunlandi!
          </h3>
          
          <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '28px' }}>
            Siz barcha {totalQuestions} ta savoldan muvaffaqiyatli o'tdingiz. Natijangizni ko'ring:
          </p>

          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
            <div style={{ borderRight: '1px solid #cbd5e1' }}>
              <span style={{ fontSize: '12px', color: '#64748b', display: 'block', fontWeight: '600' }}>To'g'ri javoblar</span>
              <strong style={{ fontSize: '20px', color: '#16a34a' }}>{score} / {totalQuestions}</strong>
            </div>
            <div>
              <span style={{ fontSize: '12px', color: '#64748b', display: 'block', fontWeight: '600' }}>Sarf etilgan vaqt</span>
              <strong style={{ fontSize: '20px', color: '#0f172a' }}>{gameTimer}s</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              type="button" 
              onClick={() => setStep('lobby')}
              style={{
                flex: 1,
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#475569',
                padding: '14px',
                borderRadius: '10px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '15px'
              }}
            >
              Lobby
            </button>
            <button 
              type="button" 
              onClick={() => handleStartGame(totalQuestions)}
              style={{
                flex: 1,
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                padding: '14px',
                borderRadius: '10px',
                fontWeight: '800',
                cursor: 'pointer',
                fontSize: '15px',
                boxShadow: '0 4px 6px rgba(37,99,235,0.1)'
              }}
            >
              Qaytadan o'ynash
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default FlagGameScreen;
