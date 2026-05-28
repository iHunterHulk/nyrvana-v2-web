'use client';

import { useState, useEffect } from 'react';
import { Network, MessageSquare, Search, Key, Settings, LayoutGrid } from 'lucide-react';

const Sidebar = () => {
  const [sidebarState, setSidebarState] = useState<'expanded' | 'collapsed'>('expanded');
  
  useEffect(() => {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('nv-sidebar='))
      ?.split('=')[1];
    
    if (cookieValue === 'collapsed') {
      setSidebarState('collapsed');
    }
  }, []);
  
  const toggleSidebar = () => {
    const newState = sidebarState === 'expanded' ? 'collapsed' : 'expanded';
    setSidebarState(newState);
    document.cookie = `nv-sidebar=${newState}; path=/`;
  };
  
  const navItems = [
    { name: 'Dashboard', icon: LayoutGrid },
    { name: 'Adapters', icon: Network },
    { name: 'Chat', icon: MessageSquare },
    { name: 'Search', icon: Search },
    { name: 'Credentials', icon: Key },
    { name: 'Settings', icon: Settings }
  ];
  
  return (
    <div 
      className={`bg-[color:var(--color-bg-base)] border-r border-[color:var(--color-border)] flex flex-col transition-[width] duration-[200ms] ease-out ${
        sidebarState === 'expanded' ? 'w-[240px]' : 'w-[56px]'
      }`}
    >
      <div className="p-4">
        <svg viewBox="0 0 32 32" className="w-8 h-8">
          <circle cx="16" cy="16" r="14" fill="var(--color-blue-vibrant)" />
        </svg>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <a
                  href={`/${item.name.toLowerCase()}`}
                  className={`flex items-center h-9 rounded-md px-3 ${
                    item.name === 'Dashboard' 
                      ? 'bg-[color:var(--color-blue-subtle)] text-[color:var(--color-blue-vibrant)]' 
                      : 'hover:bg-[color:var(--color-bg-elevated)]'
                  }`}
                >
                  <Icon size={18} />
                  {sidebarState === 'expanded' && (
                    <span className="ml-3 text-sm font-medium">{item.name}</span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-3 border-t border-[color:var(--color-border)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-7 h-7 rounded-full bg-[color:var(--color-blue-vibrant)] flex items-center justify-center text-white text-xs">
              U
            </div>
            {sidebarState === 'expanded' && (
              <span className="ml-2 text-sm">user@example.com</span>
            )}
          </div>
          {sidebarState === 'expanded' && (
            <button onClick={toggleSidebar} className="text-[color:var(--color-text-secondary)]">
              {/* Chevron icon would go here */}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;