import React, { useState, useEffect, useCallback, useRef } from 'react';

// Leaderboard items matching the screenshot
const colorLeaderboard = [
  { rank: 1, name: "Лана 7 лет ChatGPT", score: 300, time: "24s" },
  { rank: 2, name: "Zuhriddin", score: 300, time: "25s" },
  { rank: 3, name: "....", score: 300, time: "26s" },
  { rank: 4, name: "Husen", score: 300, time: "30s" },
  { rank: 5, name: "Bad bunny", score: 300, time: "44s" },
  { rank: 6, name: "Mivifktthkivimhftt", score: 300, time: "45s" },
  { rank: 7, name: "15 champions", score: 300, time: "47s" },
  { rank: 8, name: "Ay mi gatito miau miau", score: 300, time: "48s" }
];

// Helper to play synthesized retro sound effects and voice synthesis
const playAudioFeedback = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'correct') {
      // Play retro happy double beep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start();
      
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12); // E5
      gain2.gain.setValueAtTime(0.15, ctx.currentTime + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      
      osc2.start(ctx.currentTime + 0.12);
      osc.stop(ctx.currentTime + 0.25);
      osc2.stop(ctx.currentTime + 0.35);

      // Play synthesized "Zor!" voice speech
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance("Zo'r!");
        utterance.lang = 'uz-UZ';
        utterance.volume = 1.0;
        utterance.rate = 1.2;
        window.speechSynthesis.speak(utterance);
      }
    } else if (type === 'fail') {
      // Sad losing melody (descending notes)
      const notes = [293.66, 277.18, 261.63, 220.00]; // D4, C#4, C4, A3
      const duration = 0.35;
      
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.22);
        osc.frequency.exponentialRampToValueAtTime(freq - 40, ctx.currentTime + idx * 0.22 + duration);
        
        gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.22);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.22 + duration);
        
        osc.start(ctx.currentTime + idx * 0.22);
        osc.stop(ctx.currentTime + idx * 0.22 + duration);
      });
    }
  } catch (err) {
    console.error("Synthesizer error: ", err);
  }
};

const ColorGameScreen = ({ onQuit }) => {
  const [step, setStep] = useState('lobby'); // 'lobby', 'countdown', 'game', 'finished'
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [record, setRecord] = useState(150); // Matches the screenshot rekord: 150
  const [isMuted, setIsMuted] = useState(false);

  // Active game states
  const [gridSize, setGridSize] = useState(2); // 2x2, 3x3, 4x4, etc.
  const [tiles, setTiles] = useState([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameTimer, setGameTimer] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [reason, setReason] = useState('wrong'); // 'wrong' or 'timeout'

  const timerRef = useRef(null);
  const globalTimerRef = useRef(null);

  // Helper to generate a random RGB color and a slightly offset color
  const generateColors = useCallback((lvl) => {
    // Random base color (not too bright, not too dark)
    const r = Math.floor(Math.random() * 160) + 30;
    const g = Math.floor(Math.random() * 160) + 30;
    const b = Math.floor(Math.random() * 160) + 30;
    const baseColor = `rgb(${r}, ${g}, ${b})`;

    // Color offset decreases as levels rise (harder to see)
    // Level 1: diff = 40
    // Level 5: diff = 22
    // Level 10: diff = 10
    // Level 15: diff = 6
    // Level 20+: diff = 4
    const diff = Math.max(4, Math.floor(45 - lvl * 3.5));
    
    // Choose which channel to offset
    const offsetType = Math.random() < 0.5 ? 1 : -1;
    const rOffset = Math.min(255, Math.max(0, r + diff * offsetType));
    const gOffset = Math.min(255, Math.max(0, g + diff * offsetType));
    const bOffset = Math.min(255, Math.max(0, b + diff * offsetType));
    const offsetColor = `rgb(${rOffset}, ${gOffset}, ${bOffset})`;

    // Grid size scales up
    // Level 1-2: 2x2
    // Level 3-4: 3x3
    // Level 5-6: 4x4
    // Level 7-8: 5x5
    // Level 9-10: 6x6
    // Level 11+: 7x7
    let size = 2;
    if (lvl >= 11) size = 7;
    else if (lvl >= 9) size = 6;
    else if (lvl >= 7) size = 5;
    else if (lvl >= 5) size = 4;
    else if (lvl >= 3) size = 3;

    setGridSize(size);

    const totalTiles = size * size;
    const correctIndex = Math.floor(Math.random() * totalTiles);

    const levelTiles = Array.from({ length: totalTiles }).map((_, idx) => ({
      id: idx,
      color: idx === correctIndex ? offsetColor : baseColor,
      isTarget: idx === correctIndex
    }));

    setTiles(levelTiles);
    setTimeLeft(15);
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

  // Countdown timer phase
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
        generateColors(1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [step, countdown, generateColors]);

  // Gameplay timers
  useEffect(() => {
    if (step !== 'game') return;

    // Countdown timer per level
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setReason('timeout');
          playAudioFeedback('fail');
          setStep('finished');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Global match timer
    globalTimerRef.current = setInterval(() => {
      setGameTimer(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
      clearInterval(globalTimerRef.current);
    };
  }, [step, level]);

  // Start game action
  const handleStartGame = () => {
    setLevel(1);
    setScore(0);
    setGameTimer(0);
    setCountdown(3);
    setStep('countdown');
  };

  // Tile click handler
  const handleTileClick = (tile) => {
    if (step !== 'game') return;

    if (tile.isTarget) {
      // Correct tile clicked
      playAudioFeedback('correct');
      setScore(prev => prev + 10);
      setRecord(prev => Math.max(prev, score + 10));
      setLevel(prev => prev + 1);
      generateColors(level + 1);
    } else {
      // Incorrect tile clicked -> game over
      clearInterval(timerRef.current);
      clearInterval(globalTimerRef.current);
      setReason('wrong');
      playAudioFeedback('fail');
      setStep('finished');
    }
  };

  // RENDER STEP 1: LOBBY
  if (step === 'lobby') {
    return (
      <div className="color-lobby-root" style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto', fontFamily: "'Manrope', sans-serif" }}>
        
        {/* Lobby Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '24px' }} className="color-lobby-grid-layout">
          
          {/* Left/Middle setup */}
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
              className="color-back-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Score/Stats bar */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '48px', marginBottom: '40px' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '14px', color: '#64748b', fontWeight: '600' }}>Daraja</span>
                <strong style={{ fontSize: '24px', color: '#0f172a', fontWeight: '800' }}>{level}</strong>
              </div>
              <div style={{ width: '1px', background: '#e2e8f0' }} />
              <div style={{ textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '14px', color: '#64748b', fontWeight: '600' }}>Ball</span>
                <strong style={{ fontSize: '24px', color: '#2563eb', fontWeight: '800' }}>{score}</strong>
              </div>
              <div style={{ width: '1px', background: '#e2e8f0' }} />
              <div style={{ textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '14px', color: '#64748b', fontWeight: '600' }}>Rekord</span>
                <strong style={{ fontSize: '24px', color: '#eab308', fontWeight: '800' }}>{record}</strong>
              </div>
            </div>

            {/* User Pill */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
              <span style={{ background: '#eff6ff', color: '#2563eb', padding: '8px 20px', borderRadius: '100px', fontSize: '14px', fontWeight: '700', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                fayzullohilhomov
              </span>
            </div>

            {/* Start Button */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <button 
                type="button" 
                onClick={handleStartGame}
                style={{
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  padding: '16px 40px',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(37,99,235,0.2)'
                }}
                className="color-start-cta"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Boshlash
              </button>
            </div>
          </div>

          {/* Right side: Rankings */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🏆 Global reyting
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Eng ko'p ball olgan va eng qisqa vaqt sarflagan (Top 10)</span>
              </div>
              <button type="button" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '700', color: '#475569', cursor: 'default' }}>
                Top 10
              </button>
            </div>

            {/* Ranking list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
              {colorLeaderboard.map((user, i) => {
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
                        <span style={{ fontSize: '11px', color: '#64748b' }}>Daraja 30</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <strong style={{ fontSize: '14px', color: '#2563eb', display: 'block' }}>{user.score}</strong>
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
            Farqli rangni topish: bolalar uchun color learning game
          </h2>
          <p style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.6', margin: 0 }}>
            Farqli rangni toping sahifasi bolalar uchun tayyorlangan amaliy <strong>color learning game</strong> bo'lib, ranglarni ajratish, diqqatni boshqarish va tez qaror qabul qilish ko'nikmalarini rivojlantiradi. O'yinda foydalanuvchi bir xil ranglar orasidan juda yaqin tusdagi farqli katakni topadi, bu esa ko'z sezgirligini bosqichma-bosqich kuchaytiradi. Daraja oshgani sari maydon kattalashadi va ranglar farqi kamayadi. Shu sababli bu format <strong>color matching game for kids</strong> va vizual fikrlash mashqi sifatida juda samarali ishlaydi. Sahifada rekord va global reyting mavjudligi bolalarni muntazam mashq qilishga rag'batlantiradi.
          </p>
        </div>

        {/* Layout style overrides */}
        <style>{`
          @media (min-width: 768px) {
            .color-lobby-grid-layout {
              grid-template-columns: 1.2fr 0.8fr !important;
            }
          }
          .color-lobby-root strong, .color-lobby-root button {
            transition: all 0.2s ease;
          }
          .color-lobby-root button:hover {
            opacity: 0.9;
            transform: translateY(-1px);
          }
          .color-back-btn:hover {
            background: #f8fafc !important;
            color: #2563eb !important;
          }
        `}</style>
      </div>
    );
  }

  // RENDER STEP 2: COUNTDOWN OVERLAY
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
            Farqli rangni topish boshlanmoqda...
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

  // RENDER STEP 3: GAMEPLAY SCREEN
  if (step === 'game') {
    return (
      <div className="color-game-arena-root" style={{ padding: '16px', maxWidth: '700px', margin: '0 auto', fontFamily: "'Manrope', sans-serif" }}>
        
        {/* Top Header info */}
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
              Daraja: <span style={{ color: '#2563eb', fontSize: '16px', fontWeight: '800' }}>{level}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#64748b' }}>
              Ball: <span style={{ color: '#16a34a', fontSize: '16px', fontWeight: '800' }}>{score}</span>
            </div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#64748b' }}>
              Rekord: <span style={{ color: '#eab308', fontSize: '16px', fontWeight: '800' }}>{record}</span>
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

        {/* Progress timer bar */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '12px 20px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <span style={{ fontSize: '14px', fontWeight: '700', color: '#475569' }}>Farqli rangni toping</span>
          
          {/* Progress bar line */}
          <div style={{ flex: 1, height: '8px', background: '#e2e8f0', borderRadius: '100px', overflow: 'hidden' }}>
            <div 
              style={{ 
                width: `${(timeLeft / 15) * 100}%`, 
                height: '100%', 
                background: timeLeft < 5 ? '#ef4444' : '#2563eb',
                transition: 'width 1s linear',
                borderRadius: '100px'
              }} 
            />
          </div>

          {/* Time badge circle */}
          <span style={{ background: timeLeft < 5 ? '#fee2e2' : '#eff6ff', color: timeLeft < 5 ? '#ef4444' : '#2563eb', border: timeLeft < 5 ? '1px solid #fca5a5' : '1px solid #bfdbfe', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800' }}>
            {timeLeft}
          </span>
        </div>

        {/* Color Tile Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gap: '10px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            padding: '20px',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
            maxWidth: '520px',
            margin: '0 auto'
          }}
        >
          {tiles.map((tile) => (
            <div
              key={tile.id}
              onClick={() => handleTileClick(tile)}
              style={{
                background: tile.color,
                borderRadius: '8px',
                cursor: 'pointer',
                aspectRatio: '1',
                transition: 'all 0.1s'
              }}
              className="color-game-tile"
            />
          ))}
        </div>

        <style>{`
          .color-game-tile:hover {
            transform: scale(1.02);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          .color-game-tile:active {
            transform: scale(0.98);
          }
        `}</style>
      </div>
    );
  }

  // RENDER STEP 4: GAME OVER SCREEN
  if (step === 'finished') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', fontFamily: "'Manrope', sans-serif" }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '36px', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>💀</div>
          
          <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 10px' }}>
            O'yin yakunlandi!
          </h3>
          
          <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '28px' }}>
            {reason === 'timeout' 
              ? `Afsuski, Daraja ${level}da berilgan 15 soniya vaqt tugadi!`
              : `Noto'g'ri rang tanlandi va mag'lub bo'ldingiz!`}
          </p>

          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
            <div style={{ borderRight: '1px solid #cbd5e1' }}>
              <span style={{ fontSize: '12px', color: '#64748b', display: 'block', fontWeight: '600' }}>To'plangan ball</span>
              <strong style={{ fontSize: '20px', color: '#2563eb' }}>{score}</strong>
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
              onClick={handleStartGame}
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

export default ColorGameScreen;
