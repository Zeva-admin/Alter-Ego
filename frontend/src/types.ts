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
