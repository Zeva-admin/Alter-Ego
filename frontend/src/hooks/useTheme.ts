// frontend/src/hooks/useTheme.ts

import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark');

  // Загружаем тему при старте
  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null;

    const initial: Theme =
      saved === 'light' || saved === 'dark' ? saved : 'dark';

    setTheme(initial);

    // Применяем класс к <html>
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, []);

  // Переключение темы
  const toggleTheme = () => {
    setTheme(prev => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';

      localStorage.setItem('theme', next);

      document.documentElement.classList.toggle('dark', next === 'dark');

      return next;
    });
  };

  return { theme, toggleTheme };
}
