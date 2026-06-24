import React from 'react';

const GameTypes = ({ onSelectArqon, onSelectOnline, onSelectMemory }) => {
  return (
    <section className="landing-gametypes">
      <div className="landing-section-badge">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="6" width="20" height="12" rx="2"></rect>
          <path d="M12 12h.01M8 12h.01M16 12h.01"></path>
        </svg>
        O'yin turlari
      </div>
      <h2 className="landing-section-title">16+ turli o'yin formati</h2>
      <p className="landing-section-desc">Raqobat, mahorat, xotira va ijodiy o'yinlar — hammasi bir platformada.</p>

      <div className="landing-gametypes-grid">
        {/* Arqon Tortish */}
        <a 
          className="landing-gametype-card featured" 
          href="#arqon"
          onClick={(e) => {
            e.preventDefault();
            if (onSelectArqon) onSelectArqon();
          }}
        >
          <div className="landing-gametype-icon" style={{ backgroundColor: 'rgba(37, 99, 235, 0.12)', color: '#2563eb' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3l4 4-10 10-4-4L17 3z" />
              <path d="M7 17l-4 4" />
              <path d="M17 7l-6 6" />
            </svg>
          </div>
          <div className="landing-gametype-badge team">Jamoaviy</div>
          <h3>Arqon Tortish</h3>
          <p>2 jamoa sifatida raqobatlashib, savollarga javob berib arqonni tortib oling. Fanlar bo'yicha savol bazasi.</p>
          <div className="landing-gametype-tags">
            <span>Barcha fanlar</span>
            <span>Jamoaviy raqobat</span>
            <span>Vaqt limiti</span>
          </div>
        </a>

        {/* Online o'ynash */}
        <a 
          className="landing-gametype-card" 
          href="/game/online"
          onClick={(e) => {
            e.preventDefault();
            if (onSelectOnline) onSelectOnline();
          }}
        >
          <div className="landing-gametype-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="2" />
              <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" />
            </svg>
          </div>
          <div className="landing-gametype-badge online">Online</div>
          <h3>Online o'ynash</h3>
          <p>Do'stlaringiz bilan real vaqtda o'ynang. QR kod yoki xona kodi orqali tez ulanish.</p>
          <div className="landing-gametype-tags">
            <span>Real vaqt</span>
            <span>QR kod</span>
          </div>
        </a>

        {/* Xotira O'yini */}
        <a 
          className="landing-gametype-card" 
          href="/game/memory/"
          onClick={(e) => {
            e.preventDefault();
            if (onSelectMemory) onSelectMemory();
          }}
        >
          <div className="landing-gametype-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <div className="landing-gametype-badge rating">Reyting</div>
          <h3>Xotira O'yini</h3>
          <p>Kartochkalarni yodlab oling va jahon reytingida o'z o'rningizni egallang.</p>
          <div className="landing-gametype-tags">
            <span>Leaderboard</span>
            <span>Mahorat</span>
          </div>
        </a>

        {/* Bayroqlar */}
        <a className="landing-gametype-card" href="/game/flags/">
          <div className="landing-gametype-icon" style={{ backgroundColor: 'rgba(6, 182, 212, 0.12)', color: '#06b6d4' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
              <line x1="4" y1="22" x2="4" y2="15" />
            </svg>
          </div>
          <div className="landing-gametype-badge rating">Reyting</div>
          <h3>Bayroqlar</h3>
          <p>Davlatlarning bayroqlarini tanib oling. Global reytingga kiring va rekordni sinang.</p>
          <div className="landing-gametype-tags">
            <span>Leaderboard</span>
            <span>Geografiya</span>
          </div>
        </a>

        {/* Ranglar */}
        <a className="landing-gametype-card" href="/game/colors/">
          <div className="landing-gametype-icon" style={{ backgroundColor: 'rgba(236, 72, 153, 0.12)', color: '#ec4899' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="13.5" cy="6.5" r="2.5" />
              <circle cx="17.5" cy="10.5" r="2.5" />
              <circle cx="8.5" cy="7.5" r="2.5" />
              <circle cx="6.5" cy="12.5" r="2.5" />
              <path d="M12 20a5 5 0 1 1 0-10c2 0 4 .5 4 2s-2 2-2 4a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-.5" />
            </svg>
          </div>
          <div className="landing-gametype-badge rating">Reyting</div>
          <h3>Ranglar</h3>
          <p>Rang tanish qobiliyatingizni sinab ko'ring va global reytingga kiring.</p>
          <div className="landing-gametype-tags">
            <span>Leaderboard</span>
            <span>Tezlik</span>
          </div>
        </a>

        {/* AI Krossword */}
        <a className="landing-gametype-card" href="/create/crossword">
          <div className="landing-gametype-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <rect x="9" y="9" width="6" height="6" />
              <line x1="9" y1="1" x2="9" y2="4" />
              <line x1="15" y1="1" x2="15" y2="4" />
              <line x1="9" y1="20" x2="9" y2="23" />
              <line x1="15" y1="20" x2="15" y2="23" />
              <line x1="20" y1="9" x2="23" y2="9" />
              <line x1="20" y1="14" x2="23" y2="14" />
              <line x1="1" y1="9" x2="4" y2="9" />
              <line x1="1" y1="14" x2="4" y2="14" />
            </svg>
          </div>
          <div className="landing-gametype-badge ai">AI</div>
          <h3>AI Krossword</h3>
          <p>Mavzu kiriting — sun'iy intellekt avtomatik krossword topshirig'i yaratadi.</p>
          <div className="landing-gametype-tags">
            <span>OpenAI</span>
            <span>O'qituvchi uchun</span>
          </div>
        </a>

        {/* Topshiriqlar */}
        <a className="landing-gametype-card" href="/create/topic">
          <div className="landing-gametype-icon" style={{ backgroundColor: 'rgba(236, 72, 153, 0.12)', color: '#ec4899' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="4" />
              <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
              <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
              <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
              <line x1="14.83" y1="9.17" x2="18.36" y2="5.64" />
              <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
            </svg>
          </div>
          <div className="landing-gametype-badge create">Yaratish</div>
          <h3>Topshiriqlar</h3>
          <p>Sinf, fan va mavzu asosida tayyor topshiriqlar yoki loyiha topshirig'ini tez yarating.</p>
          <div className="landing-gametype-tags">
            <span>AI generator</span>
            <span>Dars uchun</span>
          </div>
        </a>
      </div>
    </section>
  );
};

export default GameTypes;
