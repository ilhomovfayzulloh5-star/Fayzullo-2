import React from 'react';

const Teachers = () => {
  return (
    <section className="landing-teachers">
      <div className="landing-section-badge">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        O'qituvchilar uchun
      </div>
      <h2 className="landing-section-title">Darsga tayyorgarlik — tez va oson</h2>
      <p className="landing-section-desc">Mavzu yarating, ishchi varaq tuzing, AI krossword tuzib o'quvchilarga yuborib o'ynating.</p>

      <div className="landing-tools-grid">
        {/* 1 */}
        <div className="landing-tool-card">
          <div className="landing-tool-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}>
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
          <h3>AI Krossword</h3>
          <p>Mavzu kiriting — OpenAI avtomatik krossword tuzadi. Bir daqiqada tayyor.</p>
          <div className="landing-tool-limit">Bepul: 3 ta</div>
        </div>

        {/* 2 */}
        <div className="landing-tool-card">
          <div className="landing-tool-icon" style={{ backgroundColor: 'rgba(37, 99, 235, 0.12)', color: '#2563eb' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="3" width="16" height="18" rx="3" />
              <rect x="7" y="7" width="10" height="3" rx="1" />
              <circle cx="8.5" cy="13.5" r="1.2" />
              <circle cx="12" cy="13.5" r="1.2" />
              <circle cx="15.5" cy="13.5" r="1.2" />
            </svg>
          </div>
          <h3>Ishchi Varaq</h3>
          <p>Savollar yozing, o'quvchilar onlayn to'ldirsin. Natijalarni ko'ring.</p>
          <div className="landing-tool-limit">Bepul: 5 ta</div>
        </div>

        {/* 3 */}
        <div className="landing-tool-card">
          <div className="landing-tool-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <h3>Mavzu Yaratish</h3>
          <p>O'z savollaringizni kiritib shaxsiy baza yarating, arqon o'yinida ishlating.</p>
          <div className="landing-tool-limit">Bepul: 3 ta</div>
        </div>

        {/* 4 */}
        <div className="landing-tool-card">
          <div className="landing-tool-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <h3>Test Tickets</h3>
          <p>Raqamlangan savollar bilan test ticketlari yarating va o'quvchilarga bering.</p>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <a className="landing-btn ghost" href="/dashboard">
          Kontent yaratishni boshlash
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
      </div>
    </section>
  );
};

export default Teachers;
