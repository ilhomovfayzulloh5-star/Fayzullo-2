import React from 'react';

const Faq = () => {
  return (
    <section className="landing-faq">
      <div className="landing-section-badge">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        FAQ
      </div>
      <h2 className="landing-section-title">Ko'p beriladigan savollar</h2>
      <p className="landing-section-desc">Bilimdon.uz'dan foydalanish, o'yinlar, tariflar va o'qituvchilar uchun imkoniyatlar bo'yicha eng muhim savollarga javoblar.</p>

      <div className="landing-faq-list">
        {/* 1 */}
        <details className="landing-faq-item">
          <summary>Bilimdon.uz qanday platforma?</summary>
          <div className="landing-faq-answer">
            Bilimdon.uz — o'yin orqali ta'lim berishga mo'ljallangan platforma. 16+ interaktiv o'yin, 12+ fan bo'yicha test, real vaqtda onlayn raqobat va AI krossword yaratish imkoniyatlari mavjud.
          </div>
        </details>

        {/* 2 */}
        <details className="landing-faq-item">
          <summary>Qaysi o'yinlar mavjud?</summary>
          <div className="landing-faq-answer">
            Platformada Arqon Tortish (jamoaviy), Online o'yin (real vaqtda), Xotira, Bayroqlar, Ranglar, Matematika va 12 ta fan bo'yicha quiz o'yinlari mavjud. Barcha o'yinlar va fanlar "O'yinlar" bo'limida joylashgan.
          </div>
        </details>

        {/* 3 */}
        <details className="landing-faq-item">
          <summary>Online o'yin qanday ishlaydi?</summary>
          <div className="landing-faq-answer">
            Xona yarating — kod yoki QR kod hosil bo'ladi. Do'stlaringiz shu kod bilan xonaga kiradi. 2 jamoa — Ko'k va Qizil — real vaqtda savollarga javob berib arqon tortishadi. Matematika rejimida qiyinlik darajasini ham tanlashingiz mumkin.
          </div>
        </details>

        {/* 4 */}
        <details className="landing-faq-item">
          <summary>Ro'yxatdan o'tish va kirish qanday amalga oshadi?</summary>
          <div className="landing-faq-answer">
            Email orqali ro'yxatdan o'tib tasdiqlash bosqichini o'tasiz. Bundan tashqari Google akkaunt orqali bir klikda tez kirish ham mavjud. Ro'yxatdan o'tgach, dashboard orqali o'yin va materiallarga o'tasiz.
          </div>
        </details>

        {/* 5 */}
        <details className="landing-faq-item">
          <summary>Platforma bepulmi yoki pullikmi?</summary>
          <div className="landing-faq-answer">
            Asosiy o'yinlar va funksiyalardan bepul foydalanish mumkin. Kontent yaratishda (krossword, ishchi varaq, mavzu) bepul limitlar mavjud. Kengaytirilgan imkoniyatlar uchun qulay obuna paketlari mavjud — "Tariflar" bo'limiga qarang.
          </div>
        </details>

        {/* 6 */}
        <details className="landing-faq-item">
          <summary>O'qituvchilar uchun qanday imkoniyatlar bor?</summary>
          <div className="landing-faq-answer">
            O'qituvchilar AI krossword, ishchi varaq va mavzu yaratishi mumkin. Shuningdek, arqon o'yini uchun o'z savollar bazasini tuzib, sinf bilan birga o'ynashi mumkin. Online o'yin rejimi ham sinf uchun ideal.
          </div>
        </details>

        {/* 7 */}
        <details className="landing-faq-item">
          <summary>Reyting tizimi qanday ishlaydi?</summary>
          <div className="landing-faq-answer">
            Xotira, Bayroqlar va Ranglar o'yinlarida global leaderboard mavjud. O'yin natijangiz avtomatik reyting jadvaliga tushadi. Rekordi kim qo'yganini ko'rib, uni yangilashga harakat qilishingiz mumkin.
          </div>
        </details>

        {/* 8 */}
        <details className="landing-faq-item">
          <summary>To'lov va obuna jarayoni qanday ishlaydi?</summary>
          <div className="landing-faq-answer">
            Tarif tanlash va to'lovlar maxsus bo'lim orqali amalga oshadi. Click to'lov tizimi qo'llaniladi. Obuna holati va amal qilish muddati akkaunt ichida ko'rinadi, muddat tugashidan oldin yangilash imkoniyati mavjud.
          </div>
        </details>

        {/* 9 */}
        <details className="landing-faq-item">
          <summary>Muammo yoki savol bo'lsa qayerga murojaat qilaman?</summary>
          <div className="landing-faq-answer">
            Platformadagi Support bo'limi orqali murojaat yuborishingiz mumkin. Har bir murojaat uchun alohida ticket ochiladi, fayl biriktirish imkoniyati ham bor. Ko'rib chiqish holatini akkaunt ichida kuzatib borasiz.
          </div>
        </details>

        {/* 10 */}
        <details className="landing-faq-item">
          <summary>Qaysi qurilmalarda ishlaydi?</summary>
          <div className="landing-faq-answer">
            Bilimdon.uz zamonaviy brauzerlarda telefon, planshet va kompyuterlarda ishlaydi. Barqaror internet aloqasi bo'lsa, platformadan to'liq va qulay foydalanish mumkin.
          </div>
        </details>
      </div>
    </section>
  );
};

export default Faq;
