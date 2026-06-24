import React from 'react';

const OnlineSection = ({ onSelectOnline }) => {
  return (
    <section className="landing-online">
      <div className="landing-online-grid">
        <div>
          <div className="landing-section-badge" style={{ color: '#0ea5e9' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="2"></circle>
              <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path>
            </svg>
            Real vaqt · Onlayn
          </div>
          <h2 className="landing-section-title">Online O'yin</h2>
          <p className="landing-section-desc">Arqon tortish o'yinini do'stlaringiz yoki butun sinfingiz bilan real vaqtda o'ynang.</p>

          <ul className="landing-online-features">
            <li>QR kod orqali xonaga tez ulanish</li>
            <li>Xona kodi yaratish va ulashish</li>
            <li>Ko'k va qizil — 2 jamoa formati</li>
            <li>Matematika rejimi: oson, o'rta, qiyin</li>
            <li>1, 3 yoki 5 daqiqalik o'yin vaqti</li>
            <li>Barcha fan bo'yicha savollar</li>
          </ul>

          <a 
            className="landing-btn primary" 
            href="/game/online"
            onClick={(e) => {
              e.preventDefault();
              if (onSelectOnline) onSelectOnline();
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Onlayn o'yinni boshlash
          </a>
        </div>

        <div>
          <div className="online-demo-card">
            <div className="online-demo-header">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="6" width="20" height="12" rx="3" />
                  <line x1="6" y1="12" x2="10" y2="12" />
                  <line x1="8" y1="10" x2="8" y2="14" />
                  <circle cx="16" cy="11" r="1" />
                  <circle cx="18" cy="13" r="1" />
                </svg>
                Xona kodi
              </span>
              <span className="online-demo-code">EDU-427</span>
            </div>
            <div className="online-demo-teams">
              <div className="online-demo-team blue">Ko'k jamoa</div>
              <div className="online-demo-vs">VS</div>
              <div className="online-demo-team red">Qizil jamoa</div>
            </div>
            <div className="online-demo-rope"></div>
            <div className="online-demo-status" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Real vaqtda o'yin davom etmoqda...
            </div>
            <div className="online-demo-qr">
              <div className="online-demo-qr-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              </div>
              <div className="online-demo-qr-text">
                <strong style={{ color: 'var(--landing-text)' }}>QR kod bilan ulanish</strong><br />
                Telefoningiz kamerasini tutib xonaga kiring
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OnlineSection;
