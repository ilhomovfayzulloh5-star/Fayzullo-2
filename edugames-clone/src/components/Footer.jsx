import React from 'react';

const Footer = ({ onSelectOnline, onSelectMemory, onSelectFlags }) => {
  return (
    <footer className="landing-footer">
      <div className="landing-footer-grid">
        <div>
          <div className="landing-footer-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="48" fill="#ffffff" />
              <path d="M42 22V68H52C59.732 68 66 61.732 66 54C66 46.268 59.732 40 52 40H48V22H42ZM48 48H52C55.3137 48 58 50.6863 58 54C58 57.3137 55.3137 60 52 60H48V48Z" fill="#2563eb" />
            </svg>
            <span style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', fontFamily: "'Manrope', sans-serif", letterSpacing: '-0.5px' }}>
              bilimdon<span style={{ color: '#60a5fa' }}>.uz</span>
            </span>
          </div>
          <p style={{ color: '#94a3b8', marginTop: '12px', fontSize: '14px' }}>
            Bolalar va talabalar uchun o'yin orqali o'rganish platformasi.
          </p>
          <div className="landing-footer-social">
            {/* Telegram */}
            <a className="landing-social-link" href="https://t.me/edugameschat" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
              <svg viewBox="0 0 496 512" fill="currentColor" aria-hidden="true" style={{ width: '18px', height: '18px' }}>
                <path d="M248,8C111.033,8,0,119.033,0,256S111.033,504,248,504,496,392.967,496,256,384.967,8,248,8ZM362.952,176.66c-3.732,39.215-19.881,134.378-28.1,178.3-3.476,18.584-10.322,24.816-16.948,25.425-14.4,1.326-25.338-9.517-39.287-18.661-21.827-14.308-34.158-23.215-55.346-37.177-24.485-16.135-8.612-25,5.342-39.5,3.652-3.793,67.107-61.51,68.335-66.746.153-.655.3-3.1-1.154-4.384s-3.59-.849-5.135-.5q-3.283.746-104.608,69.142-14.845,10.194-26.894,9.934c-8.855-.191-25.888-5.006-38.551-9.123-15.531-5.048-27.875-7.717-26.8-16.291q.84-6.7,18.45-13.7,108.446-47.248,144.628-62.3c68.872-28.647,83.183-33.623,92.511-33.789,2.052-.034,6.639.474,9.61,2.885a10.452,10.452,0,0,1,3.53,6.716A43.765,43.765,0,0,1,362.952,176.66Z" />
              </svg>
            </a>
            {/* Instagram */}
            <a className="landing-social-link" href="https://instagram.com/norinjon_boltaboev" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ width: '18px', height: '18px' }}>
                <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm10 2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-5 3.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 2a1.8 1.8 0 1 0 1.8 1.8A1.8 1.8 0 0 0 12 10.2zm4.4-3.3a.9.9 0 1 1-.9-.9.9.9 0 0 1 .9.9z" />
              </svg>
            </a>
            {/* YouTube */}
            <a className="landing-social-link" href="https://www.youtube.com/@norinjonboltaboev7874" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ width: '18px', height: '18px' }}>
                <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.5.4a3 3 0 0 0-2.1 2.1A31.2 31.2 0 0 0 2 12a31.2 31.2 0 0 0 .4 4.8 3 3 0 0 0 2.1 2.1c1.7.4 7.5.4 7.5.4s5.8 0 7.5-.4a3 3 0 0 0 2.1-2.1A31.2 31.2 0 0 0 22 12a31.2 31.2 0 0 0-.4-4.8zM10 15.2V8.8L15.2 12 10 15.2z" />
              </svg>
            </a>
            {/* Facebook */}
            <a className="landing-social-link" href="https://www.facebook.com/norinjonboltaboev1" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ width: '18px', height: '18px' }}>
                <path d="M13.4 9.2V7.3c0-.8.5-1 1-1h1.8V3.5h-2.5c-2.6 0-4 1.6-4 4.1v1.6H7.5v2.7h2.2V21h2.7v-9.1h2.2l.4-2.7h-2.6z" />
              </svg>
            </a>
            {/* X */}
            <a className="landing-social-link" href="https://x.com/usmir_n" target="_blank" rel="noopener noreferrer" aria-label="X">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ width: '18px', height: '18px' }}>
                <path d="M18.244 2H21.552L14.33 10.26L22.823 22H16.176L10.97 14.894L4.74 22H1.43L9.16 13.15L1 2H7.82L12.53 8.46L18.244 2ZM17.08 20H18.91L6.82 4H4.85L17.08 20Z" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <div className="landing-footer-title">Tezkor havolalar</div>
          <div className="landing-footer-links">
            <a href="/">Bosh sahifa</a>
            <a href="/game/">Bepul o'yinlar</a>
            <a 
              href="/game/online"
              onClick={(e) => {
                e.preventDefault();
                if (onSelectOnline) onSelectOnline();
              }}
            >
              Onlayn o'yin
            </a>
            <a href="/qanday-ishlaydi">Qanday ishlaydi</a>
            <a href="/haqida">Haqida</a>
            <a href="/aloqa">Aloqa</a>
          </div>
        </div>

        <div>
          <div className="landing-footer-title">O'yinlar</div>
          <div className="landing-footer-links">
            <a href="/game/arqon/">Matematika</a>
            <a 
              href="/game/memory/"
              onClick={(e) => {
                e.preventDefault();
                if (onSelectMemory) onSelectMemory();
              }}
            >
              Xotira O'yini
            </a>
            <a 
              href="/game/flags/"
              onClick={(e) => {
                e.preventDefault();
                if (onSelectFlags) onSelectFlags();
              }}
            >
              Bayroqlar
            </a>
            <a href="/game/colors/">Ranglar</a>
          </div>
        </div>

        <div>
          <div className="landing-footer-title">Huquqiy</div>
          <div className="landing-footer-links">
            <a href="/maxfiylik-siyosati">Maxfiylik siyosati</a>
            <a href="/foydalanish-shartlari">Foydalanish shartlari</a>
          </div>
        </div>
      </div>

      <div className="landing-footer-bottom">
        <span>&copy; 2025 - 2026 Bilimdon.uz. Barcha huquqlar himoyalangan.</span>
        <span>Aloqa: bilimdonuz@gmail.com</span>
      </div>
    </footer>
  );
};

export default Footer;
