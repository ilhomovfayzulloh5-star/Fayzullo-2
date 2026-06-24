import React from 'react';

const Topbar = ({ onMenuClick, title }) => {
  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button type="button" className="mobile-menu-btn" id="mobileMenuBtn" onClick={onMenuClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="page-title" style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
          {title || "Bosh sahifa"}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          type="button" 
          style={{ 
            background: '#eff6ff', 
            border: 'none', 
            position: 'relative', 
            cursor: 'pointer', 
            color: '#2563eb',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span style={{ position: 'absolute', top: '8px', right: '8px', background: '#ef4444', color: '#ffffff', fontSize: '9px', fontWeight: '800', width: '14px', height: '14px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            1
          </span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
