import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let db: Database | null = null;

export async function initDb(): Promise<Database> {
  if (db) return db;

  const database = await open({
    filename: './data.sqlite',
    driver: sqlite3.Database
  });

  await database.exec(`
    CREATE TABLE IF NOT EXISTS chats (
      id TEXT PRIMARY KEY,
      mode TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);

  await database.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      chatId TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (chatId) REFERENCES chats(id) ON DELETE CASCADE
    );
  `);

  db = database;
  return db;
}

export function getDb(): Database {
  if (!db) throw new Error('DB not initialized');
  return db;
}
