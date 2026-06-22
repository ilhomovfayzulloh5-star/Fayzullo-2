/**
 * 🗄️ Database Module — Kun Tartibi Bot
 * 
 * JSON fayl asosida ma'lumotlar bazasi.
 * Python/C++ build tools kerak emas — sof JavaScript!
 * 
 * Jadvallar: users, tasks, reminders
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data.json');

// ─── Default baza strukturasi ──────────────────────────────────────
const DEFAULT_DB = {
  users: {},       // { "userId": { username, first_name, created_at } }
  tasks: [],       // [ { id, user_id, title, category, priority, status, ... } ]
  reminders: [],   // [ { id, task_id, user_id, remind_at, remind_type, is_active } ]
  nextTaskId: 1,
  nextReminderId: 1
};

// ─── Bazani yuklash ────────────────────────────────────────────────
function loadDB() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      const data = JSON.parse(raw);
      // Ensure all fields exist (backward compat)
      return { ...DEFAULT_DB, ...data };
    }
  } catch (err) {
    console.error('⚠️ Bazani yuklashda xato, yangi baza yaratiladi:', err.message);
  }
  return { ...DEFAULT_DB };
}

// ─── Bazani saqlash ────────────────────────────────────────────────
function saveDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('❌ Bazani saqlashda xato:', err.message);
  }
}

// ─── Bazani boshlash ───────────────────────────────────────────────
let db = loadDB();
console.log('🗄️ Ma\'lumotlar bazasi tayyor!');
console.log(`   📊 Vazifalar: ${db.tasks.length} ta | Foydalanuvchilar: ${Object.keys(db.users).length} ta`);

// ─── Yordamchi: bugungi sana ───────────────────────────────────────
function todayStr() {
  const now = new Date();
  const tashkent = new Date(now.getTime() + 5 * 60 * 60 * 1000);
  return tashkent.toISOString().split('T')[0];
}

function nowStr() {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
}

// ═══════════════════════════════════════════════════════════════════
// USERS
// ═══════════════════════════════════════════════════════════════════

function upsertUser(userId, username, firstName) {
  db.users[userId] = {
    username: username || '',
    first_name: firstName || '',
    created_at: db.users[userId]?.created_at || nowStr()
  };
  saveDB(db);
}

// ═══════════════════════════════════════════════════════════════════
// TASKS
// ═══════════════════════════════════════════════════════════════════

function insertTask(userId, title, category, priority, dueDate, dueTime) {
  const task = {
    id: db.nextTaskId++,
    user_id: userId,
    title,
    category: category || 'shaxsiy',
    priority: priority || 'orta',
    status: 'kutilmoqda',
    due_date: dueDate || null,
    due_time: dueTime || null,
    created_at: nowStr(),
    completed_at: null
  };
  db.tasks.push(task);
  saveDB(db);
  return { lastInsertRowid: task.id };
}

function getTaskById(taskId, userId) {
  return db.tasks.find(t => t.id === taskId && t.user_id === userId) || null;
}

function getTodayTasks(userId, todayDate) {
  const priorityOrder = { 'yuqori': 1, 'orta': 2, 'past': 3 };
  return db.tasks
    .filter(t => t.user_id === userId && t.status === 'kutilmoqda' 
      && (t.due_date === todayDate || t.due_date === null))
    .sort((a, b) => (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2));
}

function getAllActiveTasks(userId) {
  const priorityOrder = { 'yuqori': 1, 'orta': 2, 'past': 3 };
  return db.tasks
    .filter(t => t.user_id === userId && t.status === 'kutilmoqda')
    .sort((a, b) => {
      const priDiff = (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2);
      if (priDiff !== 0) return priDiff;
      // due_date bo'yicha saralash (null oxirga)
      if (a.due_date && !b.due_date) return -1;
      if (!a.due_date && b.due_date) return 1;
      if (a.due_date && b.due_date) return a.due_date.localeCompare(b.due_date);
      return 0;
    });
}

function getCompletedTasks(userId) {
  return db.tasks
    .filter(t => t.user_id === userId && t.status === 'bajarilgan')
    .sort((a, b) => (b.completed_at || '').localeCompare(a.completed_at || ''))
    .slice(0, 20);
}

function completeTask(taskId, userId) {
  const task = db.tasks.find(t => t.id === taskId && t.user_id === userId);
  if (task) {
    task.status = 'bajarilgan';
    task.completed_at = nowStr();
    saveDB(db);
    return true;
  }
  return false;
}

function deleteTask(taskId, userId) {
  const idx = db.tasks.findIndex(t => t.id === taskId && t.user_id === userId);
  if (idx !== -1) {
    db.tasks.splice(idx, 1);
    // Bog'liq eslatmalarni ham o'chirish
    db.reminders = db.reminders.filter(r => r.task_id !== taskId);
    saveDB(db);
    return true;
  }
  return false;
}

function updateTaskTitle(title, taskId, userId) {
  const task = db.tasks.find(t => t.id === taskId && t.user_id === userId);
  if (task) {
    task.title = title;
    saveDB(db);
    return true;
  }
  return false;
}

function getTasksByCategory(userId, category) {
  return db.tasks
    .filter(t => t.user_id === userId && t.category === category && t.status === 'kutilmoqda')
    .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
}

// ═══════════════════════════════════════════════════════════════════
// STATISTIKA
// ═══════════════════════════════════════════════════════════════════

function daysAgo(n) {
  const d = new Date(Date.now() - n * 24 * 60 * 60 * 1000);
  return d.toISOString().replace('T', ' ').substring(0, 19);
}

function getWeekStats(userId) {
  const since = daysAgo(7);
  const filtered = db.tasks.filter(t => t.user_id === userId && t.created_at >= since);
  return {
    total: filtered.length,
    completed: filtered.filter(t => t.status === 'bajarilgan').length,
    pending: filtered.filter(t => t.status === 'kutilmoqda').length
  };
}

function getMonthStats(userId) {
  const since = daysAgo(30);
  const filtered = db.tasks.filter(t => t.user_id === userId && t.created_at >= since);
  return {
    total: filtered.length,
    completed: filtered.filter(t => t.status === 'bajarilgan').length,
    pending: filtered.filter(t => t.status === 'kutilmoqda').length
  };
}

function getCategoryStats(userId) {
  const active = db.tasks.filter(t => t.user_id === userId && t.status === 'kutilmoqda');
  const counts = {};
  active.forEach(t => {
    counts[t.category] = (counts[t.category] || 0) + 1;
  });
  return Object.entries(counts).map(([category, count]) => ({ category, count }));
}

function getTotalCompleted(userId) {
  return {
    total: db.tasks.filter(t => t.user_id === userId && t.status === 'bajarilgan').length
  };
}

// ═══════════════════════════════════════════════════════════════════
// REMINDERS
// ═══════════════════════════════════════════════════════════════════

function insertReminder(taskId, userId, remindAt, remindType) {
  const reminder = {
    id: db.nextReminderId++,
    task_id: taskId,
    user_id: userId,
    remind_at: remindAt,
    remind_type: remindType || 'once',
    is_active: 1
  };
  db.reminders.push(reminder);
  saveDB(db);
  return reminder;
}

function getActiveReminders() {
  return db.reminders
    .filter(r => r.is_active === 1)
    .map(r => {
      const task = db.tasks.find(t => t.id === r.task_id);
      return { ...r, task_title: task ? task.title : '(o\'chirilgan vazifa)' };
    });
}

function deactivateReminder(reminderId) {
  const rem = db.reminders.find(r => r.id === reminderId);
  if (rem) {
    rem.is_active = 0;
    saveDB(db);
  }
}

function getRemindersForUser(userId) {
  return db.reminders
    .filter(r => r.user_id === userId && r.is_active === 1)
    .map(r => {
      const task = db.tasks.find(t => t.id === r.task_id);
      return { ...r, task_title: task ? task.title : '(o\'chirilgan vazifa)' };
    });
}

// ─── Export ────────────────────────────────────────────────────────

module.exports = {
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
};
