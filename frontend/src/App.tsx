// frontend/src/App.tsx

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import { useTheme } from './hooks/useTheme';
import { Mode, Chat } from './types';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [chatId, setChatId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const isDark = theme === 'dark';

  useEffect(() => {
    const loadChats = async () => {
      try {
        const res = await fetch('/api/chat');
        if (!res.ok) throw new Error('Server error');
        const data: Chat[] = await res.json();
        setChats(data);
      } catch (err) {
        console.error('Ошибка загрузки чатов:', err);
      }
    };
    loadChats();
  }, []);

  const startNewChat = async (selectedMode: Mode) => {
    try {
      const res = await fetch('/api/chat/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: selectedMode })
      });
      if (!res.ok) throw new Error('Server error');
      const data: Chat = await res.json();
      setChats(prev => [data, ...prev]);
      setChatId(data.id);
      setMode(selectedMode);
    } catch (err) {
      console.error('Ошибка создания чата:', err);
    }
  };

  const selectChat = (id: string, mode: Mode) => {
    setChatId(id);
    setMode(mode);
  };

  return (
    <div
      className={`
        w-screen h-screen overflow-hidden flex
        ${isDark ? 'bg-[#1e1f22] text-white' : 'bg-gray-100 text-gray-900'}
      `}
    >
      {/* SIDEBAR */}
      {sidebarVisible && (
        <div
          className={`
            h-full w-64 min-w-64 max-w-64 flex-shrink-0 overflow-y-auto
            ${isDark ? 'bg-[#2b2d31] border-r border-[#1f2023]' : 'bg-white border-r border-gray-200'}
          `}
        >
          <Sidebar
            chats={chats}
            onSelectChat={selectChat}
            onCreateChat={startNewChat}
            theme={theme}
            onToggleSidebar={() => setSidebarVisible(false)}
          />
        </div>
      )}

      {/* MAIN */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* HEADER */}
        <header
          className={`
            h-16 flex items-center justify-between px-4
            border-b flex-shrink-0
            ${isDark ? 'bg-[#2b2d31] border-[#1f2023]' : 'bg-white border-gray-200'}
          `}
        >
          <div className="flex items-center gap-3">
            <h1 className="font-bold text-xl">Alter Ego</h1>

            {/* SVG-КНОПКА СКРЫТИЯ САЙДБАРА */}
            <button
              onClick={() => setSidebarVisible(prev => !prev)}
              className={`button-glow p-2 rounded-xl ${
                isDark ? 'bg-[#1f2023]' : 'bg-gray-200'
              }`}
              aria-label="Скрыть меню"
            >
              <img
                src="/icons/menu.svg"
                alt="menu"
                className="w-5 h-5"
              />
            </button>
          </div>

          <button
            onClick={toggleTheme}
            className={`button-glow p-2 rounded-xl ${
              isDark ? 'bg-[#1f2023]' : 'bg-gray-200'
            }`}
          >
            <img
              src={isDark ? '/icons/sun_white.svg' : '/icons/moon.svg'}
              className="w-6 h-6"
              alt="theme"
            />
          </button>
        </header>

        {/* CHAT AREA */}
        <div className="flex-1 overflow-hidden flex">
          {chatId && mode ? (
            <ChatInterface chatId={chatId} mode={mode} theme={theme} />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div
                className={`p-8 rounded-2xl ${
                  isDark ? 'bg-[#2b2d31]' : 'bg-white shadow-lg'
                }`}
              >
                <h2 className="text-2xl font-bold mb-4">Выберите модель Alter Ego</h2>
                <p className="text-gray-400">
                  Создайте новый чат в панели слева, чтобы начать диалог.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
