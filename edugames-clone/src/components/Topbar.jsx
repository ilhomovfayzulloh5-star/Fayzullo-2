import React from 'react';

const Topbar = ({ onMenuClick }) => {
  return (
    <header className="topbar">
      <button type="button" className="mobile-menu-btn" id="mobileMenuBtn" onClick={onMenuClick}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="page-title">
        Bosh sahifa
      </div>
    </header>
  );
};

export default Topbar;
