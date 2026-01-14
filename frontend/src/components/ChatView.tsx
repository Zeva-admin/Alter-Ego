import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import MessageBubble from './MessageBubble';
import { useTheme } from '../hooks/useTheme';

interface ChatViewProps {
  messages: Message[];
}

export default function ChatView({ messages }: ChatViewProps) {
  const { theme } = useTheme();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      className={`
        flex-1 overflow-y-auto p-4 sm:p-6 space-y-4
        ${theme === 'dark' ? 'glass-dark' : 'glass'}
        rounded-2xl shadow-xl
      `}
    >
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
  );
}
