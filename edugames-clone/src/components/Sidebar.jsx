import React, { useState } from 'react';

const Sidebar = ({ isOpen, onSelectOnline }) => {
  const [isMateriallarOpen, setIsMateriallarOpen] = useState(false);
  const [isMetodlarOpen, setIsMetodlarOpen] = useState(false);

  return (
    <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`} id="sidebar">
      <div className="sidebar-header">
        <a href="/" className="brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="34" height="34" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="48" fill="#1e293b" />
            <path d="M42 22V68H52C59.732 68 66 61.732 66 54C66 46.268 59.732 40 52 40H48V22H42ZM48 48H52C55.3137 48 58 50.6863 58 54C58 57.3137 55.3137 60 52 60H48V48Z" fill="white" />
          </svg>
          <span style={{ fontSize: '21px', fontWeight: '800', color: '#0f172a', fontFamily: "'Manrope', sans-serif", letterSpacing: '-0.5px' }}>
            bilimdon<span style={{ color: '#2563eb' }}>.uz</span>
          </span>
        </a>
      </div>

      <nav className="sidebar-nav">
        <a href="/" className="nav-link active">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span className="nav-text">Bosh sahifa</span>
        </a>

        {/* Materiallar */}
        <div className={`nav-dropdown ${isMateriallarOpen ? 'open' : ''}`}>
          <button 
            type="button" 
            className="nav-dropdown-toggle" 
            onClick={() => setIsMateriallarOpen(!isMateriallarOpen)}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14"></path>
                <path d="M5 12h14"></path>
                <rect x="3" y="3" width="18" height="18" rx="4"></rect>
              </svg>
              <span className="nav-text">Materiallar</span>
            </span>
            <svg className="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div className="nav-dropdown-menu">
            <a href="/login" rel="nofollow" className="nav-sublink guest-auth-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="3" width="16" height="18" rx="3"></rect>
                <rect x="7" y="7" width="10" height="3" rx="1"></rect>
                <circle cx="8.5" cy="13.5" r="1.2"></circle>
                <circle cx="12" cy="13.5" r="1.2"></circle>
                <circle cx="15.5" cy="13.5" r="1.2"></circle>
              </svg>
              <span className="nav-text">Ishchi varaq</span>
            </a>
            <a href="/login" rel="nofollow" className="nav-sublink guest-auth-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="14" rx="3"></rect>
                <path d="M7 8h10"></path>
                <path d="M7 12h6"></path>
              </svg>
              <span className="nav-text">Topshiriqlar</span>
            </a>
            <a href="/login" rel="nofollow" className="nav-sublink guest-auth-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="8" height="8" rx="1"></rect>
                <rect x="13" y="3" width="8" height="8" rx="1"></rect>
                <rect x="3" y="13" width="8" height="8" rx="1"></rect>
                <rect x="13" y="13" width="8" height="8" rx="1"></rect>
              </svg>
              <span className="nav-text">Krossword</span>
            </a>
          </div>
        </div>

        {/* Metodlar */}
        <div className={`nav-dropdown ${isMetodlarOpen ? 'open' : ''}`}>
          <button 
            type="button" 
            className="nav-dropdown-toggle" 
            onClick={() => setIsMetodlarOpen(!isMetodlarOpen)}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="6" width="20" height="12" rx="3"></rect>
                <line x1="6" y1="12" x2="10" y2="12"></line>
                <line x1="8" y1="10" x2="8" y2="14"></line>
                <circle cx="16" cy="11" r="1"></circle>
                <circle cx="18" cy="13" r="1"></circle>
              </svg>
              <span className="nav-text">Metodlar</span>
            </span>
            <svg className="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div className="nav-dropdown-menu">
            <a href="/game/" className="nav-sublink">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-2-2h-6l-2 2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"></path>
                <circle cx="8.5" cy="13.5" r="1.5"></circle>
                <circle cx="15.5" cy="13.5" r="1.5"></circle>
              </svg>
              <span className="nav-text">Bepul o'yinlar</span>
            </a>
            <a 
              href="/game/online" 
              className="nav-sublink"
              onClick={(e) => {
                e.preventDefault();
                if (onSelectOnline) onSelectOnline();
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 8v4l3 3"></path>
              </svg>
              <span className="nav-text">Online o'ynash</span>
            </a>
            <a href="/login" rel="nofollow" className="nav-sublink guest-auth-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
              <span className="nav-text">Arqon tortish</span>
            </a>
            <a href="/login" rel="nofollow" className="nav-sublink guest-auth-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6 9 17 4 12"></path>
                <path d="M14 6h6"></path>
                <path d="M14 12h6"></path>
              </svg>
              <span className="nav-text">To'g'ri | Noto'g'ri</span>
            </a>
            <a href="/login" rel="nofollow" className="nav-sublink guest-auth-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2a7 7 0 0 1 7 7c0 2.4-1.28 4.5-3.2 5.72V17a2 2 0 0 1-2 2h-3.6a2 2 0 0 1-2-2v-2.28A7 7 0 0 1 5 9a7 7 0 0 1 7-7Z"></path>
                <path d="M9 22h6"></path>
              </svg>
              <span className="nav-text">Viktorina</span>
            </a>
            <a href="/game/online-quiz" className="nav-sublink">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                <path d="M9 9h6"></path>
                <path d="M9 13h6"></path>
                <path d="M9 17h4"></path>
              </svg>
              <span className="nav-text">Online Quiz</span>
            </a>
            <a href="/login" rel="nofollow" className="nav-sublink guest-auth-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="7" cy="7" r="3"></circle>
                <circle cx="17" cy="17" r="3"></circle>
                <path d="M9.5 9.5l5 5"></path>
                <path d="M14.5 9.5l-5 5"></path>
              </svg>
              <span className="nav-text">Juftini top</span>
            </a>
            <a href="/login" rel="nofollow" className="nav-sublink guest-auth-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7" rx="1"></rect>
                <rect x="14" y="3" width="7" height="7" rx="1"></rect>
                <rect x="3" y="14" width="7" height="7" rx="1"></rect>
                <rect x="14" y="14" width="7" height="7" rx="1"></rect>
              </svg>
              <span className="nav-text">Guruhlash</span>
            </a>
            <a href="/login" rel="nofollow" className="nav-sublink guest-auth-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
              <span className="nav-text">Bilet </span>
            </a>
            <a href="/login" rel="nofollow" className="nav-sublink guest-auth-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M12 7v5l3 3"></path>
              </svg>
              <span className="nav-text">Random</span>
            </a>
          </div>
        </div>

        <a href="/plans" className="nav-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 12V7a2 2 0 0 0-2-2h-5l-7 7 5 5 7-7z"></path>
            <circle cx="16" cy="8" r="1"></circle>
          </svg>
          <span className="nav-text">Tariflar</span>
        </a>

        <div style={{ margin: '8px 0', borderTop: '1px solid #e5e7eb' }}></div>

        <a href="/login" className="nav-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span className="nav-text">Kirish</span>
        </a>

        <a href="/register" className="nav-link nav-link-register">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <line x1="19" y1="8" x2="19" y2="14"></line>
            <line x1="22" y1="11" x2="16" y2="11"></line>
          </svg>
          <span className="nav-text">Ro'yxatdan o'tish</span>
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;
