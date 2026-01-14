import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db';
import { generateGroqReply } from '../groq';

const router = Router();

router.get('/', async (req, res) => {
  const db = getDb();
  const chats = await db.all('SELECT * FROM chats ORDER BY datetime(createdAt) DESC');
  res.json(chats);
});

router.post('/new', async (req, res) => {
  const db = getDb();
  const { mode } = req.body;
  const id = uuidv4();
  const createdAt = new Date().toISOString();
  await db.run('INSERT INTO chats (id, mode, createdAt) VALUES (?, ?, ?)', id, mode, createdAt);
  res.json({ id, mode, createdAt });
});

router.get('/:id/messages', async (req, res) => {
  const db = getDb();
  const messages = await db.all(
    'SELECT * FROM messages WHERE chatId = ? ORDER BY datetime(createdAt)',
    req.params.id
  );
  res.json({ messages });
});

router.post('/:id/message', async (req, res) => {
  const db = getDb();
  const { content } = req.body;
  const chatId = req.params.id;
  const userId = uuidv4();
  const createdAt = new Date().toISOString();

  await db.run(
    'INSERT INTO messages (id, chatId, role, content, createdAt) VALUES (?, ?, ?, ?, ?)',
    userId,
    chatId,
    'user',
    content,
    createdAt
  );

  const reply = await generateGroqReply(content);
  const aiId = uuidv4();
  const aiCreatedAt = new Date().toISOString();

  await db.run(
    'INSERT INTO messages (id, chatId, role, content, createdAt) VALUES (?, ?, ?, ?, ?)',
    aiId,
    chatId,
    'assistant',
    reply,
    aiCreatedAt
  );

  res.json({ response: reply });
});

export default router;
