import React, { useEffect, useState } from 'react';

const THEME_KEY = 'agritheme';

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const v = localStorage.getItem(THEME_KEY);
      if (v) return v === 'dark';
    } catch (e) {}
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="fixed right-4 top-4 z-50 bg-gray-100 dark:bg-gray-700 text-sm px-3 py-2 rounded-md shadow-sm hover:opacity-90"
      title="Alternar modo oscuro"
    >
      {isDark ? '🌙 Oscuro' : '☀️ Claro'}
    </button>
  );
};

export default ThemeToggle;
