import React from 'react';

const HowItWorks = () => {
  return (
    <section className="landing-how">
      <div className="landing-section-badge">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        Qanday ishlaydi
      </div>
      <h2 className="landing-section-title">3 qadamda boshlang</h2>
      <p className="landing-section-desc">O'rganishni boshlash juda oson — atigi bir necha daqiqa kifoya.</p>

      <div className="landing-how-steps">
        <div className="landing-how-step">
          <div className="landing-how-number">1</div>
          <h3>Ro'yxatdan o'tish</h3>
          <p>Email yoki Google akkaunt orqali tez va oson ro'yxatdan o'ting. Bepul boshlang.</p>
        </div>
        <div className="landing-how-step">
          <div className="landing-how-number">2</div>
          <h3>O'yin yoki fanni tanlang</h3>
          <p>16+ o'yin turidan birini, yoki 12+ fan bo'yicha test o'yinini tanlang.</p>
        </div>
        <div className="landing-how-step">
          <div className="landing-how-number">3</div>
          <h3>O'ynang va o'rganing</h3>
          <p>Savolga javob bering, ball to'plang, reyting jadvaliga kiring va bilimingizni mustahkamlang.</p>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <a className="landing-btn ghost" href="/qanday-ishlaydi">
          Batafsil ma'lumot
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
      </div>
    </section>
  );
};

export default HowItWorks;
