// frontend/src/components/ChatInterface.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Message, Mode } from '../types';
import MessageBubble from './MessageBubble';
import { cleanText } from '../utils/formatter';

interface Props {
  chatId: string;
  mode: Mode;
  theme: 'light' | 'dark';
}

export default function ChatInterface({ chatId, theme }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const isDark = theme === 'dark';

  // Загружаем историю сообщений
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const res = await fetch(`/api/chat/${chatId}/messages`);
        if (!res.ok) throw new Error('Server error');
        const data = await res.json();
        setMessages(data.messages || []);
      } catch (err) {
        console.error('Ошибка загрузки сообщений:', err);
      }
    };
    loadMessages();
  }, [chatId]);

  // Автоскролл вниз
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Отправка сообщения
  const sendMessage = async () => {
    if (!input.trim() || sending) return;

    const text = cleanText(input);
    if (!text) return;

    setInput('');
    setSending(true);

    // Локальное сообщение пользователя
    setMessages(prev => [
      ...prev,
      {
        id: `local-user-${Date.now()}`,
        chatId,
        role: 'user',
        content: text,
        createdAt: new Date().toISOString()
      }
    ]);

    try {
      const res = await fetch(`/api/chat/${chatId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text })
      });

      if (!res.ok) throw new Error('Server error');

      const data = await res.json();

      // Ответ ИИ
      setMessages(prev => [
        ...prev,
        {
          id: `local-ai-${Date.now()}`,
          chatId,
          role: 'assistant',
          content: data.response,
          createdAt: new Date().toISOString()
        }
      ]);
    } catch (err) {
      console.error('Ошибка при отправке:', err);
    } finally {
      setSending(false);
    }
  };

  // Enter = отправка
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Сообщения */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map(m => (
          <MessageBubble
            key={m.id}
            role={m.role}
            content={m.content}
            theme={theme}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Поле ввода */}
      <div
        className={`p-3 sm:p-4 border-t ${
          isDark ? 'bg-[#2b2d31] border-[#1f2023]' : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex gap-2 sm:gap-3 items-center">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`
              flex-1 px-3 py-2 sm:px-4 sm:py-3 rounded-xl outline-none
              placeholder:text-gray-500 text-sm sm:text-base
              transition-colors duration-200
              ${
                isDark
                  ? 'bg-[#1f2023] text-white'
                  : 'bg-gray-100 text-gray-900'
              }
            `}
            placeholder="Введите сообщение..."
          />

          <button
            onClick={sendMessage}
            disabled={sending}
            className={`
              button-glow px-4 sm:px-5 py-2 sm:py-3 rounded-xl
              text-sm sm:text-base font-medium transition-all duration-200
              ${
                sending
                  ? 'bg-gray-500 cursor-not-allowed text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }
            `}
          >
            {sending ? '...' : '➤'}
          </button>
        </div>
      </div>
    </div>
  );
}
