/**
 * 🍽️ Pazanchilik Bot — Shaxsiy Oshpaz
 * @Pazanachilikbot
 * 
 * Foydalanuvchi taom nomini yoki masalliqlarni yozadi —
 * bot retseptni topib beradi + YouTube havolasi!
 */

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const fs = require('fs');
const path = require('path');

// ─── Express server (Render uchun) ─────────────────────────────────
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('🍽️ Pazanchilik Bot ishlayapti!'));
app.listen(PORT, () => console.log(`📡 Server port: ${PORT}`));

// ─── Self-ping ─────────────────────────────────────────────────────
const RENDER_URL = process.env.RENDER_EXTERNAL_URL || 'https://pazanachilik-bot.onrender.com';
setInterval(() => {
  const https = require('https');
  const http = require('http');
  const client = RENDER_URL.startsWith('https') ? https : http;
  client.get(RENDER_URL, () => {}).on('error', () => {});
}, 14 * 60 * 1000);

// ─── Retseptlar bazasini yuklash ───────────────────────────────────
let recipesData = { categories: [], recipes: [] };
try {
  const raw = fs.readFileSync(path.join(__dirname, 'recipes.json'), 'utf-8');
  recipesData = JSON.parse(raw);
  console.log(`📚 ${recipesData.recipes.length} ta retsept yuklandi!`);
} catch (err) {
  console.error('❌ recipes.json yuklashda xato:', err.message);
}

// ─── Bot yaratish ──────────────────────────────────────────────────
const token = process.env.BOT_TOKEN;
if (!token) { console.error('❌ BOT_TOKEN topilmadi!'); process.exit(1); }
const bot = new TelegramBot(token, { polling: true });
console.log('🤖 Pazanchilik Bot ishga tushdi!');

// ─── Kirill → Lotin transliteratsiya ──────────────────────────────
const cyrToLat = {
  'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'j',
  'з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o',
  'п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'x','ц':'ts',
  'ч':'ch','ш':'sh','щ':'sh','ъ':'','ы':'i','ь':'','э':'e','ю':'yu',
  'я':'ya','ў':'o\'','қ':'q','ғ':'g\'','ҳ':'h'
};

function toLatin(text) {
  return text.toLowerCase().split('').map(c => cyrToLat[c] || c).join('');
}

// ─── Oshxona nomlari ───────────────────────────────────────────────
const cuisineNames = {
  'uzbek':'🇺🇿 O\'zbek','rus':'🇷🇺 Rus','turk':'🇹🇷 Turk',
  'italyan':'🇮🇹 Italyan','yapon':'🇯🇵 Yapon','kores':'🇰🇷 Kores',
  'meksika':'🇲🇽 Meksika','hind':'🇮🇳 Hind','fransuz':'🇫🇷 Fransuz',
  'gruzin':'🇬🇪 Gruzin','arab':'🇸🇦 Arab','xitoy':'🇨🇳 Xitoy',
  'tayland':'🇹🇭 Tayland','grek':'🇬🇷 Grek','nemis':'🇩🇪 Nemis',
  'xalqaro':'🌍 Xalqaro'
};

// ─── Masalliqlar ro'yxati (aniqlash uchun) ─────────────────────────
const knownIngredients = [
  'go\'sht','go\'sht','gusht','mol','qo\'y','tovuq','baliq',
  'kartoshka','piyoz','sarimsoq','pomidor','sabzi','bodring',
  'baqlajon','qalampir','karam','qovoq','lavlagi','turp',
  'guruch','un','xamir','makaron','sut','tuxum','sariyog\'',
  'pishloq','qaymoq','smetana','yogurt','tvorog',
  'shakar','tuz','murch','zira','asal','sirka',
  'moy','zaytun','limon','yong\'oq','mayiz',
  'ukrop','petirushka','ko\'katlar','bazilik',
  'shokolad','kakao','vanil','loviya','no\'xat','mosh',
  'krevetka','jigar','kolbasa','pekon','non',
  'olma','banan','mango','tarvuz','gilos','uzum',
  'ot','qiyma','dumba','losos','ananas','avokado',
  'ismaloq','brokkoli','qo\'ziqorin','kungjut',
  // kirill variantlar
  'мясо','картошка','лук','помидор','морковь','курица',
  'рыба','яйцо','молоко','масло','мука','рис','сыр','сахар','соль'
];

function isIngredientQuery(text) {
  const words = text.toLowerCase().replace(/,/g, ' ').split(/\s+/).filter(w => w.length > 1);
  if (words.length < 2) return false;
  // Vergul bor — katta ehtimol masalliqlar
  if (text.includes(',')) return true;
  // Bilgan masalliqlardan 2+ tasi bormi
  const matched = words.filter(w => 
    knownIngredients.some(ing => ing.includes(w) || w.includes(ing) || toLatin(w) === toLatin(ing))
  );
  return matched.length >= 2;
}

// ─── Taom nomi bo'yicha qidirish ──────────────────────────────────
function searchByName(query) {
  const q = query.toLowerCase();
  const qLat = toLatin(q);
  
  // Aniq mos kelish
  const exact = recipesData.recipes.filter(r => {
    const name = r.name.toLowerCase();
    return name === q || toLatin(name) === qLat;
  });
  if (exact.length > 0) return exact;
  
  // Qisman mos kelish
  return recipesData.recipes.filter(r => {
    const name = r.name.toLowerCase();
    const nameLat = toLatin(name);
    return name.includes(q) || nameLat.includes(qLat) || q.includes(name) || qLat.includes(nameLat);
  });
}

// ─── Masalliqlar bo'yicha taom topish ─────────────────────────────
function searchByIngredients(text) {
  const words = text.toLowerCase().replace(/,/g, ' ').split(/\s+/).filter(w => w.length > 1);
  const wordsLat = words.map(w => toLatin(w));
  
  // Har bir retseptda nechta masalliq mos kelishini hisoblash
  const scored = recipesData.recipes.map(recipe => {
    let matchCount = 0;
    recipe.ingredients.forEach(ing => {
      const ingLow = ing.toLowerCase();
      const ingLat = toLatin(ingLow);
      words.forEach((word, i) => {
        if (ingLow.includes(word) || ingLat.includes(wordsLat[i]) || ingLow.includes(wordsLat[i])) {
          matchCount++;
        }
      });
    });
    return { recipe, matchCount };
  });
  
  // Eng ko'p mos kelganlarni qaytarish
  return scored
    .filter(s => s.matchCount >= 2)
    .sort((a, b) => b.matchCount - a.matchCount)
    .slice(0, 10)
    .map(s => s.recipe);
}

// ─── Retseptni chiroyli formatlash ─────────────────────────────────
function formatRecipe(recipe) {
  let msg = '';
  
  // Sarlavha
  msg += `🍽️ *${recipe.name.toUpperCase()}*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  // Ma'lumotlar
  if (recipe.cuisine) msg += `🌍 ${cuisineNames[recipe.cuisine] || recipe.cuisine}\n`;
  if (recipe.difficulty) {
    const d = {'oson':'🟢 Oson',"o'rta":'🟡 O\'rta','qiyin':'🔴 Qiyin'};
    msg += `📊 ${d[recipe.difficulty] || recipe.difficulty}\n`;
  }
  if (recipe.prepTime) msg += `⏱ Tayyorlash: ${recipe.prepTime}\n`;
  if (recipe.cookTime) msg += `🔥 Pishirish: ${recipe.cookTime}\n`;
  if (recipe.servings) msg += `👥 ${recipe.servings} kishilik\n`;
  
  // Masalliqlar
  msg += `\n🧾 *KERAKLI MASALLIQLAR:*\n\n`;
  recipe.ingredients.forEach((ing, i) => {
    msg += `  • ${ing}\n`;
  });
  
  // Tayyorlanish jarayoni
  msg += `\n📝 *TAYYORLANISH JARAYONI:*\n`;
  recipe.instructions.forEach((step, i) => {
    msg += `\n*${i + 1}.* ${step}\n`;
  });
  
  // YouTube
  if (recipe.youtube) {
    msg += `\n━━━━━━━━━━━━━━━━━━━━`;
    msg += `\n🎬 *Video retsept:*\n[▶️ YouTube'da ko'rish](${recipe.youtube})`;
  }
  
  msg += `\n\n_Yoqimli ishtaha! 🍽️_`;
  
  return msg;
}

// ─── /start buyrug'i ───────────────────────────────────────────────
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const name = msg.from.first_name || 'do\'stim';

  const welcome = `👨‍🍳 *Salom, ${name}!*

Men sizning *shaxsiy oshpaz*ingizman! 🍽️

✏️ Menga xohlagan taomingiz nomini yozing yoki uyda bor masalliqlarni sanab bering _(masalan: pomidor, tuxum)_, shundan mazali taom retseptini darhol tuzib beraman!

📌 *Misol:*
• _palov_ — palov retseptini beraman
• _шурпа_ — kirill harfda ham ishlaydi
• _go'sht, kartoshka, piyoz_ — masalliqlardan taom topaman

_Ovqat nomini yozing_ 👇`;

  bot.sendMessage(chatId, welcome, { parse_mode: 'Markdown' });
});

// ─── /yordam buyrug'i ──────────────────────────────────────────────
bot.onText(/\/yordam/, (msg) => {
  bot.sendMessage(msg.chat.id, `❓ *Yordam*

✏️ *Taom nomi yozing* — retseptni beraman
✏️ *Masalliqlar yozing* — taom topaman
✏️ *Lotin yoki Kirill* harfda yozing

📌 Misol: _pizza, борщ, tovuq kartoshka piyoz_

_Shunchaki yozing — men topaman!_ 🍽️`, { parse_mode: 'Markdown' });
});

// ═══════════════════════════════════════════════════════════════════
// ASOSIY: Foydalanuvchi xabar yozganda
// ═══════════════════════════════════════════════════════════════════
bot.on('message', (msg) => {
  if (!msg.text || msg.text.startsWith('/')) return;
  
  const chatId = msg.chat.id;
  const text = msg.text.trim();

  if (text.length < 2) return;

  // ─── 1. Masalliqlar yozilganmi tekshirish ───
  if (isIngredientQuery(text)) {
    const results = searchByIngredients(text);
    
    if (results.length > 0) {
      // Eng yaxshi natijani ko'rsatish
      const best = results[0];
      let intro = `👨‍🍳 *Sizning masalliqlaringizdan eng mazali taom:*\n\n`;
      bot.sendMessage(chatId, intro + formatRecipe(best), { 
        parse_mode: 'Markdown',
        disable_web_page_preview: true 
      });
      
      // Agar boshqa variantlar ham bo'lsa
      if (results.length > 1) {
        let more = `\n📋 *Yana boshqa variantlar:*\n\n`;
        results.slice(1, 6).forEach((r, i) => {
          more += `${i + 2}. ${r.emoji || '🍽️'} *${r.name}*\n`;
        });
        more += `\n_Taom nomini yozing — retseptini beraman_`;
        
        setTimeout(() => {
          bot.sendMessage(chatId, more, { parse_mode: 'Markdown' });
        }, 500);
      }
      return;
    }
    
    // Masalliqlardan hech narsa topilmadi
    bot.sendMessage(chatId, 
      `😕 Siz yozgan masalliqlardan mos taom topilmadi.\n\n_Boshqa masalliqlar yozing yoki to'g'ridan-to'g'ri taom nomini yozing._`,
      { parse_mode: 'Markdown' }
    );
    return;
  }

  // ─── 2. Taom nomi bo'yicha qidirish ───
  const results = searchByName(text);

  if (results.length === 1) {
    // Aniq 1 ta natija — retseptni ko'rsatish
    bot.sendMessage(chatId, formatRecipe(results[0]), { 
      parse_mode: 'Markdown',
      disable_web_page_preview: true 
    });
    return;
  }

  if (results.length > 1) {
    // Birinchisini to'liq ko'rsatish
    bot.sendMessage(chatId, formatRecipe(results[0]), { 
      parse_mode: 'Markdown',
      disable_web_page_preview: true 
    });
    
    // Qolganlarini ro'yxat qilib ko'rsatish
    if (results.length > 1) {
      let more = `\n📋 *"${text}" bo'yicha yana topildi:*\n\n`;
      results.slice(1, 8).forEach((r, i) => {
        more += `${i + 2}. ${r.emoji || '🍽️'} *${r.name}*\n`;
      });
      more += `\n_Taom nomini yozing — to'liq retseptini beraman_`;
      
      setTimeout(() => {
        bot.sendMessage(chatId, more, { parse_mode: 'Markdown' });
      }, 500);
    }
    return;
  }

  // ─── 3. Hech narsa topilmadi ───
  // YouTube qidiruviga yo'naltirish
  const youtubeQuery = encodeURIComponent(text + ' retsepti');
  bot.sendMessage(chatId, 
    `😕 *"${text}"* — bazamda topilmadi.\n\nLekin YouTube'dan ko'rishingiz mumkin:\n🎬 [▶️ YouTube'da qidirish](https://www.youtube.com/results?search_query=${youtubeQuery})\n\n_Boshqa taom nomini yozing yoki masalliqlar sanab bering._`,
    { parse_mode: 'Markdown' }
  );
});

// ─── Xatolarni ushlab qolish ──────────────────────────────────────
bot.on('polling_error', (err) => {
  console.error('Polling xatosi:', err.code || err.message);
});

process.on('uncaughtException', (err) => {
  console.error('Kutilmagan xato:', err);
});

console.log('✅ Pazanchilik Bot tayyor — yozing, retseptni topaman!');
