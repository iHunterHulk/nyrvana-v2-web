'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('nv-theme='))
      ?.split('=')[1];
    
    if (cookieValue === 'dark') {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      setTheme('light');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.cookie = `nv-theme=${newTheme}; path=/`;
    document.documentElement.setAttribute('data-theme', newTheme);
  };
  
  return (
    <button 
      onClick={toggleTheme}
      className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[color:var(--color-bg-elevated)]"
    >
      {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
};

export default ThemeToggle;