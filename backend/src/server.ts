import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chat';
import { initDb } from './db';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/chat', chatRoutes);

async function start() {
  await initDb();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

start();
