import React from 'react';

const Features = () => {
  return (
    <div className="landing-features">
      {/* 1 */}
      <div className="landing-feature-card">
        <div className="landing-feature-icon" style={{ backgroundColor: 'rgba(37, 99, 235, 0.12)', color: '#2563eb' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </div>
        <h3>Gamifikatsiya tizimi</h3>
        <p>Ball to'plang, darajalar oching va raqobatchilardan o'zib keting. Har bir to'g'ri javob oldinga olib boradi.</p>
      </div>

      {/* 2 */}
      <div className="landing-feature-card">
        <div className="landing-feature-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
        </div>
        <h3>16+ interaktiv o'yin</h3>
        <p>Arqon tortish, krossword, xotira, bayroqlar, ranglar, matematika va boshqa ko'plab o'yin turlari mavjud.</p>
      </div>

      {/* 3 */}
      <div className="landing-feature-card">
        <div className="landing-feature-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 20V10M12 20V4M6 20v-6"></path>
          </svg>
        </div>
        <h3>Reyting tizimi</h3>
        <p>Xotira, Bayroqlar va Ranglar o'yinlarida global leaderboard. Rekordi siz o'rnating!</p>
      </div>

      {/* 4 */}
      <div className="landing-feature-card">
        <div className="landing-feature-icon" style={{ backgroundColor: 'rgba(14, 165, 233, 0.12)', color: '#0ea5e9' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <h3>Online o'yin</h3>
        <p>Raqibingiz bilan real vaqtda o'ynang. QR kod bilan xonaga bir zumda ulanish.</p>
      </div>

      {/* 5 */}
      <div className="landing-feature-card">
        <div className="landing-feature-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
            <path d="M12 2a10 10 0 0 1 10 10H12V2z" opacity="0.4"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </div>
        <h3>AI Krossword yaratish</h3>
        <p>Sun'iy intellekt (OpenAI) yordamida istalgan mavzu bo'yicha krossword avtomatik tuziladi.</p>
      </div>

      {/* 6 */}
      <div className="landing-feature-card">
        <div className="landing-feature-icon" style={{ backgroundColor: 'rgba(236, 72, 153, 0.12)', color: '#ec4899' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </div>
        <h3>Maxsus kontent yaratish</h3>
        <p>Ishchi varaq, mavzu va savollar yarating. Darsga tayyorgarlik vaqtini qisqartiring.</p>
      </div>
    </div>
  );
};

export default Features;
