import React, { useState, useEffect, useCallback, useRef } from 'react';

// Emojis for card matching
const memoryEmojis = [
  "🍎", "🍌", "🍒", "🍇", "🍉", "🍍", "🥑", "🍓", // Fruits
  "🐶", "🐱", "🐰", "🦊", "🦁", "🐯", "🐼", "🐨", // Animals
  "🚗", "🚌", "🚲", "✈️", "🚀", "🚂", "🚢", "🚁", // Vehicles
  "⚽", "🏀", "🎾", "🏐", "🏈", "🎱", "🏓", "🏸", // Sports
  "🎨", "🎭", "🎪", "🎤", "🎧", "🎸", "🎹", "🎷", // Art/Music
  "📚", "✏️", "📐", "🔬", "🔭", "🧠", "🎒", "🎓"  // School/Science
];

// Leaderboard items matching the screenshot
const initialLeaderboard = [
  { rank: 1, name: "Karam", level: 10, score: 425, time: "110s" },
  { rank: 2, name: "16-maktab 6-A sinf", level: 10, score: 425, time: "111s" },
  { rank: 3, name: "5V Sinf", level: 10, score: 425, time: "110s" },
  { rank: 4, name: "Abdusalomov sardorbek", level: 10, score: 425, time: "120s" },
  { rank: 5, name: "DOSTON", level: 10, score: 425, time: "126s" },
  { rank: 6, name: "Eshboyev_Ummatjon 7T", level: 10, score: 425, time: "137s" },
  { rank: 7, name: "aaaaa", level: 10, score: 425, time: "127s" },
  { rank: 8, name: "5ASinfXurshidbek", level: 10, score: 425, time: "131s" }
];

const MemoryGameScreen = ({ onQuit }) => {
  const [step, setStep] = useState('lobby'); // 'lobby', 'countdown', 'game', 'success', 'finished'
  const [level, setLevel] = useState(1); // Daraja 1 to 10
  const [score, setScore] = useState(0);
  const [record, setRecord] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Game active states
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameTimer, setGameTimer] = useState(0); // overall seconds elapsed
  const [countdown, setCountdown] = useState(3);
  const [isWon, setIsWon] = useState(false);

  const timerRef = useRef(null);
  const globalTimerRef = useRef(null);

  // Initialize level grid size and card pairs
  // Level 1: 4 cards (2x2)
  // Level 2: 6 cards (2x3)
  // Level 3: 8 cards (2x4)
  // Level 4: 12 cards (3x4)
  // Level 5: 16 cards (4x4)
  // Level 6: 20 cards (4x5)
  // Level 7: 24 cards (4x6)
  // Level 8: 30 cards (5x6)
  // Level 9: 36 cards (6x6)
  // Level 10: 40 cards (5x8)
  const getGridConfig = (lvl) => {
    switch (lvl) {
      case 1: return { pairs: 2, cols: 2 };
      case 2: return { pairs: 3, cols: 3 };
      case 3: return { pairs: 4, cols: 4 };
      case 4: return { pairs: 6, cols: 4 };
      case 5: return { pairs: 8, cols: 4 };
      case 6: return { pairs: 10, cols: 5 };
      case 7: return { pairs: 12, cols: 6 };
      case 8: return { pairs: 15, cols: 6 };
      case 9: return { pairs: 18, cols: 6 };
      case 10: return { pairs: 20, cols: 8 };
      default: return { pairs: 2, cols: 2 };
    }
  };

  // Generate cards for the current level
  const generateLevelCards = useCallback(() => {
    const config = getGridConfig(level);
    
    // Pick random emojis
    const shuffledEmojis = [...memoryEmojis].sort(() => 0.5 - Math.random());
    const levelEmojis = shuffledEmojis.slice(0, config.pairs);
    
    // Duplicate emojis to make pairs
    const doubleEmojis = [...levelEmojis, ...levelEmojis];
    
    // Shuffle the final set of cards
    const finalShuffled = doubleEmojis
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }))
      .sort(() => 0.5 - Math.random());
      
    setCards(finalShuffled);
    setSelectedCards([]);
    setTimeLeft(30 + level * 10); // time limit grows as levels get harder
  }, [level]);

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
        generateLevelCards();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [step, countdown, generateLevelCards]);

  // Main gameplay level timer & global time tracker
  useEffect(() => {
    if (step !== 'game') return;

    // Level Countdown Timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setStep('finished');
          setIsWon(false);
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
      clearInterval(timerRef.current);
      clearInterval(globalTimerRef.current);
    };
  }, [step]);

  // Start the game
  const handleStartGame = () => {
    setLevel(1);
    setScore(0);
    setGameTimer(0);
    setCountdown(3);
    setStep('countdown');
  };

  // Card select click handler
  const handleCardClick = (index) => {
    if (step !== 'game') return;
    if (cards[index].isFlipped || cards[index].isMatched) return;
    if (selectedCards.length >= 2) return;

    // Flip card
    const updatedCards = [...cards];
    updatedCards[index].isFlipped = true;
    setCards(updatedCards);

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    // Check match if 2 cards selected
    if (newSelected.length === 2) {
      const firstIdx = newSelected[0];
      const secondIdx = newSelected[1];

      if (cards[firstIdx].emoji === cards[secondIdx].emoji) {
        // Matched!
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[firstIdx].isMatched = true;
          matchedCards[secondIdx].isMatched = true;
          setCards(matchedCards);
          setSelectedCards([]);
          setScore(prev => prev + 15);

          // Check level completion
          const allMatched = matchedCards.every(c => c.isMatched);
          if (allMatched) {
            clearInterval(timerRef.current);
            clearInterval(globalTimerRef.current);
            
            // Level success!
            if (level === 10) {
              // Beat all levels!
              setRecord(prev => Math.max(prev, score + 150));
              setStep('finished');
              setIsWon(true);
            } else {
              setStep('success');
            }
          }
        }, 600);
      } else {
        // No match: flip back
        setTimeout(() => {
          const flippedBack = [...cards];
          flippedBack[firstIdx].isFlipped = false;
          flippedBack[secondIdx].isFlipped = false;
          setCards(flippedBack);
          setSelectedCards([]);
          // subtract points for error
          setScore(prev => Math.max(0, prev - 2));
        }, 1000);
      }
    }
  };

  // Move to next level
  const handleNextLevel = () => {
    setLevel(prev => prev + 1);
    setCountdown(3);
    setStep('countdown');
  };

  const currentGridConfig = getGridConfig(level);

  // RENDER STEP 1: LOBBY
  if (step === 'lobby') {
    return (
      <div className="memory-lobby-root" style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto', fontFamily: "'Manrope', sans-serif" }}>
        
        {/* Main Grid: Info/Start & Ranking */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '24px' }} className="memory-lobby-grid-layout">
          
          {/* Left/Middle: Setup panel */}
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
              className="memory-back-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Score/Stats bar */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '48px', marginBottom: '40px' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '14px', color: '#64748b', fontWeight: '600' }}>Daraja</span>
                <strong style={{ fontSize: '24px', color: '#0f172a', fontWeight: '800' }}>
                  {level} <span style={{ color: '#94a3b8', fontSize: '16px', fontWeight: '600' }}>/ 10</span>
                </strong>
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

            {/* Boshlash Action Button */}
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
                className="memory-start-cta"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Boshlash
              </button>
            </div>
          </div>

          {/* Right: Leaderboard */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🏆 Global reyting
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Eng yuqori ball va eng tez yakun (Top 10)</span>
              </div>
              <button type="button" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '700', color: '#475569', cursor: 'default' }}>
                Top 10
              </button>
            </div>

            {/* Ranking list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
              {initialLeaderboard.map((user, i) => {
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
                      {/* Rank tag */}
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
                        <span style={{ fontSize: '11px', color: '#64748b' }}>Daraja {user.level}</span>
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

        {/* Bottom Section: SEO/Information */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 16px' }}>
            Xotira o'yini: bolalar uchun memory games for kids
          </h2>
          <p style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.6', margin: '0 0 16px' }}>
            Xotira o'yini sahifasi bolalar va o'quvchilar uchun ishlab chiqilgan bo'lib, u <strong>memory games for kids</strong> va <strong>memory card game online</strong> formatidagi mashqlarni zamonaviy ko'rinishda taqdim etadi. O'yin mexanikasi oddiy: raqamlar yoki joylashuvlarni eslab qolish, keyin ularni tez va to'g'ri tiklash. Darajalar oshgani sari vazifa murakkablashadi, bu esa foydalanuvchining diqqat, qisqa muddatli xotira va tezkor fikrlashini bir vaqtda mashq qildiradi. Natija global reytingga yozilishi sababli o'quvchi o'z rekordini yangilashga intiladi va muntazam mashq qilishga odatlanadi.
          </p>
          <p style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.6', margin: '0 0 16px' }}>
            Ushbu sahifa <strong>online memory games for kids free</strong> toifasida samarali yechim bo'lib, uyda mustaqil mashq qilish yoki darsdan oldin qisqa faollashtirish uchun juda qulay. O'qituvchilar uni sinfda qo'shimcha mashg'ulot sifatida qo'llab, bolalarning e'tibor darajasini tez tekshirishi mumkin. Mazkur o'yin <strong>brain games for kids</strong>, <strong>interactive learning games</strong> va <strong>learning games online free</strong> yondashuvlarini birlashtiradi. Muntazam o'ynash orqali foydalanuvchi <strong>brain training games for students</strong> hamda <strong>best brain games online free</strong> formatlarida kutiladigan asosiy ko'nikmalarni bosqichma-bosqich rivojlantiradi.
          </p>
          <p style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.6', margin: 0 }}>
            Qisqa sessiyalar va bosqichli murakkablik modeli tufayli bu sahifa darsdan tashqari mustaqil mashg'ulotlar uchun ham mos: o'quvchi har kuni 5-10 daqiqa mashq qilib, xotira barqarorligini oshiradi. Shu yondashuv uni <strong>online memory games for kids free</strong> va <strong>memory card game online</strong> qidiruvlari uchun kuchli sahifaga aylantiradi. Natijada platforma bolalar uchun qiziqarli, o'qituvchi uchun esa nazorat qilinadigan interaktiv ta'lim muhiti beradi.
          </p>
        </div>

        {/* Responsive Grid Layout Style override */}
        <style>{`
          @media (min-width: 768px) {
            .memory-lobby-grid-layout {
              grid-template-columns: 1.2fr 0.8fr !important;
            }
          }
          .memory-lobby-root strong, .memory-lobby-root button {
            transition: all 0.2s ease;
          }
          .memory-lobby-root button:hover {
            opacity: 0.9;
            transform: translateY(-1px);
          }
          .memory-back-btn:hover {
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
            O'yin boshlanmoqda...
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

  // RENDER STEP 3: GAMEPLAY ARENA
  if (step === 'game') {
    return (
      <div className="memory-game-arena-root" style={{ padding: '16px', maxWidth: '1000px', margin: '0 auto', fontFamily: "'Manrope', sans-serif" }}>
        
        {/* Top bar controls */}
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
              Daraja: <span style={{ color: '#2563eb', fontSize: '16px', fontWeight: '800' }}>{level} / 10</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#64748b' }}>
              Ball: <span style={{ color: '#16a34a', fontSize: '16px', fontWeight: '800' }}>{score}</span>
            </div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              ⏱️ <span style={{ color: timeLeft < 10 ? '#ef4444' : '#0f172a', fontSize: '16px', fontWeight: '800', width: '30px', display: 'inline-block' }}>{timeLeft}s</span>
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

        {/* Card Grid Container */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${currentGridConfig.cols}, 1fr)`,
            gap: '12px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            padding: '20px',
            borderRadius: '16px',
            minHeight: '400px',
            alignContent: 'center',
            justifyItems: 'center',
            maxWidth: level <= 3 ? '400px' : level <= 5 ? '560px' : '760px',
            margin: '0 auto 20px'
          }}
        >
          {cards.map((card, index) => {
            const isFlippedOrMatched = card.isFlipped || card.isMatched;
            return (
              <div 
                key={card.id}
                onClick={() => handleCardClick(index)}
                style={{
                  width: '74px',
                  height: '74px',
                  cursor: isFlippedOrMatched ? 'default' : 'pointer',
                  perspective: '1000px',
                  position: 'relative'
                }}
                className="memory-card-wrapper"
              >
                {/* 3D Flipping container */}
                <div 
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    transform: isFlippedOrMatched ? 'rotateY(180deg)' : 'rotateY(0deg)'
                  }}
                >
                  {/* Card Front (Face Down) */}
                  <div 
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                      backfaceVisibility: 'hidden',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      border: '2px solid #ffffff'
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" opacity="0.8">
                      <rect x="3" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="3" y="14" width="7" height="7" rx="1" />
                      <rect x="14" y="14" width="7" height="7" rx="1" />
                    </svg>
                  </div>

                  {/* Card Back (Face Up) */}
                  <div 
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      background: card.isMatched ? '#dcfce7' : '#ffffff',
                      border: card.isMatched ? '2px solid #22c55e' : '2px solid #3b82f6',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '32px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      transition: 'background 0.3s'
                    }}
                  >
                    {card.emoji}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // RENDER STEP 4: SUCCESS MODAL
  if (step === 'success') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', fontFamily: "'Manrope', sans-serif" }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '32px', maxWidth: '460px', width: '100%', textAlign: 'center', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
          <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px' }}>Daraja {level} yakunlandi!</h3>
          <p style={{ color: '#64748b', fontSize: '14.5px', marginBottom: '24px' }}>
            Ajoyib natija! Barcha juftliklarni to'g'ri topdingiz.
          </p>

          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-around', marginBottom: '28px' }}>
            <div>
              <span style={{ fontSize: '12px', color: '#64748b', display: 'block', fontWeight: '600' }}>Hozirgi ball</span>
              <strong style={{ fontSize: '18px', color: '#2563eb' }}>{score} ball</strong>
            </div>
            <div style={{ width: '1px', background: '#cbd5e1' }} />
            <div>
              <span style={{ fontSize: '12px', color: '#64748b', display: 'block', fontWeight: '600' }}>Vaqt qoldi</span>
              <strong style={{ fontSize: '18px', color: '#16a34a' }}>{timeLeft}s</strong>
            </div>
          </div>

          <button 
            type="button" 
            onClick={handleNextLevel}
            style={{
              width: '100%',
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              padding: '14px',
              borderRadius: '10px',
              fontWeight: '800',
              cursor: 'pointer',
              fontSize: '15px'
            }}
          >
            Keyingi daraja ➜
          </button>
        </div>
      </div>
    );
  }

  // RENDER STEP 5: GAME OVER OR FULL VICTORY
  if (step === 'finished') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', fontFamily: "'Manrope', sans-serif" }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '36px', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>{isWon ? '🏆' : '⏰'}</div>
          
          <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 10px' }}>
            {isWon ? 'G\'alaba! Barcha darajalar yakunlandi!' : 'Vaqt tugadi!'}
          </h3>
          
          <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '28px' }}>
            {isWon 
              ? 'Tabriklaymiz! Siz 10-darajani ham muvaffaqiyatli yakunlab, o\'yinni butunlay yutdingiz!'
              : `Afsuski, Daraja ${level}da berilgan vaqt tugadi. Yana urinib ko'ring.`}
          </p>

          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
            <div style={{ borderRight: '1px solid #cbd5e1' }}>
              <span style={{ fontSize: '12px', color: '#64748b', display: 'block', fontWeight: '600' }}>Umumiy ball</span>
              <strong style={{ fontSize: '20px', color: '#2563eb' }}>{score}</strong>
            </div>
            <div>
              <span style={{ fontSize: '12px', color: '#64748b', display: 'block', fontWeight: '600' }}>Umumiy vaqt</span>
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

export default MemoryGameScreen;
