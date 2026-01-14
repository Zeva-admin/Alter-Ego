import React from 'react';
import { Chat, Mode } from '../types';

interface SidebarProps {
  chats: Chat[];
  onSelectChat: (id: string, mode: Mode) => void;
  onCreateChat: (mode: Mode) => void;
  theme: 'light' | 'dark';
  onToggleSidebar?: () => void;
}

const modes: { mode: Mode; title: string; description: string }[] = [
  {
    mode: 'baseline',
    title: 'Базовый',
    description: 'Спокойный, универсальный собеседник для любых задач.'
  },
  {
    mode: 'strategist',
    title: 'Стратег',
    description: 'Помогает продумывать шаги, планы и решения.'
  },
  {
    mode: 'antihero',
    title: 'Антигерой',
    description: 'Провокационный стиль, нестандартные идеи и взгляды.'
  },
  {
    mode: 'manipulator',
    title: 'Манипулятор',
    description: 'Анализирует мотивации, влияние и скрытые ходы.'
  }
];

export default function Sidebar({
  chats,
  onSelectChat,
  onCreateChat,
  theme,
  onToggleSidebar
}: SidebarProps) {
  const isDark = theme === 'dark';

  return (
    <div className="h-full flex flex-col p-4 gap-4">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-lg">Модели</span>

        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className={`button-glow p-2 rounded-xl ${
              isDark ? 'bg-[#1f2023]' : 'bg-gray-200'
            }`}
            aria-label="Скрыть меню"
          >
            <img src="/icons/menu.svg" alt="menu" className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* MODES */}
      <div className="flex flex-col gap-2">
        {modes.map(m => (
          <button
            key={m.mode}
            type="button"
            onClick={() => onCreateChat(m.mode)}
            className={`
              button-glow flex flex-col items-start gap-1 p-3 rounded-lg text-left
              ${isDark ? 'bg-[#1f2023] text-white' : 'bg-gray-100 text-gray-900'}
            `}
          >
            <span className="font-semibold text-sm">{m.title}</span>
            <span className="text-xs opacity-80">{m.description}</span>
          </button>
        ))}
      </div>

      {/* HISTORY */}
      <div className="mt-4">
        <h3 className="text-xs uppercase tracking-wide opacity-60 mb-2">
          История
        </h3>

        {chats.length === 0 ? (
          <p className="text-xs opacity-60">Пока нет чатов</p>
        ) : (
          <div className="flex flex-col gap-1 max-h-[50vh] overflow-y-auto pr-1">
            {chats.map(chat => (
              <button
                key={chat.id}
                type="button"
                onClick={() => onSelectChat(chat.id, chat.mode)}
                className={`
                  w-full text-left px-3 py-2 rounded-lg text-sm truncate
                  ${
                    isDark
                      ? 'bg-[#1f2023] hover:bg-[#34363b] text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }
                `}
              >
                <span className="block truncate">
                  {modes.find(m => m.mode === chat.mode)?.title || chat.mode}
                </span>
                <span className="block text-[10px] opacity-60">
                  {new Date(chat.createdAt).toLocaleString()}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
