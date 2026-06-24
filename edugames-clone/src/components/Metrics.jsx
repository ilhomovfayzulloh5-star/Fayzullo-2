import React from 'react';

const Metrics = () => {
  return (
    <section className="landing-metrics">
      <div style={{ textAlign: 'center' }}>
        <div className="landing-section-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 20V10M12 20V4M6 20v-6"></path>
          </svg>
          Raqamlarda
        </div>
        <h2 className="landing-section-title">Platformamiz natijalari</h2>
      </div>
      <div className="landing-metrics-grid">
        <div className="landing-metric">
          <div className="number">350K+</div>
          <div className="label">Aktiv foydalanuvchi</div>
        </div>
        <div className="landing-metric">
          <div className="number">16+</div>
          <div className="label">Interaktiv o'yinlar</div>
        </div>
        <div className="landing-metric">
          <div className="number">12+</div>
          <div className="label">Fanlar</div>
        </div>
        <div className="landing-metric">
          <div className="number">17 000 000</div>
          <div className="label">Jami tashriflar</div>
        </div>
      </div>
    </section>
  );
};

export default Metrics;
