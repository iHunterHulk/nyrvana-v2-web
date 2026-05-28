'use client';

import { useState, useEffect, useContext } from 'react';
import { Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { ShellContext } from './Shell';

const TopBar = ({ title }: { title: string }) => {
  const { sidebarOpen, setSidebarOpen } = useContext(ShellContext);
  
  return (
    <div className="h-12 border-b border-[color:var(--color-border)] flex items-center justify-between px-4">
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="w-9 h-7 flex items-center justify-center rounded-md hover:bg-[color:var(--color-bg-elevated)]"
      >
        <Menu size={16} />
      </button>
      
      <h1 className="text-sm font-medium">{title}</h1>
      
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <kbd className="px-2 py-1 text-xs font-mono rounded bg-[color:var(--color-bg-elevated)]">
          Cmd K
        </kbd>
        <div className="w-7 h-7 rounded-full bg-[color:var(--color-blue-vibrant)] flex items-center justify-center text-white text-xs">
          U
        </div>
      </div>
    </div>
  );
};

export default TopBar;