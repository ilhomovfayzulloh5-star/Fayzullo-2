/**
 * 🍽️ Pazanchilik Bot — 1000 ta Retseptli Telegram Bot
 * @Pazanachilikbot
 * 
 * Buyruqlar:
 *   /start       — Botni ishga tushirish
 *   /kategoriya  — Kategoriyalar ro'yxati
 *   /qidirish    — Retsept qidirish
 *   /tasodifiy   — Tasodifiy retsept
 *   /yordam      — Yordam menyu
 */

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const fs = require('fs');
const path = require('path');

// ─── Express ping server (deploy uchun) ────────────────────────────
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('🍽️ Pazanchilik Bot ishlayapti!'));
app.get('/health', (req, res) => res.json({ status: 'ok', recipes: recipesData.recipes?.length || 0 }));
app.listen(PORT, () => {
  console.log(`📡 Server port: ${PORT} da ishga tushdi`);
});

// ─── Self-ping: Render Free plan da uxlab qolmasligi uchun ─────────
const RENDER_URL = process.env.RENDER_EXTERNAL_URL || 'https://pazanachilik-bot.onrender.com';
setInterval(() => {
  const http = require('http');
  const https = require('https');
  const client = RENDER_URL.startsWith('https') ? https : http;
  client.get(RENDER_URL, (res) => {
    console.log(`🏓 Self-ping: ${res.statusCode} — Bot tirik!`);
  }).on('error', (err) => {
    console.log('🏓 Self-ping xatosi:', err.message);
  });
}, 14 * 60 * 1000); // Har 14 minutda

// ─── Retseptlar bazasini yuklash ───────────────────────────────────
let recipesData = { categories: [], recipes: [] };
try {
  const raw = fs.readFileSync(path.join(__dirname, 'recipes.json'), 'utf-8');
  recipesData = JSON.parse(raw);
  console.log(`📚 ${recipesData.recipes.length} ta retsept yuklandi!`);
  console.log(`📂 ${recipesData.categories.length} ta kategoriya mavjud`);
} catch (err) {
  console.error('❌ recipes.json yuklashda xato:', err.message);
}

// ─── Foydalanuvchi ma'lumotlarini saqlash ──────────────────────────
const USERS_PATH = path.join(__dirname, 'users.json');
let usersData = { users: {} };
try {
  if (fs.existsSync(USERS_PATH)) {
    usersData = JSON.parse(fs.readFileSync(USERS_PATH, 'utf-8'));
  }
} catch (err) {
  console.log('⚠️ users.json yuklashda xato, yangi yaratiladi');
}

function saveUsers() {
  try {
    fs.writeFileSync(USERS_PATH, JSON.stringify(usersData, null, 2), 'utf-8');
  } catch (err) {
    console.error('❌ users.json saqlashda xato:', err.message);
  }
}

function getUser(userId) {
  if (!usersData.users[userId]) {
    usersData.users[userId] = { favorites: [], history: [], created_at: new Date().toISOString() };
    saveUsers();
  }
  return usersData.users[userId];
}

// ─── Bot yaratish ──────────────────────────────────────────────────
const token = process.env.BOT_TOKEN;
if (!token || token === 'YOUR_BOT_TOKEN_HERE') {
  console.error('❌ BOT_TOKEN topilmadi! .env faylga tokenni yozing.');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });
console.log('🤖 Pazanchilik Bot muvaffaqiyatli ishga tushdi!');

// ─── Foydalanuvchi holatlari ───────────────────────────────────────
const userStates = {};

// ─── Sahifa boshiga ITEMS_PER_PAGE ────────────────────────────────
const ITEMS_PER_PAGE = 8;

// ─── Yordamchi funksiyalar ─────────────────────────────────────────
function getRecipesByCategory(categoryId) {
  return recipesData.recipes.filter(r => r.category === categoryId);
}

function getRecipesByLetter(letter) {
  return recipesData.recipes.filter(r => 
    r.name.toUpperCase().startsWith(letter.toUpperCase())
  );
}

function showABC(chatId) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const uzAlphabet = "A B D E F G H I J K L M N O P Q R S T U V X Y Z".split(' ');
  
  let msg = `🔤 *ABC — Harf bo'yicha qidirish*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `_Harfni tanlang — shu harfga boshlanadigan retseptlarni ko'ring_ 👇`;

  const inlineKeyboard = [];
  let row = [];
  
  uzAlphabet.forEach((letter) => {
    const count = getRecipesByLetter(letter).length;
    if (count > 0) {
      row.push({
        text: `${letter} (${count})`,
        callback_data: `abc_${letter}_0`
      });
      if (row.length === 4) {
        inlineKeyboard.push([...row]);
        row = [];
      }
    }
  });
  if (row.length > 0) inlineKeyboard.push(row);

  bot.sendMessage(chatId, msg, {
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: inlineKeyboard }
  });
}

function searchRecipes(query) {
  const q = query.toLowerCase();
  return recipesData.recipes.filter(r => 
    r.name.toLowerCase().includes(q) ||
    r.ingredients.some(ing => ing.toLowerCase().includes(q)) ||
    (r.cuisine && r.cuisine.toLowerCase().includes(q))
  );
}

function getRandomRecipe() {
  const idx = Math.floor(Math.random() * recipesData.recipes.length);
  return recipesData.recipes[idx];
}

function getRecipeById(id) {
  return recipesData.recipes.find(r => r.id === id);
}

function formatRecipe(recipe) {
  let msg = `${recipe.emoji || '🍽️'} *${recipe.name}*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  // Ma'lumotlar
  const cat = recipesData.categories.find(c => c.id === recipe.category);
  if (cat) msg += `📂 *Kategoriya:* ${cat.name}\n`;
  if (recipe.cuisine) {
    const cuisineNames = {
      'uzbek': '🇺🇿 O\'zbek', 'rus': '🇷🇺 Rus', 'turk': '🇹🇷 Turk',
      'italyan': '🇮🇹 Italyan', 'yapon': '🇯🇵 Yapon', 'kores': '🇰🇷 Kores',
      'meksika': '🇲🇽 Meksika', 'hind': '🇮🇳 Hind', 'fransuz': '🇫🇷 Fransuz',
      'gruzin': '🇬🇪 Gruzin', 'arab': '🇸🇦 Arab', 'xitoy': '🇨🇳 Xitoy',
      'tayland': '🇹🇭 Tayland', 'grek': '🇬🇷 Grek', 'nemis': '🇩🇪 Nemis'
    };
    msg += `🌍 *Oshxona:* ${cuisineNames[recipe.cuisine] || recipe.cuisine}\n`;
  }
  if (recipe.difficulty) {
    const diffEmoji = { 'oson': '🟢 Oson', "o'rta": '🟡 O\'rta', 'qiyin': '🔴 Qiyin' };
    msg += `📊 *Qiyinlik:* ${diffEmoji[recipe.difficulty] || recipe.difficulty}\n`;
  }
  if (recipe.prepTime) msg += `⏱️ *Tayyorlash:* ${recipe.prepTime}\n`;
  if (recipe.cookTime) msg += `🔥 *Pishirish:* ${recipe.cookTime}\n`;
  if (recipe.servings) msg += `👥 *Porsiya:* ${recipe.servings} kishi\n`;
  
  msg += `\n🧾 *Masalliqlar:*\n`;
  recipe.ingredients.forEach((ing, i) => {
    msg += `  ${i + 1}. ${ing}\n`;
  });
  
  msg += `\n📝 *Tayyorlash tartibi:*\n`;
  recipe.instructions.forEach((step, i) => {
    msg += `\n*${i + 1}-qadam:* ${step}\n`;
  });
  
  msg += `\n🆔 Retsept #${recipe.id}`;
  
  if (recipe.youtube) {
    msg += `\n\n🎬 [YouTube'da ko'rish](${recipe.youtube})`;
  }
  
  return msg;
}

// ─── Asosiy menyu ──────────────────────────────────────────────────
function getMainKeyboard() {
  return {
    reply_markup: {
      keyboard: [
        ['📂 Kategoriyalar', '🔤 ABC harflar'],
        ['🎲 Tasodifiy retsept', '🔍 Qidirish'],
        ['⭐ Sevimlilar', '📊 Statistika'],
        ['❓ Yordam']
      ],
      resize_keyboard: true
    }
  };
}

// ─── /start buyrug'i ───────────────────────────────────────────────
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const user = msg.from;
  getUser(user.id);
  delete userStates[chatId];

  const totalRecipes = recipesData.recipes.length;
  const totalCategories = recipesData.categories.length;

  const welcome = `🎉 *Salom, ${user.first_name || 'do\'stim'}!*

🍽️ Men — *Pazanchilik Bot*man!

Menda *${totalRecipes}* ta retsept bor, *${totalCategories}* ta kategoriyada!

📂 *Kategoriyalar* — Taom turini tanlang
🎲 *Tasodifiy* — Tasodifiy retsept oling
🔍 *Qidirish* — Nomi yoki masalliq bo'yicha
⭐ *Sevimlilar* — Saqlangan retseptlar
📊 *Statistika* — Bot haqida ma'lumot

_Boshlash uchun quyidagi tugmalardan foydalaning_ 👇`;

  bot.sendMessage(chatId, welcome, {
    parse_mode: 'Markdown',
    ...getMainKeyboard()
  });
});

// ─── /yordam buyrug'i ──────────────────────────────────────────────
bot.onText(/\/yordam/, (msg) => sendHelp(msg.chat.id));

function sendHelp(chatId) {
  const help = `❓ *Yordam — Pazanchilik Bot*

📌 *Buyruqlar:*
/start — Botni qayta ishga tushirish
/kategoriya — Kategoriyalar ro'yxati
/qidirish — Retsept qidirish
/tasodifiy — Tasodifiy retsept olish
/sevimlilar — Sevimli retseptlar
/yordam — Shu yordam sahifasi

📌 *Tugmalar:*
📂 Kategoriyalar — Taom turini tanlang
🎲 Tasodifiy — Tasodifiy retsept
🔍 Qidirish — Nom/masalliq bo'yicha
⭐ Sevimlilar — Saqlangan retseptlar

📌 *Retsept ichida:*
⭐ — Sevimli qilish
🎲 — Yana tasodifiy olish

_Yoqimli ishtaha tilayman!_ 🍽️`;

  bot.sendMessage(chatId, help, { parse_mode: 'Markdown', ...getMainKeyboard() });
}

// ─── Kategoriyalar ─────────────────────────────────────────────────
bot.onText(/\/kategoriya/, (msg) => showCategories(msg.chat.id));

function showCategories(chatId) {
  let msg = `📂 *Kategoriyalar*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;

  const inlineKeyboard = [];
  let row = [];

  recipesData.categories.forEach((cat, i) => {
    const count = getRecipesByCategory(cat.id).length;
    row.push({
      text: `${cat.emoji} ${cat.name.replace(cat.emoji, '').trim()} (${count})`,
      callback_data: `cat_${cat.id}_0`
    });

    if (row.length === 2 || i === recipesData.categories.length - 1) {
      inlineKeyboard.push([...row]);
      row = [];
    }
  });

  msg += `_Kategoriya tanlang — ichidagi retseptlarni ko'ring_ 👇`;

  bot.sendMessage(chatId, msg, {
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: inlineKeyboard }
  });
}

// ─── Qidirish ──────────────────────────────────────────────────────
bot.onText(/\/qidirish/, (msg) => startSearch(msg.chat.id));

function startSearch(chatId) {
  userStates[chatId] = { action: 'awaiting_search' };
  bot.sendMessage(chatId, 
    `🔍 *Retsept qidirish*\n\nTaom nomi yoki masalliq nomini yozing:\n\n_Masalan: "palov", "kartoshka", "shokolad"_`,
    { 
      parse_mode: 'Markdown',
      reply_markup: {
        keyboard: [['❌ Bekor qilish']],
        resize_keyboard: true
      }
    }
  );
}

// ─── Tasodifiy retsept ─────────────────────────────────────────────
bot.onText(/\/tasodifiy/, (msg) => showRandomRecipe(msg.chat.id, msg.from.id));

function showRandomRecipe(chatId, userId) {
  const recipe = getRandomRecipe();
  if (!recipe) {
    bot.sendMessage(chatId, '❌ Retseptlar topilmadi.', getMainKeyboard());
    return;
  }

  // Tarixga qo'shish
  const user = getUser(userId);
  if (!user.history.includes(recipe.id)) {
    user.history.push(recipe.id);
    if (user.history.length > 50) user.history.shift();
    saveUsers();
  }

  const isFav = user.favorites.includes(recipe.id);
  
  bot.sendMessage(chatId, formatRecipe(recipe), {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: isFav ? '💛 Sevimlilardan olish' : '⭐ Sevimlilarga qo\'shish', callback_data: `fav_${recipe.id}` },
        ],
        [
          { text: '🎲 Yana tasodifiy', callback_data: 'random' },
          { text: '📂 Kategoriyalar', callback_data: 'show_categories' }
        ]
      ]
    }
  });
}

// ─── Sevimlilar ────────────────────────────────────────────────────
bot.onText(/\/sevimlilar/, (msg) => showFavorites(msg.chat.id, msg.from.id));

function showFavorites(chatId, userId) {
  const user = getUser(userId);
  
  if (user.favorites.length === 0) {
    bot.sendMessage(chatId, 
      `⭐ *Sevimli retseptlar*\n\n📭 Hali sevimli retseptingiz yo'q.\n\n_Retsept ko'rayotganda ⭐ tugmasini bosing!_`,
      { parse_mode: 'Markdown', ...getMainKeyboard() }
    );
    return;
  }

  let msg = `⭐ *Sevimli retseptlar* (${user.favorites.length} ta)\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;

  const favRecipes = user.favorites
    .map(id => getRecipeById(id))
    .filter(r => r);

  const inlineKeyboard = [];
  favRecipes.slice(0, 15).forEach(recipe => {
    inlineKeyboard.push([{
      text: `${recipe.emoji || '🍽️'} ${recipe.name}`,
      callback_data: `show_${recipe.id}`
    }]);
  });

  msg += `_Retseptni tanlang_ 👇`;

  bot.sendMessage(chatId, msg, {
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: inlineKeyboard }
  });
}

// ─── Statistika ────────────────────────────────────────────────────
bot.onText(/\/statistika/, (msg) => showStats(msg.chat.id, msg.from.id));

function showStats(chatId, userId) {
  const user = getUser(userId);
  const totalRecipes = recipesData.recipes.length;
  const totalCategories = recipesData.categories.length;
  const totalUsers = Object.keys(usersData.users).length;

  let msg = `📊 *Bot Statistikasi*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `🍽️ *Jami retseptlar:* ${totalRecipes} ta\n`;
  msg += `📂 *Kategoriyalar:* ${totalCategories} ta\n`;
  msg += `👥 *Foydalanuvchilar:* ${totalUsers} ta\n\n`;

  msg += `📌 *Sizning ma'lumotlaringiz:*\n`;
  msg += `⭐ Sevimlilar: ${user.favorites.length} ta\n`;
  msg += `📖 Ko'rilgan: ${user.history.length} ta retsept\n\n`;

  // Har bir kategoriya bo'yicha
  msg += `📂 *Kategoriyalar taqsimoti:*\n`;
  recipesData.categories.forEach(cat => {
    const count = getRecipesByCategory(cat.id).length;
    msg += `  ${cat.emoji} ${cat.name.replace(cat.emoji, '').trim()}: ${count} ta\n`;
  });

  msg += `\n_Yoqimli ishtaha!_ 🍽️`;

  bot.sendMessage(chatId, msg, { parse_mode: 'Markdown', ...getMainKeyboard() });
}

// ─── Callback query handler ───────────────────────────────────────
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  const userId = query.from.id;

  // ─── ABC harf bo'yicha qidirish ───
  if (data.startsWith('abc_')) {
    const parts = data.split('_');
    const letter = parts[1];
    const page = parseInt(parts[2]) || 0;
    
    const recipes = getRecipesByLetter(letter);
    
    if (recipes.length === 0) {
      bot.answerCallbackQuery(query.id, { text: `"${letter}" harfida retsept yo'q` });
      return;
    }

    const start = page * ITEMS_PER_PAGE;
    const end = Math.min(start + ITEMS_PER_PAGE, recipes.length);
    const pageRecipes = recipes.slice(start, end);
    const totalPages = Math.ceil(recipes.length / ITEMS_PER_PAGE);

    let msg = `🔤 *"${letter}" harfi bilan boshlanadigan retseptlar*\n`;
    msg += `📊 Jami: ${recipes.length} ta | Sahifa ${page + 1}/${totalPages}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    msg += `_Retseptni tanlang_ 👇`;

    const inlineKeyboard = [];
    pageRecipes.forEach(recipe => {
      inlineKeyboard.push([{
        text: `${recipe.emoji || '🍽️'} ${recipe.name}`,
        callback_data: `show_${recipe.id}`
      }]);
    });

    const navRow = [];
    if (page > 0) navRow.push({ text: '⬅️ Oldingi', callback_data: `abc_${letter}_${page - 1}` });
    if (end < recipes.length) navRow.push({ text: '➡️ Keyingi', callback_data: `abc_${letter}_${page + 1}` });
    if (navRow.length > 0) inlineKeyboard.push(navRow);
    inlineKeyboard.push([{ text: '🔙 ABC harflarga qaytish', callback_data: 'show_abc' }]);

    bot.answerCallbackQuery(query.id);
    bot.editMessageText(msg, {
      chat_id: chatId,
      message_id: query.message.message_id,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: inlineKeyboard }
    }).catch(() => {
      bot.sendMessage(chatId, msg, {
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: inlineKeyboard }
      });
    });
    return;
  }

  // ─── ABC ga qaytish ───
  if (data === 'show_abc') {
    bot.answerCallbackQuery(query.id);
    showABC(chatId);
    return;
  }

  // ─── Kategoriya tanlash ───
  if (data.startsWith('cat_')) {
    const parts = data.split('_');
    const categoryId = parts[1];
    const page = parseInt(parts[2]) || 0;
    
    const recipes = getRecipesByCategory(categoryId);
    const cat = recipesData.categories.find(c => c.id === categoryId);
    
    if (recipes.length === 0) {
      bot.answerCallbackQuery(query.id, { text: 'Bu kategoriyada retsept yo\'q' });
      return;
    }

    const start = page * ITEMS_PER_PAGE;
    const end = Math.min(start + ITEMS_PER_PAGE, recipes.length);
    const pageRecipes = recipes.slice(start, end);
    const totalPages = Math.ceil(recipes.length / ITEMS_PER_PAGE);

    let msg = `${cat.emoji} *${cat.name.replace(cat.emoji, '').trim()}*\n`;
    msg += `📊 Jami: ${recipes.length} ta retsept | Sahifa ${page + 1}/${totalPages}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;

    const inlineKeyboard = [];
    pageRecipes.forEach(recipe => {
      const diff = recipe.difficulty === 'oson' ? '🟢' : recipe.difficulty === "o'rta" ? '🟡' : '🔴';
      inlineKeyboard.push([{
        text: `${recipe.emoji || '🍽️'} ${recipe.name} ${diff}`,
        callback_data: `show_${recipe.id}`
      }]);
    });

    // Pagination tugmalari
    const navRow = [];
    if (page > 0) {
      navRow.push({ text: '⬅️ Oldingi', callback_data: `cat_${categoryId}_${page - 1}` });
    }
    if (end < recipes.length) {
      navRow.push({ text: '➡️ Keyingi', callback_data: `cat_${categoryId}_${page + 1}` });
    }
    if (navRow.length > 0) inlineKeyboard.push(navRow);

    // Orqaga tugmasi
    inlineKeyboard.push([{ text: '🔙 Kategoriyalarga qaytish', callback_data: 'show_categories' }]);

    msg += `_Retseptni tanlang_ 👇`;

    bot.answerCallbackQuery(query.id);
    bot.editMessageText(msg, {
      chat_id: chatId,
      message_id: query.message.message_id,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: inlineKeyboard }
    }).catch(() => {
      bot.sendMessage(chatId, msg, {
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: inlineKeyboard }
      });
    });
    return;
  }

  // ─── Retseptni ko'rsatish ───
  if (data.startsWith('show_')) {
    const recipeId = parseInt(data.replace('show_', ''));
    const recipe = getRecipeById(recipeId);
    
    if (!recipe) {
      bot.answerCallbackQuery(query.id, { text: '❌ Retsept topilmadi' });
      return;
    }

    // Tarixga qo'shish
    const user = getUser(userId);
    if (!user.history.includes(recipe.id)) {
      user.history.push(recipe.id);
      if (user.history.length > 50) user.history.shift();
      saveUsers();
    }

    const isFav = user.favorites.includes(recipe.id);

    bot.answerCallbackQuery(query.id);
    bot.sendMessage(chatId, formatRecipe(recipe), {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: isFav ? '💛 Sevimlilardan olish' : '⭐ Sevimlilarga qo\'shish', callback_data: `fav_${recipe.id}` }
          ],
          [
            { text: '🎲 Tasodifiy', callback_data: 'random' },
            { text: `📂 ${recipesData.categories.find(c => c.id === recipe.category)?.emoji || '📂'} Shu kategoriya`, callback_data: `cat_${recipe.category}_0` }
          ],
          [
            { text: '🔙 Kategoriyalar', callback_data: 'show_categories' }
          ]
        ]
      }
    });
    return;
  }

  // ─── Sevimli qilish ───
  if (data.startsWith('fav_')) {
    const recipeId = parseInt(data.replace('fav_', ''));
    const user = getUser(userId);
    
    const idx = user.favorites.indexOf(recipeId);
    if (idx === -1) {
      user.favorites.push(recipeId);
      bot.answerCallbackQuery(query.id, { text: '⭐ Sevimlilarga qo\'shildi!' });
    } else {
      user.favorites.splice(idx, 1);
      bot.answerCallbackQuery(query.id, { text: '💔 Sevimlilardan olindi' });
    }
    saveUsers();

    // Tugmani yangilash
    const recipe = getRecipeById(recipeId);
    if (recipe) {
      const isFav = user.favorites.includes(recipeId);
      try {
        bot.editMessageReplyMarkup({
          inline_keyboard: [
            [
              { text: isFav ? '💛 Sevimlilardan olish' : '⭐ Sevimlilarga qo\'shish', callback_data: `fav_${recipe.id}` }
            ],
            [
              { text: '🎲 Tasodifiy', callback_data: 'random' },
              { text: `📂 ${recipesData.categories.find(c => c.id === recipe.category)?.emoji || '📂'} Shu kategoriya`, callback_data: `cat_${recipe.category}_0` }
            ],
            [
              { text: '🔙 Kategoriyalar', callback_data: 'show_categories' }
            ]
          ]
        }, {
          chat_id: chatId,
          message_id: query.message.message_id
        });
      } catch (e) { /* ignore */ }
    }
    return;
  }

  // ─── Tasodifiy retsept ───
  if (data === 'random') {
    bot.answerCallbackQuery(query.id, { text: '🎲 Tasodifiy retsept...' });
    showRandomRecipe(chatId, userId);
    return;
  }

  // ─── Kategoriyalarga qaytish ───
  if (data === 'show_categories') {
    bot.answerCallbackQuery(query.id);
    showCategories(chatId);
    return;
  }
});

// ─── Matn xabarlarini qayta ishlash ───────────────────────────────
bot.on('message', (msg) => {
  if (!msg.text || msg.text.startsWith('/')) return;
  
  const chatId = msg.chat.id;
  const text = msg.text.trim();
  const user = msg.from;

  // ─── Bekor qilish ───
  if (text === '❌ Bekor qilish') {
    delete userStates[chatId];
    bot.sendMessage(chatId, '↩️ Bekor qilindi.', getMainKeyboard());
    return;
  }

  // ─── Menyu tugmalari ───
  if (text === '📂 Kategoriyalar') { showCategories(chatId); return; }
  if (text === '🔤 ABC harflar') { showABC(chatId); return; }
  if (text === '🎲 Tasodifiy retsept') { showRandomRecipe(chatId, user.id); return; }
  if (text === '🔍 Qidirish') { startSearch(chatId); return; }
  if (text === '⭐ Sevimlilar') { showFavorites(chatId, user.id); return; }
  if (text === '📊 Statistika') { showStats(chatId, user.id); return; }
  if (text === '❓ Yordam') { sendHelp(chatId); return; }

  // ─── Qidirish holati ───
  const state = userStates[chatId];
  if (state && state.action === 'awaiting_search') {
    delete userStates[chatId];

    if (text.length < 2) {
      bot.sendMessage(chatId, '⚠️ Kamida 2 ta harf kiriting.', getMainKeyboard());
      return;
    }

    const results = searchRecipes(text);

    if (results.length === 0) {
      bot.sendMessage(chatId, 
        `🔍 *"${text}" bo'yicha natija topilmadi*\n\n_Boshqa so'z bilan qidirib ko'ring_`,
        { parse_mode: 'Markdown', ...getMainKeyboard() }
      );
      return;
    }

    let resultMsg = `🔍 *"${text}" bo'yicha topildi: ${results.length} ta*\n`;
    resultMsg += `━━━━━━━━━━━━━━━━━━━━\n\n`;

    const inlineKeyboard = [];
    results.slice(0, 15).forEach(recipe => {
      inlineKeyboard.push([{
        text: `${recipe.emoji || '🍽️'} ${recipe.name}`,
        callback_data: `show_${recipe.id}`
      }]);
    });

    if (results.length > 15) {
      resultMsg += `\n_Faqat dastlabki 15 tasi ko'rsatilmoqda_`;
    }

    bot.sendMessage(chatId, resultMsg, {
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: inlineKeyboard }
    });
    return;
  }
});

// ─── Xatolarni ushlab qolish ──────────────────────────────────────
bot.on('polling_error', (err) => {
  console.error('Polling xatosi:', err.code || err.message);
});

process.on('uncaughtException', (err) => {
  console.error('Kutilmagan xato:', err);
});

console.log('✅ Barcha handlerlar tayyor!');
console.log('🍽️ Pazanchilik Bot tayyor — 1000 ta retsept bilan!');
