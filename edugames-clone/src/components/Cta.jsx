import React from 'react';

const Cta = () => {
  return (
    <section className="landing-cta">
      <h2>Hoziroq o'rganishni boshlang!</h2>
      <p>350K+ aktiv foydalanuvchiga qo'shiling. Bepul ro'yxatdan o'ting va o'yin orqali bilimingizni oshiring.</p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a className="landing-btn primary" href="/register">
          Bepul ro'yxatdan o'tish
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
        <a className="landing-btn ghost" style={{ backgroundColor: 'transparent', borderColor: 'rgba(255, 255, 255, 0.4)', color: '#fff' }} href="/game/">
          O'yinlarni ko'rish
        </a>
      </div>
    </section>
  );
};

export default Cta;
