// backend/src/db/chatHistory.ts

import { open, Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';

let db: Database;

export const initDB = async () => {
  if (db) return db;
  console.log('🔧 Инициализация БД...');
  try {
    db = await open({
      filename: './chat_history.db',
      driver: sqlite3.Database
    });

    console.log('✅ Подключено к БД');

    await db.exec(`
      CREATE TABLE IF NOT EXISTS chats (
        id TEXT PRIMARY KEY,
        mode TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Таблица chats создана');

    await db.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        chat_id TEXT NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(chat_id) REFERENCES chats(id)
      )
    `);

    console.log('✅ Таблица messages создана');
    return db;
  } catch (err) {
    console.error('❌ Ошибка инициализации БД:', err);
    throw err;
  }
};

export type Mode = 'baseline' | 'strategist' | 'antihero' | 'manipulator';

export interface Chat {
  id: string;
  mode: Mode;
  createdAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export const createChat = async (mode: Mode): Promise<Chat> => {
  await initDB();
  const id = uuidv4();
  await db.run('INSERT INTO chats (id, mode) VALUES (?, ?)', [id, mode]);
  return { id, mode, createdAt: new Date().toISOString() };
};

export const getChatById = async (chatId: string): Promise<Chat | undefined> => {
  await initDB();
  const row = await db.get('SELECT * FROM chats WHERE id = ?', [chatId]) as any;
  return row ? { id: row.id, mode: row.mode, createdAt: row.created_at } : undefined;
};

export const saveMessage = async (chatId: string, role: 'user' | 'assistant', content: string): Promise<Message> => {
  await initDB();
  const id = uuidv4();
  await db.run('INSERT INTO messages (id, chat_id, role, content) VALUES (?, ?, ?, ?)', [id, chatId, role, content]);
  return { id, chatId, role, content, createdAt: new Date().toISOString() };
};

export const getMessagesByChatId = async (chatId: string): Promise<Message[]> => {
  await initDB();
  const rows = await db.all('SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at ASC', [chatId]) as any[];
  return rows.map(row => ({
    id: row.id,
    chatId: row.chat_id,
    role: row.role,
    content: row.content,
    createdAt: row.created_at
  }));
};