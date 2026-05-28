'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { CommandPalette } from '../palette/CommandPalette';
import { HelpOverlay } from '../palette/HelpOverlay';
import { useShortcuts } from '../../lib/palette/use-shortcuts';

interface ShellContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  title: string;
  setTitle: (title: string) => void;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  helpOpen: boolean;
  setHelpOpen: (open: boolean) => void;
}

export const ShellContext = createContext<ShellContextType>({
  sidebarOpen: true,
  setSidebarOpen: () => {},
  title: '',
  setTitle: () => {},
  paletteOpen: false,
  setPaletteOpen: () => {},
  helpOpen: false,
  setHelpOpen: () => {}
});

const Shell = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [title, setTitle] = useState('');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  
  useEffect(() => {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('nv-sidebar='))
      ?.split('=')[1];
    
    if (cookieValue === 'collapsed') {
      setSidebarOpen(false);
    }
  }, []);
  
  // Initialize shortcuts
  useShortcuts({
    onOpenPalette: () => setPaletteOpen(true),
    onOpenHelp: () => setHelpOpen(true)
  });
  
  return (
    <ShellContext.Provider value={{ 
      sidebarOpen, 
      setSidebarOpen, 
      title, 
      setTitle,
      paletteOpen,
      setPaletteOpen,
      helpOpen,
      setHelpOpen
    }}>
      <div className="grid grid-cols-[auto_1fr] min-h-screen">
        <Sidebar />
        <div className="flex flex-col">
          <TopBar title={title} />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      <HelpOverlay open={helpOpen} onOpenChange={setHelpOpen} />
    </ShellContext.Provider>
  );
};

export default Shell;