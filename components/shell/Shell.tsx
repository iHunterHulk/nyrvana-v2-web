'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface ShellContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  title: string;
  setTitle: (title: string) => void;
}

export const ShellContext = createContext<ShellContextType>({
  sidebarOpen: true,
  setSidebarOpen: () => {},
  title: '',
  setTitle: () => {}
});

const Shell = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [title, setTitle] = useState('');
  
  useEffect(() => {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('nv-sidebar='))
      ?.split('=')[1];
    
    if (cookieValue === 'collapsed') {
      setSidebarOpen(false);
    }
  }, []);
  
  return (
    <ShellContext.Provider value={{ sidebarOpen, setSidebarOpen, title, setTitle }}>
      <div className="grid grid-cols-[auto_1fr] min-h-screen">
        <Sidebar />
        <div className="flex flex-col">
          <TopBar title={title} />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </ShellContext.Provider>
  );
};

export default Shell;