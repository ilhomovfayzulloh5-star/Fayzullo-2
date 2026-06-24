const Subjects = ({ onSelectMath, onSelectEnglish, onSelectRussian, onSelectOnaTili, onSelectBiology, onSelectChemistry, onSelectPhysics, onSelectHistory, onSelectGeography, onSelectInformatics, onSelectLiterature, onSelectTurkish }) => {
  return (
    <section className="landing-subjects">
      <div className="landing-section-badge">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
        Fanlar
      </div>
      <h2 className="landing-section-title">O'z faningizni tanlang</h2>
      <p className="landing-section-desc">12 ta fan bo'yicha interaktiv testlar. Har bir fan uchun maxsus savol bazasi bilan.</p>

      <div className="landing-subjects-grid">
        {/* 1. Matematika */}
        <a 
          className="landing-subject-card" 
          href="#matematika"
          onClick={(e) => {
            e.preventDefault();
            if (onSelectMath) onSelectMath();
          }}
        >
          <div className="landing-subject-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
            </svg>
          </div>
          <h4>Matematika</h4>
          <span>Hisoblash mahoratingizni oshiring</span>
        </a>

        {/* 2. Ingliz tili */}
        <a 
          className="landing-subject-card" 
          href="#english"
          onClick={(e) => {
            e.preventDefault();
            if (onSelectEnglish) onSelectEnglish();
          }}
        >
          <div className="landing-subject-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          </div>
          <h4>Ingliz tili</h4>
          <span>So'z va grammatika</span>
        </a>

        {/* 3. Rus tili */}
        <a 
          className="landing-subject-card" 
          href="#rus-tili"
          onClick={(e) => {
            e.preventDefault();
            if (onSelectRussian) onSelectRussian();
          }}
        >
          <div className="landing-subject-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
          <h4>Rus tili</h4>
          <span>Grammatika va lug'at</span>
        </a>

        {/* 4. Ona tili */}
        <a 
          className="landing-subject-card" 
          href="#ona-tili"
          onClick={(e) => {
            e.preventDefault();
            if (onSelectOnaTili) onSelectOnaTili();
          }}
        >
          <div className="landing-subject-icon" style={{ backgroundColor: 'rgba(244, 63, 94, 0.12)', color: '#f43f5e' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h4>Ona tili</h4>
          <span>Imlo va uslub</span>
        </a>

        {/* 5. Biologiya */}
        <a 
          className="landing-subject-card" 
          href="#biology"
          onClick={(e) => {
            e.preventDefault();
            if (onSelectBiology) onSelectBiology();
          }}
        >
          <div className="landing-subject-icon" style={{ backgroundColor: 'rgba(34, 197, 94, 0.12)', color: '#22c55e' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22c-4-3-8-6-8-11a4 4 0 0 1 8 0 4 4 0 0 1 8 0c0 5-4 8-8 11z"></path>
            </svg>
          </div>
          <h4>Biologiya</h4>
          <span>Tirik tabiat</span>
        </a>

        {/* 6. Kimyo */}
        <a 
          className="landing-subject-card" 
          href="#chemistry"
          onClick={(e) => {
            e.preventDefault();
            if (onSelectChemistry) onSelectChemistry();
          }}
        >
          <div className="landing-subject-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 2v8L4 20h16l-6-10V2"></path>
              <line x1="8" y1="2" x2="16" y2="2"></line>
            </svg>
          </div>
          <h4>Kimyo</h4>
          <span>Elementlar va formulalar</span>
        </a>

        {/* 7. Fizika */}
        <a 
          className="landing-subject-card" 
          href="#physics"
          onClick={(e) => {
            e.preventDefault();
            if (onSelectPhysics) onSelectPhysics();
          }}
        >
          <div className="landing-subject-icon" style={{ backgroundColor: 'rgba(14, 165, 233, 0.12)', color: '#0ea5e9' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6m8.5-9h-6m-6 0H2.5"></path>
            </svg>
          </div>
          <h4>Fizika</h4>
          <span>Qonunlar va formulalar</span>
        </a>

        <a 
          className="landing-subject-card" 
          href="#history"
          onClick={(e) => {
            e.preventDefault();
            if (onSelectHistory) onSelectHistory();
          }}
        >
          <div className="landing-subject-icon" style={{ backgroundColor: 'rgba(168, 85, 247, 0.12)', color: '#a855f7' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <h4>Tarix</h4>
          <span>Tarixiy voqealar</span>
        </a>

        {/* 9. Geografiya */}
        <a 
          className="landing-subject-card" 
          href="#geography"
          onClick={(e) => {
            e.preventDefault();
            if (onSelectGeography) onSelectGeography();
          }}
        >
          <div className="landing-subject-icon" style={{ backgroundColor: 'rgba(6, 182, 212, 0.12)', color: '#06b6d4' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"></path>
            </svg>
          </div>
          <h4>Geografiya</h4>
          <span>Xaritalar va mamlakatlar</span>
        </a>

        {/* 10. Informatika */}
        <a 
          className="landing-subject-card" 
          href="#informatics"
          onClick={(e) => {
            e.preventDefault();
            if (onSelectInformatics) onSelectInformatics();
          }}
        >
          <div className="landing-subject-icon" style={{ backgroundColor: 'rgba(99, 102, 241, 0.12)', color: '#6366f1' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </div>
          <h4>Informatika</h4>
          <span>Dasturlash asoslari</span>
        </a>

        {/* 11. Adabiyot */}
        <a 
          className="landing-subject-card" 
          href="#literature"
          onClick={(e) => {
            e.preventDefault();
            if (onSelectLiterature) onSelectLiterature();
          }}
        >
          <div className="landing-subject-icon" style={{ backgroundColor: 'rgba(236, 72, 153, 0.12)', color: '#ec4899' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20l9-5-9-5-9 5 9 5z"></path>
              <path d="M12 12l9-5-9-5-9 5 9 5z"></path>
            </svg>
          </div>
          <h4>Adabiyot</h4>
          <span>Asarlar va mualliflar</span>
        </a>

        {/* 12. Turk tili */}
        <a 
          className="landing-subject-card" 
          href="#turkish"
          onClick={(e) => {
            e.preventDefault();
            if (onSelectTurkish) onSelectTurkish();
          }}
        >
          <div className="landing-subject-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3 6 6 .9-4.5 4.3 1 6.8-5.5-3-5.5 3 1-6.8L3 8.9 9 8l3-6z"></path>
            </svg>
          </div>
          <h4>Turk tili</h4>
          <span>Lug'at va grammatika</span>
        </a>
      </div>

      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <a className="landing-btn ghost" href="/game/">
          Barcha o'yinlarni ko'rish
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
      </div>
    </section>
  );
};

export default Subjects;
