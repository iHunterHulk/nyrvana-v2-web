'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { getStoredTheme, setStoredTheme, applyTheme } from '@/lib/theme/persist';

const ThemeToggle = () => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>('system');
  
  useEffect(() => {
    const storedTheme = getStoredTheme();
    setCurrentTheme(storedTheme);
    applyTheme(storedTheme);
  }, []);

  const toggleTheme = () => {
    // Cycle through themes: light → dark → system
    let newTheme: 'light' | 'dark' | 'system';
    if (currentTheme === 'light') {
      newTheme = 'dark';
    } else if (currentTheme === 'dark') {
      newTheme = 'system';
    } else {
      newTheme = 'light';
    }
    
    setCurrentTheme(newTheme);
    setStoredTheme(newTheme);
  };
  
  return (
    <button 
      onClick={toggleTheme}
      className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[color:var(--color-bg-elevated)]"
    >
      {currentTheme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
};

export default ThemeToggle;