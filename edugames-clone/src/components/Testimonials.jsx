import React from 'react';

const Testimonials = () => {
  return (
    <section className="landing-testimonials">
      <div className="landing-section-badge">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        Fikrlar
      </div>
      <h2 className="landing-section-title">Foydalanuvchilar nima deydi</h2>
      <p className="landing-section-desc">O'quvchilar, o'qituvchilar va ota-onalarning platformamiz haqidagi fikrlari.</p>

      <div className="landing-testimonials-grid">
        {/* Madina */}
        <div className="landing-quote">
          <div className="landing-quote-text">
            "Arqon tortish o'yini bizning sinfimizda eng sevimli faoliyatga aylandi. O'quvchilar savollarga zavq bilan javob berishmoqda!"
          </div>
          <div className="landing-quote-author">
            <div className="landing-quote-avatar" style={{ backgroundColor: '#2563eb' }}>M</div>
            <div>
              <div className="landing-quote-name">Madina</div>
              <div className="landing-quote-role">Biologiya o'qituvchisi</div>
            </div>
          </div>
        </div>

        {/* Aziz */}
        <div className="landing-quote">
          <div className="landing-quote-text">
            "Bayroqlar o'yinida reyting jadvalida 1-o'rinni egallashga harakat qilyapman. Geografiyani shu orqali yaxshi o'rgandim!"
          </div>
          <div className="landing-quote-author">
            <div className="landing-quote-avatar" style={{ backgroundColor: '#10b981' }}>A</div>
            <div>
              <div className="landing-quote-name">Aziz, 15 yosh</div>
              <div className="landing-quote-role">O'quvchi</div>
            </div>
          </div>
        </div>

        {/* Sarvar */}
        <div className="landing-quote">
          <div className="landing-quote-text">
            "AI krossword funksiyasi ajoyib! Mavzu yozdim — bir daqiqada tayyor krossword chiqdi. Dars tayyorgarligim juda tezlashdi."
          </div>
          <div className="landing-quote-author">
            <div className="landing-quote-avatar" style={{ backgroundColor: '#8b5cf6' }}>S</div>
            <div>
              <div className="landing-quote-name">Sarvar</div>
              <div className="landing-quote-role">Tarix o'qituvchisi</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
