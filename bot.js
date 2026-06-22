/**
 * 📅 Kun Tartibi Bot — Vazifalar va Eslatmalar Telegram Bot
 * 
 * Buyruqlar:
 *   /start       — Botni ishga tushirish
 *   /yangi       — Yangi vazifa qo'shish
 *   /bugun       — Bugungi vazifalar
 *   /barcha      — Barcha aktiv vazifalar
 *   /bajarilgan  — Bajarilgan vazifalar
 *   /statistika  — Haftalik/oylik statistika
 *   /yordam      — Yordam menyu
 */

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cron = require('node-cron');
const {
  upsertUser,
  insertTask,
  getTaskById,
  getTodayTasks,
  getAllActiveTasks,
  getCompletedTasks,
  completeTask,
  deleteTask,
  updateTaskTitle,
  getTasksByCategory,
  getWeekStats,
  getMonthStats,
  getCategoryStats,
  getTotalCompleted,
  insertReminder,
  getActiveReminders,
  deactivateReminder,
  getRemindersForUser
} = require('./database');

// ─── Express ping server (deploy uchun) ────────────────────────────
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('📅 Kun Tartibi Bot ishlayapti!'));
app.listen(PORT, () => {
  console.log(`📡 Server port: ${PORT} da ishga tushdi`);
});

// ─── Bot yaratish ──────────────────────────────────────────────────
const token = process.env.BOT_TOKEN;
if (!token || token === 'YOUR_BOT_TOKEN_HERE') {
  console.error('❌ BOT_TOKEN topilmadi! .env faylga tokenni yozing.');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });
console.log('🤖 Kun Tartibi Bot muvaffaqiyatli ishga tushdi!');

// ─── Foydalanuvchi holatlari ───────────────────────────────────────
const userStates = {};

// ─── Konstantalar ──────────────────────────────────────────────────
const CATEGORIES = {
  'ish': '💼 Ish',
  'oqish': '📚 O\'qish',
  'shaxsiy': '🏠 Shaxsiy',
  'xarid': '🛒 Xarid',
  'sport': '🏋️ Sport',
  'boshqa': '📌 Boshqa'
};

const PRIORITIES = {
  'yuqori': '🔴 Yuqori',
  'orta': '🟡 O\'rta',
  'past': '🟢 Past'
};

const PRIORITY_EMOJI = {
  'yuqori': '🔴',
  'orta': '🟡',
  'past': '🟢'
};

const CATEGORY_EMOJI = {
  'ish': '💼',
  'oqish': '📚',
  'shaxsiy': '🏠',
  'xarid': '🛒',
  'sport': '🏋️',
  'boshqa': '📌'
};

// ─── Bugungi sanani olish ──────────────────────────────────────────
function getTodayDate() {
  const now = new Date();
  // UTC+5 (Tashkent)
  const tashkent = new Date(now.getTime() + 5 * 60 * 60 * 1000);
  return tashkent.toISOString().split('T')[0];
}

function getCurrentTime() {
  const now = new Date();
  const tashkent = new Date(now.getTime() + 5 * 60 * 60 * 1000);
  return tashkent.toISOString().split('T')[1].substring(0, 5);
}

// ─── Asosiy menyu ──────────────────────────────────────────────────
function getMainKeyboard() {
  return {
    reply_markup: {
      keyboard: [
        ['➕ Yangi vazifa', '📋 Bugungi vazifalar'],
        ['📂 Barcha vazifalar', '✅ Bajarilganlar'],
        ['📊 Statistika', '❓ Yordam']
      ],
      resize_keyboard: true
    }
  };
}

// ─── /start buyrug'i ───────────────────────────────────────────────
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const user = msg.from;
  
  // Foydalanuvchini bazaga saqlash
  upsertUser(user.id, user.username || '', user.first_name || '');
  
  // Holatni tozalash
  delete userStates[chatId];

  const welcome = `🎉 *Salom, ${user.first_name || 'do\'stim'}!*

📅 Men — *Kun Tartibi Bot*man!

Men sizga kunlik vazifalaringizni tartibga solishda yordam beraman:

➕ *Yangi vazifa* — Vazifa qo'shish
📋 *Bugungi* — Bugungi vazifalar ro'yxati
📂 *Barchasi* — Barcha aktiv vazifalar
✅ *Bajarilgan* — Yakunlangan vazifalar
📊 *Statistika* — Haftalik/oylik hisobot
⏰ *Eslatmalar* — Vaqtli eslatmalar

_Boshlash uchun quyidagi tugmalardan foydalaning_ 👇`;

  bot.sendMessage(chatId, welcome, {
    parse_mode: 'Markdown',
    ...getMainKeyboard()
  });
});

// ─── /yordam buyrug'i ──────────────────────────────────────────────
bot.onText(/\/yordam/, (msg) => {
  sendHelp(msg.chat.id);
});

function sendHelp(chatId) {
  const help = `❓ *Yordam — Kun Tartibi Bot*

📌 *Buyruqlar:*
/start — Botni qayta ishga tushirish
/yangi — Yangi vazifa qo'shish
/bugun — Bugungi vazifalar
/barcha — Barcha aktiv vazifalar
/bajarilgan — Bajarilgan vazifalar
/statistika — Haftalik statistika
/yordam — Shu yordam sahifasi

📌 *Tugmalar:*
Har bir vazifada ✅ (bajarish), ✏️ (tahrirlash), 🗑 (o'chirish) tugmalari bor.

📌 *Kategoriyalar:*
💼 Ish | 📚 O'qish | 🏠 Shaxsiy
🛒 Xarid | 🏋️ Sport | 📌 Boshqa

📌 *Ustuvorlik:*
🔴 Yuqori | 🟡 O'rta | 🟢 Past

_Savolingiz bo'lsa, /start tugmasini bosing_ 🔄`;

  bot.sendMessage(chatId, help, { parse_mode: 'Markdown', ...getMainKeyboard() });
}

// ─── Yangi vazifa qo'shish ─────────────────────────────────────────
bot.onText(/\/yangi/, (msg) => {
  startNewTask(msg.chat.id, msg.from);
});

function startNewTask(chatId, user) {
  upsertUser(user.id, user.username || '', user.first_name || '');
  
  userStates[chatId] = {
    action: 'awaiting_task_title',
    userId: user.id,
    messagesToDelete: []  // Oraliq xabarlarni kuzatish
  };

  bot.sendMessage(chatId, 
    '✏️ *Yangi vazifa*\n\nVazifa nomini yozing:', 
    { 
      parse_mode: 'Markdown',
      reply_markup: {
        keyboard: [['❌ Bekor qilish']],
        resize_keyboard: true
      }
    }
  ).then(sent => {
    if (userStates[chatId]) userStates[chatId].messagesToDelete.push(sent.message_id);
  });
}

// ─── Kategoriya tanlash ────────────────────────────────────────────
function askCategory(chatId) {
  userStates[chatId].action = 'awaiting_category';

  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '💼 Ish', callback_data: 'cat_ish' },
          { text: '📚 O\'qish', callback_data: 'cat_oqish' }
        ],
        [
          { text: '🏠 Shaxsiy', callback_data: 'cat_shaxsiy' },
          { text: '🛒 Xarid', callback_data: 'cat_xarid' }
        ],
        [
          { text: '🏋️ Sport', callback_data: 'cat_sport' },
          { text: '📌 Boshqa', callback_data: 'cat_boshqa' }
        ]
      ]
    }
  };

  bot.sendMessage(chatId, '🏷️ *Kategoriya tanlang:*', { parse_mode: 'Markdown', ...keyboard }).then(sent => {
    if (userStates[chatId]) userStates[chatId].messagesToDelete.push(sent.message_id);
  });
}

// ─── Ustuvorlik tanlash ────────────────────────────────────────────
function askPriority(chatId) {
  userStates[chatId].action = 'awaiting_priority';

  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🔴 Yuqori', callback_data: 'pri_yuqori' },
          { text: '🟡 O\'rta', callback_data: 'pri_orta' },
          { text: '🟢 Past', callback_data: 'pri_past' }
        ]
      ]
    }
  };

  bot.sendMessage(chatId, '⚡ *Ustuvorlik darajasini tanlang:*', { parse_mode: 'Markdown', ...keyboard }).then(sent => {
    if (userStates[chatId]) userStates[chatId].messagesToDelete.push(sent.message_id);
  });
}

// ─── Muddat so'rash ────────────────────────────────────────────────
function askDueDate(chatId) {
  userStates[chatId].action = 'awaiting_due_date';

  const today = getTodayDate();
  const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000)
    .toISOString().split('T')[0];

  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '📅 Bugun', callback_data: `date_${today}` },
          { text: '📅 Ertaga', callback_data: `date_${tomorrow}` }
        ],
        [
          { text: '⏭️ Muddatsiz', callback_data: 'date_none' }
        ]
      ]
    }
  };

  bot.sendMessage(chatId, '📅 *Muddatni tanlang:*\n\n_Yoki YYYY-MM-DD formatida yozing (masalan: 2026-06-25)_', 
    { parse_mode: 'Markdown', ...keyboard }
  ).then(sent => {
    if (userStates[chatId]) userStates[chatId].messagesToDelete.push(sent.message_id);
  });
}

// ─── Eslatma so'rash ───────────────────────────────────────────────
function askReminder(chatId) {
  userStates[chatId].action = 'awaiting_reminder';

  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '⏰ 09:00', callback_data: 'rem_09:00' },
          { text: '⏰ 12:00', callback_data: 'rem_12:00' },
          { text: '⏰ 18:00', callback_data: 'rem_18:00' }
        ],
        [
          { text: '🔕 Eslatma kerak emas', callback_data: 'rem_none' }
        ]
      ]
    }
  };

  bot.sendMessage(chatId, '⏰ *Eslatma vaqtini tanlang:*\n\n_Yoki HH:MM formatida yozing (masalan: 14:30)_', 
    { parse_mode: 'Markdown', ...keyboard }
  ).then(sent => {
    if (userStates[chatId]) userStates[chatId].messagesToDelete.push(sent.message_id);
  });
}

// ─── Oraliq xabarlarni o'chirish ───────────────────────────────────
function deleteIntermediateMessages(chatId, messageIds) {
  if (!messageIds || messageIds.length === 0) return;
  messageIds.forEach(msgId => {
    bot.deleteMessage(chatId, msgId).catch(() => {
      // Xabar allaqachon o'chirilgan bo'lishi mumkin — e'tiborsiz qoldiramiz
    });
  });
}

// ─── Vazifani saqlash ──────────────────────────────────────────────
function saveTask(chatId) {
  const state = userStates[chatId];
  if (!state || !state.taskTitle) return;

  try {
    const result = insertTask(
      state.userId,
      state.taskTitle,
      state.category || 'shaxsiy',
      state.priority || 'orta',
      state.dueDate || null,
      state.dueTime || null
    );

    const taskId = result.lastInsertRowid;

    // Eslatma qo'shish
    if (state.reminderTime && state.reminderTime !== 'none') {
      insertReminder(taskId, state.userId, state.reminderTime, 'once');
    }

    // ✨ Oraliq xabarlarni o'chirish (kategoriya, ustuvorlik, muddat, eslatma)
    deleteIntermediateMessages(chatId, state.messagesToDelete);

    const catEmoji = CATEGORY_EMOJI[state.category] || '📌';
    const priEmoji = PRIORITY_EMOJI[state.priority] || '🟡';
    const catName = CATEGORIES[state.category] || 'Shaxsiy';
    const priName = PRIORITIES[state.priority] || 'O\'rta';

    let msg = `✅ *Vazifa muvaffaqiyatli qo'shildi!*\n\n`;
    msg += `📝 *Vazifa:* ${state.taskTitle}\n`;
    msg += `${catEmoji} *Kategoriya:* ${catName}\n`;
    msg += `${priEmoji} *Ustuvorlik:* ${priName}\n`;
    
    if (state.dueDate) {
      msg += `📅 *Muddat:* ${state.dueDate}\n`;
    }
    if (state.reminderTime && state.reminderTime !== 'none') {
      msg += `⏰ *Eslatma:* ${state.reminderTime}\n`;
    }

    msg += `\n🆔 Vazifa #${taskId}`;

    bot.sendMessage(chatId, msg, { parse_mode: 'Markdown', ...getMainKeyboard() });
  } catch (err) {
    console.error('Vazifa saqlashda xato:', err);
    bot.sendMessage(chatId, '❌ Xatolik yuz berdi. Qaytadan urinib ko\'ring.', getMainKeyboard());
  }

  delete userStates[chatId];
}

// ─── Bugungi vazifalar ─────────────────────────────────────────────
bot.onText(/\/bugun/, (msg) => {
  showTodayTasks(msg.chat.id, msg.from);
});

function showTodayTasks(chatId, user) {
  upsertUser(user.id, user.username || '', user.first_name || '');
  
  const today = getTodayDate();
  const tasks = getTodayTasks(user.id, today);

  if (tasks.length === 0) {
    bot.sendMessage(chatId, 
      '📋 *Bugungi vazifalar*\n\n🎉 Bugun uchun vazifa yo\'q!\n\n_Yangi vazifa qo\'shish uchun ➕ tugmasini bosing_', 
      { parse_mode: 'Markdown', ...getMainKeyboard() }
    );
    return;
  }

  let msg = `📋 *Bugungi vazifalar* (${today})\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;

  tasks.forEach((task, i) => {
    const pri = PRIORITY_EMOJI[task.priority] || '🟡';
    const cat = CATEGORY_EMOJI[task.category] || '📌';
    msg += `${i + 1}. ${pri} ${task.title}\n`;
    msg += `   ${cat} ${CATEGORIES[task.category] || task.category}`;
    if (task.due_time) msg += ` | ⏰ ${task.due_time}`;
    msg += `\n\n`;
  });

  msg += `📊 Jami: ${tasks.length} ta vazifa`;

  // Har bir vazifa uchun inline tugmalar
  const inlineKeyboard = tasks.slice(0, 8).map(task => ([
    { text: `✅ #${task.id}`, callback_data: `done_${task.id}` },
    { text: `🗑️ #${task.id}`, callback_data: `del_${task.id}` }
  ]));

  bot.sendMessage(chatId, msg, {
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: inlineKeyboard }
  });
}

// ─── Barcha aktiv vazifalar ────────────────────────────────────────
bot.onText(/\/barcha/, (msg) => {
  showAllTasks(msg.chat.id, msg.from);
});

function showAllTasks(chatId, user) {
  upsertUser(user.id, user.username || '', user.first_name || '');
  
  const tasks = getAllActiveTasks(user.id);

  if (tasks.length === 0) {
    bot.sendMessage(chatId, 
      '📂 *Barcha vazifalar*\n\n🎉 Aktiv vazifalar yo\'q!\n\n_Yangi vazifa qo\'shish uchun ➕ tugmasini bosing_', 
      { parse_mode: 'Markdown', ...getMainKeyboard() }
    );
    return;
  }

  let msg = `📂 *Barcha aktiv vazifalar*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;

  tasks.forEach((task, i) => {
    const pri = PRIORITY_EMOJI[task.priority] || '🟡';
    const cat = CATEGORY_EMOJI[task.category] || '📌';
    msg += `${i + 1}. ${pri} *${task.title}*\n`;
    msg += `   ${cat} ${CATEGORIES[task.category] || task.category}`;
    if (task.due_date) msg += ` | 📅 ${task.due_date}`;
    if (task.due_time) msg += ` ⏰ ${task.due_time}`;
    msg += `\n\n`;
  });

  msg += `📊 Jami: ${tasks.length} ta aktiv vazifa`;

  const inlineKeyboard = tasks.slice(0, 8).map(task => ([
    { text: `✅ #${task.id}`, callback_data: `done_${task.id}` },
    { text: `✏️ #${task.id}`, callback_data: `edit_${task.id}` },
    { text: `🗑️ #${task.id}`, callback_data: `del_${task.id}` }
  ]));

  bot.sendMessage(chatId, msg, {
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: inlineKeyboard }
  });
}

// ─── Bajarilgan vazifalar ──────────────────────────────────────────
bot.onText(/\/bajarilgan/, (msg) => {
  showCompletedTasks(msg.chat.id, msg.from);
});

function showCompletedTasks(chatId, user) {
  upsertUser(user.id, user.username || '', user.first_name || '');
  
  const tasks = getCompletedTasks(user.id);

  if (tasks.length === 0) {
    bot.sendMessage(chatId, 
      '✅ *Bajarilgan vazifalar*\n\n📭 Hali biror vazifa bajarilmagan.\n\n_Vazifalarni ko\'rish uchun 📋 tugmasini bosing_', 
      { parse_mode: 'Markdown', ...getMainKeyboard() }
    );
    return;
  }

  let msg = `✅ *Bajarilgan vazifalar*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;

  tasks.forEach((task, i) => {
    const cat = CATEGORY_EMOJI[task.category] || '📌';
    msg += `${i + 1}. ✅ ~${task.title}~\n`;
    msg += `   ${cat} ${CATEGORIES[task.category] || task.category}`;
    if (task.completed_at) msg += ` | 🕐 ${task.completed_at.split(' ')[0]}`;
    msg += `\n\n`;
  });

  msg += `🎉 Jami: ${tasks.length} ta bajarilgan`;

  bot.sendMessage(chatId, msg, { parse_mode: 'Markdown', ...getMainKeyboard() });
}

// ─── Statistika ────────────────────────────────────────────────────
bot.onText(/\/statistika/, (msg) => {
  showStatistics(msg.chat.id, msg.from);
});

function showStatistics(chatId, user) {
  upsertUser(user.id, user.username || '', user.first_name || '');
  
  const week = getWeekStats(user.id);
  const month = getMonthStats(user.id);
  const categories = getCategoryStats(user.id);
  const totalDone = getTotalCompleted(user.id);

  // Progress bar yasash
  function progressBar(completed, total) {
    if (total === 0) return '░░░░░░░░░░ 0%';
    const percent = Math.round((completed / total) * 100);
    const filled = Math.round(percent / 10);
    const empty = 10 - filled;
    return '▓'.repeat(filled) + '░'.repeat(empty) + ` ${percent}%`;
  }

  let msg = `📊 *Statistika*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;

  // Haftalik
  msg += `📅 *Haftalik (7 kun):*\n`;
  msg += `   Jami: ${week.total || 0} ta vazifa\n`;
  msg += `   ✅ Bajarilgan: ${week.completed || 0}\n`;
  msg += `   ⏳ Kutilmoqda: ${week.pending || 0}\n`;
  msg += `   ${progressBar(week.completed || 0, week.total || 0)}\n\n`;

  // Oylik
  msg += `📆 *Oylik (30 kun):*\n`;
  msg += `   Jami: ${month.total || 0} ta vazifa\n`;
  msg += `   ✅ Bajarilgan: ${month.completed || 0}\n`;
  msg += `   ⏳ Kutilmoqda: ${month.pending || 0}\n`;
  msg += `   ${progressBar(month.completed || 0, month.total || 0)}\n\n`;

  // Kategoriyalar
  if (categories.length > 0) {
    msg += `🏷️ *Aktiv vazifalar kategoriyasi:*\n`;
    categories.forEach(cat => {
      const emoji = CATEGORY_EMOJI[cat.category] || '📌';
      const name = CATEGORIES[cat.category] || cat.category;
      msg += `   ${emoji} ${name}: ${cat.count} ta\n`;
    });
    msg += `\n`;
  }

  // Umumiy
  msg += `🏆 *Umumiy bajarilgan:* ${totalDone.total || 0} ta vazifa\n\n`;

  // Motivatsion xabar
  const total = totalDone.total || 0;
  if (total === 0) {
    msg += `💪 _Birinchi vazifangizni bajaring!_`;
  } else if (total < 10) {
    msg += `🌱 _Yaxshi boshladingiz! Davom eting!_`;
  } else if (total < 50) {
    msg += `⭐ _Ajoyib! Siz juda samarali ishlayapsiz!_`;
  } else if (total < 100) {
    msg += `🔥 _Zo'r natija! Siz haqiqiy professional!_`;
  } else {
    msg += `🏆 _Legendar darajaga chiqdingiz!_`;
  }

  bot.sendMessage(chatId, msg, { parse_mode: 'Markdown', ...getMainKeyboard() });
}

// ─── Callback query handler (inline tugmalar) ─────────────────────
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  const userId = query.from.id;

  // ─── Kategoriya tanlash ───
  if (data.startsWith('cat_')) {
    const category = data.replace('cat_', '');
    if (userStates[chatId]) {
      userStates[chatId].category = category;
      bot.answerCallbackQuery(query.id, { text: `✅ ${CATEGORIES[category]}` });
      askPriority(chatId);
    }
    return;
  }

  // ─── Ustuvorlik tanlash ───
  if (data.startsWith('pri_')) {
    const priority = data.replace('pri_', '');
    if (userStates[chatId]) {
      userStates[chatId].priority = priority;
      bot.answerCallbackQuery(query.id, { text: `✅ ${PRIORITIES[priority]}` });
      askDueDate(chatId);
    }
    return;
  }

  // ─── Muddat tanlash ───
  if (data.startsWith('date_')) {
    const dateVal = data.replace('date_', '');
    if (userStates[chatId]) {
      userStates[chatId].dueDate = dateVal === 'none' ? null : dateVal;
      bot.answerCallbackQuery(query.id, { text: dateVal === 'none' ? '⏭️ Muddatsiz' : `📅 ${dateVal}` });
      askReminder(chatId);
    }
    return;
  }

  // ─── Eslatma tanlash ───
  if (data.startsWith('rem_')) {
    const remVal = data.replace('rem_', '');
    if (userStates[chatId]) {
      userStates[chatId].reminderTime = remVal;
      bot.answerCallbackQuery(query.id, { text: remVal === 'none' ? '🔕 Eslatmasiz' : `⏰ ${remVal}` });
      saveTask(chatId);
    }
    return;
  }

  // ─── Vazifani bajarish ───
  if (data.startsWith('done_')) {
    const taskId = parseInt(data.replace('done_', ''));
    const task = getTaskById(taskId, userId);
    
    if (task) {
      completeTask(taskId, userId);
      bot.answerCallbackQuery(query.id, { text: '✅ Bajarildi!' });
      
      // Xabarni yangilash
      bot.sendMessage(chatId, `✅ *Vazifa bajarildi!*\n\n~${task.title}~\n\n🎉 _Ajoyib ish!_`, 
        { parse_mode: 'Markdown' }
      );
    } else {
      bot.answerCallbackQuery(query.id, { text: '❌ Vazifa topilmadi' });
    }
    return;
  }

  // ─── Vazifani o'chirish ───
  if (data.startsWith('del_')) {
    const taskId = parseInt(data.replace('del_', ''));
    const task = getTaskById(taskId, userId);
    
    if (task) {
      // Tasdiqlash
      bot.answerCallbackQuery(query.id);
      bot.sendMessage(chatId, 
        `🗑️ *O'chirish tasdiqlang:*\n\n"${task.title}"\n\n_Bu amalni qaytarib bo'lmaydi!_`,
        {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [[
              { text: '✅ Ha, o\'chir', callback_data: `confirm_del_${taskId}` },
              { text: '❌ Bekor', callback_data: 'cancel_del' }
            ]]
          }
        }
      );
    } else {
      bot.answerCallbackQuery(query.id, { text: '❌ Vazifa topilmadi' });
    }
    return;
  }

  // ─── O'chirishni tasdiqlash ───
  if (data.startsWith('confirm_del_')) {
    const taskId = parseInt(data.replace('confirm_del_', ''));
    deleteTask(taskId, userId);
    bot.answerCallbackQuery(query.id, { text: '🗑️ O\'chirildi!' });
    bot.sendMessage(chatId, '🗑️ Vazifa o\'chirildi.', getMainKeyboard());
    return;
  }

  if (data === 'cancel_del') {
    bot.answerCallbackQuery(query.id, { text: '↩️ Bekor qilindi' });
    bot.sendMessage(chatId, '↩️ O\'chirish bekor qilindi.', getMainKeyboard());
    return;
  }

  // ─── Vazifani tahrirlash ───
  if (data.startsWith('edit_')) {
    const taskId = parseInt(data.replace('edit_', ''));
    const task = getTaskById(taskId, userId);
    
    if (task) {
      userStates[chatId] = {
        action: 'awaiting_edit_title',
        userId: userId,
        editTaskId: taskId,
        oldTitle: task.title
      };
      
      bot.answerCallbackQuery(query.id);
      bot.sendMessage(chatId, 
        `✏️ *Vazifani tahrirlash*\n\nHozirgi nomi: "${task.title}"\n\nYangi nomini yozing:`,
        { 
          parse_mode: 'Markdown',
          reply_markup: {
            keyboard: [['❌ Bekor qilish']],
            resize_keyboard: true
          }
        }
      );
    } else {
      bot.answerCallbackQuery(query.id, { text: '❌ Vazifa topilmadi' });
    }
    return;
  }

  // ─── Kategoriya bo'yicha ko'rish ───
  if (data.startsWith('viewcat_')) {
    const category = data.replace('viewcat_', '');
    const tasks = getTasksByCategory(userId, category);
    
    if (tasks.length === 0) {
      bot.answerCallbackQuery(query.id, { text: 'Bu kategoriyada vazifa yo\'q' });
      return;
    }

    let msg = `${CATEGORY_EMOJI[category] || '📌'} *${CATEGORIES[category] || category} vazifalari*\n\n`;
    
    tasks.forEach((task, i) => {
      const pri = PRIORITY_EMOJI[task.priority] || '🟡';
      msg += `${i + 1}. ${pri} ${task.title}\n`;
      if (task.due_date) msg += `   📅 ${task.due_date}\n`;
      msg += `\n`;
    });

    bot.answerCallbackQuery(query.id);
    bot.sendMessage(chatId, msg, { parse_mode: 'Markdown' });
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
  if (text === '➕ Yangi vazifa') {
    startNewTask(chatId, user);
    return;
  }
  if (text === '📋 Bugungi vazifalar') {
    showTodayTasks(chatId, user);
    return;
  }
  if (text === '📂 Barcha vazifalar') {
    showAllTasks(chatId, user);
    return;
  }
  if (text === '✅ Bajarilganlar') {
    showCompletedTasks(chatId, user);
    return;
  }
  if (text === '📊 Statistika') {
    showStatistics(chatId, user);
    return;
  }
  if (text === '❓ Yordam') {
    sendHelp(chatId);
    return;
  }

  // ─── Holat bo'yicha qayta ishlash ───
  const state = userStates[chatId];
  if (!state) return;

  // Yangi vazifa nomi
  if (state.action === 'awaiting_task_title') {
    if (text.length > 200) {
      bot.sendMessage(chatId, '⚠️ Vazifa nomi 200 ta belgidan oshmasin. Qayta yozing:');
      return;
    }
    // Foydalanuvchining xabarini ham o'chirish uchun saqlash
    if (userStates[chatId].messagesToDelete) {
      userStates[chatId].messagesToDelete.push(msg.message_id);
    }
    userStates[chatId].taskTitle = text;
    askCategory(chatId);
    return;
  }

  // Muddat kiritish (qo'lda)
  if (state.action === 'awaiting_due_date') {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(text)) {
      if (userStates[chatId].messagesToDelete) {
        userStates[chatId].messagesToDelete.push(msg.message_id);
      }
      userStates[chatId].dueDate = text;
      askReminder(chatId);
    } else {
      bot.sendMessage(chatId, '⚠️ Noto\'g\'ri format. YYYY-MM-DD formatida yozing (masalan: 2026-06-25)');
    }
    return;
  }

  // Eslatma vaqti (qo'lda)
  if (state.action === 'awaiting_reminder') {
    const timeRegex = /^\d{2}:\d{2}$/;
    if (timeRegex.test(text)) {
      if (userStates[chatId].messagesToDelete) {
        userStates[chatId].messagesToDelete.push(msg.message_id);
      }
      userStates[chatId].reminderTime = text;
      saveTask(chatId);
    } else {
      bot.sendMessage(chatId, '⚠️ Noto\'g\'ri format. HH:MM formatida yozing (masalan: 14:30)');
    }
    return;
  }

  // Tahrirlash
  if (state.action === 'awaiting_edit_title') {
    if (text.length > 200) {
      bot.sendMessage(chatId, '⚠️ Vazifa nomi 200 ta belgidan oshmasin. Qayta yozing:');
      return;
    }
    updateTaskTitle(text, state.editTaskId, state.userId);
    bot.sendMessage(chatId, 
      `✏️ *Vazifa tahrirlandi!*\n\nEski: ~${state.oldTitle}~\nYangi: *${text}*`, 
      { parse_mode: 'Markdown', ...getMainKeyboard() }
    );
    delete userStates[chatId];
    return;
  }
});

// ─── Eslatmalar tizimi (har minutda tekshirish) ───────────────────
cron.schedule('* * * * *', () => {
  const currentTime = getCurrentTime();
  
  try {
    const reminders = getActiveReminders();
    
    reminders.forEach(reminder => {
      if (reminder.remind_at === currentTime) {
        // Eslatma yuborish
        const msg = `⏰ *Eslatma!*\n\n📝 *Vazifa:* ${reminder.task_title}\n\n_Vazifani bajarish vaqti keldi!_`;
        
        bot.sendMessage(reminder.user_id, msg, {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [[
              { text: '✅ Bajardim', callback_data: `done_${reminder.task_id}` },
              { text: '⏰ Keyinroq', callback_data: `snooze_${reminder.id}` }
            ]]
          }
        }).catch(err => {
          console.error(`Eslatma yuborishda xato (user: ${reminder.user_id}):`, err.message);
        });

        // Bir martalik eslatmani o'chirish
        if (reminder.remind_type === 'once') {
          deactivateReminder(reminder.id);
        }
      }
    });
  } catch (err) {
    console.error('Eslatma tekshirishda xato:', err.message);
  }
});

// ─── Har kuni ertalab motivatsion xabar (ixtiyoriy) ───────────────
cron.schedule('0 8 * * *', () => {
  console.log('🌅 Ertalabki tekshirish...');
  // Bu yerda barcha foydalanuvchilarga ertalabki vazifalar ro'yxatini 
  // yuborish mumkin (kelajakda qo'shiladi)
});

// ─── Xatolarni ushlab qolish ──────────────────────────────────────
bot.on('polling_error', (err) => {
  console.error('Polling xatosi:', err.code || err.message);
});

process.on('uncaughtException', (err) => {
  console.error('Kutilmagan xato:', err);
});

console.log('✅ Barcha handlerlar tayyor!');
console.log('📅 Eslatmalar tizimi ishga tushdi (har minutda tekshiradi)');
