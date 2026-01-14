// backend/src/server.ts

// ⚠️ САМОЕ ПЕРВОЕ: загрузка .env ДО ЛЮБЫХ ИМПОРТОВ, КОТОРЫЕ ИСПОЛЬЗУЮТ process.env
import dotenv from 'dotenv';
const result = dotenv.config();
if (result.error) {
  console.error('❌ Не удалось загрузить .env:', result.error);
  process.exit(1);
}
if (!process.env.GROQ_API_KEY) {
  console.error('❌ GROQ_API_KEY отсутствует в .env');
  process.exit(1);
}
console.log('✅ GROQ_API_KEY загружен');

// Теперь можно импортировать остальное
import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chat';
import { initDB } from './db/chatHistory';

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => {
  res.send('Alter Ego Architect Backend is running');
});

app.use('/api/chat', chatRoutes);

initDB()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Backend running on http://localhost:${PORT}`);
      console.log('✅ База данных инициализирована');
    });
  })
  .catch(err => {
    console.error('❌ Ошибка БД:', err);
    process.exit(1);
  });