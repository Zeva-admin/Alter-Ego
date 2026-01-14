// backend/src/routes/chat.ts

import express from 'express';
import { createChat, getChatById, getMessagesByChatId, saveMessage, Mode } from '../db/chatHistory';
import { getCompletion } from '../services/groqService';

const router = express.Router();

// Создать новый чат
router.post('/new', async (req, res) => {
  const { mode } = req.body;
  if (!['baseline', 'strategist', 'antihero', 'manipulator'].includes(mode)) {
    return res.status(400).json({ error: 'Invalid mode' });
  }
  try {
    const chat = await createChat(mode as Mode);
    res.json(chat);
  } catch (e) {
    console.error('Error creating chat:', e);
    res.status(500).json({ error: 'Failed to create chat' });
  }
});

// Получить сообщения чата
router.get('/:chatId/messages', async (req, res) => {
  const { chatId } = req.params;
  try {
    const chat = await getChatById(chatId);
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    const messages = await getMessagesByChatId(chatId);
    res.json({ chat, messages });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Отправить сообщение
router.post('/:chatId/message', async (req, res) => {
  const { chatId } = req.params;
  const { content } = req.body;

  try {
    const chat = await getChatById(chatId);
    if (!chat) return res.status(404).json({ error: 'Chat not found' });

    await saveMessage(chatId, 'user', content);

    const history = await getMessagesByChatId(chatId);
    const formattedHistory = history.map(m => ({
      role: m.role,
      content: m.content
    }));

    const aiResponse = await getCompletion(chat.mode, formattedHistory);
    await saveMessage(chatId, 'assistant', aiResponse);

    res.json({ response: aiResponse });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || 'AI request failed' });
  }
});

// Получить все чаты (для истории)
router.get('/', async (req, res) => {
  try {
    // Убедимся, что БД инициализирована
    await require('../db/chatHistory').initDB();
    const db = require('../db/chatHistory').db;
    const rows = await db.all('SELECT id, mode, created_at FROM chats ORDER BY created_at DESC');
    res.json(rows.map((row: any) => ({
      id: row.id,
      mode: row.mode,
      createdAt: row.created_at
    })));
  } catch (e) {
    console.error('Error fetching chats:', e);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

export default router;