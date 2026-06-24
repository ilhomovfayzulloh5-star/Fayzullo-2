import React from 'react';

const Hero = () => {
  return (
    <section className="landing-hero">
      <div className="landing-grid">
        <div>
          <span className="landing-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3 6 6 .9-4.5 4.3 1 6.8-5.5-3-5.5 3 1-6.8L3 8.9 9 8l3-6z"></path>
            </svg>
            Gamifikatsiya asosidagi ta'lim
          </span>
          <h1 className="landing-title">O'qituvchilar uchun ta'limiy o'yinlar platformasi</h1>
          <p className="landing-text">
            16+ interaktiv o'yin, 12+ fan, real vaqtda onlayn raqobat va AI krossword. O'qituvchilar va talabalar uchun eng qiziqarli ta'lim tajribasi!
          </p>
          <div className="landing-actions">
            <a className="landing-btn primary" href="/game/">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              O'yinlarni boshlash
            </a>
            <a className="landing-btn ghost" href="/qanday-ishlaydi">Qanday ishlaydi</a>
          </div>
        </div>
        <div className="landing-card">
          <div>
            <span className="landing-card-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
              350K+ Aktiv foydalanuvchilar
            </span>
          </div>
          <div className="landing-stats">
            <div className="landing-stat">
              <div className="label">O'yinlar</div>
              <div className="value">16+</div>
            </div>
            <div className="landing-stat">
              <div className="label">Fanlar</div>
              <div className="value">12+</div>
            </div>
          </div>
          <div className="landing-highlight">
            <div className="landing-update-head">
              <h3>Yangi funksiyalar</h3>
              <span className="landing-update-pill">Yangi</span>
            </div>
            <div className="landing-update-list">
              <a className="landing-update-card" href="/game/online-quiz">
                <div className="landing-update-icon" style={{ backgroundColor: 'rgba(124, 58, 237, 0.12)', color: '#7c3aed' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="14" rx="3"></rect>
                    <path d="M8 10h8"></path>
                    <path d="M10 14h4"></path>
                    <path d="M12 18v2"></path>
                  </svg>
                </div>
                <div className="landing-update-body">
                  <strong>Online Quiz qo'shildi</strong>
                  <span>PIN, QR kod va avatarlar bilan telefon orqali jonli viktorina boshlang.</span>
                </div>
                <svg className="landing-update-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
