import React, { useEffect, useState } from 'react';

const THEME_KEY = 'agritheme';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
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
      className={`inline-flex items-center justify-center gap-2 px-2 py-1 rounded ${className}`}
      title="Alternar modo oscuro"
      aria-label="Alternar modo claro/oscuro"
    >
      {/* Iconos removidos por petición del usuario; mostrar control discreto */}
      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Tema</span>
    </button>
  );
};

export default ThemeToggle;
